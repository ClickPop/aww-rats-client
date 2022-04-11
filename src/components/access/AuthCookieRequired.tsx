import { Center, Text } from '@chakra-ui/react';
import React, { FC, ReactElement, useContext } from 'react';
import { EthersContext } from '~/components/context/EthersContext';

type Props = {
  fallback: ReactElement;
  isBacktalk?: boolean;
};

const AuthCookieRequired: FC<Props> = ({ children, fallback, isBacktalk }) => {
  const { isLoggedIn, backtalkAuthLoading, isLoggedInBacktalk, authLoading } =
    useContext(EthersContext);

  if (authLoading || backtalkAuthLoading) {
    return (
      <Center py={20}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  const showFallback = !isBacktalk ? !isLoggedIn : !isLoggedInBacktalk;

  if (showFallback) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
