import type { NextPage } from 'next';
import { RatRaceLayout } from '~/components/layout/RatRaceLayout';
import { Box } from '@chakra-ui/react';
import { SoloEncounterList } from '~/components/game/solo-encounters/SoloEncounterList';
import { GameContextProvider } from '~/components/context/GameContext';
import { SelectedEncounter } from '~/components/game/SelectedEncounter';
import { RatSelector } from '~/components/game/rats/RatSelector';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import { PlayerStats } from '~/components/game/player/PlayerStats';
import { AttemptEncounterButton } from '~/components/game/shared/AttemptEncounterButton';

const Home: NextPage = () => {
  return (
    <RatRaceLayout className='min-h-screen rrPage--sewer-green'>
      <Box>
        <AuthCookieRequired>
          <GameContextProvider>
            <PlayerStats />
            <SoloEncounterList />
            <SelectedEncounter />
            <RatSelector />
            <Box w='fit-content' mt='2rem' mx='auto'>
              <AttemptEncounterButton />
            </Box>
          </GameContextProvider>
        </AuthCookieRequired>
      </Box>
    </RatRaceLayout>
  );
};

export default Home;
