import { Text, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GameAdminContextProvider } from '~/components/context/GameAdminContext';
import { EncountersTable } from '~/components/game/admin/EncountersTable';
import { RewardsTable } from '~/components/game/admin/RewardsTable';
import Login from '~/components/access/Login';
import { useGetGameDataQuery } from '~/schema/generated';
import { EthersContext } from '~/components/context/EthersContext';

export const Admin = () => {
  const { data, loading, error } = useGetGameDataQuery();
  const { isLoggedIn } = useContext(EthersContext);

  if (loading) {
    return <Text color='white'>Loading...</Text>;
  }

  if (error) {
    console.error(error);
    return (
      <Text color='white'>An error occurred, please check the console</Text>
    );
  }

  if (!isLoggedIn) {
    return <Login />;
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
