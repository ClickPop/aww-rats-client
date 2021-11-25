import type { NextPage } from 'next';
import Head from 'next/head';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import dynamic from 'next/dynamic';
import { ClosetContextProvider } from '~/components/context/ClosetContext';
const Closet = dynamic(() => import('~/components/closet/Closet'), {
  ssr: false,
});

const ClosetPage: NextPage = () => {
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
        <meta
          name='twitter:image'
          content='https://storage.googleapis.com/aww-rats-images/social/og-image.png'
        />

        {/* Open Graph */}
        <meta property='og:title' content='Aww, Rats!' />
        <meta
          property='og:description'
          content='An NFT Project By Creators, for Creators.'
        />
        <meta
          property='og:image'
          content='https://storage.googleapis.com/aww-rats-images/social/og-image.png'
        />
      </Head>
      <ClosetContextProvider>
        <Closet />
      </ClosetContextProvider>
    </LayoutNoFooter>
  );
};

export default ClosetPage;
