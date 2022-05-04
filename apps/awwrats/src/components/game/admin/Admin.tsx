import { Button, Text, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Image } from '~/components/shared/Image';
import { GameAdminContextProvider } from '~/components/context/GameAdminContext';
import { EncountersTable } from '~/components/game/admin/EncountersTable';
import { RewardsTable } from '~/components/game/admin/RewardsTable';
import Login from '~/components/access/Login';
import { useGetGameDataQuery } from '~/schema/generated';
import { EthersContext } from 'common/components/context/EthersContext';
import RatRace from '~/assets/svg/RatRace.svg';

export const Admin = () => {
  const { data, loading, error } = useGetGameDataQuery();
  const { isLoggedIn } = useContext(EthersContext);

  if (loading) {
    return <Text color='white'>Loading...</Text>;
  }

  if (!isLoggedIn) {
    return (
      <VStack alignItems='center' maxW='100vw'>
        <Image src={RatRace} alt='The Rat Race' />
        <Login>
          <Button
            background='linear-gradient(-45deg, var(--chakra-colors-pink-500), var(--chakra-colors-red-500), var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))'
            backgroundSize='600% 400%'
            _hover={{
              animation: 'encounterShimmer 4s ease infinite;',
            }}>
            Login
          </Button>
        </Login>
      </VStack>
    );
  }

  if (error) {
    console.error(error);
    return (
      <Text color='white'>An error occurred, please check the console</Text>
    );
  }

  return data ? (
    <VStack alignItems='flex-start' maxW='100vw'>
      <GameAdminContextProvider>
        <EncountersTable />
        <RewardsTable />
      </GameAdminContextProvider>
    </VStack>
  ) : null;
};
