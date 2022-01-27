import React from 'react';
import { Heading, Flex, Box, VStack, HStack } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { Button } from '~/components/game/Button';
import { GameIconTypes } from '~/types/game';
import { PickRatButton } from '~/components/game/PickRatButton';
import { ThumbCard } from '~/components/game/ThumbCard';
import { Stat } from '~/components/game/Stat';

import fpoCat from '~/assets/images/ratrace/fpo/fpo.cat.png';
import fpoBG from '~/assets/images/ratrace/fpo/fpo.bg.jpg';

export const Styleguide = () => {
  return (
    <Box w='100vw' minH='100vh' pos='fixed' top={0} left={0} color='dark.500'>
      <Image src={fpoBG} alt='background' objectFit='contain' className='absolute top-0 left-0 w-max h-max' />
      <VStack maxW={800} mx='auto' pt={40} pos='relative' zIndex={2}>
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
              <PickRatButton ratType={GameIconTypes.PetRat} label='Pet Rat' mr={2} />
              <PickRatButton ratType={GameIconTypes.LabRat} label='Lab Rat' mr={2} />
              <PickRatButton ratType={GameIconTypes.StreetRat} label='Street Rat' mr={2} />
              <PickRatButton ratType={GameIconTypes.PackRat} label='Pack Rat' mr={2} />
              <PickRatButton label='Any old rat...' mr={2} />
            </Flex>
          </Box>

          <Box w='100%' p={6} rounded="md" bg='whiteAlpha.600' boxShadow="md">
            <Heading as='h2' size='lg' mb={2}>Thumb Cards</Heading>

            <Flex mt={2}>
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
            </Flex>
          </Box>
      </VStack>

    </Box>
        
  );
};
