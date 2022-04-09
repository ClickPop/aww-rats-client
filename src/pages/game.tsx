import type { NextPage } from 'next';
import { RatRaceLayout } from '~/components/layout/RatRaceLayout';
import { Box, ListItem, UnorderedList, VStack, Text } from '@chakra-ui/react';
import { SoloEncounterList } from '~/components/game/solo-encounters/SoloEncounterList';
import { TutorialVideo } from '~/components/game/shared/TutorialVideo';
import { GameContextProvider } from '~/components/context/GameContext';
import { SelectedEncounter } from '~/components/game/SelectedEncounter';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import { PlayerStats } from '~/components/game/player/PlayerStats';
import { AttemptEncounterButton } from '~/components/game/shared/AttemptEncounterButton';
import Login from '~/components/access/GameLogin';
import { RattributePill } from '~/components/game/rats/RattributePill';
import { Image } from '~/components/shared/Image';
import RatRace from '~/assets/svg/RatRace.svg';

const GamePage: NextPage = () => {
  return (
    <RatRaceLayout className='min-h-screen rrPage--sewer-blueGray'>
      <Box pb={12}>
        <AuthCookieRequired
          fallback={
            <Box px={2} py={8}>
              <VStack
                alignItems='center'
                bg='blueGray.500'
                bgImage='url("/rat-race/images/ratrace-bg.webp")'
                bgPosition='center'
                bgSize='cover'
                boxShadow='dark-lg'
                h='600'
                maxH='90vh'
                mx='auto'
                w='100%'
                maxW='480px'
                py={8}
                px={4}
                rounded='xl'>
                <Image alt='The Rat Race' height='200px' src={RatRace} />
                <Login />
                <Box
                  textAlign='left'
                  bg='darkAlpha.500'
                  color='white'
                  fontSize='sm'
                  maxH='200px'
                  overflowY='scroll'
                  p={3}
                  rounded='lg'
                  mt={12}>
                  <RattributePill rattribute='Alpha' value={0.1} mb={2} />
                  <Text mb={4}>
                    Things might broken or may not work the way you expect. Let
                    us know about bugs or ideas the discord.
                  </Text>
                  <Text fontWeight='bold'>02/24/2022</Text>
                  <UnorderedList>
                    <ListItem>
                      Begin tracking rewards people have earned for completing
                      encounters. Not doing anything with this yet, but laying
                      the groundwork.
                    </ListItem>
                    <ListItem>Add tooltips to explain game features.</ListItem>
                  </UnorderedList>
                </Box>
              </VStack>
            </Box>
          }>
          <TutorialVideo />
          <GameContextProvider>
            <PlayerStats />
            <SoloEncounterList />
            <Box
              bg='blueGray.500'
              boxShadow='lg'
              display='flex'
              flexDirection='column'
              mt={2}
              mx='auto'
              w='725px'
              rounded='xl'>
              <SelectedEncounter />
            </Box>
            <Box position='fixed' bottom='0' w='100%'>
              <AttemptEncounterButton />
            </Box>
          </GameContextProvider>
        </AuthCookieRequired>
      </Box>
    </RatRaceLayout>
  );
};

export default GamePage;
