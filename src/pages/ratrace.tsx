import { NextPage } from 'next';
import React from 'react';
import { Layout } from '~/components/layout/RatRaceLayout';
import { RatRace } from '~/components/rat-race/RatRace';

const RatRacePage: NextPage = () => {
  return (
    <Layout className='bg-gray-800'>
      <RatRace />
    </Layout>
  );
};

export default RatRacePage;
