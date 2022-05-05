import React, { FC } from 'react';
import { Header } from '~/components/layout/Header';

export const LayoutNoFooter: FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={`${className ?? ''} w-full`}>
      <Header />
      {children}
    </div>
  );
};
