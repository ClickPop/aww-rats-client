import { Button, useBoolean } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { useConnect } from '~/hooks/useConnect';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  useBacktalkLoginMutation,
  BacktalkLoginMutation,
} from '~/schema/generated';

const BacktalkLogin = () => {
  const [login, { loading, error }] = useBacktalkLoginMutation({
    client: apolloBacktalkClient,
  });
  const { connected, isLoggedInBacktalk, signer, signerAddr } =
    useContext(EthersContext);
  const { handleLogin, connectToMetamask } = useConnect<BacktalkLoginMutation>(
    login,
    (res, sa) => sa === res.data?.login?.wallet,
  );
  const [shouldLogin, { on, off }] = useBoolean();

  useEffect(() => {
    if (shouldLogin && signerAddr && signer) {
      handleLogin();
      off();
    }
  }, [handleLogin, off, shouldLogin, signer, signerAddr]);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>An error occurred, please check the console</div>;
  }

  return !isLoggedInBacktalk || !connected ? (
    <div>
      <Button
        onClick={async () => {
          if (!connected && typeof window !== 'undefined' && window.ethereum) {
            on();
            await connectToMetamask();
          } else if (!isLoggedInBacktalk) {
            await handleLogin();
          }
        }}
        background='linear-gradient(-45deg, var(--chakra-colors-pink-500), var(--chakra-colors-red-500), var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))'
        backgroundSize='600% 400%'
        color='white'
        _hover={{
          animation: 'encounterShimmer 4s ease infinite;',
        }}>
        Login
      </Button>
    </div>
  ) : null;
};

export default BacktalkLogin;
