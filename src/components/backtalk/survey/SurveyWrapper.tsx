import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

export const SurveyWrapper: FC = ({ children }) => {
  return (
    <Box
      background='purple.800'
      boxShadow='dark-lg'
      borderRadius='xl'
      color='white'
      my={8}
      p={5}>
      {children}
    </Box>
  );
};
