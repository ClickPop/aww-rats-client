import { Box, BoxProps } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props extends BoxProps {
  'aria-label': string;
}

export const Emoji: FC<Props> = ({ children, ...rest }) => {
  return (
    <Box {...rest} as={'span'} role='img'>
      {children}
    </Box>
  );
};
