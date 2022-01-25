import React, { FC } from 'react';
import { Link } from '~/components/shared/Link';
import { Image } from '~/components/shared/Image';

type Props = {
  pathName: string;
  pathTitle: string;
  altText?: string;
  imgPath?: string | StaticImageData;
};

export const Room: FC<Props> = ({
  pathName,
  pathTitle,
  altText,
  imgPath,
  children,
}) => {
  return (
    <Link
      href={pathName}
      className='grid grid-cols-6 items-center border border-tan hover:bg-tan hover:bg-opacity-5 duration-300 rounded-md overflow-hidden mb-4 cursor-pointer'>
      {imgPath ? (
        <Image
          src={imgPath}
          alt={altText}
          className='block col-span-3 md:col-span-2 mb-0 leading-none'
          layout='responsive'
        />
      ) : (
        <div className='block col-span-3 md:col-span-2 mb-0 leading-none bg-gray-500 h-full'></div>
      )}
      <div className='p-4 col-span-3 md:col-span-4'>
        <div className='font-semibold text-lg'>{pathTitle}</div>
        {children}
      </div>
    </Link>
  );
};
