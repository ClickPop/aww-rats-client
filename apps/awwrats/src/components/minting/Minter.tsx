import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import {
  GeneratorResponse,
  LOADING_STATE,
  Metadata,
  OpenSeaAttribute,
} from '~/types';
import { ERC20__factory } from 'types';
import { CHAIN_ID, CONTRACT_ADDRESS, RAT_EGG_BLUR } from '~/config/env';
import { Image } from '~/components/shared/Image';
import { RatPackSize } from '~/components/minting/RatPackSize';
import { format } from 'date-fns';
import { EthersContext } from 'common/components/context/EthersContext';
import Login from 'common/components/access/Login';
import { formatEther } from '@ethersproject/units';
import { CheeseLoader } from '~/components/shared/CheeseLoader';
import { ContractsContext } from '~/components/context/ContractsContext';
import { useContractRead, useNetwork, useProvider, useSigner } from 'wagmi';
import RatJSON from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';

type MintAndGenerateData = {
  tokenId?: string | null;
  rat?: GeneratorResponse | null;
};

const Minter = () => {
  const { connected } = useContext(EthersContext);
  const [loading, setLoading] = useState<LOADING_STATE>(null);
  const [mintTx, setMintTx] = useState('');
  const [completedRat, setCompletedRat] = useState<GeneratorResponse | null>(
    null,
  );
  const [imageURL, setImageURL] = useState('');
  const [tokenMetadata, setTokenMetadata] = useState<Metadata | null>(null);
  const [mintingError, setMintingError] = useState('');
  const network = useNetwork();
  const { data: canMint } = useContractRead(
    { addressOrName: CONTRACT_ADDRESS ?? '', contractInterface: RatJSON.abi },
    'canMint',
  );

  const { data: cost } = useContractRead(
    { addressOrName: CONTRACT_ADDRESS ?? '', contractInterface: RatJSON.abi },
    'cost',
  );

  const ethCost = useMemo(
    () =>
      cost !== undefined
        ? parseFloat(formatEther(cost as unknown as number))
        : 0,
    [cost],
  );

  const { rat } = useContext(ContractsContext);

  const provider = useProvider();
  const { data: signer } = useSigner();

  useEffect(() => {
    if (!canMint) {
      setMintingError('Minting is currently closed.');
    }
  }, [canMint]);

  const handleMintAndGenerate = async (
    skip?: LOADING_STATE[],
    data?: MintAndGenerateData,
  ) => {
    if (rat && provider && signer) {
      const approveWeth = async () => {
        setLoading('INITIAL');
        const signerAddr = await signer.getAddress();
        const wethAddr = await rat.erc20();
        const factory = new ERC20__factory(signer);
        const weth = factory.attach(wethAddr);
        const cost = ethers.utils.parseEther(`${ethCost}`);
        const allowance = await weth.allowance(signerAddr, rat.address);
        if (ethCost !== 0 && allowance < cost) {
          setLoading('APPROVAL');
          const bal: BigNumber = await weth.balanceOf(
            await signer.getAddress(),
          );
          if (bal.lt(cost)) {
            const err = `Insufficient WETH. Cost is ${ethers.utils.formatEther(
              cost,
            )}. Wallet balance at address ${signerAddr} is ${bal}`;
            setMintingError(err);
            throw new Error(err);
          }
          await weth.approve(rat.address, cost).then((t) => t.wait());
        }
      };

      const mintToken = async () => {
        setLoading('TOKEN');
        const tx = await rat.createToken().then((t) => t.wait());
        setMintTx(tx.transactionHash);
        const tokenId = tx?.events
          ?.find((e) => e.args?.['tokenId'])
          ?.args?.['tokenId'].toString() as string;
        return tokenId;
      };

      const generateRat = async (tokenId: string) => {
        setLoading('GENERATOR');
        const rat: GeneratorResponse = await fetch('./api/generate-rat', {
          method: 'post',
          body: JSON.stringify({
            tokenId,
          }),
        }).then((res) => res.json());
        if (provider && rat.data) {
          const tx = await provider.getTransaction(rat.data.txHash);
          await tx.wait();
        }
        setCompletedRat(rat);
        return rat;
      };

      const loadMetadata = async (rat: GeneratorResponse) => {
        setLoading('METADATA');
        const metaHash = rat.data?.tokenUri.split('//')[1];
        if (metaHash) {
          const meta: Metadata = await fetch(
            `https://gateway.pinata.cloud/ipfs/${metaHash}`,
          ).then((res) => res.json());
          setTokenMetadata(meta);
          const imageHash = meta.image.split('//')[1];
          if (imageHash) {
            const imageURL = `https://gateway.pinata.cloud/ipfs/${imageHash}`;
            fetch(imageURL)
              .then((res) => res.blob())
              .then((data) => {
                const url = URL.createObjectURL(data);
                setImageURL(url);
              })
              .catch((err) => {
                console.error(err);
                setImageURL('/rat-egg.png');
              });
          }
        }
      };

      const handleError = async (err: any, data?: MintAndGenerateData) => {
        if (err.data?.message) {
          switch (true) {
            case 'execution reverted: Max tokens reached for wallet' ===
              err.data.message:
              setMintingError(
                'Sorry, looks like you have reached the max number of tokens allowed per wallet.',
              );
              break;
            default:
              setMintingError(
                `An error occurred. Please copy this error and reach out to use in Discord so we can see what might have happened: ${err.data.message}`,
              );
              break;
          }
        } else if (err?.message) {
          if (err?.reason) {
            const isRepriced = err.reason === 'repriced';
            if (err.reason === 'canceled' || (isRepriced && err?.cancelled)) {
              return;
            }
            if (isRepriced && err?.receipt?.status === 1) {
              if (err?.receipt?.transactionHash) {
                const tx = await provider.getTransaction(
                  err.receipt.transactionHash,
                );
                const completedTx = await tx.wait();
                const last = skip?.slice(-1)[0];
                const block = await provider.getBlock(completedTx.blockHash);
                const event = rat.filters.TokenMinted();

                const events = await rat.queryFilter(
                  event,
                  block.number,
                  block.number,
                );
                const tokenId = events
                  ?.find(
                    (e) =>
                      e.transactionHash === completedTx.transactionHash &&
                      e.args?.['tokenId'],
                  )
                  ?.args?.['tokenId'].toString() as string;
                if (last) {
                  switch (last) {
                    case 'INITIAL':
                    case 'APPROVAL':
                    case 'TOKEN':
                      return await handleMintAndGenerate(
                        ['APPROVAL', 'TOKEN'],
                        { ...data, tokenId },
                      );
                    case 'GENERATOR':
                      return await handleMintAndGenerate(
                        ['APPROVAL', 'TOKEN', 'GENERATOR'],
                        data,
                      );
                    case 'METADATA':
                      return await handleMintAndGenerate(
                        ['APPROVAL', 'TOKEN', 'GENERATOR', 'METADATA'],
                        data,
                      );
                    default:
                      return;
                  }
                } else {
                  return await handleMintAndGenerate(['APPROVAL'], data);
                }
              }
            }
          }
          if (
            err.message !==
            'MetaMask Tx Signature: User denied transaction signature.'
          ) {
            setMintingError(
              `An error occurred. Please copy this error and reach out to use in Discord so we can see what might have happened: ${err.message}`,
            );
          }
        }
        console.error(err);
      };

      let tokenId = data?.tokenId;
      let generatedRat = data?.rat;
      try {
        if (!skip || !skip.includes('APPROVAL')) {
          await approveWeth();
        }
        if (!skip || !skip.includes('TOKEN')) {
          tokenId = await mintToken();
        }
        if (tokenId && (!skip || !skip.includes('GENERATOR'))) {
          generatedRat = await generateRat(tokenId);
        }
        if (generatedRat && (!skip || skip.includes('METADATA'))) {
          await loadMetadata(generatedRat);
        }
      } catch (err: any) {
        await handleError(err, { tokenId, rat: generatedRat });
      }
    }
  };

  const displayRattributes = (attribute: OpenSeaAttribute) => {
    switch (attribute.display_type) {
      case 'date':
        return (
          <>
            <p className='font-semibold capitalize'>{attribute.trait_type}</p>
            <p>
              {format(
                new Date((attribute.value as number) * 1000),
                'MMM dd yyyy',
              )}
            </p>
          </>
        );
      case 'number':
        return (
          <>
            <p className='font-semibold capitalize'>{attribute.trait_type}</p>
            <p>
              {attribute.value}{' '}
              {attribute.max_value !== undefined &&
                `out of ${attribute.max_value}`}
            </p>
          </>
        );
      default:
        return (
          <>
            <p className='font-semibold capitalize'>{attribute.trait_type}</p>
            <p>{attribute.value}</p>
          </>
        );
    }
  };

  if (!connected || network?.activeChain?.id !== CHAIN_ID) {
    return <Login chain={CHAIN_ID} />;
  }

  if (mintingError) {
    return (
      <div>
        <p>{mintingError}</p>
      </div>
    );
  }

  return (
    <>
      {loading && <CheeseLoader className='w-10' />}
      {loading === 'APPROVAL' && (
        <>
          <p className='px-4 py-2'>
            Approving WETH transfer...
            <br />
          </p>
          <p className='bg-light text-gray-700 text-sm rounded-md p-3'>
            You&apos;ll need to confirm a transaction that gives our smart
            contract permission to transfer {ethCost} from your wallet.
          </p>
        </>
      )}
      {loading === 'TOKEN' && (
        <>
          <p className='px-4 py-2'>Minting Token...</p>
          <p className='bg-light text-gray-700 text-sm rounded-md p-3'>
            Now you confirm your actual rat mint. Once the mint is successful,
            we&apos;ll charge you {ethCost} for you rat.
          </p>
        </>
      )}
      {loading === 'GENERATOR' && (
        <p className='px-4 py-2'>Generating Rat...</p>
      )}

      {loading === 'METADATA' && (
        <p className='px-4 py-2'>Retreiving Metadata...</p>
      )}
      {!loading && (
        <>
          <div>
            <button
              className='rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light font-bold'
              onClick={async () => {
                await handleMintAndGenerate();
                setLoading(null);
              }}>
              <span className='px-4 py-3 inline-block border-r-2 border-black'>
                Mint a Rat
              </span>{' '}
              <span className='px-4 py-3 pl-2 inline-block'>
                {ethCost === 0 ? 'FREE' : `${ethCost}weth`}
              </span>
            </button>
            <RatPackSize className='text-sm mt-2' />
            <p className='my-4 max-w-lg text-sm'>
              <a
                href='https://go.awwrats.com/how-to-buy'
                className='underline'
                target='_blank'
                rel='noreferrer'>
                Need help getting wETH into your wallet?
              </a>
            </p>
            <p className='mt-4 max-w-lg text-sm'>
              You&apos;re going to need a very small amount of matic for your
              transactions. You can get some from{' '}
              <a
                href='https://matic.supply/'
                target='_blank'
                rel='noreferrer'
                className='underline'>
                a faucet
              </a>{' '}
              or ask in our discord.
            </p>
          </div>
          <div className={tokenMetadata ? 'mt-8' : ''}>
            {tokenMetadata && (
              <div className='rounded-md max-w-md mx-auto bg-white text-gray-800 text-left'>
                <div className='p-4'>
                  <h2 className='text-2xl font-semibold mb-2 mt-2'>
                    Your new friend {tokenMetadata.name} was just born!
                  </h2>
                  {completedRat && (
                    <>
                      <p className='mb-2'>
                        <a
                          href={`https://opensea.io/assets/matic/${CONTRACT_ADDRESS}/${completedRat.data?.tokenId}`}
                          target='_blank'
                          className='underline'
                          rel='noreferrer'>
                          View your new rat on OpenSea
                        </a>
                      </p>
                    </>
                  )}

                  {mintTx && completedRat && (
                    <p>
                      <a
                        href={`https://polygonscan.com/tx/${mintTx}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='underline'>
                        View transaction on polygonscan
                      </a>
                    </p>
                  )}
                </div>

                {imageURL && (
                  <Image
                    src={imageURL}
                    alt='Your newborn rat'
                    width={448}
                    height={448}
                    className='imgfix mb-4'
                    placeholder='blur'
                    blurDataURL={RAT_EGG_BLUR}
                  />
                )}

                <div className='p-4'>
                  <p className='mb-4'>{tokenMetadata.description}</p>

                  <p className='font-semibold'>Rattributes and Stats</p>
                  <div className='grid grid-flow-row grid-cols-2 gap-4'>
                    {tokenMetadata.attributes.map((attr) => (
                      <div
                        className='mt-4 bg-blue-100 border border-solid border-blue-400 rounded-md px-2 py-1'
                        key={attr.trait_type ?? attr.value}>
                        {displayRattributes(attr)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Minter;
