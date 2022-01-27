import React from 'react';
import { Button } from '~/components/game/Button';
import { EncounterType, GameIcon, Rattribute } from '~/types/game';
import { PickRatButton } from '../game/PickRatButton';
import { BattleCard } from '../game/BattleCard';
import battleCardPlaceholder from '~/assets/images/den.png';

export const Styleguide = () => {
  return (
    <div className='py-20 px-4'>
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
          <Button mr='2' icon={GameIcon.Energy} iconNumber={5}>
            Primary
          </Button>
          <Button
            mr='2'
            icon={GameIcon.Energy}
            iconNumber={5}
            buttonType='secondary'>
            Secondary
          </Button>
          <Button
            mr='2'
            icon={GameIcon.Energy}
            iconNumber={5}
            buttonType='destructive'>
            Destructive
          </Button>
        </div>

        <div className='flex mt-2'>
          <PickRatButton ratType={GameIcon.PetRat} label='Pet Rat' mr={2} />
          <PickRatButton ratType={GameIcon.LabRat} label='Lab Rat' mr={2} />
          <PickRatButton
            ratType={GameIcon.StreetRat}
            label='Street Rat'
            mr={2}
          />
          <PickRatButton ratType={GameIcon.PackRat} label='Pack Rat' mr={2} />
        </div>
      </div>
      <div className='my-4'>
          <BattleCard
              className='max-w-4xl text-white'
              imgPath={battleCardPlaceholder}
              altText='The Battle thubmnail illustration.'
              title='Cat'
              description='A description of the encounters you are about to undertake. This should be fun and add to the lore of the rataverse. Are you trying to acquire trash? Get a snack? Help a spider save a life through artistic weaving?'
              encounterType={EncounterType.Solo}
              weakness={Rattribute.Cunning}
              resistance={Rattribute.Cuteness}
              energy={5}
          />
      </div>
    </div>
  );
};
