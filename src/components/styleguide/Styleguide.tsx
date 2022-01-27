import React from 'react';
import { Button } from '~/components/game/Button';
import { GameIconTypes } from '~/types/game';
import { PickRatButton } from '../game/PickRatButton';
import { ThumbCard } from '../game/ThumbCard';
import { Stat } from '../game/Stat';

import fpoCat from '~/assets/images/ratrace/fpo/fpo.cat.png';

export const Styleguide = () => {
  return (
    <div className='mx-auto max-w-xl py-20 px-4'>
      <div className='mb-4'>
        <h1 className='text-xl text-white mb-2'>Buttons</h1>
        <div className='flex mt-2'>
          <Button mr='2'>Primary</Button>
          <Button mr='2' buttonType='secondary'>
            Secondary
          </Button>
          <Button mr='2' buttonType='destructive'>
            Destructive
          </Button>
        </div>

        <div className='flex mt-2'>
          <Button mr='2' icon={GameIconTypes.Energy} iconNumber={5}>
            Primary
          </Button>
          <Button
            mr='2'
            icon={GameIconTypes.Energy}
            iconNumber={5}
            buttonType='secondary'>
            Secondary
          </Button>
          <Button
            mr='2'
            icon={GameIconTypes.Energy}
            iconNumber={5}
            buttonType='destructive'>
            Destructive
          </Button>
        </div>

        <div className='flex mt-2'>
          <PickRatButton ratType={GameIconTypes.PetRat} label='Pet Rat' mr={2} />
          <PickRatButton ratType={GameIconTypes.LabRat} label='Lab Rat' mr={2} />
          <PickRatButton ratType={GameIconTypes.StreetRat} label='Street Rat' mr={2} />
          <PickRatButton ratType={GameIconTypes.PackRat} label='Pack Rat' mr={2} />
          <PickRatButton label='Any old rat...' mr={2} />
        </div>

        <h1 className='text-xl text-white mt-4 mb-2'>Thumb Cards</h1>
        <div className='flex mt-2'>
          <ThumbCard 
            title='Generic TC'
            image={fpoCat}
            flag='24hrs'>
            <Stat icon={GameIconTypes.Strength} label='Strength' showLabel={true} value={5} />
            <Stat icon={GameIconTypes.Attack} label='Attack' showLabel={true} value={7} />
            <Stat icon={GameIconTypes.Reward} label='Reward' showLabel={true} value={10} />
          </ThumbCard>
        </div>
      </div>
    </div>
  );
};
