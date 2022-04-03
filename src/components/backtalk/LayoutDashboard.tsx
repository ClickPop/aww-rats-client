import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';
import { Navbar } from '~/components/backtalk/Navbar';

export const LayoutDashboard: FC = ({ children }) => {
  return (
    <Box backgroundColor='backtalk.background' minH='100vh'>
      <Navbar />
      <Box
        maxW='4xl'   
        mx='auto'
        px={{base: 2, md: 0}}
        py={4}
      >
        {children}
      </Box>
    </Box>
  );
};
