import NextImage, { ImageProps } from 'next/image';
import React, { FC } from 'react';

export const Image: FC<ImageProps> = ({ className, ...rest }) => {
  return (
    <div className={`${className ?? ''}`}>
      <div className='w-full h-full relative'>
        <NextImage {...rest} />
      </div>
    </div>
  );
};
