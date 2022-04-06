import {
  Box,
  Center,
  VStack,
  Text,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { Image } from '~/components/shared/Image';
import Login from '~/components/access/Login';
import { EthersContext } from '~/components/context/EthersContext';
import RatRace from '~/assets/svg/RatRace.svg';
import { RattributePill } from '~/components/game/rats/RattributePill';

const AuthCookieRequired: FC = ({ children }) => {
  const { isLoggedIn, authLoading } = useContext(EthersContext);

  if (authLoading) {
    return (
      <Center py={20}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
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
            <Login />
            <Box
              textAlign='left'
              bg='darkAlpha.500'
              color='white'
              fontSize='sm'
              maxH='200px'
              overflowY='scroll'
              p={3}
              rounded='lg'
              mt={12}>
              <RattributePill rattribute='Alpha' value={0.1} mb={2} />
              <Text mb={4}>
                Things might broken or may not work the way you expect. Let us
                know about bugs or ideas the discord.
              </Text>
              <Text fontWeight='bold'>02/24/2022</Text>
              <UnorderedList>
                <ListItem>
                  Begin tracking rewards people have earned for completing
                  encounters. Not doing anything with this yet, but laying the
                  groundwork.
                </ListItem>
                <ListItem>Add tooltips to explain game features.</ListItem>
              </UnorderedList>
            </Box>
          </VStack>
        </Box>
      </>
    );
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
