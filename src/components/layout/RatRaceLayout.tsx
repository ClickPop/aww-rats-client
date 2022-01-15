import React, { FC } from 'react';

export const Layout: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div className={`${className ?? ''} w-full`}>
      {children}
    </div>
  );
};
