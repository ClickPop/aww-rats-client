import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from '~/components/shared/Link';
import ratAlley from '~/assets/images/rat-alley.png';

export const Roadmap = () => {
  return (
    <div id='roadmap' className='bg-white text-slate'>
      <div className='flex flex-col mx-auto max-w-xl py-20 px-4'>
        <Image
          className='imgfix overflow-hidden rounded-md mb-8'
          src={ratAlley}
          alt='Aww, Rats! Logo'
          placeholder='blur'
        />
        <h2 className='text-4xl mb-3 font-bold'>Roadmap</h2>
        <p className='mb-8'>
          A brand new Roadmap for 2022 is coming soon! Have questions or suggestions?
          Join our {' '}
          <Link
            href='https://discord.gg/awwrats'
            className='underline text-blue-500'>
            Discord
          </Link>
        {' '} and let us know. Until then, here&apos;s a recap of just some of the most notable milestones...
        </p>
        {/** @ts-ignore */}

        <table className='w-full border border-blue-300 border-solid mb-8'>
          <thead>
            <tr className='border-b border-blue-300 border-solid bg-blue-50'>
              <th className='text-left px-4 py-2'>Date</th>
              <th className='text-left px-4 py-2 w-3/4'>Milestone</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Aug 27, 2021</td>
              <td className='text-left px-4 py-2'>
                First prototype of an Aww, Rats! NFT was minted.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Oct 4, 2021</td>
              <td className='text-left px-4 py-2'>
                Aww, Rats! officially launches on Polygon! {' '}
                <Link
                  href='https://opensea.io/collection/aww-rats'
                  className='underline text-blue-500'>
                  The collection
                </Link>
                {' '}is born.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Oct 11, 2021</td>
              <td className='text-left px-4 py-2'>
                Our first dApp, {' '}
                <Link
                  href='/closet'
                  className='underline text-blue-500'>
                  the Closet
                </Link>
                , was released. Dress up your Rats in fun clothes, accessories, backgrounds, and save it as a brand new Profile Picture.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Nov 5, 2021</td>
              <td className='text-left px-4 py-2'>
                Our second dApp, {' '}
                <Link
                  href='/den'
                  className='underline text-blue-500'>
                  the Den
                </Link>
                , was released. Showcase any NFTs you have (Rats or otherwise) in your very own special alleyway in the Aww, Rats! sewer.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Dec 6, 2021</td>
              <td className='text-left px-4 py-2'>
                Version 2.0 of {' '}
                <Link
                  href='/closet'
                  className='underline text-blue-500'>
                  the Closet
                </Link>
              {' '} dApp is released, starting the Aww, Rats! partnership program.
                Any artist can now contribute to the Aww, Rats! Closet dApp in order to have their designs minted as NFTs,
                earn passive revenue on each sale, and have their creations purchased and shown off by any Rat holder.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Dec 17, 2021</td>
              <td className='text-left px-4 py-2'>
                Aww, Rats! makes the {' '}
                <Link
                  href='https://github.com/ClickPop/aww-rats-client'
                  className='underline text-blue-500'>
                  main GitHub repo
                </Link>
                {' '}opensource. It is now freely accessible for anybody to review, contribute to, or fork as a starting point for their own project.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Jan 29, 2022</td>
              <td className='text-left px-4 py-2'>
                Aww, Rats! teams up with the nonprofit organization {' '}
                <Link
                  href='https://www.heartsinmotion.org/him-music-in-motion-33.htm'
                  className='underline text-blue-500'>
                  Music in Motion
                </Link>
                {' '}raising over $1,000 for the charity in one weekend.
              </td>
            </tr>
            <tr className='border-b border-blue-300 border-solid'>
              <td className='text-left px-4 py-2'>Feb 23, 2022</td>
              <td className='text-left px-4 py-2'>
                Our third dApp, the Rat Race, opens for Alpha testing. The Rat Race is an interactive RPG-style game, requiring you to put your Rattributes to the test in order to complete various challenges.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
