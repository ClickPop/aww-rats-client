import type { NextPage } from 'next'
import { Hero } from '~/components/index/hero/Hero';
import { About } from '~/components/index/about/About';
import { Roadmap } from '~/components/index/roadmap/Roadmap';
import { FAQ } from '~/components/index/faq/FAQ';
import { RatRace } from '~/components/index/rat-race/RatRace';
import { Layout } from '~/components/layout/Layout';

const Home: NextPage = () => {
  return (
    <Layout className="bg-dark">
      <Hero />
      <About />
      <Roadmap />
      <FAQ />
      <RatRace />
    </Layout>
  )
}

export default Home
