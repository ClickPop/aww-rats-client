import type { NextPage } from 'next'
import Head from 'next/head'
import { Hero } from '~/components/index/hero/Hero';
import { About } from '~/components/index/about/About';
import { Roadmap } from '~/components/index/roadmap/Roadmap';
import { Generator } from '~/components/index/generator/Generator';
import { FAQ } from '~/components/index/faq/FAQ';
import { RatRace } from '~/components/index/rat-race/RatRace';
import { Layout } from '~/components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout className="bg-dark">
      <Head>
        <title>Aww, Rats! NFTs</title>
      </Head>
      <Hero />
      <About />
      <Roadmap />
      <Generator />
      <FAQ />
      <RatRace />
    </Layout>
  )
}

export default Home
