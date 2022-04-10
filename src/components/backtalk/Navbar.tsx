import { Box, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { Image } from '~/components/shared/Image';
import BacktalkLogo from 'src/assets/images/backtalk/backtalk-logo.png';

export const Navbar = () => {
  return (
    <Box backgroundColor='white' boxShadow='xs' py={1}>
      <Stack justify='space-between' maxW='4xl' mx='auto'>
        <Box>
          <Link href='/backtalk' passHref>
            <Image
              cursor='pointer'
              src={BacktalkLogo}
              alt='BacktalkLogo'
              height={46}
              width={58}
            />
          </Link>
        </Box>
      </Stack>
    </Box>
  );
};
