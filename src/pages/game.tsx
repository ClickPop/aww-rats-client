import type { NextPage } from 'next';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import { Button } from '~/components/game/Button';
import { GameIconTypes } from '~/types/game';
import { Box } from '@chakra-ui/react';
import { SoloEncounterList } from '~/components/game/solo-encounters/SoloEncounterList';
import { GameContextProvider } from '~/components/context/GameContext';
import { SelectedEncounter } from '~/components/game/SelectedEncounter';

const Home: NextPage = () => {
  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800'>
      <Box pt={24}>
        <GameContextProvider>
          <SoloEncounterList />
          <SelectedEncounter />
        </GameContextProvider>
      </Box>
    </LayoutNoFooter>
  );
};

export default Home;
