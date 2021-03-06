import React, { FC } from 'react';
import {
  Button as ChakraButton,
  Divider,
  ButtonProps,
  Tooltip,
  TooltipProps,
  Box,
} from '@chakra-ui/react';
import { GameIconTypes } from '~/types/game';
import { GameIcon } from '~/components/game/Icons';

interface Props extends ButtonProps {
  icon?: GameIconTypes;
  iconNumber?: number;
  buttonType?: 'primary' | 'secondary' | 'destructive';
  tooltip?: Omit<TooltipProps, 'children'>;
}

export const Button: FC<Props> = ({
  children,
  icon,
  iconNumber,
  buttonType,
  tooltip,
  ...rest
}) => {
  const getDefinedProps = (
    buttonType: Props['buttonType'],
    icon: Props['icon'],
  ): ButtonProps => {
    let tempDefinedProps: ButtonProps = {};

    switch (buttonType) {
      case 'secondary':
        tempDefinedProps.colorScheme = 'darkAlpha';
        break;
      case 'destructive':
        tempDefinedProps.colorScheme = 'red';
        break;
      case 'primary':
      default:
        tempDefinedProps.colorScheme = 'purple';
    }

    if (icon && !iconNumber) {
      tempDefinedProps.rightIcon = <GameIcon icon={icon} />;
    }

    return tempDefinedProps;
  };

  const getIconChildren = (
    icon: Props['icon'],
    iconNumber: Props['iconNumber'],
  ): JSX.Element => {
    let tempIcon;
    if (icon && iconNumber) {
      tempIcon = <GameIcon icon={icon} />;
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
    <Tooltip {...(tooltip ?? {})}>
      <Box as='span'>
        <ChakraButton {...definedProps} {...rest}>
          {children}
          {iconChildren}
        </ChakraButton>
      </Box>
    </Tooltip>
  );
};
