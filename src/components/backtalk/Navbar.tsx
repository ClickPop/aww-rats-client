import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import { Image } from '~/components/shared/Image';
import BacktalkLogo from 'src/assets/images/backtalk/backtalk-logo.png';

export const Navbar = () => {
  return (
    <Box backgroundColor='white' boxShadow='xs' py='0.25rem'>
      <Stack justify='space-between' maxW='4xl' mx='auto'>
        <Box>
          <Image src={BacktalkLogo} alt='BacktalkLogo' height={46} width={58} />
        </Box>
      </Stack>
    </Box>
  );
};