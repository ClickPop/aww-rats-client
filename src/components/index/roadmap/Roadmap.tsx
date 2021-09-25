import React from 'react'
import { Image } from '~/components/shared/Image'
import { Link } from '~/components/shared/Link'
import ratAlley from '~/assets/images/rat-alley.png'

export const Roadmap = () => {
  return (
    <div className="w-full bg-white text-slate">
      <div className="flex flex-col mx-auto max-w-lg py-16">
        <Image className="w-128 h-80 overflow-hidden rounded-md mb-2" src={ratAlley} layout="fill" objectFit="fill" alt="Aww, Rats! Logo" />
        <h2 className="text-4xl mb-3 font-bold">Roadmap</h2>
        <h3 className="text-2xl mb-2 font-bold">The first generation</h3>
        <p>The first generation of rats includes 990 programmatically generated rats.</p>
        <ul className="list-disc pl-8 text-lg mb-8">
          <li className="list-item mb-3">
            First 99 rats are listed directly on OpenSea
            <ul className="list-circle mt-3 pl-8">
              <li className="list-item mb-3">0.025 ETH</li>
              <li className="list-item mb-3">Includes a big cheese attribute and icon.</li>
              <li className="list-item mb-3">All holders will get beta access to Looks, the tool we built Aww, Rats with (when it’s ready).</li>
              <li className="list-item mb-3">Holders will have access to a special discord channel to help shape the future of Aww, Rats.</li>
            </ul>
          </li>
          <li className="list-item mb-3">
            Remaining 891 are 0.04 ETH.
          </li>
          <li className="list-item mb-3">
            After every 99 rats are minted.
            <ul className="list-circle mt-3 pl-8">
              <li className="mb-3">We&apos;ll randomly select 1 holder to get a custom rat of their choosing added to the generation (and their wallet at no additional cost). The pieces will get added to the generator library so the community will be directly contributing to the rats.</li>
            </ul>
          </li>
          <li className="list-item mb-3">
            20% minted
            <ul className="list-circle mt-3 pl-8">
              <li className="mb-3">We&apos;ll hold our first <Link className="underline text-blue-500" href="/ratrace">rat race</Link>.</li>
            </ul>
          </li>
          <li className="list-item mb-3">
            100% minted.
            <ul className="list-circle mt-3 pl-8">
              <li className="list-item mb-3">
                We’ll build out the next generation of rat races.
              </li>
              <li className="list-item mb-3">
                Every holder will get access to a special Aww, Rats collab with one of our favorite projects.
              </li>
              <li className="list-item mb-3">
                All holders will get discounted access to Looks, the tool we built Aww, Rats with (when it’s ready).
              </li>
            </ul>
          </li>
        </ul>
        <h3 className="text-2xl font-bold mb-2">Building out the Ecosystem</h3>
        <p>We&apos;ll be announcing this while we plan with our initial holder community.</p>
        <h2 className="text-4xl mt-10 mb-3 font-bold">What do I get ?</h2>
        <p>When you adopt a rat, you get:</p>
        <ul className="list-disc pl-8 mt-3 mb-8">
          <li className="list-item mb-3">Your very own Rat with a randomly generated backstory and rattributes that give it personality, charm, and Mystique.</li>
          <li className="list-item mb-3">A high quality .png image of the artwork that you can use however you like (profile pictures, t-shirts, frame it on your wall).</li>
          <li className="list-item mb-3">Entry into Rat Races, community events where you can win all sorts of trash prizes.</li>
          <li className="list-item mb-3">Random airdrops of more NFTs from us and our favorite creators on the polygon network.</li>
          <li className="list-item mb-3">Access to private Discord channels where you can ask us questions about process, mistakes we’ve made, etc.</li>
          <li className="list-item mb-3">Tutorials and streams that teach you how to make your own NFT project.</li>
          <li className="list-item mb-3">Access to the tools we built to auto-generate our rats, their descriptions, and rattributes.</li>
        </ul>
      <h2 className="text-4xl mb-3 font-bold">FAQs</h2>
      <p>We have a whole <Link href="/faq" className="underline text-blue-500">running list of FAQs</Link> and answers.</p>
      </div>
    </div>
  )
}
