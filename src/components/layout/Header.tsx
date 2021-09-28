import React from 'react'
import { Image } from '~/components/shared/Image'
import { Link } from '~/components/shared/Link'
import logo from '~/assets/images/aww-rats-logo.png'
import { TwitterLogo } from '~/components/shared/svg/TwitterLogo'
import { DiscordLogo } from '~/components/shared/svg/DiscordLogo'


export const Header = () => {
  return (
    <div className="pt-4 w-full">
      <Image className="w-full h-24 py-1 px-16" src={logo} layout="fill" objectFit="contain" alt="Aww, Rats! Logo" placeholder="blur" />
      <div className="flex max-w-2xl mx-auto align-center justify-between content-center px-4">
        <div className="flex items-center rounded-md bg-light">
          <Link href="#roadmap" className="hover:bg-yellow-200 duration-300 p-2 border-r border-black">Roadmap</Link>
          <Link href="#generator" className="hover:bg-yellow-200 duration-300 p-2 border-r border-black">GeneRATor</Link>
          <Link href="#faqs" className="hover:bg-yellow-200 duration-300 p-2">FAQs</Link>
        </div>
        <div className="flex justify-center items-center space-x-5">
          <Link href="https://www.twitter.com/awwratspack"><TwitterLogo width={32} height={32} /></Link>
          <Link href="https://discord.gg/2cwxkBkgf5"><DiscordLogo width={32} height={32} /></Link>
        </div>
      </div>
    </div>
  )
}
