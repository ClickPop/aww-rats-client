import { Link } from 'common/components/shared/Link';
import React from 'react';
import { Image } from '~/components/shared/Image';
import BacktalkLogo from 'src/assets/images/backtalk-icon.svg';
import Login from 'common/components/access/Login';
import { Box, HStack } from '@chakra-ui/react';

export const Navbar = () => {
  return (
    <Box backgroundColor='white' boxShadow='xs' p={1} pt={2}>
      <HStack justify='space-between' maxW='4xl' mx='auto'>
        <Box maxW='fit-content' textAlign={{ base: 'center', lg: 'left' }}>
          <Link href='/'>
            <Image
              src={BacktalkLogo}
              alt='BacktalkLogo'
              height={38}
              width={52}
            />
          </Link>
        </Box>
        <Login login />
      </HStack>
    </Box>
  );
};
