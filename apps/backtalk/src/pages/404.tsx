import { Box, Heading, VStack } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { NextPage } from 'next';
import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import fourohfour from '~/assets/svg/404.svg';

const NotFoundPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <VStack>
        <Box py={12}>
          <Image src={fourohfour} alt='404' />
        </Box>
        <Heading size='lg'>Uh oh, looks like this doesn&apos;t exist.</Heading>
      </VStack>
    </LayoutDashboard>
  );
};

export default NotFoundPage;
