import React from 'react'
import { Image } from '~/components/shared/Image'
import logo from '~/assets/images/aww-rats-logo.png'
import rat01 from '~/assets/images/rats/rat-01.png'
import rat02 from '~/assets/images/rats/rat-02.png'
import rat03 from '~/assets/images/rats/rat-03.png'
import rat04 from '~/assets/images/rats/rat-04.png'
import rat05 from '~/assets/images/rats/rat-05.png'
import rat06 from '~/assets/images/rats/rat-06.png'
import rat07 from '~/assets/images/rats/rat-07.png'
import { Minter } from '~/components/minting/Minter'

export const Hero = () => {
  return (
    <div className="pb-24 pt-4 overflow-hidden text-white w-full">
      <Image className="max-w-md mx-auto mb-8 p-4" src={logo} alt="Aww, Rats! Logo" placeholder="blur" />
      <div className="text-center justify-center items-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl mb-2 font-bold">An NFT Project By Creators, for Creators.</h1>
      </div>
      <div className="w-screen my-12 overflow-hidden">
        <div className="flex flex-row items-center justify-center overflow-hidden">
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat01} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat02} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat03} alt="" />
          <Image className="ratvatar ratvatar-lg imgfix overflow-hidden rounded-full mx-8" src={rat04} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat05} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat06} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat07} alt="" />
        </div>
      </div>
      <div className="text-center justify-center items-center max-w-2xl mx-auto px-4">
        <p className="text-lg mb-8">We&apos;re sharing the tools we built and the skills we learned with all of our rat holders so more artists can make generative art and NFTs.</p>
        <div className="text-light w-fit mx-auto">
          <Minter />
        </div>
      </div>
    </div>
  )
}
