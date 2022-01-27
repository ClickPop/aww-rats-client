import React, { FC } from 'react';
import { IconButton, IconButtonProps, HTMLChakraProps } from '@chakra-ui/react';
import { GameIconTypes } from '~/types/game';
import { GameIcon } from '~/components/game/Icons';

interface Props extends HTMLChakraProps<'button'> {
  ratType?: GameIconTypes.StreetRat | GameIconTypes.PetRat | GameIconTypes.LabRat | GameIconTypes.PackRat | GameIconTypes.Plus;
  label: string;
}

export const PickRatButton: FC<Props> = ({ ratType, label, ...rest }) => {
  const getDefinedProps = (
    ratType: Props['ratType'],
    label: Props['label'],
  ): IconButtonProps => {
    let tempDefinedProps: IconButtonProps = {
      'aria-label': label,
      icon: ratType ? <GameIcon icon={ratType} /> : <GameIcon icon={GameIconTypes.Plus} />,
      borderRadius: 'full',
      colorScheme: 'pickRat',
      fontSize: 'xl',
      lineHeight: '1',
    };

    return tempDefinedProps;
  };

  const definedProps: IconButtonProps = getDefinedProps(ratType, label);

  return <IconButton {...definedProps} {...rest} />;
};
