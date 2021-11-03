import React from 'react';
import { Image } from '~/components/shared/Image';
import umbria from '~/assets/images/umbriaLogo.png';

export const Promo = () => {
  return (
    <div className='overflow-hidden mt-10 flex rounded-md'>
      <Image
        className='w-24 m-4 md:ml-8'
        src={umbria}
        alt='Umbria Logo'
        placeholder='blur'
      />
      <div className='m-4 md:mr-8 text-left'>
        <p className='mb-4'>
          If you only have ETH on the Ethereum main network, you will need to
          bridge it to Polygon.
        </p>
        <p className='mb-4'>
          Aww, Rats strongly recommends using the Umbria Narni Bridge.
        </p>
        <p>
          <a
            className='px-4 py-3 inline-block rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold'
            href='https://bridge.umbria.network/bridge/ethereum-polygon/eth'
            target='_blank'
            rel='noopener noreferrer'>
            Bridge ETH
          </a>
        </p>
      </div>
    </div>
  );
};

