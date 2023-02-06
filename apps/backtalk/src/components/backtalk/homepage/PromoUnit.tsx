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
      backgroundColor={bgcolor ? bgcolor : 'white'}
      color={textcolor ? textcolor : 'black'}
      border='2px #3E464E solid'
      fontSize='xl'
      {...rest}>
      <Grid
        alignItems='center'
        templateColumns={{
          base: '1fr',
          lg: imgSrc ? 'repeat(16, 1fr)' : 'repeat(1, 1fr)',
        }}>
        <GridItem pl={4} colSpan={9}>
          <Heading
            mb={2}
            fontSize='1.5rem'
            fontFamily='Work Sans'
            fontWeight={400}>
            {title ? title : 'Please enter a title'}
          </Heading>
          {children}
        </GridItem>
        {imgSrc && (
          <GridItem colSpan={7}>
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
