import React, { useContext, FC, useEffect, useState } from 'react';
import { ClosetContext } from '~/components/context/ClosetContext';
import { ClosetTokenWithMeta, ClosetUserTokenWithMeta, ERC20 } from '~/types';
import { Image } from '~/components/shared/Image';
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
        selected ? 'white' : 'slate'
      } border-2 flex flex-col justify-between`}>
      <div className='overflow-hidden aspect-w-1 aspect-h-1 w-full'>
        <Image
          loading='eager'
          src={piece.tokenMeta.image}
          alt=''
          layout='fill'
          className={`w-full h-full ${
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
        <div className='w-full h-full relative'>
          <span className='text-xs font-bold absolute inline top-1 left-1 w-fit h-fit text-white bg-purple-700 px-2 py-1 rounded-xl bg-opacity-80'>
            <>
              {minted[piece.id.toString()].toString()} total minted of{' '}
              {piece.token.maxTokens.toString()}
            </>
          </span>
        </div>
      </div>

      <div className={`text-center text-sm text-white`}>
        <h5 className='p-2'>
          {piece.token.name}{' '}
          {sponsorName && sponsorURL && (
            <>
              by{' '}
              <a
                className='underline'
                href={sponsorURL as string}
                target='_blank'
                rel='noreferrer'>
                {sponsorName}
              </a>
            </>
          )}
        </h5>
        <ClosetMintButton piece={piece} />
      </div>
    </div>
  );
};
