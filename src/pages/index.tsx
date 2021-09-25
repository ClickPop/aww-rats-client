import type { NextPage } from 'next'
import { Minter } from '~/components/minting/Minter';
import { Hero } from '~/components/index/hero/Hero';
import { About } from '~/components/index/about/About';
import { Roadmap } from '~/components/index/roadmap/Roadmap';
import { RatRace } from '~/components/index/rat-race/RatRace';
import { Layout } from '~/components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout className="bg-dark">
      <Hero />
      <div className="text-light w-fit mx-auto">
        <Minter />
      </div>
      <About />
      <Roadmap />
      <RatRace />
    </Layout>
  )
}

export default Home
