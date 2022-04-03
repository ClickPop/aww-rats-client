import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';

export const LayoutSurvey: FC = ({ children }) => {
  return (
    <Box bgGradient='linear(to-b, purple.900, purple.950)' minH='100vh'>
      <Box
        maxW='md'   
        mx='auto'
        px={{base: 2, md: 0}}
        py={4}
      >
        {children}
      </Box>
    </Box>
  );
};
