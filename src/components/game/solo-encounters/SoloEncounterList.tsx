import { Box, HStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { GameContext } from '~/components/context/GameContext';
import { BattleThumbCard } from '~/components/game/BattleThumbCard';
import { useGetActiveEncountersQuery } from '~/schema/generated';
import { GameIconTypes } from '~/types/game';
import Placeholder from '~/assets/images/rat-placeholder.png';

export const SoloEncounterList = () => {
  const {
    soloEncountersResults: { data, loading, error },
    setSelectedEncounter,
  } = useContext(GameContext);
  if (loading) {
    return (
      <SimpleBar style={{ overflow: 'scroll' }}>
        <HStack p={2}>
          <BattleThumbCard image={Placeholder} title='Loading' mb={2} />
        </HStack>
      </SimpleBar>
    );
  }

  if (error) {
    console.log(error);
    return <Box>An error occurred. Please check the console</Box>;
  }

  return data ? (
    <SimpleBar style={{ overflow: 'scroll' }}>
      <HStack p={2}>
        {data.encounters.map((enc) => (
          <BattleThumbCard
            key={enc.id}
            image={enc.image || ''}
            title={enc.name}
            mb={2}
            stats={[
              {
                label: 'Strength',
                icon: GameIconTypes.Strength,
                value: enc.power,
                showLabel: true,
              },
              {
                label: 'Energy',
                icon: GameIconTypes.Energy,
                value: enc.energy_cost,
                showLabel: true,
              },
            ]}
            onClick={() => {
              setSelectedEncounter(enc);
            }}
          />
        ))}
      </HStack>
    </SimpleBar>
  ) : null;
};
