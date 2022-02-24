import { Box, Center, VStack, Text } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { Image } from '~/components/shared/Image';
import Login from '~/components/access/Login';
import { EthersContext } from '~/components/context/EthersContext';
import RatRace from '~/assets/svg/RatRace.svg';
import { RattributePill } from '~/components/game/rats/RattributePill';
import { Connect } from '~/components/shared/Connect';

const AuthCookieRequired: FC = ({ children }) => {
  const { isLoggedIn, signerAddr, authLoading } = useContext(EthersContext);

  if (authLoading) {
    return (
      <Center py={20}>
        <Text>Loading...</Text>
      </Center>
    );
  }

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
          rounded='xl'>
          <Image alt='The Rat Race' height='200px' src={RatRace} />
          <RattributePill rattribute='Alpha' value={0.1} mb={2} />
          <Text
            align='center'
            bg='darkAlpha.400'
            color='white'
            fontSize='sm'
            p={3}
            rounded='lg'>
            <strong>Release Notes:</strong> This is our very first alpha.
            Don&apos;t be surprised if things are broken or don&apos;t work the
            way you expect. Let us know of any bugs you find or ideas you have
            in the discord.
          </Text>
          <Login />
        </VStack>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
