import React, { FC } from 'react';
import { Button as ChakraButton, Divider, ButtonProps } from '@chakra-ui/react';
import { GameIcon } from '~/types/game';
import { EnergyIcon } from '~/components/game/Icons';

interface Props extends ButtonProps {
  icon?: GameIcon;
  iconNumber?: number;
  buttonType?: 'primary' | 'secondary' | 'destructive';
}

export const Button: FC<Props> = ({
  children,
  icon,
  iconNumber,
  buttonType,
  ...rest
}) => {
  const getIcon = (icon: GameIcon | undefined) => {
    switch (icon) {
      case GameIcon.Energy:
        return <EnergyIcon />;
    }
    return;
  };

  const getDefinedProps = (
    buttonType: Props['buttonType'],
    icon: Props['icon'],
  ): ButtonProps => {
    let tempDefinedProps: ButtonProps = {};

    switch (buttonType) {
      case 'secondary':
        tempDefinedProps.colorScheme = 'whiteAlpha';
        tempDefinedProps.variant = 'outline';
        break;
      case 'destructive':
        tempDefinedProps.colorScheme = 'red';
        break;
      case 'primary':
      default:
        tempDefinedProps.colorScheme = 'purple';
    }

    if (icon && !iconNumber) {
      tempDefinedProps.rightIcon = getIcon(icon);
    }

    return tempDefinedProps;
  };

  const getIconChildren = (
    icon: Props['icon'],
    iconNumber: Props['iconNumber'],
  ): JSX.Element => {
    let tempIcon;
    if (icon && iconNumber) {
      tempIcon = getIcon(icon);
      if (tempIcon) {
        return (
          <>
            <Divider orientation='vertical' ml={2} h={6} />
            <span className='ml-2'>{tempIcon}</span>
            <span className='ml-0'>{iconNumber}</span>
          </>
        );
      }
    }
    return <></>;
  };

  const definedProps: ButtonProps = getDefinedProps(buttonType, icon);
  const iconChildren = getIconChildren(icon, iconNumber);

  return (
    <ChakraButton {...definedProps} {...rest}>
      {children}
      {iconChildren}
    </ChakraButton>
  );
};
