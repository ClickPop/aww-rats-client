import React from 'react';
import { Image } from '~/components/shared/Image';
import { Link } from 'common/components/shared/Link';
import logo from '~/assets/images/aww-rats-avatar.png';
import { YouTubeLogo } from '~/components/shared/svg/YouTubeLogo';
import { TwitchLogo } from '~/components/shared/svg/TwitchLogo';
import { OpenSeaLogo } from '~/components/shared/svg/OpenSeaLogo';
import { TwitterLogo } from '~/components/shared/svg/TwitterLogo';
import { DiscordLogo } from '~/components/shared/svg/DiscordLogo';
import { MenuLink } from '~/components/shared/MenuLink';

export const Header = () => {
  return (
    <div className='py-4 flex flex-col bg-gray-800 md:flex-row justify-between fixed items-center w-full z-50 bg-opacity-30'>
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
          <MenuLink href='/sewer' className='mr-4'>
            Sewer (dApps)
          </MenuLink>
          <MenuLink
            href='https://www.youtube.com/channel/UCVgncISRbHeQMjO-Vv8VUaA'
            className='mr-4 quicklogos'
            target='_blank'>
            <YouTubeLogo width={24} height={24} />
          </MenuLink>
          <MenuLink
            href='https://www.twitch.tv/awwratspack'
            className='mr-4 quicklogos'
            target='_blank'>
            <TwitchLogo width={24} height={24} />
          </MenuLink>
          <MenuLink
            href='https://opensea.io/collection/aww-rats'
            className='mr-4'
            target='_blank'>
            <OpenSeaLogo width={24} height={24} />
          </MenuLink>
          <MenuLink
            href='https://www.twitter.com/awwratspack'
            className='mr-4 quicklogos'
            target='_blank'>
            <TwitterLogo width={24} height={24} />
          </MenuLink>
          <MenuLink
            href='https://discord.gg/awwrats'
            className='mr-4 quicklogos'
            target='_blank'>
            <DiscordLogo width={24} height={24} />
          </MenuLink>
        </div>
      </div>
    </div>
  );
};
