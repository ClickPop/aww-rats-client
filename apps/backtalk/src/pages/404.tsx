import { Center } from '@chakra-ui/react';
import { NextPage } from 'next';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';

const NotFoundPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <Center>Uh oh, looks like this doesn&apos;t exist...</Center>
    </LayoutDashboard>
  );
};

export default NotFoundPage;
