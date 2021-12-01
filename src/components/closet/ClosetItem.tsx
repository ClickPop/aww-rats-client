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
    ownedItems,
    tryOnClothes,
    loadedTokens,
    setLoadedTokens,
    tokenCounts: { owned },
  } = useContext(ClosetContext);

  const ownedItem = ownedItems[piece.id.toString()];

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
    <div className='rounded-md border-slate border-2 flex flex-col justify-between'>
      <div className='overflow-hidden aspect-w-1 aspect-h-1 w-full'>
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

      <div className={`text-center text-sm text-white`}>
        <h5 className='p-2'>
          {piece.token.name}{' '}
          {sponsorName && sponsorURL && (
            <a href={sponsorURL as string}>{sponsorName}</a>
          )}
        </h5>
        <ClosetMintButton piece={piece} />
      </div>
    </div>
  );
};
