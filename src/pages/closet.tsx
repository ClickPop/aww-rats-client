import type { NextPage } from 'next';
import Head from 'next/head';
import { Layout } from '~/components/layout/Layout';
import dynamic from 'next/dynamic';
const Closet = dynamic(() => import('~/components/closet/Closet'), {
  ssr: false,
});

const Home: NextPage = () => {
  return (
    <Layout className='bg-dark'>
      <Head>
        <title>Aww, Rats! NFTs</title>
        <meta
          name='description'
          content='An NFT Project By Creators, for Creators.'
        />

        {/* Twitter */}
        <meta name='twitter:card' content='summary' key='twcard' />
        <meta name='twitter:creator' content='awwratspack' key='twhandle' />
        <meta name='twitter:image' content='/og-image.png' />

        {/* Open Graph */}
        <meta property='og:title' content='Aww, Rats!' />
        <meta
          property='og:description'
          content='An NFT Project By Creators, for Creators.'
        />
        <meta property='og:image' content='/og-image.png' />
      </Head>
      <Closet />
    </Layout>
  );
};

export default Home;
