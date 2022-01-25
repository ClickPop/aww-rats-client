import React, { FC } from 'react';
import NextLink, { LinkProps as ImportedLinkProps } from 'next/link';

export interface LinkProps extends ImportedLinkProps {
  className?: string;
  openInNewTab?: boolean;
}

export const Link: FC<LinkProps> = ({
  children,
  className,
  openInNewTab,
  ...props
}) => {
  return (
    <NextLink {...props}>
      <a
        className={className}
        rel={openInNewTab ? 'noreferrer noopener' : ''}
        target={openInNewTab ? '_blank' : ''}>
        {children}
      </a>
    </NextLink>
  );
};
