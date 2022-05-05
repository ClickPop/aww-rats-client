import { NextPage } from 'next';
import React from 'react';
import { Community } from '~/components/index/community/Community';
import { Layout } from '~/components/layout/Layout';

const RatRacePage: NextPage = () => {
  return (
    <Layout className='bg-gray-800'>
      <Community />
    </Layout>
  );
};

export default RatRacePage;
