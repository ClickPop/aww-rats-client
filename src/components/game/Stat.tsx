import React, { FC } from 'react';
import { Text, Flex, FlexProps } from '@chakra-ui/react';
import { GameIconTypes } from '~/types/game';
import { GameIcon } from '~/components/game/Icons';

interface Props extends FlexProps {
  icon?: GameIconTypes;
  label?: string;
  value?: string | number;
  showLabel?: boolean;
}

export const Stat: FC<Props> = ({
  children,
  icon,
  label,
  value,
  showLabel,
  ...rest
}) => (
  <Flex {...rest} lineHeight='1.2em' mb={1}>
    {icon && <GameIcon icon={icon} mr={1} boxSize='1em' my='auto' />}
    {(showLabel || !icon) && <Text as='span' fontWeight='regular'>{label}</Text>}
    {value && <Text as="span" align='right' ml={1} flex={1}>{value}</Text>}
  </Flex>
)


