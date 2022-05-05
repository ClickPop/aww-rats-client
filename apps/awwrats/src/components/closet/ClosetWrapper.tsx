import React from 'react';
import Closet from '~/components/closet/Closet';
import { ClosetContextProvider } from '~/components/context/ClosetContext';

const ClosetWrapper = () => {
  return (
    <ClosetContextProvider>
      <Closet />
    </ClosetContextProvider>
  );
};
export default ClosetWrapper;
