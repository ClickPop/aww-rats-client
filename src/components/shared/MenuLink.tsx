import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Link, LinkProps } from '~/components/shared/Link';
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

interface Props extends LinkProps {
  offset?: number;
  to?: string;
  target?: string;
}

export const MenuLink: FC<Props> = ({
  children,
  className,
  offset,
  href,
  to,
  target,
  ...props
}) => {
  const router = useRouter();
  let isAnchor = false;
  if (typeof to === 'string' && to.length > 0 && router.pathname === href) {
    isAnchor = true;
  }

  if (isAnchor) {
    return (
      <ScrollLink
        className={className}
        to={to as string}
        smooth={true}
        offset={offset}>
        {children}
      </ScrollLink>
    );
  } else if (target && typeof href === 'string') {
    return (
      <a
        className={className}
        href={href}
        target={target}
        rel='noopener noreferrer nofollow'>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={`${href}#${to}`}>
      {children}
    </Link>
  );
};
