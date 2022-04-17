import React, { FC } from 'react';
import {
    Box,
    BoxProps,
    Heading,
} from '@chakra-ui/react';

interface Props extends BoxProps {
    bgcolor?: string;
    textcolor?: string;
    title?: string;
}

export const PromoUnit: FC<Props> = ({
    children,
    bgcolor,
    textcolor,
    title,
    ...rest
    }) => {
    return (
        <Box
            backgroundColor={bgcolor ? bgcolor : 'backtalk.yellow'}
            borderRadius={12}
            color={textcolor ? textcolor : 'black'}
            fontSize='xl'
            p={12}
            {...rest}
        >
            <Heading
                mb={4}
                size='xl'
            >
                {title ? title : 'Please enter a title'}
            </Heading>
            {children}
        </Box>
    );
};