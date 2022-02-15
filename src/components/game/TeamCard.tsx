import React, { FC } from 'react';
import { BoxProps, Box } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { RatType } from '~/types/game';
import { PickRatButton } from './PickRatButton';

interface Props extends BoxProps {
  ratType?: RatType;
  rat?: string | StaticImageData;
  altText?: string;
}

export const TeamCard: FC<Props> = ({ ratType, rat, altText, ...rest }) => {
  const getDefinedProps = (ratType: Props['ratType']): BoxProps => {
    let tempDefinedProps: BoxProps = {};

    if (typeof ratType === 'string') {
      tempDefinedProps.borderColor = `${ratType}Rat.500`;
      console.log(tempDefinedProps.borderColor);
    }
    return tempDefinedProps;
  };

  const definedProps: BoxProps = getDefinedProps(ratType);

  return (
    <Box
      as='button'
      rounded='lg'
      border='12px solid'
      w='200px'
      h='200px'
      bg='darkAlpha.300'
      boxShadow='-6px 6px 3px #00000050'
      transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
      _hover={{
        bg: 'darkAlpha.400',
      }}
      {...definedProps}
      {...rest}>
      {rat ? (
        <Image
          layout='fill'
          src={rat}
          alt={altText ? altText : 'Selected Rat'}
          className='w-full h-full'
        />
      ) : (
        <PickRatButton ratType={ratType} as='div' notActive />
      )}
    </Box>
  );
};
