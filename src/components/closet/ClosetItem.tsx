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

  const [mintedCount, setMintedCount] = useState(BigNumber.from(0));
  const [ownedCount, setOwnedCount] = useState(BigNumber.from(0));

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

  useEffect(() => {
    const getTokenAmount = async () => {
      if (closet && signerAddr) {
        setMintedCount(await closet.totalSupply(piece.id));
        setOwnedCount(await closet.balanceOf(signerAddr, piece.id));
      }
    };

    getTokenAmount();
  }, [closet, signerAddr, piece.id]);

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
    <div className='overflow-hidden aspect-w-1 aspect-h-1 rounded-md border-slate border-4 group'>
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
      <div
        className={`text-center token-purchase-overlay absolute bg-light ${
          !loading && '-bottom-full'
        } left-0 right-0 top-auto h-auto group-hover:bottom-0 duration-300`}>
        <h5 className='bold'>{`Item Name`}</h5>
        <p className='price text-sm'>
          <Image src={PolyEthIcon} className='w-2 mr-1 inline-block' alt='' />
          {ethers.utils.formatEther(piece.token.cost)}
        </p>
        {canMint ? (
          <div>
            {!loading ? (
              <button
                className='mint-now bg-purple-700 text-white hover:bg-purple-800 px-2 py-1 m-1 mt-0 rounded transition-color duration-300'
                onClick={handleMint}>
                Mint!
              </button>
            ) : (
              <CheeseLoader className='h-6 w-6 relative' />
            )}
            {/* <button className='add-to-cart bg-slate text-white hover:bg-dark px-2 py-1 m-1 mt-0 rounded transition-color duration-300'>
                        + Cart
                      </button> */}
          </div>
        ) : (
          <div>Cannot mint</div>
        )}
        {piece.token.maxTokens.gt(0) && (
          <p className='supply block text-sm italic'>
            {piece.token.maxTokens.sub(mintedCount).toString()} of{' '}
            {piece.token.maxTokens.toString()} left
          </p>
        )}
        {piece.token.maxPerWallet.gt(0) && (
          <p className='supply block text-sm italic'>
            {ownedCount.toString()} minted of{' '}
            {piece.token.maxPerWallet.toString()}
          </p>
        )}
      </div>
    </div>
  );
};
