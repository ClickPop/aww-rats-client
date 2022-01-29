import React, { FC } from 'react';
import { IconButton, IconButtonProps, HTMLChakraProps } from '@chakra-ui/react';
import { GameIconTypes, RatType } from '~/types/game';
import { GameIcon } from '~/components/game/Icons';

interface Props extends HTMLChakraProps<'button'> {
  ratType?: RatType;
  label?: string;
  notActive?: boolean;
}

export const PickRatButton: FC<Props> = ({
  ratType,
  label,
  notActive,
  ...rest
}) => {
  const getDefinedProps = (
    ratType: Props['ratType'],
    label: Props['label'],
  ): IconButtonProps => {
    let tempDefinedProps: IconButtonProps = {
      'aria-label': label ? label : ratType ? ratType : 'Pick a Rat',
      icon: ratType ? (
        <GameIcon icon={ratType} />
      ) : (
        <GameIcon icon={GameIconTypes.Plus} />
      ),
      borderRadius: 'full',
      colorScheme: notActive ? 'pickRatStatic' : 'pickRat',
      fontSize: 'xl',
      lineHeight: '1',
    };

    return tempDefinedProps;
  };

  const definedProps: IconButtonProps = getDefinedProps(ratType, label);

  return <IconButton as='div' {...definedProps} {...rest} />;
};
