import { Box, HStack, Text, Tooltip } from '@chakra-ui/react';
import { add, differenceInHours, differenceInMinutes } from 'date-fns';
import React, { useContext } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { Stat } from '~/components/game/Stat';
import { GameIconTypes } from '~/types/game';

export const PlayerStats = () => {
  const { player } = useContext(GameContext);
  const getDiff = (
    differenceFunction: typeof differenceInHours,
    opts?: { roundingMethod?: string },
  ) =>
    differenceFunction(
      add(new Date(), { days: 1 }).setHours(0, 0, 0, 0),
      new Date(),
      opts,
    );
  const getTooltipText = () =>
    `Your energy will recharge in ${getDiff(differenceInHours)}h:${(
      getDiff(differenceInMinutes, { roundingMethod: 'ceil' }) % 60
    )
      .toString()
      .padStart(2, '0')}m`;

  return player ? (
    <HStack
      justifyContent='space-between'
      color='gray.200'
      fontWeight='semibold'
      p='2'>
      <Text>🐀 {player.id}</Text>
      <HStack gap={2}>
        <Tooltip
          placement='left'
          label='Your earned but unclaimed tokens'
          shouldWrapChildren>
          <Stat
            label='Reward'
            icon={GameIconTypes.Reward}
            value={player.tokens ?? 0}
          />
        </Tooltip>
        <Tooltip
          placement='left'
          isDisabled={player.energy === player.max_energy}
          label={getTooltipText()}
          shouldWrapChildren>
          <Stat
            label='Energy'
            icon={GameIconTypes.Energy}
            value={`${player.energy}/${player.max_energy}`}
          />
        </Tooltip>
      </HStack>
    </HStack>
  ) : null;
};
