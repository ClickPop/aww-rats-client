import React from 'react'
import { Image } from '~/components/shared/Image'
import { Link } from '~/components/shared/Link'
import logo from '~/assets/images/aww-rats-logo.png'
import discord from '~/assets/svg/discord-logo.svg'
import twitter from '~/assets/svg/twitter-logo.svg'


export const Header = () => {
  return (
    <div className="pt-4 w-full">
      <Image className="w-full h-28 py-1 px-16" src={logo} layout="fill" objectFit="contain" alt="Aww, Rats! Logo" placeholder="blur" />
      <div className="flex max-w-2xl mx-auto align-center justify-between content-center px-4">
        <div className="flex items-center">
          <Link href="#roadmap" className="text-white p-2 mr-2">Roadmap</Link>
          <Link href="#faqs" className="text-white p-2">FAQs</Link>
        </div>
        <div className="flex justify-center items-center space-x-5">
          <Link href="https://www.twitter.com/awwratspack"><Image src={twitter} alt="Discord Logo" width={32} height={32} /></Link>
          <Link href="https://discord.gg/2cwxkBkgf5"><Image src={discord} alt="Discord Logo" width={32} height={32} /></Link>
        </div>
      </div>
    </div>
  )
}
