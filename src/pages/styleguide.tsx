import { NextPage } from 'next';
import React from 'react';
import { Styleguide } from '~/components/styleguide/Styleguide';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';

const SewerPage: NextPage = () => {
  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800'>
      <Styleguide />
    </LayoutNoFooter>
  );
};

export default SewerPage;
