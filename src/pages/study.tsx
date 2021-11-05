import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import Study from '~/components/study/Study';
import studyHeader from '~/assets/images/headers/header-study.jpg';

import React, {
  useContext,
  useEffect,
  useState
} from 'react';
import router from 'next/router';
import { BigNumber } from 'ethers';
import { EthersContext } from '~/components/context/EthersContext';
import { Connect } from '~/components/shared/Connect';

const StudyPage: NextPage = () => {
  const { signer, contract, signerAddr, connected } = useContext(EthersContext);
  const [signerTokenCount, setSignerTokenCount] = useState<number | null>(0);
  const [loading, setLoading] = useState({
    tokenCount: false
  });

  // Get all the tokens for an address
  useEffect(() => {
    (async () => {
      if (contract && signerAddr) {
        try {
          setLoading((l) => ({ ...l, tokenCount: true }));
          let balance = await contract.balanceOf(signerAddr);
          setSignerTokenCount(balance.toNumber());
        } catch (err) {
          console.error(err);
        }
        setLoading((l) => ({ ...l, tokenCount: false }));
      }
    })();
  }, [signer, contract, signerAddr]);

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
      <div className='h-screen w-full'>
        <div className='w-full h-1/4 h-max-60 relative flex items-center justify-center'>
          <h1 className='sr-only'>The Study</h1>
          <Image 
            alt='Study'
            src={studyHeader}
            layout='fill'
            objectFit='cover'
          />
        </div>
        <div className='pt-16'>
          {!signerAddr ? (
            <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
              <Connect />
            </div>
          ) : (typeof signerTokenCount === 'number' && signerTokenCount <= 0) ? (
            <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
              <h3 className='text-center text-xl italic font-bold p-4'>
                The den is currently restricted to Aww, Rats hodlers.
              </h3>
            </div>
          ) : (
            <Study />
          )}
        </div>
      </div>
    </LayoutNoFooter>
  );
};

export default StudyPage;
