import React from 'react';
import { Heading, Flex, Box, VStack, HStack } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { Button } from '~/components/game/Button';
import { GameIconTypes, RatType } from '~/types/game';
import { PickRatButton } from '~/components/game/PickRatButton';
import { ThumbCard } from '~/components/game/ThumbCard';
import { BattleThumbCard } from '~/components/game/BattleThumbCard';
import { RatThumbCard } from '~/components/game/RatThumbCard';
import { Stat } from '~/components/game/Stat';

import fpoCat from '~/assets/images/ratrace/fpo/fpo.cat.png';
import fpoRat from '~/assets/images/ratrace/fpo/fpo.rat.png';
import fpoBG from '~/assets/images/ratrace/fpo/fpo.bg.jpg';

export const Styleguide = () => {
  return (
    <Box w='100vw' minH='100vh' pos='fixed' top={0} left={0} color='dark.500'>
      <Image src={fpoBG} alt='background' objectFit='contain' className='absolute top-0 left-0 w-max h-max' />
      <VStack maxW={1000} mx='auto' pt={40} pos='relative' zIndex={2}>
          <Box w='100%' p={6} rounded="md" bg='whiteAlpha.600' boxShadow="md">
            <Heading as='h2' size='lg' mb={2}>Buttons</Heading>
            
            <Flex mt={2}>
              <Button mr={2}>Primary</Button>
              <Button mr={2} buttonType='secondary'>
                Secondary
              </Button>
              <Button mr={2} buttonType='destructive'>
                Destructive
              </Button>
            </Flex>

            <Flex mt={2}>
              <Button mr={2} icon={GameIconTypes.Energy} iconNumber={5}>
                Primary
              </Button>
              <Button
                mr={2}
                icon={GameIconTypes.Energy}
                iconNumber={5}
                buttonType='secondary'>
                Secondary
              </Button>
              <Button
                mr={2}
                icon={GameIconTypes.Energy}
                iconNumber={5}
                buttonType='destructive'>
                Destructive
              </Button>
            </Flex>

            <Flex mt={2}>
              <PickRatButton ratType={RatType.PetRat} label='Pet Rat' mr={2} />
              <PickRatButton ratType={RatType.LabRat} label='Lab Rat' mr={2} />
              <PickRatButton ratType={RatType.StreetRat} label='Street Rat' mr={2} />
              <PickRatButton ratType={RatType.PackRat} label='Pack Rat' mr={2} />
              <PickRatButton label='Any old rat...' mr={2} />
            </Flex>
          </Box>

          

          <Box w='100%' p={6} rounded="md" bg='whiteAlpha.600' boxShadow="md">
            <Heading as='h2' size='lg' mb={2}>Thumb Cards</Heading>
            <HStack alignItems='top' wrap='wrap'>
              <VStack align='left'>
                <Heading as='h3' size='md' mb={1}>ThumbCard.tsx</Heading>
                <ThumbCard 
                  title='Generic TC'
                  image={fpoCat}
                  flag='24hrs'>
                  <Stat icon={GameIconTypes.Strength} label='Strength' showLabel={true} value={5} />
                  <Stat icon={GameIconTypes.Attack} label='Attack' showLabel={true} value={7} />
                  <Stat icon={GameIconTypes.Reward} label='Reward' showLabel={true} value={10} />
                </ThumbCard>

                <ThumbCard 
                  title='Disabled TC'
                  state='disabled'
                  image={fpoCat}
                  flag='24hrs'>
                  <Stat icon={GameIconTypes.Strength} label='Strength' showLabel={true} value={5} />
                  <Stat icon={GameIconTypes.Attack} label='Attack' showLabel={true} value={7} />
                  <Stat icon={GameIconTypes.Reward} label='Reward' showLabel={true} value={10} />
                </ThumbCard>

                <ThumbCard 
                  title='Selected TC'
                  state='selected'
                  image={fpoCat}
                  flag='24hrs'>
                  <Stat icon={GameIconTypes.Strength} label='Strength' showLabel={true} value={5} />
                  <Stat icon={GameIconTypes.Attack} label='Attack' showLabel={true} value={7} />
                  <Stat icon={GameIconTypes.Reward} label='Reward' showLabel={true} value={10} />
                </ThumbCard>
              </VStack>

              <VStack align='left'>
                <Heading as='h3' size='md' mb={1}>BattleThumbCard.tsx</Heading>
                <BattleThumbCard 
                  title='Batte'
                  image={fpoCat}
                  flag='5 minutes'
                  stats={[
                    { icon: GameIconTypes.Strength, label: 'Strength', showLabel: true, value: 5 },
                    { icon: GameIconTypes.Attack, label: 'Attack', showLabel: true, value: 7 },
                    { icon: GameIconTypes.Reward, label: 'Reward', showLabel: true, value: 10 },
                  ]}
                />

                <BattleThumbCard 
                  title='Batte'
                  image={fpoCat}
                  flag='3 steps'
                  state='disabled'
                  stats={[
                    { icon: GameIconTypes.Strength, label: 'Strength', showLabel: true, value: 5 },
                    { icon: GameIconTypes.Attack, label: 'Attack', showLabel: true, value: 7 },
                    { icon: GameIconTypes.Reward, label: 'Reward', showLabel: true, value: 10 },
                  ]}
                />
              </VStack>

              <VStack align='left'>
                <Heading as='h3' size='md' mb={1}>RatThumbCard.tsx</Heading>
                <RatThumbCard 
                  image={fpoRat}
                  ratType={RatType.LabRat}
                  showRatTypeIcon={true}
                  cunning={3}
                  cuteness={1}
                  rattitude={4}
                />

                <RatThumbCard 
                  state='disabled'
                  image={fpoRat}
                  ratType={RatType.LabRat}
                  showRatTypeIcon={true}
                  cunning={3}
                  cuteness={1}
                  rattitude={4}
                />

                <RatThumbCard 
                  state='selected'
                  image={fpoRat}
                  ratType={RatType.LabRat}
                  showRatTypeIcon={true}
                  cunning={3}
                  cuteness={1}
                  rattitude={4}
                />
              </VStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
        
  );
};
