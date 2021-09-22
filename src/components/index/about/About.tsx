import React from 'react'
import { Image } from '~/components/shared/Image'

export const About = () => {
  return (
    <div className="bg-light">
      <div className="flex items-center w-fit mx-auto text-slate">
        <div className="max-w-md p-4">
          <h1 className="text-4xl font-bold">What are Aww, Rats?</h1>
          <p className="my-4">
            They&apos;re a pack of programmatically generated NFT rats on the Matic blockchain. We chose Matic because it has extraordinarily low gas fees and uses significantly less electricity than the ethereum mainnet.
          </p>
          <p className="my-4">
            Each rat is unique and randomly generated with a ton of different colors, clothes, accessories, and attributes.
          </p>
          <p className="my-4">
            Owning a rat gives you access to tools to build your own project (coming soon), educational resources and tutorials, and a community of other creators.
          </p>
        </div>
        <div className="w-128 h-128 p-8 ">
          <Image className="w-full h-full" src="/rat-bubbles.png" layout="fill" objectFit="contain" alt="Some images of sample rats" />
        </div>
      </div>
    </div>
  )
}
