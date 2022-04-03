import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import { Image } from '~/components/shared/Image';
import BacktalkLogo from 'src/assets/images/backtalk/backtalk-logo.png';

export const Navbar = () => {
  return (
    <Stack justify='space-between' mx={{ base: '0', md: '10rem' }}>
      <Box>
        <Image src={BacktalkLogo} alt='BacktalkLogo' />
      </Box>
    </Stack>
  );
};
