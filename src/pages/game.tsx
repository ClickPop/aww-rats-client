import type { NextPage } from 'next';
import { RatRaceLayout } from '~/components/layout/RatRaceLayout';
import { Box } from '@chakra-ui/react';
import { SoloEncounterList } from '~/components/game/solo-encounters/SoloEncounterList';
import { GameContextProvider } from '~/components/context/GameContext';
import { SelectedEncounter } from '~/components/game/SelectedEncounter';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import { PlayerStats } from '~/components/game/player/PlayerStats';
import { AttemptEncounterButton } from '~/components/game/shared/AttemptEncounterButton';

const Home: NextPage = () => {
  return (
    <RatRaceLayout className='min-h-screen rrPage--sewer-blueGray'>
      <Box>
        <AuthCookieRequired>
          <GameContextProvider>
            <PlayerStats />
            <SoloEncounterList />
            <Box
              bg='blueGray.500'
              display='flex'
              flexDirection='column'
              my={2}
              mx='auto'
              w='60%'
              rounded='xl'
            >
              <SelectedEncounter />
              <Box>
                <AttemptEncounterButton />
              </Box>
            </Box>
          </GameContextProvider>
        </AuthCookieRequired>
      </Box>
    </RatRaceLayout>
  );
};

export default Home;
