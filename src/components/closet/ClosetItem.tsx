import { ethers, BigNumber } from 'ethers';
import React, { useContext, FC, useEffect, useState } from 'react';
import { ClosetContext } from '~/components/context/ClosetContext';
import { ClosetTokenWithMeta, ClosetUserTokenWithMeta, ERC20 } from '~/types';
import { Image } from '~/components/shared/Image';
import PolyEthIcon from '~/assets/svg/PolyEthIcon.svg';
import { ClosetMintButton } from '~/components/closet/ClosetMintButton';
import { Link } from '~/components/shared/Link';
import { GetClosetDataQuery } from '~/schema/generated';

type Props = {
  piece: GetClosetDataQuery['closet_pieces'][0];
  pieceType: keyof GetClosetDataQuery['rats'][0];
};

export const ClosetItem: FC<Props> = ({ piece, pieceType }) => {
  const { currentRat, tryOnClothes } = useContext(ClosetContext);

  const minted = piece.minted.aggregate?.sum?.amount ?? 0;
  const owned = piece.owned.aggregate?.count ?? 0;

  const ownedItem = (piece.owned.aggregate?.count ?? 0) > 0;
  const tokenMaxReached = piece.max_tokens < minted;
  const noMaxTokens = piece.max_tokens === 0;
  const walletMaxReached = piece.max_per_wallet < owned;
  const noWalletMax = piece.max_per_wallet === 0;

  const selected = currentRat?.[pieceType] === piece.id;

  if (!ownedItem && !piece.active) {
    return null;
  }

  const sponsorName = piece.sponsor;
  const sponsorURL = piece.sponsor_url;

  return (
    <div
      className={`rounded-md ${
        selected && 'ring-2 ring-white'
      } flex flex-col justify-between bg-gray-700 bg-opacity-50 shadow-lg text-sm text-gray-200 overflow-hidden relative`}>
      <div className='overflow-hidden aspect-w-1 aspect-h-1 w-full'>
        <Image
          src={`/closet/image-thumbnails/${piece.image
            .split('/')
            .slice(-1)[0]
            .replace('.png', '.webp')}`}
          alt=''
          layout='fill'
          className={`w-full h-full border-b border-gray-800 ${
            currentRat && ownedItem ? 'cursor-pointer' : ''
          }`}
          onClick={() => {
            if (ownedItem) {
              tryOnClothes(pieceType, piece.id);
            }
          }}
        />
        {owned > 0 && (
          <div className='w-full h-full relative'>
            <span className='text-xs font-bold absolute inline top-1 right-1 w-fit h-fit text-white bg-purple-700 px-2 py-1 rounded-xl bg-opacity-80'>
              <>You own {owned}</>
            </span>
          </div>
        )}
      </div>

      <div className={`text-left flex-auto flex justify-between py-3`}>
        <div className='px-2'>
          <div className='text-gray-400'>Name</div>
          <h5>
            {piece.name}{' '}
            {sponsorName && sponsorURL && (
              <div>
                by{' '}
                <a
                  className='underline'
                  href={sponsorURL as string}
                  target='_blank'
                  rel='noreferrer'>
                  {sponsorName}
                </a>
              </div>
            )}
          </h5>
        </div>
        <div className='px-2 text-right'>
          <div className='text-gray-400'>Price</div>
          <div className='font-bold'>
            <Image src={PolyEthIcon} className='w-2 mr-1 inline-block' alt='' />
            {ethers.utils.formatEther(piece.cost)}
          </div>
        </div>
      </div>

      {piece.max_tokens > 0 && (
        <div className='px-2 py-2 border-t border-gray-800'>
          {piece.max_tokens - minted} / {piece.max_tokens} left
        </div>
      )}

      <div>
        <ClosetMintButton
          piece={piece}
          tokenMaxReached={tokenMaxReached}
          walletMaxReached={walletMaxReached}
          noMaxTokens={noMaxTokens}
          noWalletMax={noWalletMax}
        />
      </div>
      {!ownedItem && !noMaxTokens && tokenMaxReached && (
        <Link
          className='absolute w-full h-full'
          href={`https://opensea.io/assets/matic/0x40474b875c3debb9eeed7b1891f51cd0403ecc95/${piece.id.toString()}`}
          openInNewTab
        />
      )}
    </div>
  );
};
