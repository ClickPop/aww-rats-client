import { ethers } from 'ethers';
import React, { useContext, FC, useMemo } from 'react';
import { ClosetContext } from '~/components/context/ClosetContext';
import { Image } from '~/components/shared/Image';
import PolyEthIcon from '~/assets/svg/PolyEthIcon.svg';
import { ClosetMintButton } from '~/components/closet/ClosetMintButton';
import { Link } from 'common/components/shared/Link';
import { PieceTypeUnion, TokenWithMeta } from '~/types';

type Props = {
  piece: TokenWithMeta;
  pieceType: string;
};

export const ClosetItem: FC<Props> = ({ piece, pieceType }) => {
  const { currentRat, tryOnClothes } = useContext(ClosetContext);

  const minted = piece.minted.toNumber();
  const owned = piece.amount.toNumber();
  const maxTokens = piece.token.maxTokens.toNumber();
  const maxTokensPerWallet = piece.token.maxPerWallet.toNumber();

  const ownedItem = owned > 0;
  const tokenMaxReached = maxTokens <= minted;
  const noMaxTokens = maxTokens === 0;
  const walletMaxReached = maxTokensPerWallet <= owned;
  const noWalletMax = maxTokensPerWallet === 0;

  const selected =
    currentRat?.[pieceType as keyof typeof currentRat] === piece.id.toString();

  const sponsorName = useMemo(
    () =>
      piece.meta.attributes.find((a) => a.trait_type === 'Sponsor')?.value ??
      null,
    [piece.meta.attributes],
  );
  const sponsorURL = useMemo(
    () =>
      piece.meta.attributes.find((a) => a.trait_type === 'Sponsor URL')
        ?.value ?? null,
    [piece.meta.attributes],
  );

  if (!ownedItem && !piece.token.active) {
    return null;
  }

  return (
    <div
      className={`rounded-md ${
        selected && 'ring-2 ring-white'
      } flex flex-col justify-between bg-gray-700 bg-opacity-50 shadow-lg text-sm text-gray-200 overflow-hidden relative`}>
      <div className='overflow-hidden aspect-w-1 aspect-h-1 w-full'>
        <Image
          src={`/closet/image-thumbnails/${piece.meta.image
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
              tryOnClothes(pieceType as PieceTypeUnion, piece.id.toString());
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
            {piece.meta.name}{' '}
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

      {maxTokens > 0 && (
        <div className='px-2 py-2 border-t border-gray-800'>
          {maxTokens - minted} / {maxTokens} left
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
