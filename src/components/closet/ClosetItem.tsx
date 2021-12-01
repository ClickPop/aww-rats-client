import React, { useContext, FC, useEffect, useState } from 'react';
import { ClosetContext } from '~/components/context/ClosetContext';
import {
  ClosetTokenWithMeta,
  ClosetUserTokenWithMeta,
  ERC20,
  LOADING_STATE,
} from '~/types';
import { Image } from '~/components/shared/Image';
import PolyEthIcon from '~/assets/svg/PolyEthIcon.svg';
import { EthersContext } from '~/components/context/EthersContext';
import { BigNumber } from '@ethersproject/bignumber';
import { ethers } from 'ethers';
import ERC20ABI from 'smart-contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { CheeseLoader } from '~/components/shared/CheeseLoader';

type Props = {
  piece: ClosetTokenWithMeta;
  pieceType: string;
};

export const ClosetItem: FC<Props> = ({ piece, pieceType }) => {
  const { closet, signer, provider, signerAddr } = useContext(EthersContext);
  const [loading, setLoading] = useState<LOADING_STATE>(null);

  const {
    ownedItems,
    tryOnClothes,
    loadedTokens,
    setLoadedTokens,
    setOwnedItems,
    tokenCounts: { minted, owned },
    setTokenCounts,
  } = useContext(ClosetContext);

  const ownedItem = ownedItems[piece.id.toString()];
  const tokenMaxReached = piece.token.maxTokens.lte(ownedItem?.amount ?? 0);
  const noMaxTokens = piece.token.maxTokens.eq(0);
  const walletMaxReached = piece.token.maxPerWallet.lte(ownedItem?.amount ?? 0);
  const noWalletMax = piece.token.maxPerWallet.eq(0);

  const canMint =
    (!tokenMaxReached || noMaxTokens) &&
    (!walletMaxReached || noWalletMax) &&
    piece.token.active;

  const approveWeth = async () => {
    if (closet && signer && signerAddr && provider) {
      setLoading('INITIAL');
      const wethAddr = await closet.erc20();
      console.log(wethAddr);
      const weth = new ethers.Contract(wethAddr, ERC20ABI.abi, signer) as ERC20;
      const cost = piece.token.cost;
      const allowance = await weth.allowance(signerAddr, closet.address);
      if (cost.gt(0) && allowance < cost) {
        setLoading('APPROVAL');
        const bal: BigNumber = await weth.balanceOf(await signer.getAddress());
        if (bal.lt(cost)) {
          const err = `Insufficient WETH. Cost is ${ethers.utils.formatEther(
            cost,
          )}. Wallet balance at address ${signerAddr} is ${bal}`;
          throw new Error(err);
        }
        await weth.approve(closet.address, cost).then((t) => t.wait());
      }
    }
  };

  const handleMint = async () => {
    if (closet) {
      try {
        await approveWeth();
        setLoading('TOKEN');
        await closet.mint(piece.id, 1).then((t) => t.wait());
        const t: Record<string, ClosetUserTokenWithMeta> = {
          ...ownedItems,
          [piece.id.toString()]: ownedItem
            ? { ...ownedItem, amount: ownedItem.amount.add(1) }
            : { ...piece, amount: BigNumber.from(1) },
        };
        setOwnedItems(t);
        setTokenCounts((c) => ({
          minted: {
            ...c.minted,
            [piece.id.toString()]: c.minted[piece.id.toString()].add(1),
          },
          owned: {
            ...c.owned,
            [piece.id.toString()]: c.owned[piece.id.toString()].add(1),
          },
        }));
      } catch (err) {
        console.error(err);
      }
      setLoading(null);
    }
  };

  if (!ownedItem && !piece.token.active) {
    return null;
  }

  return (
    <div className="rounded-md border-slate border-2">
      <div className='overflow-hidden aspect-w-1 aspect-h-1'>
        <Image
          loading='eager'
          src={piece.tokenMeta.image}
          alt=''
          layout='fill'
          className={`w-full h-full ${ownedItem ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (ownedItem) {
              tryOnClothes(pieceType, piece.id.toString());
            }
          }}
          onLoad={(e) => {
            const src = e.currentTarget.src;

            if (src.includes('/_next/image')) {
              setLoadedTokens([...loadedTokens, e.currentTarget.src]);
            }
          }}
        />
        <div className='w-full h-full relative'>
          <span className='text-sm absolute inline top-1 right-2 w-fit h-fit text-white'>
            {owned[piece.id.toString()].toString()} Owned
          </span>
        </div>
      </div>

      <div
        className={`text-left text-sm text-white`}>
        <h5 className="p-2 ">{piece.token.name}</h5>
        {canMint ? (
          <>
            {!loading ? (
              <button
                className='text-gray-800 bg-light hover:bg-yellow-300 p-2 rounded-b-md block w-full duration-300'
                onClick={handleMint}>
                {piece.token.cost.gt(0)
                  ? <>Mint <Image src={PolyEthIcon} className='w-2 mr-1 inline-block' alt='' />{ethers.utils.formatEther(piece.token.cost)}</>
                  : <>Free</>
                }
              </button>
            ) : (
              <CheeseLoader className='h-6 w-6 relative' />
            )}
            {/* <button className='add-to-cart bg-slate text-white hover:bg-dark px-2 py-1 m-1 mt-0 rounded transition-color duration-300'>
              + Cart
            </button> */}
          </>
        ) : (
          <button
            className='text-gray-400 bg-gray-800 p-2 rounded-b-md block w-full cursor-not-allowed'
            disabled
          >
            Sold Out
          </button>
        )}
        {piece.token.maxTokens.gt(0) && (
          <p className='supply block text-sm italic'>
            {piece.token.maxTokens.sub(minted[piece.id.toString()]).toString()}{' '}
            of {piece.token.maxTokens.toString()}
          </p>
        )}
        {/* {piece.token.maxPerWallet.gt(0) && (
          <p className='supply block text-sm italic'>
            {owned[piece.id.toString()].toString()} minted of{' '}
            {piece.token.maxPerWallet.toString()}
          </p>
        )} */}
      </div>
    </div>
  );
};
