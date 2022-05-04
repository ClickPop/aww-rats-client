import React, { FC } from 'react';
import NextLink, { LinkProps } from 'next/link';

export interface Props extends LinkProps {
  className?: string;
  openInNewTab?: boolean;
}

export const Link: FC<Props> = ({
  children,
  className,
  openInNewTab,
  ...props
}) => {
  return (
    <NextLink {...props} passHref>
      <a
        className={className}
        rel={openInNewTab ? 'noreferrer noopener' : ''}
        target={openInNewTab ? '_blank' : ''}>
        {children}
      </a>
    </NextLink>
  );
};
