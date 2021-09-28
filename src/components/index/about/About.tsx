import React from 'react'
import { Image } from '~/components/shared/Image'
import ratBubbles from '~/assets/images/rat-bubbles.png'
import { GraySwoosh } from '~/components/shared/svg/GraySwoosh'
import { WhiteSwoosh } from '~/components/shared/svg/WhiteSwoosh'


export const About = () => {
  return (
    <div className="bg-light overflow-hidden">
      {/* <Image className="imgfix w-screen overflow-hidden" src={swooshGray} alt="" /> */}
      <GraySwoosh />
      <div className="grid md:grid-cols-3 content-center max-w-4xl mx-auto text-slate pt-16 pb-24">
        <div className="md:col-span-2 p-4">
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
        <Image className="w-full h-full" src={ratBubbles} alt="Some images of sample rats" placeholder="blur" />
      </div>
      <WhiteSwoosh />
    </div>
  )
}
