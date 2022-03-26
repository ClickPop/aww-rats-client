import React, { FC } from 'react';
import { Text, Flex, FlexProps, Box, AspectRatio } from '@chakra-ui/react';
import { RatType } from '~/types/game';
import { GameIcon } from '~/components/game/Icons';
import { Rat_Types_Enum } from '~/schema/generated';

interface Props extends FlexProps {
  showIcon?: boolean;
  ratType: Rat_Types_Enum;
}

export const RatTypeStat: FC<Props> = ({ showIcon, ratType, ...rest }) => {
  return (
    <Flex {...rest} lineHeight='1.2em' mb={1}>
      <Text as='span' align='left' fontWeight='bold'>
        Type
      </Text>
      <Text as='span' align='right' textTransform='capitalize' ml='auto'>
        {(showIcon || showIcon === undefined) && (
          <GameIcon icon={ratType} mr={1} />
        )}
        {ratType}
      </Text>
    </Flex>
  );
};
