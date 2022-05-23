import { Box, Heading, VStack } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { NextPage } from 'next';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import fivehundred from '~/assets/svg/500.svg';

const ServerErrorPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <VStack>
        <Box py={12}>
          <Image src={fivehundred} alt='404' />
        </Box>
        <Heading size='lg'>Uh oh, something went wrong.</Heading>
      </VStack>
    </LayoutDashboard>
  );
};

export default ServerErrorPage;
