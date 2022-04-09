import React, { FC } from 'react';
import { Box, Text } from '@chakra-ui/react';

export const LayoutSurvey: FC = ({ children }) => {
  return (
    <Box bgGradient='linear(to-b, purple.900, purple.950)' minH='100vh'>
      <Box maxW='md' mx='auto' px={{ base: 2, md: 0 }} py={4}>
        {children}
        <Text
          align='center'
          color='whiteAlpha.800'
          fontSize={14}
          my={12}
        >
            <strong>Important:</strong> Never input passwords or secret keys. If someone is asking for it they're probably doing something shady.
          </Text>
      </Box>
    </Box>
  );
};
