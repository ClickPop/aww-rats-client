import React, { FC } from 'react';
import { Box, BoxProps, Text } from '@chakra-ui/react';

interface Props extends BoxProps {
  rattribute: string;
  value: number;
}

export const RattributePill: FC<Props> = ({ rattribute, value, ...rest }) => {
  return (
    <Box {...rest} color='blueGray.700'>
      <Text
        background='white'
        borderLeftRadius='md'
        display='inline-block'
        fontSize='xs'
        fontWeight='regular'
        px={2}
        py={1}>
        {rattribute}
      </Text>
      <Text
        background='white'
        borderLeft='1px solid black'
        borderRightRadius='md'
        display='inline-block'
        fontSize='xs'
        fontWeight='semibold'
        px={2}
        py={1}>
        {value}
      </Text>
    </Box>
  );
};
