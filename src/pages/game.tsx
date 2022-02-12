import type { NextPage } from 'next';
import { RatRaceLayout } from '~/components/layout/RatRaceLayout';
import { Box } from '@chakra-ui/react';
import { SoloEncounterList } from '~/components/game/solo-encounters/SoloEncounterList';
import { GameContextProvider } from '~/components/context/GameContext';
import { SelectedEncounter } from '~/components/game/SelectedEncounter';
import { RatSelector } from '~/components/game/rats/RatSelector';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';

const Home: NextPage = () => {
  return (
    <RatRaceLayout className='min-h-screen rrPage--sewer-green'>
      <Box pt={24}>
        <AuthCookieRequired>
          <GameContextProvider>
            <SoloEncounterList />
            <SelectedEncounter />
            <RatSelector />
          </GameContextProvider>
        </AuthCookieRequired>
      </Box>
    </RatRaceLayout>
  );
};

export default Home;
