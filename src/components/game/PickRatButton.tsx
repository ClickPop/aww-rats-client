import React, { FC } from 'react';
import { IconButton, IconButtonProps, HTMLChakraProps } from '@chakra-ui/react';
import { GameIcon } from '~/types/game';
import {
  PetRatIcon,
  StreetRatIcon,
  LabRatIcon,
  PackRatIcon,
  PlusIcon,
} from '~/components/game/Icons';

interface Props extends HTMLChakraProps<'button'> {
  ratType?: GameIcon;
  label: string;
}

export const PickRatButton: FC<Props> = ({ ratType, label, ...rest }) => {
  const getIcon = (ratType: GameIcon | undefined) => {
    switch (ratType) {
      case GameIcon.StreetRat:
        return <StreetRatIcon />;
      case GameIcon.LabRat:
        return <LabRatIcon />;
      case GameIcon.PackRat:
        return <PackRatIcon />;
      case GameIcon.PetRat:
        return <PetRatIcon />;
      case GameIcon.Plus:
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
