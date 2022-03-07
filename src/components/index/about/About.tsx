import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from '~/components/shared/Link';
import ratBubbles from '~/assets/images/rat-bubbles.png';
import { GraySwoosh } from '~/components/shared/svg/GraySwoosh';
import { WhiteSwoosh } from '~/components/shared/svg/WhiteSwoosh';

export const About = () => {
  return (
    <div className='bg-light overflow-hidden'>
      {/* <Image className="imgfix w-screen overflow-hidden" src={swooshGray} alt="" /> */}
      <GraySwoosh />
      <div className='grid md:grid-cols-3 content-center max-w-4xl mx-auto text-slate pt-16 pb-24'>
        <div className='md:col-span-2 p-4'>
          <h1 className='text-4xl font-bold'>What are Aww, Rats?</h1>
          <p className='my-4'>
            Established in August &apos;21, Aww, Rats! are a pack of 1,000 adorable Rats, minted on the Polygon network.</p>
            <p className='my-4'>
            We chose Polygon because of its environmental efficiency as
            well as its affordability in comparison to Ethereum.
          </p>
          <p className='my-4'>
            Each Rat is unique and randomly generated with a ton of different
            colors, clothes, accessories, and rattributes.
          </p>
          <p className='my-4'>
            Owning a Rat gives you access to all sorts of fun benefits immediately, such as:
            </p>
            <ul className='list-disc pl-8 mb-8'>
              <li className='list-item mb-2'>
                Free access forever to any {' '}
                <Link
                  href='/sewer'
                  className='underline text-blue-500'>
                  dApp
                </Link>{' '}
                 we end up creating
              </li>
              <li className='list-item mb-2'>
                Free access to Rat Guilds where you can align yourself with other Rats, competing in weekly fun games for prizes
              </li>
              <li className='list-item mb-2'>
                Free access to our design tools in Procreate (iPad) to help get you started with creating your own project
              </li>
              <li className='list-item mb-2'>
                Free access to participate in unique competitions to win a custom 1/1 Rat, drawn to your specifications
              </li>
              <li className='list-item mb-2'>
                Monthly airdrops of additional NFTs as we continue to expand the Aww, Rats! universe (coming soon)
              </li>
              <li className='list-item mb-2'>
                <strong>Note:</strong> Owning a {' '}
                <Link
                  href='https://opensea.io/collection/aww-rats?search[sortAscending]=true&search[sortBy]=PRICE&search[stringTraits][0][name]=Generation&search[stringTraits][0][values][0]=Big%20Cheese&search[toggles][0]=BUY_NOW'
                  className='underline text-blue-500'
                  target='_blank'>
                  Big Cheese Rat
                </Link>
                {' '}will give you access to our most exclusive Discord channel where you can participate in regular voting on Roadmap items, receive early access to product development, and more.
              </li>
            </ul>
        </div>
        <Image
          className='w-full h-full'
          src={ratBubbles}
          alt='Some images of sample rats'
          placeholder='blur'
        />
      </div>
      <WhiteSwoosh />
    </div>
  );
};
