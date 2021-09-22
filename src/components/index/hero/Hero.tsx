import React from 'react'
import { Image } from '~/components/shared/Image'

export const Hero = () => {
  return (
    <div className="pb-16 text-white w-full">
      <div className="text-center flex flex-col justify-center items-center w-1/2 max-w-xl h-full mx-auto">
          <Image className="overflow-hidden rounded-full w-80 h-80 mt-3 mb-8" src="/rats.gif" layout="fill" objectFit="contain" alt="Rotating gif displaying some rats" />
          <h1 className="text-4xl px-10 mb-2 font-bold">An NFT Project By Creators, for Creators.</h1>
          <p className="px-2 text-lg">We&apos;re sharing the tools we built and the skills we learned with all of our rat holders so more artists can make generative art and NFTs.</p>
      </div>
      {/* {metamaskConn ? <Minter ethCost={ethCost} contract={contract} /> : <button onClick={connectToMetamask}>Connect to metamask</button>} */}
    </div>
  )
}
