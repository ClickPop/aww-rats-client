import React from 'react';
import { Heading, Flex, Box, Stack, VStack, HStack } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { Button } from '~/components/game/Button';
import {
  GameIconTypes,
  RatType,
  EncounterType,
  Rattribute,
} from '~/types/game';
import { PickRatButton } from '~/components/game/PickRatButton';
import { ThumbCard } from '~/components/game/ThumbCard';
import { BattleThumbCard } from '~/components/game/BattleThumbCard';
import { RatThumbCard } from '~/components/game/RatThumbCard';
import { BattleCard } from '~/components/game/BattleCard';
import { TeamCard } from '~/components/game/TeamCard';
import { Stat } from '~/components/game/Stat';

import fpoCat from '~/assets/images/ratrace/fpo/fpo.cat.png';
import fpoRat from '~/assets/images/ratrace/fpo/fpo.rat.png';
import fpoBG from '~/assets/images/ratrace/fpo/fpo.bg.jpg';

export const Styleguide = () => {
  return (
    <Box w='100vw' minH='100vh' pos='fixed' top={0} left={0} color='dark.500'>
      <Image
        src={fpoBG}
        alt='background'
        objectFit='cover'
        className='absolute top-0 left-0 w-max h-max'
      />
      <VStack
        w='100%'
        maxW={1000}
        mx='auto'
        px={2}
        pb={5}
        pos='fixed'
        top='100px'
        bottom='40px'
        left='50%'
        transform='translateX(-50%)'
        zIndex={2}
        overflowY='scroll'>
        <Box w='100%' p={6} rounded='md' bg='whiteAlpha.600' boxShadow='md'>
          <Heading as='h2' size='lg' mb={2}>
            Buttons
          </Heading>

          <Heading as='h3' size='md' mb={2}>
            Basic
          </Heading>
          <Stack mt={2} direction={['column', 'row']} spacing='2' align='start'>
            <Button>Primary</Button>
            <Button buttonType='secondary'>
              Secondary
            </Button>
            <Button buttonType='destructive'>
              Destructive
            </Button>
          </Stack>

          <Heading as='h3' size='md' my={2}>
            Combo
          </Heading>
          <Stack mt={2} direction={['column', 'row']} spacing='2' align='start'>
            <Button
              icon={GameIconTypes.Energy}
              iconNumber={5}>
              Primary
            </Button>
            <Button
              icon={GameIconTypes.Energy}
              iconNumber={5}
              buttonType='secondary'>
              Secondary
            </Button>
            <Button
              icon={GameIconTypes.Energy}
              iconNumber={5}
              buttonType='destructive'>
              Destructive
            </Button>
          </Stack>

          <Heading as='h3' size='md' my={2}>
            Icon
          </Heading>
          <Flex mt={2}>
            <PickRatButton ratType={RatType.PetRat} label='Pet Rat' mr={2} />
            <PickRatButton ratType={RatType.LabRat} label='Lab Rat' mr={2} />
            <PickRatButton
              ratType={RatType.StreetRat}
              label='Street Rat'
              mr={2}
            />
            <PickRatButton ratType={RatType.PackRat} label='Pack Rat' mr={2} />
            <PickRatButton label='Any old rat...' mr={2} />
          </Flex>
        </Box>

        <Box w='100%' p={6} rounded='md' bg='whiteAlpha.600' boxShadow='md'>
          <Heading as='h2' size='lg' mb={2}>
            Team Cards
          </Heading>

          <Flex mt={2} flexWrap='wrap'>
            <TeamCard mr={5} mb={5} />
            <TeamCard mr={5} mb={5} ratType={RatType.LabRat} />
            <TeamCard mr={5} mb={5} ratType={RatType.StreetRat} />
            <TeamCard mr={5} mb={5} ratType={RatType.PetRat} />
            <TeamCard mr={5} mb={5} ratType={RatType.PackRat} />
          </Flex>
        </Box>

        <Box w='100%' p={6} rounded='md' bg='whiteAlpha.600' boxShadow='md'>
          <Heading as='h2' size='lg' mb={2}>
            Thumb Cards
          </Heading>
          <HStack alignItems='top' wrap='wrap'>
            <VStack align='left'>
              <Heading as='h3' size='md' mb={1}>
                ThumbCard.tsx
              </Heading>
              <ThumbCard title='Generic TC' image={fpoCat} flag='24hrs'>
                <Stat
                  icon={GameIconTypes.Strength}
                  label='Strength'
                  showLabel={true}
                  value={5}
                />
                <Stat
                  icon={GameIconTypes.Attack}
                  label='Attack'
                  showLabel={true}
                  value={7}
                />
                <Stat
                  icon={GameIconTypes.Reward}
                  label='Reward'
                  showLabel={true}
                  value={10}
                />
              </ThumbCard>

              <ThumbCard
                title='Disabled TC'
                state='disabled'
                image={fpoCat}
                flag='24hrs'>
                <Stat
                  icon={GameIconTypes.Strength}
                  label='Strength'
                  showLabel={true}
                  value={5}
                />
                <Stat
                  icon={GameIconTypes.Attack}
                  label='Attack'
                  showLabel={true}
                  value={7}
                />
                <Stat
                  icon={GameIconTypes.Reward}
                  label='Reward'
                  showLabel={true}
                  value={10}
                />
              </ThumbCard>

              <ThumbCard
                title='Selected TC'
                state='selected'
                image={fpoCat}
                flag='24hrs'>
                <Stat
                  icon={GameIconTypes.Strength}
                  label='Strength'
                  showLabel={true}
                  value={5}
                />
                <Stat
                  icon={GameIconTypes.Attack}
                  label='Attack'
                  showLabel={true}
                  value={7}
                />
                <Stat
                  icon={GameIconTypes.Reward}
                  label='Reward'
                  showLabel={true}
                  value={10}
                />
              </ThumbCard>
            </VStack>

            <VStack align='left'>
              <Heading as='h3' size='md' mb={1}>
                BattleThumbCard.tsx
              </Heading>
              <BattleThumbCard
                title='Batte'
                image={fpoCat}
                flag='5 minutes'
                stats={[
                  {
                    icon: GameIconTypes.Strength,
                    label: 'Strength',
                    showLabel: true,
                    value: 5,
                  },
                  {
                    icon: GameIconTypes.Attack,
                    label: 'Attack',
                    showLabel: true,
                    value: 7,
                  },
                  {
                    icon: GameIconTypes.Reward,
                    label: 'Reward',
                    showLabel: true,
                    value: 10,
                  },
                ]}
              />

              <BattleThumbCard
                title='Batte'
                image={fpoCat}
                flag='3 steps'
                state='disabled'
                stats={[
                  {
                    icon: GameIconTypes.Strength,
                    label: 'Strength',
                    showLabel: true,
                    value: 5,
                  },
                  {
                    icon: GameIconTypes.Attack,
                    label: 'Attack',
                    showLabel: true,
                    value: 7,
                  },
                  {
                    icon: GameIconTypes.Reward,
                    label: 'Reward',
                    showLabel: true,
                    value: 10,
                  },
                ]}
              />
            </VStack>

            <VStack align='left'>
              <Heading as='h3' size='md' mb={1}>
                RatThumbCard.tsx
              </Heading>
              <RatThumbCard
                image={fpoRat}
                ratType={RatType.LabRat}
                showRatTypeIcon={true}
                cunning={3}
                cuteness={1}
                rattitude={2}
              />

              <RatThumbCard
                state='disabled'
                image={fpoRat}
                ratType={RatType.LabRat}
                showRatTypeIcon={true}
                cunning={3}
                cuteness={1}
                rattitude={2}
              />

              <RatThumbCard
                state='selected'
                image={fpoRat}
                ratType={RatType.LabRat}
                showRatTypeIcon={true}
                cunning={3}
                cuteness={1}
                rattitude={2}
              />
            </VStack>
          </HStack>
        </Box>

        <Box w='100%' p={6} rounded='md' bg='whiteAlpha.600' boxShadow='md'>
          <Heading as='h2' size='lg' mb={2}>
            Battle Cards
          </Heading>
          <BattleCard
            image={fpoCat}
            altText='The Battle thubmnail illustration.'
            title='Cat'
            description='A description of the encounters you are about to undertake. This should be fun and add to the lore of the rataverse. Are you trying to acquire trash? Get a snack? Help a spider save a life through artistic weaving?'
            encounterType={EncounterType.Solo}
            weakness={Rattribute.Cunning}
            resistance={Rattribute.Cuteness}
            energy={5}
            strength={30}
            attack={10}
            reward={15}
          />
        </Box>
      </VStack>
    </Box>
  );
};
