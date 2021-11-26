import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import Study from '~/components/study/Study';
import studyHeader from '~/assets/images/headers/header-study.jpg';

import React, { useContext, useEffect, useState } from 'react';
import router from 'next/router';
import { BigNumber } from 'ethers';
import { EthersContext } from '~/components/context/EthersContext';
import { Connect } from '~/components/shared/Connect';

const StudyPage: NextPage = () => {
  const { signer, contract, signerAddr, connected } = useContext(EthersContext);
  const [signerTokenCount, setSignerTokenCount] = useState<number | null>(0);
  const [loading, setLoading] = useState({
    tokenCount: false,
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
      <div className='container mx-auto max-w-xl h-screen w-full text-white'>
        <div className='w-full pt-20'>
          <h1 className='text-4xl mb-2 font-bold'>The Study</h1>
          <p className='text-lg mb-8'>
            A repository of all the stored wisdom of the sewer, just for Aww,
            Rats token holders.
          </p>
        </div>
        <div>
          {!signerAddr ? (
            <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
              <p className='text-lg mb-8'>
                The study is for rats only. Connect your wallet with a rat token
                to start learning.
              </p>
              <Connect />
            </div>
          ) : typeof signerTokenCount === 'number' && signerTokenCount <= 0 ? (
            <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
              <h3 className='text-center text-xl font-bold p-4'>
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
