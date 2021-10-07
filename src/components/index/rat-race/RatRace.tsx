import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from '~/components/shared/Link';
import ratRace from '~/assets/images/rat-race.png';

export const RatRace = () => {
  return (
    <div className='w-full bg-dark text-tan'>
      <div className='flex flex-col max-w-xl px-4 mx-auto py-20'>
        <Image
          className='mb-4 self-center'
          src={ratRace}
          layout='fill'
          objectFit='cover'
          alt='Rat race trophy'
          placeholder='blur'
        />
        <div className='text-lg'>
          <h2 className='mb-4 text-4xl font-bold'>Welcome to the Rat Race.</h2>
          <p className='mb-8'>
            When you own an Aww, Rat you automatically get an entry into the Rat
            Race - a regular competition between rats, with fabulous trash
            prizes.
          </p>
          <h3 className='mb-4 text-2xl font-bold'>What can I win?</h3>
          <p className='mb-8'>
            Each competition will have its own type of prize you can win - from
            a custom-drawn Aww, Rat NFT to crypto cash prizes and more!
          </p>
          <h3 className='mb-4 text-2xl font-bold'>How can I compete?</h3>
          <p className='mb-2'>
            Just by owning an Aww, Rat token you are automatically entered into
            the Rat Race!
          </p>
          <p className='mb-8'>
            n the future, we will have different types of competitions that you
            may need to enter in order to compete in.
          </p>
          <h3 className='mb-4 text-2xl font-bold'>
            Where are the competitions held?
          </h3>
          <p className='mb-2'>
            Rat Races will be{' '}
            <Link
              href='https://twitch.tv/awwratspack'
              className='underline font-semibold'>
              streamed live on Twitch
            </Link>{' '}
            so you can cheer your favorite rat on.
          </p>
          <p className='mb-8'>
            Whether your own little Rat is competing, or if you just want to
            spectate and catch the competition, it&apos;s a great way to catch
            up with everybody else in the Rat Pack.
          </p>
          <h3 className='mb-4 text-2xl font-bold'>Do I need a Rat to join?</h3>
          <p className='mb-8'>
            Absolutely not! If you just want to watch the competitions and cheer
            on your favorite Rat, you can absolutely do that. As a spectator,
            you can even place bets on who you think will win so that you can
            join the Rat Race for yourself from the stands.
          </p>
          <p>Rat being said, it does make it more fun if you have one...</p>
        </div>
      </div>
    </div>
  );
};
