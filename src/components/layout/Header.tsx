import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from '~/components/shared/Link';
import logo from '~/assets/images/aww-rats-avatar.png';
import { TwitterLogo } from '~/components/shared/svg/TwitterLogo';
import { DiscordLogo } from '~/components/shared/svg/DiscordLogo';
import { MenuLink } from '~/components/shared/MenuLink';

export const Header = () => {
  return (
    <div className='py-4 flex flex-col bg-dark md:flex-row justify-between fixed items-center w-full z-50 bg-opacity-30'>
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
          <MenuLink to='roadmap' href='/' className='mr-4' offset={-25}>
            Roadmap
          </MenuLink>
          <MenuLink to='generator' href='/' className='mr-4' offset={-25}>
            GeneRATor
          </MenuLink>
          <MenuLink to='faqs' href='/' className='mr-4' offset={-25}>
            FAQs
          </MenuLink>
          <MenuLink href='/closet' className='mr-4'>
            Closet
          </MenuLink>
          <MenuLink
            href='https://www.twitter.com/awwratspack'
            className='mr-4'
            target='_blank'>
            <TwitterLogo width={24} height={24} />
          </MenuLink>
          <MenuLink href='https://discord.gg/aww-rats' target='_blank'>
            <DiscordLogo width={24} height={24} />
          </MenuLink>
        </div>
      </div>
    </div>
  );
};
