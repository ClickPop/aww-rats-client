import React, { FC } from 'react';
import { AspectRatio, Box, Flex, FlexProps, Heading, Text } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';

import { Stat } from '~/components/game/Stat';
import { GameIconTypes } from '~/types/game';

interface Props extends FlexProps {
  image: string | StaticImageData
  title?: string;
  flag?: string;
}
export const ThumbCard: FC<Props> = ({children, image, title, flag, ...rest}) => {

  return (
    <Flex as='button' border='3px solid' borderColor='whiteAlpha.500' bg='whiteAlpha.200' rounded='md' overflow='hidden' w='300px' pos='relative' {...rest}>
      <AspectRatio ratio={1 / 1} w='120px'>
        <Image 
          src={image}
          objectFit='cover' 
          alt={title ? title : 'Image' }  />
      </AspectRatio>

      <Box m={3} color="white" flex={1} align='left' my='auto'>
        {title && <Heading as="h3" size="sm" mt={0} mb={2}>{title}</Heading>}
        {children}
      </Box>

      {flag && (
        <Text as='span' bg='gray.300' py={1} px={2} roundedRight='lg' color='black' boxShadow='md' pos='absolute' zIndex={2} left={0} bottom={2} >
          {flag}
        </Text>
      )}
    </Flex>
  );
};
