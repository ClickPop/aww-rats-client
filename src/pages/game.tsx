import type { NextPage } from 'next';
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';
import { Button } from '~/components/game/Button';
import { GameIcon } from '~/types/game';

const Home: NextPage = () => {
  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800'>
      <div className='pt-60'>
        <Button icon={GameIcon.Energy} iconNumber={5}>
          Energy
        </Button>
      </div>
    </LayoutNoFooter>
  );
};

export default Home;
