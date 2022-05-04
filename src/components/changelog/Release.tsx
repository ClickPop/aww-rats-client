import React, { FC } from 'react';
import {
  Box,
  Text,
} from '@chakra-ui/react';

type Props = {
  releaseDate: string;
};

export const Release: FC<Props> = ({
  releaseDate,
  children,
}) => {
  return (
    <Box
      borderBottom='1px'
      borderColor='white'
      borderRadius={2}
      fontSize='md'
      mb={8}
      pb={2}
    >
      <Text
        fontWeight='600'
        mb={2}
        textDecoration='underline'
      >
        {releaseDate}
      </Text>
      <Text>
        {children}
      </Text>
    </Box>
  );
};
