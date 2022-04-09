import { Button, useBoolean } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { Emoji } from '~/components/shared/Emoji';
import { useConnect } from '~/hooks/useConnect';
import { apolloBacktalkClient } from '~/lib/graphql';
import {
  useBacktalkLoginMutation,
  BacktalkLoginMutation,
} from '~/schema/generated';

export const Connect = () => {
  const [login, { loading, error }] = useBacktalkLoginMutation({
    client: apolloBacktalkClient,
  });
  const { connected, isLoggedIn, signer, signerAddr } =
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

  if (error) {
    return <div>An error occurred, please check the console</div>;
  }

  return !isLoggedIn || !connected ? (
    <div>
      <Button
        colorScheme='gray'
        mt={4}
        size='md'
        variant='outline'
        width='100%'
        _hover= {{
          backgroundColor: 'gray.200',
          color: 'black'
        }}
        onClick={async () => {
          if (!connected && typeof window !== 'undefined' && window.ethereum) {
            on();
            await connectToMetamask();
          } else if (!isLoggedIn) {
            await handleLogin();
          }
        }}
        isLoading={loading}>
        <Emoji mr='0.5ch' aria-label='Electrical Plug'>
          🔌{' '}
        </Emoji>{' '}
        Connect
      </Button>
    </div>
  ) : null;
};
