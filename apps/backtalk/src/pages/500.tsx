import { Center } from '@chakra-ui/react';
import { NextPage } from 'next';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';

const ServerErrorPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <Center>Uh oh... something broke.</Center>
    </LayoutDashboard>
  );
};

export default ServerErrorPage;
