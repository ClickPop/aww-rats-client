import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';
import { Navbar } from '~/components/backtalk/backtalk/Navbar';

export const LayoutDashboard = ({ children }) => {
  return (
    <Box
      backgroundColor='backtalk.background'
      minH='100vh'
    >
      <Navbar />
      {children}
    </Box>
  );
};