import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from '~/components/shared/Link';
import geneRATor from '~/assets/images/geneRATor.png';

export const Generator = () => {
  return (
    <div id='generator' className='bg-light text-slate'>
      <div className='flex flex-col mx-auto max-w-xl py-20 px-4'>
        <Image
          className='imgfix overflow-hidden rounded-md mb-8'
          src={geneRATor}
          alt='The geneRATor machine.'
          placeholder='blur'
        />
        <h2 className='text-4xl mb-3 font-bold'>The GeneRATor</h2>
        <p className='mb-4'>
          The geneRATor is the tool that creates our rats. It designs a rat,
          assigns it rattributes, creates a backstory for it, and once it&apos;s
          sure the new critter is unique it to the blockchain.
        </p>
        <p className='mb-8'>
          The best part?{' '}
          <Link
            href='https://github.com/ClickPop/looks'
            className='underline text-blue-500'>
            The geneRATor is opensource
          </Link>{' '}
          and can be accessed by anybody for their own use.
        </p>

        <h3 className='mb-4 text-2xl font-bold'>Rat Pieces</h3>
        <p className='mb-2'>
          Each rat is made up of a number of pieces, some of which appear every
          time, and some which only appear sometimes:
        </p>
        <ul className='list-disc pl-8 mb-8'>
          <li className='list-item mb-1'>Background color.</li>
          <li className='list-item mb-1'>Fur color.</li>
          <li className='list-item mb-1'>Eyes.</li>
          <li className='list-item mb-1'>Tail style.</li>
          <li className='list-item mb-1'>Ear.</li>
          <li className='list-item mb-1'>Facial expression.</li>
          <li className='list-item mb-1'>Shirt.</li>
          <li className='list-item mb-1'>Hat.</li>
          <li className='list-item mb-1'>Glasses.</li>
          <li className='list-item mb-1'>Accessory.</li>
        </ul>

        <h3 className='mb-4 text-2xl font-bold'>Rattributes</h3>
        <p className='mb-2'>
          Every rat has a variety of rattributes based on the pieces
          they&apos;re made up of.
        </p>
        <ul className='list-disc pl-8 mb-8'>
          <li className='list-item mb-1'>
            Rat type: A rat can be a street, lab, pet, or pack rat based on
            their dominant rattributes.
          </li>
          <li className='list-item mb-1'>Cunning.</li>
          <li className='list-item mb-1'>Cuteness.</li>
          <li className='list-item mb-1'>Rattitude.</li>
        </ul>

        <h3 className='mb-4 text-2xl font-bold'>Backstory</h3>
        <p className='mb-2'>
          Based on the type of rat that&apos;s created, the geneRATor writes a
          backstory that describes the rat&apos;s backstory.
        </p>
      </div>
    </div>
  );
};
