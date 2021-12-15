import { ethers, BigNumber } from 'ethers';
import React, { useContext, FC, useEffect, useState } from 'react';
import { ClosetContext } from '~/components/context/ClosetContext';
import { ClosetTokenWithMeta, ClosetUserTokenWithMeta, ERC20 } from '~/types';
import { Image } from '~/components/shared/Image';
import PolyEthIcon from '~/assets/svg/PolyEthIcon.svg';
import { ClosetMintButton } from '~/components/closet/ClosetMintButton';

type Props = {
  piece: ClosetTokenWithMeta;
  pieceType: string;
};

export const ClosetItem: FC<Props> = ({ piece, pieceType }) => {
  const {
    currentRat,
    ownedItems,
    tryOnClothes,
    loadedTokenImages,
    setLoadedTokenImages,
    tokenCounts: { owned, minted },
  } = useContext(ClosetContext);

  const ownedItem = ownedItems[piece.id.toString()];

  const selected =
    currentRat?.properties.get(pieceType) === piece.id.toString();

  if (!ownedItem && !piece.token.active) {
    return null;
  }

  const sponsorName = piece.tokenMeta.attributes.find(
    (a) => a.trait_type === 'Sponsor',
  )?.value;
  const sponsorURL = piece.tokenMeta.attributes.find(
    (a) => a.trait_type === 'Sponsor URL',
  )?.value;

  return (
    <div
      className={`rounded-md border-${
        selected ? 'white' : 'none'
      } border-2 flex flex-col justify-between bg-gray-700 bg-opacity-50 shadow-lg text-sm text-gray-200`}>
      <div className='overflow-hidden aspect-w-1 aspect-h-1 w-full'>
        <Image
          loading='eager'
          src={piece.tokenMeta.image}
          alt=''
          layout='fill'
          className={`w-full h-full border-b border-gray-800 ${
            currentRat && ownedItem ? 'cursor-pointer' : ''
          }`}
          onClick={() => {
            if (ownedItem) {
              tryOnClothes(pieceType, piece.id.toString());
            }
          }}
          onLoad={(e) => {
            const src = e.currentTarget.src;

            if (src.includes('/_next/image')) {
              setLoadedTokenImages([...loadedTokenImages, e.currentTarget.src]);
            }
          }}
        />
        {owned[piece.id.toString()].gt(0) && (
          <div className='w-full h-full relative'>
            <span className='text-xs font-bold absolute inline top-1 right-1 w-fit h-fit text-white bg-purple-700 px-2 py-1 rounded-xl bg-opacity-80'>
              <>You own {owned[piece.id.toString()].toString()}</>
            </span>
          </div>
        )}
      </div>

      <div className={`text-left flex-auto flex justify-between py-3`}>
        <div className='px-2'>
          <div className='text-gray-400'>Name</div>
          <h5>
            {piece.token.name}{' '}
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
            {ethers.utils.formatEther(piece.token.cost)}
          </div>
        </div>
      </div>

      {piece.token.maxTokens.gt(0) && (
        <div className='px-2 py-2 border-t border-gray-800'>
          {piece.token.maxTokens.toNumber() -
            minted[piece.id.toString()].toNumber()}{' '}
          / {piece.token.maxTokens.toString()} left
        </div>
      )}

      <div>
        <ClosetMintButton piece={piece} />
      </div>
    </div>
  );
};
