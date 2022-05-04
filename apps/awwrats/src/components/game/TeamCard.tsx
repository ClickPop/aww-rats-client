import React, { FC } from 'react';
import { BoxProps, Box } from '@chakra-ui/react';
import { Image } from '~/components/shared/Image';
import { PickRatButton } from './PickRatButton';
import { Rat_Types_Enum } from '~/schema/generated';
import { StaticImageData } from 'next/image';

interface Props extends BoxProps {
  ratType?: Rat_Types_Enum;
  rat?: string | StaticImageData;
  altText?: string;
}

export const TeamCard: FC<Props> = ({ ratType, rat, altText, ...rest }) => {
  const getDefinedProps = (ratType: Props['ratType']): BoxProps => {
    let tempDefinedProps: BoxProps = {};
    if (typeof ratType === 'string') {
      tempDefinedProps.borderColor = `${ratType}Rat.500`;
    }
    return tempDefinedProps;
  };

  const definedProps: BoxProps = getDefinedProps(ratType);

  return (
    <Box
      as='button'
      bg='blueGray.600'
      boxShadow='inner'
      h='150px'
      overflow='hidden'
      rounded='lg'
      transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
      w='150px'
      _hover={{
        bg: 'blueGray.700',
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
