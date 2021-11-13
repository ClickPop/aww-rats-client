import React, { FC } from 'react';
import NextLink, { LinkProps as ImportedLinkProps } from 'next/link';

export interface LinkProps extends ImportedLinkProps {
  className?: string;
}

export const Link: FC<LinkProps> = ({ children, className, ...props }) => {
  return (
    <NextLink {...props}>
      <a className={className}>{children}</a>
    </NextLink>
  );
};
