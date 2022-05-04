import React from 'react';
import { Room } from '~/components/sewer/Room';
import closetImg from '~/assets/images/closet.gif';
import denImg from '~/assets/images/den.png';

export const Sewer = () => {
  return (
    <div className='flex flex-col max-w-xl px-4 mx-auto py-20'>
      <h2 className='mb-4 text-4xl font-bold'>The Sewer</h2>
      <p className='mb-4'>
        Aww Rats aren&apos;t just pictures. They&apos;re rapscallions with a lot
        of life in them. We&apos;re creating all sorts of dApps for you to use
        your rats in.
      </p>

      <Room pathName='/closet' pathTitle='The Closet' imgPath={closetImg}>
        Dress up your rat in a variety of clothing and accessories. And
        we&apos;re always adding new seasonal items.
      </Room>

      <Room pathName='/den' pathTitle='The Den' imgPath={denImg}>
        The Den is a gallery wall for you to decorate with your NFTs (from any
        project) and show your collection off to the world.
      </Room>

      <Room pathName='/study' pathTitle='The Study'>
        The Study is where we store resources and tutorials for other creators.
      </Room>
    </div>
  );
};
