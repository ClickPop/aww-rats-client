import type { NextPage } from 'next';
import Head from 'next/head';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import dynamic from 'next/dynamic';
const Den = dynamic(() => import('~/components/den/Den'), {
  ssr: false,
});

const DenPage: NextPage = () => {
  return (
    <LayoutNoFooter className='bg-dark'>
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
      <Den />
    </LayoutNoFooter>
  );
};

export default DenPage;
