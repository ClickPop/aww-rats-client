import React, { FC } from 'react';

export const RatRaceLayout: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div className={`${className ?? ''} w-full min-h-screen h-full`}>
      {children}
    </div>
  );
};