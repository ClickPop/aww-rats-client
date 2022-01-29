import { Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { GameAdminContextProvider } from '~/components/context/GameAdminContext';
import { EncountersTable } from '~/components/game/admin/EncountersTable';
import { GauntletsTable } from '~/components/game/admin/GauntletsTable';
import { RaidsTable } from '~/components/game/admin/RaidsTable';
import { RewardsTable } from '~/components/game/admin/RewardsTable';
import { useGetGameDataQuery } from '~/schema/apollo';
import { Rattributes_Enum, Rat_Types_Enum } from '~/schema/generated';

export const Admin = () => {
  const { data, loading } = useGetGameDataQuery();

  if (loading) {
    return <Text color='white'>Loading...</Text>;
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
