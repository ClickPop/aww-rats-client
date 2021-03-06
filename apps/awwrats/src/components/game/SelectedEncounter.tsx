import { Box, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GameContext } from '~/components/context/GameContext';
import { BattleCard } from '~/components/game/BattleCard';
import { Encounter_Types_Enum } from '~/schema/generated';

export const SelectedEncounter = () => {
  const { selectedEncounter } = useContext(GameContext);
  return selectedEncounter ? (
    <Box>
      <BattleCard
        image={selectedEncounter.image ?? ''}
        title={selectedEncounter.name}
        description={selectedEncounter.description ?? ''}
        weakness={selectedEncounter.encounter_weaknesses.map((w) => w.weakness)}
        resistance={selectedEncounter.encounter_resistances.map(
          (r) => r.resistance,
        )}
        energy={selectedEncounter.energy_cost}
        strength={selectedEncounter.power}
        reward={selectedEncounter.reward.tokens}
        encounterType={Encounter_Types_Enum.Solo}
      />
    </Box>
  ) : (
    <Text color='gray.200' p={10} textAlign='center'>
      Select an encounter ⬆️
    </Text>
  );
};
