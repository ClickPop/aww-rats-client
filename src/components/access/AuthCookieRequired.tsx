import { Box, Center, VStack, Text } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { Image } from '~/components/shared/Image';
import Login from '~/components/access/Login';
import { EthersContext } from '~/components/context/EthersContext';
import RatRace from '~/assets/svg/RatRace.svg';
import { Connect } from '~/components/shared/Connect';

const AuthCookieRequired: FC = ({ children }) => {
  const { isLoggedIn, signerAddr } = useContext(EthersContext);

  if (!signerAddr) {
    return (
      <Center py={20}>
        <Connect />
      </Center>
    );
  }

  if (!isLoggedIn) {
    return (
      <Box px={2} py={8}>
        <VStack
          alignItems='center'
          bg='blueGray.500'
          bgImage='url("/rat-race/images/ratrace-bg.webp")'
          bgPosition='center'
          bgSize='cover'
          boxShadow='dark-lg'
          h='600'
          maxH='90vh'
          mx='auto'
          w='100%'
          maxW='480px'
          py={8}
          px={4}
          rounded='xl'
        >
          <Image
            alt='The Rat Race'
            height='200px'
            src={RatRace}
          />
          <Text
            align='center'
            color='white'
            pb={6}
            pt={2}
          >
            <strong>Alpha</strong><br />(That means this is just a really rough beginning)
          </Text>
          <Login />
        </VStack>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
