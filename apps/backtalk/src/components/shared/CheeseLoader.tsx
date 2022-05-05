import React, { FC } from 'react';
import { Image } from '~/components/shared/Image';
import loader from '~/assets/images/loader-cheese.gif';

type Props = {
  className?: string;
};

export const CheeseLoader: FC<Props> = ({ className }) => {
  return (
    <Image
      src={loader}
      className={`inline-block ${className}`}
      alt='Rat Cheese Loader'
    />
  );
};
