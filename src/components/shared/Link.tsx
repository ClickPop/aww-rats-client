import React, { FC } from 'react';
import NextLink, { LinkProps } from 'next/link';

interface Props extends LinkProps {
  className?: string;
}

export const Link: FC<Props> = ({ children, className, ...props }) => {
  return (
    <NextLink {...props}>
      <a className={className}>{children}</a>
    </NextLink>
  );
};
