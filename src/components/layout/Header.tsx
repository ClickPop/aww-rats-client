import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from '~/components/shared/Link';
import logo from '~/assets/images/aww-rats-avatar.png';
import { TwitterLogo } from '~/components/shared/svg/TwitterLogo';
import { DiscordLogo } from '~/components/shared/svg/DiscordLogo';

export const Header = () => {
  return (
    <div className='py-4 flex flex-col bg-dark md:flex-row justify-between fixed items-center w-full z-50 bg-opacity-50'>
      <Link href='/' className='mr-4'>
        <Image
          className='w-12 h-12 mx-4 hidden md:block'
          src={logo}
          alt='Aww, Rats! Logo'
          placeholder='blur'
        />
      </Link>
      <div className='flex px-4'>
        <div className='flex items-center text-white'>
          <Link href='/#roadmap' className='mr-4'>
            Roadmap
          </Link>
          <Link href='/#generator' className='mr-4'>
            GeneRATor
          </Link>
          <Link href='/#faqs' className='mr-4'>
            FAQs
          </Link>
          <Link href='/closet' className='mr-4'>
            Closet
          </Link>
          <Link href='https://www.twitter.com/awwratspack' className='mr-4'>
            <TwitterLogo width={24} height={24} />
          </Link>
          <Link href='https://discord.gg/2cwxkBkgf5'>
            <DiscordLogo width={24} height={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};
