import React from 'react'
import { Image } from '~/components/shared/Image'
import { Link } from '~/components/shared/Link'
import ratAlley from '~/assets/images/rat-alley.png'

export const Roadmap = () => {
  return (
    <div className="w-full bg-white text-slate">
      <div className="flex flex-col mx-auto max-w-xl pt-16 px-4">
        <Image className="imgfix overflow-hidden rounded-md mb-8" src={ratAlley} alt="Aww, Rats! Logo" placeholder="blur" />
        <h2 id="roadmap" className="text-4xl mb-3 font-bold">Roadmap</h2>
        <p class="mb-8">The first generation of rats includes 1,037 programmatically generated rats.</p>

        <h3 className="mb-4 text-2xl font-bold"><strike>Presale</strike> Complete</h3>
        <p className="mb-2">We were initially going to sell 99 rats directly through OpenSea but found the OS shared contract <Link href="https://medium.com/@awwratspack/aww-rats-an-update-on-our-minting-plans-3f4fbdaaa1e3" className="underline text-blue-500">didn’t give us what we need</Link>. Instead, we stopped minting our Big Cheese rats after 37. Big cheeses can be purchased on the secondary market and come with these benefits:</p>
        <ul className="list-disc pl-8 mb-8">
          <li className="list-item mb-2">Includes an exclusive torn ear, big cheese attribute and icon.</li>
          <li className="list-item mb-2">Access to Looks, the tool we built Aww, Rats with (when it’s ready) for as long as the application exists.</li>
          <li className="list-item mb-2">Access to a special discord channel to help shape the future of Aww, Rats.</li>
          <li className="list-item mb-2">Stake in our SeaGals derivatives project.</li>
          <li className="list-item mb-2">Access to the Closet dapp prior with accessories to dress up and decorate your rat as soon as it rolls out.</li>
        </ul>

        <h3 className="mb-4 text-2xl font-bold">Minting</h3>
        <table className="w-full border border-blue-300 border-solid mb-8">
          <thead>
            <tr className="border-b border-blue-300 border-solid bg-blue-50">
              <th className="text-left px-4 py-2 w-2/3">Rat #</th>
              <th className="text-left p-4 px-4 py-2">Cost to Mint</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">1 - 99</td>
              <td className="text-left px-4 py-2">Free</td>
            </tr>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">100 - 198</td>
              <td className="text-left px-4 py-2">0.01ETH</td>
            </tr>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">199 - 397</td>
              <td className="text-left px-4 py-2">0.02ETH</td>
            </tr>
            <tr>
              <td className="text-left px-4 py-2">398 - 990</td>
              <td className="text-left px-4 py-2">0.03ETH</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-2xl mb-3 font-bold">Milestones</h3>
        <table className="w-full border border-blue-300 border-solid mb-8">
          <thead>
            <tr className="border-b border-blue-300 border-solid bg-blue-50">
              <th className="text-left px-4 py-2">Milestone</th>
              <th className="text-left px-4 py-2 w-3/4">Unlockable</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">10%</td>
              <td className="text-left px-4 py-2">We'll hold our first rat race, the winner will get a custom designed rat minted.</td>
            </tr>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">After every 99 mints</td>
              <td className="text-left px-4 py-2">We'll randomly select 1 holder to get a custom rat of their choosing added to the generation (and their wallet at no additional cost). The pieces will get added to the generator library so the community will be directly contributing to the rats.</td>
            </tr>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">25%</td>
              <td className="text-left px-4 py-2">Our closet Dapp will release for all holders to add new accessories to dress up and decorate their rats. We will be dropping new accessories in the closet regularly.</td>
            </tr>
            <tr className="border-b border-blue-300 border-solid">
              <td className="text-left px-4 py-2">50%</td>
              <td className="text-left px-4 py-2">New alleyway in the sewer opens up.</td>
            </tr>
            <tr>
              <td className="text-left px-4 py-2">100%</td>
              <td className="text-left px-4 py-2">We’ll build out the next generation of rat races and dapps we have planned.</td>
            </tr>
          </tbody>
        </table>

        <h3 className="text-2xl mb-3 font-bold">Benefits</h3>
        <p className="mb-2">When you pick up a rat, you get access to our fantastic community of creators as well as all sorts of other benefits like:</p>
        <ul className="list-disc pl-8 mb-8">
          <li className="list-item mb-2">Access to games and dapps that we build in the aww rats metaverse.</li>
          <li className="list-item mb-2">Access to tutorials and resources we create to help NFT and generative art creators design, build, and promote their projects. We share our process freely so you don’t have to make the mistakes we did already.</li>
          <li className="list-item mb-2">Access to our discord full of creators and interesting little vermin.</li>
          <li className="list-item mb-2">Discounted access to Looks, the tool we built Aww, Rats with (when it’s ready).</li>
          <li className="list-item mb-2">Access to a special Aww, Rats collab with one of our favorite projects.</li>
        </ul>
      </div>
    </div>
  )
}
