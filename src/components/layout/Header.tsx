import React from 'react'
import { Image } from '~/components/shared/Image'
import logo from '~/assets/images/aww-rats-logo.png'
import discord from '~/assets/svg/discord-logo.svg'
import twitter from '~/assets/svg/twitter-logo.svg'


export const Header = () => {
  return (
    <div className="pt-4 w-full">
      <Image className="w-full h-28 py-1 px-16" src={logo} layout="fill" objectFit="contain" alt="Aww, Rats! Logo" placeholder="blur" />
      <div className="mt-3 w-fit mx-auto flex justify-center items-center space-x-5">
        <Image src={twitter} alt="Discord Logo" width={32} height={32} />
        <Image src={discord} alt="Discord Logo" width={32} height={32} />
      </div>
    </div>
  )
}
