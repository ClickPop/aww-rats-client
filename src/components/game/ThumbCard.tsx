import React, { FC } from 'react';
import {
  AspectRatio,
  Box,
  Flex,
  FlexProps,
  Heading,
  Text,
} from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';

export interface ThumbCardProps extends FlexProps {
  image: string | StaticImageData;
  title?: string;
  flag?: string;
  state?: 'disabled' | 'active' | 'selected';
}
export const ThumbCard: FC<ThumbCardProps> = ({
  children,
  image,
  title,
  flag,
  state,
  ...rest
}) => {
  const getDefinedProps = (state: ThumbCardProps['state']): FlexProps => {
    let tempDefinedProps: FlexProps = {
      bg: 'darkAlpha.500',
    };

    let subduedPseudo = {
      content: '""',
      bg: 'white',
      opacity: 0.4,
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 3,
    };

    let selectedPseudo = {
      content: '"✔️"',
      fontSize: '2.5rem',
      lineHeight: '120px',
      width: '120px',
      height: '120px',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 4,
    };

    switch (state) {
      case 'selected':
        tempDefinedProps._before = subduedPseudo;
        tempDefinedProps._after = selectedPseudo;
        break;
      case 'disabled':
        tempDefinedProps._before = subduedPseudo;
        tempDefinedProps.as = 'div';
        break;
      case 'active':
      default:
        tempDefinedProps.transition = 'all 0.2s cubic-bezier(.08,.52,.52,1)';
        tempDefinedProps._hover = {
          bg: 'darkAlpha.600',
        };
        break;
    }

    return tempDefinedProps;
  };

  return (
    <Flex
      as='button'
      rounded='md'
      overflow='hidden'
      w='300px'
      pos='relative'
      {...getDefinedProps(state)}
      {...rest}
      ml={2}>
      <AspectRatio ratio={1 / 1} w='120px'>
        <Image src={image} objectFit='cover' alt={title ? title : 'Image'} />
      </AspectRatio>

      <Box m={3} color='white' flex={1} align='left' my='auto'>
        {title && (
          <Heading as='h3' size='sm' mt={0} mb={2}>
            {title}
          </Heading>
        )}
        {children}
      </Box>

      {flag && (
        <Text
          as='span'
          bg='gray.300'
          py={1}
          px={2}
          roundedRight='lg'
          color='black'
          boxShadow='md'
          pos='absolute'
          zIndex={2}
          left={0}
          bottom={2}>
          {flag}
        </Text>
      )}
    </Flex>
  );
};
