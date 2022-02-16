import { HStack, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { GameContext } from '~/components/context/GameContext';
import { Stat } from '~/components/game/Stat';
import { GameIconTypes } from '~/types/game';

export const PlayerStats = () => {
  const { player } = useContext(GameContext);

  return player ? (
    <HStack
      justifyContent='space-between'
      color='gray.200'
      fontWeight='semibold'
      p='2'>
      <Text>🐀 {player.id}</Text>
      <Stat
        label='Energy'
        icon={GameIconTypes.Energy}
        value={`${player.energy}/${player.max_energy}`}
      />
    </HStack>
  ) : null;
};
