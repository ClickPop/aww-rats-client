import React, { FC } from 'react';
import { Button as ChakraButton, ButtonProps } from '@chakra-ui/react';

interface Props extends ButtonProps {
  ratType?: string;
}

export const Button: FC<Props> = ({ children, ...rest }) => {
  return (
    <ChakraButton colorScheme='purple' {...rest}>
      {children}
    </ChakraButton>
  );
};
