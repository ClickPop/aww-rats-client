import React from 'react';
import { Button } from '~/components/game/Button';
import { EncounterType, GameIconTypes, Rattribute } from '~/types/game';
import { PickRatButton } from '~/components/game/PickRatButton';
import { ThumbCard } from '~/components/game/ThumbCard';
import { Stat } from '~/components/game/Stat';
import { BattleCard } from '~/components/game/BattleCard';

import fpoCat from '~/assets/images/ratrace/fpo/fpo.cat.png';

export const Styleguide = () => {
  return (
    <div className='py-20 px-4'>
      <div className='mb-4'>
        
        <h1 className='text-xl text-white mb-2'>Buttons</h1>
        
        <div className='flex mt-2'>
          <Button marginRight={2}>Primary</Button>
          <Button mr={2} buttonType='secondary'>
            Secondary
          </Button>
          <Button mr={2} buttonType='destructive'>
            Destructive
          </Button>
        </div>

        <div className='flex mt-2'>
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

        <h1 className='text-xl text-white mt-4 mb-2'>Battle Cards</h1>

        <div className='flex mt-2'>
          <BattleCard
            className='max-w-4xl text-white'
            imgPath={fpoCat}
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
    </div>
  );
};
