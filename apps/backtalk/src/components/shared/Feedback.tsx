import dynamic from 'next/dynamic';
import React from 'react';
import { FEEDER_ID } from '~/config/env';
const Feeder = dynamic(() => import('feeder-react-feedback'), { ssr: false });

export const Feedback = () => {
  //@ts-ignore
  return <Feeder email emailRequired projectId={FEEDER_ID} />;
};
