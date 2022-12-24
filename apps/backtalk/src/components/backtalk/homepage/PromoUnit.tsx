import React, { FC } from 'react';
import { Box, BoxProps, Heading, Grid, GridItem } from '@chakra-ui/react';
import NextImage from 'next/image';

interface Props extends BoxProps {
  bgcolor?: string;
  textcolor?: string;
  title?: string;
  imgAlt?: string;
  imgSrc?: string;
}

export const PromoUnit: FC<Props> = ({
  children,
  bgcolor,
  textcolor,
  title,
  imgAlt,
  imgSrc,
  ...rest
}) => {
  return (
    <Box
      backgroundColor={bgcolor ? bgcolor : 'backtalk.yellow'}
      borderRadius={2}
      color={textcolor ? textcolor : 'black'}
      fontSize='xl'
      {...rest}>
      <Grid
        alignItems='center'
        templateColumns={{
          base: '1fr',
          lg: imgSrc ? 'repeat(5, 1fr)' : 'repeat(1, 1fr)',
        }}
        gap={8}>
        <GridItem p={12} colSpan={3}>
          <Heading mb={4} size='lg'>
            {title ? title : 'Please enter a title'}
          </Heading>
          {children}
        </GridItem>
        {imgSrc && (
          <GridItem colSpan={2} pt={{ base: 0, lg: 6 }}>
            <Box maxW='400px' mx='auto' fontSize='0'>
              <NextImage
                alt={imgAlt}
                height={640}
                layout='responsive'
                src={imgSrc}
                width={876}
              />
            </Box>
          </GridItem>
        )}
      </Grid>
    </Box>
  );
};
