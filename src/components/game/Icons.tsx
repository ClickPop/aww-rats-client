import type { FC } from 'react';
import { Icon, IconProps } from '@chakra-ui/icons';

export const EnergyIcon: FC<IconProps> = ({ children, ...rest }) => (
  <Icon color='yellow.300' viewBox='0 0 41.95 57.59' {...rest}>
    <polygon
      fill='currentColor'
      points='41.95 24.79 22.7 24.79 28.73 0 0 32.35 17.38 32.56 10.98 57.59 41.95 24.79'
    />
  </Icon>
);
