import React from 'react'
import { Image } from '~/components/shared/Image'

export const Header = () => {
  return (
    <div className="pt-4 w-full">
      <Image className="w-full h-28 py-1 px-16" src="/aww-rats-logo.png" layout="fill" objectFit="contain" alt="Aww, Rats! Logo" />
      <div className="mt-3 w-fit mx-auto flex justify-center items-center space-x-5">
        <Image src="/twitter-logo.svg" alt="Discord Logo" width={32} height={32} />
        <Image src="/discord-logo.svg" alt="Discord Logo" width={32} height={32} />
      </div>
    </div>
  )
}
