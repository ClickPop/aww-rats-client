import { Box, Button, useBoolean } from '@chakra-ui/react';
import React, { FC, useContext, useEffect } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { SIGNER_MESSAGE } from '~/config/env';
import { useConnect } from '~/hooks/useConnect';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  useBacktalkLoginMutation,
  BacktalkLoginMutation,
} from '~/schema/generated';

const BacktalkLogin: FC = ({ children }) => {
  const [login, { loading, error }] = useBacktalkLoginMutation({
    client: apolloBacktalkClient,
  });
  const { connected, isLoggedInBacktalk, signer, signerAddr } =
    useContext(EthersContext);
  const { handleLogin, connectToMetamask } = useConnect<BacktalkLoginMutation>(
    login,
    (res, sa) => sa === res.data?.login?.wallet,
    SIGNER_MESSAGE,
    true,
  );
  const [shouldLogin, { on, off }] = useBoolean();

  useEffect(() => {
    if (shouldLogin && signerAddr && signer) {
      handleLogin();
      off();
    }
  }, [handleLogin, off, shouldLogin, signer, signerAddr]);

  useEffect(() => {
    return () => {
      off();
    };
  }, [off]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>An error occurred, please check the console</div>;
  }

  return !isLoggedInBacktalk || !connected ? (
    <Box
      as='span'
      onClick={async () => {
        if (!connected && typeof window !== 'undefined' && window.ethereum) {
          on();
          await connectToMetamask();
        } else if (!isLoggedInBacktalk) {
          await handleLogin();
        }
      }}>
      {children}
    </Box>
  ) : null;
};

export default BacktalkLogin;
