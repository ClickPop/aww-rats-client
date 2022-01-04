import React, { FC } from 'react';
import { Button as ChakraButton} from '@chakra-ui/react'

export const Button: FC = ({ children, className }) => {
  return (
    <ChakraButton
        className={`${className ?? ''}`}
        colorScheme='teal'
        variant='outline'
    >
        {children}
    </ChakraButton>
  );
};