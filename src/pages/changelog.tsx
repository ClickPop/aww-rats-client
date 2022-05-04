import { NextPage } from 'next';
import React from 'react';
import { Changelog } from '~/components/changelog/Changelog';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';

const ChangelogPage: NextPage = () => {
  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800 text-white'>
      <Changelog/>
    </LayoutNoFooter>
  );
};

export default ChangelogPage;
