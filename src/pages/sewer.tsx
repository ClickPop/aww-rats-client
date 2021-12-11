import { NextPage } from 'next';
import React from 'react';
import { Sewer } from '~/components/sewer/Sewer';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';

const SewerPage: NextPage = () => {
  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800'>
      <Sewer />
    </LayoutNoFooter>
  );
};

export default SewerPage;
