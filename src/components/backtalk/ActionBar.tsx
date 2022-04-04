import React from 'react';
import { Box } from '@chakra-ui/react';

export const ActionBar: FC = ({ children }) => {
    return (
        <Box
            bottom='0'
            backgroundColor='white'
            boxShadow='xs'
            left='0'
            pos='fixed'
            py={4}
            w='100%'
        >
            <Box maxW='4xl' mx='auto' align='right'>
                {children}
            </Box>
        </Box>
    );
};