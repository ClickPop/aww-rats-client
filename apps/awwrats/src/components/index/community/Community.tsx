import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from 'common/components/shared/Link';

export const Community = () => {
  return (
    <div className='w-full bg-dark text-tan'>
      <div className='flex flex-col max-w-xl px-4 mx-auto py-20'>
        <div className='text-lg'>
          <h2 className='mb-4 text-4xl font-bold'>
            We are aww about Community.
          </h2>
          <p className='mb-8'>
            Whether you own an Aww, Rats! NFT or not, when you step into our
            Discord, or follow us on Twitter, you are part of the Rat Pack.
          </p>
          <h3 className='mb-4 text-2xl font-bold'>Twitch Streams</h3>
          <p className='mb-8'>
            We stream live from{' '}
            <Link
              href='https://twitch.tv/awwratspack'
              className='underline font-semibold'>
              Twitch
            </Link>{' '}
            every Monday and Wednesday at 9PM ET, at minimum. This is our chance
            to give development updates, play games with our community, and do
            some drawwing on stream. In fact, some of the items you see in these
            Aww, Rats! NFTs came from suggestions from chatters in our earliest
            live streams!
          </p>
          <h3 className='mb-4 text-2xl font-bold'>
            Rat Races for custom 1/1 NFTs
          </h3>
          <p className='mb-8'>
            After every 100 Rats that get minted, we run a unique competition
            inside of our community. The winner of each competition ultimately
            gets to specify what they would love to see in a custom 1/1 Rat. Not
            only do these rarities look different from any other Rats, but their
            rattributes are stacked! This comes in handy particularly for the
            Rat Race dApp.
          </p>
          <h3 className='mb-4 text-2xl font-bold'>Rat Guilds</h3>
          <p className='mb-8'>
            There are four different types of Rats that exist: Pet Rats, Pack
            Rats, Street Rats, and Lab Rats. Rat owners are invited to join up
            with the guild that they align with most inside of the Discord. Rat
            Guilds compete in specific events to earn extra prizes, individually
            and as a team.
          </p>
          <h3 className='mb-4 text-2xl font-bold'>Creator Tools</h3>
          <p className='mb-8'>
            We want to do everything we can to help our community members
            succeed with their own projects. We are here for you! We have
            channels setup in our Discord specifically to chat about questions
            around the development, design, and minting of an NFT project. We
            stream tutorials on Twitch, publish tutorial videos to our YouTube
            channel, and make our tools opensource. If you are looking to start
            your own project, hop in our Discord and let us know.
          </p>
        </div>
      </div>
    </div>
  );
};
