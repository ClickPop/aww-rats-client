import { Box, Center } from '@chakra-ui/react';
import { NextPage } from 'next';
import { Navbar } from '~/components/backtalk/navbar/Navbar';

const BacktalkPage: NextPage = () => {
  return (
    <Box>
      <Navbar />
      <Center h='100vh'>
        <Box>Backtalk</Box>
      </Center>
    </Box>
  );
};

export default BacktalkPage;
