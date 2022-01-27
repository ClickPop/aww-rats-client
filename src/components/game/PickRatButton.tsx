import React, { FC } from 'react';
import { IconButton, IconButtonProps, HTMLChakraProps } from '@chakra-ui/react';
import { GameIconTypes } from '~/types/game';
import {
  PetRatIcon,
  StreetRatIcon,
  LabRatIcon,
  PackRatIcon,
  PlusIcon,
} from '~/components/game/Icons';

interface Props extends HTMLChakraProps<'button'> {
  ratType?: GameIconTypes;
  label: string;
}

export const PickRatButton: FC<Props> = ({ ratType, label, ...rest }) => {
  const getIcon = (ratType: GameIconTypes | undefined) => {
    switch (ratType) {
      case GameIconTypes.StreetRat:
        return <StreetRatIcon />;
      case GameIconTypes.LabRat:
        return <LabRatIcon />;
      case GameIconTypes.PackRat:
        return <PackRatIcon />;
      case GameIconTypes.PetRat:
        return <PetRatIcon />;
      case GameIconTypes.Plus:
      default:
        return <PlusIcon />;
    }
  };

  const getDefinedProps = (
    ratType: Props['ratType'],
    label: Props['label'],
  ): IconButtonProps => {
    let tempDefinedProps: IconButtonProps = {
      'aria-label': label,
      icon: getIcon(ratType),
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
