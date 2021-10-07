import React from 'react';
import { Image } from '~/components/shared/Image';
import Question from '~/assets/images/question.png';

export const FAQ = () => {
  return (
    <div className='w-full bg-white text-slate'>
      <div className='flex flex-col mx-auto max-w-xl py-20 px-4'>
        <Image
          className='w-12 h-12 mb-4'
          src={Question}
          layout='fill'
          objectFit='cover'
          alt='A curious rat face'
          placeholder='blur'
        />
        <h2 id='faqs' className='text-4xl mb-3 font-bold'>
          FAQs
        </h2>
        <h3 className='text-2xl font-bold mb-3'>What the heck is an NFT?</h3>
        <p className='mb-2'>
          A non-fungible token (NFT) is a unique digital marker stored on the
          blockchain. NFTs can be representations of digital artwork, physical
          things, and even membership cards that offer someone access to
          content.
        </p>
        <p className='mb-10'>
          In our case, the NFT proves your ownership of your unique image which
          can compete in our regular Rate Race. The neatest part? You can trade
          with others and grow your collection over time.
        </p>

        <h3 className='text-2xl font-bold mb-3'>
          What does programmatically generated mean?
        </h3>
        <p className='mb-8'>
          It means that the images are assembled by an algorithm from a set of
          parts. Think of it as a Potato Head, with a basic shape (potato) and
          holes for different pieces to go into. We drew a ton of different
          parts (hats, eyes, accessories, pets, backgrounds... 12 categories in
          all) and built a geneRATor to pick pieces from each category and build
          images.
        </p>
      </div>
    </div>
  );
};
