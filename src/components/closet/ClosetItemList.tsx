import React, { useContext, useMemo } from 'react';
import { ClosetItem } from '~/components/closet/ClosetItem';
import { ClosetContext } from '~/components/context/ClosetContext';
import { ClosetTokenWithMeta } from '~/types';

export const ClosetItemList = () => {
  const { loading, closetPieces } = useContext(ClosetContext);

  const piecesByType = useMemo(
    () =>
      Object.values(closetPieces).reduce((acc, curr) => {
        const pieceType = curr.tokenMeta.attributes.find(
          (a) => a.trait_type === 'Piece Type',
        )?.value;
        if (pieceType) {
          return { ...acc, [pieceType]: [...(acc[pieceType] ?? []), curr] };
        }
        return acc;
      }, {} as Record<string, ClosetTokenWithMeta[]>),
    [closetPieces],
  );

  return (
    <div
      className={`flex flex-col w-full ${
        loading.pieces
          ? 'opacity-0 pointer-events-none'
          : 'opacity-1 pointer-events-auto'
      }`}>
      {Object.entries(piecesByType).map(([pieceType, pieces]) => (
        <div key={pieceType}>
          <h3 className='mt-4 mb-1 text-white bold capitalize text-xl'>
            {pieceType}
          </h3>

          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {pieces.map((piece) => (
              <ClosetItem
                key={piece.id.toString()}
                piece={piece}
                pieceType={pieceType}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
