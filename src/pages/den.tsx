import type { NextPage } from 'next';
import React, { useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import dynamic from 'next/dynamic';
import { EthersContext } from '~/components/context/EthersContext';
import { Connect } from '~/components/shared/Connect';
const Den = dynamic(() => import('~/components/den/Den'), {
  ssr: false,
});

const DenPage: NextPage = () => {
  const { signerAddr } = useContext(EthersContext);
  const [hodler, setHodler] = useState<Boolean | null>();

  useEffect(() => {
    const getHodlerStatus = async () => {
      if (signerAddr) {
        const resHodler = await fetch(`/api/hodler/${signerAddr}`).then((r) =>
          r.json(),
        );
        setHodler(resHodler.data.hodler ? true : false);
      }
    };

    getHodlerStatus();
  }, [signerAddr]);

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

      {!signerAddr ? (
        <div className='h-screen pt-60'>
          <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
            <Connect />
          </div>
        </div>
      ) : hodler === false ? (
        <div className='h-screen pt-60'>
          <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
            <h3 className='text-center text-xl italic font-bold p-4'>
              The den is currently restricted to Aww, Rats hodlers.
            </h3>
          </div>
        </div>
      ) : (
        <Den />
      )}
    </LayoutNoFooter>
  );
};

export default DenPage;
