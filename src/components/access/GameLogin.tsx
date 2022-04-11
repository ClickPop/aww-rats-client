import { Button, useBoolean } from '@chakra-ui/react';
import React, { useContext, useEffect } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { useConnect } from '~/hooks/useConnect';
import { LoginMutation, useLoginMutation } from '~/schema/generated';

const GameLogin = () => {
  const [login, { loading, error }] = useLoginMutation();
  const { connected, isLoggedIn, signer, signerAddr } =
    useContext(EthersContext);
  const { handleLogin, connectToMetamask } = useConnect<LoginMutation>(
    login,
    (res, sa) => sa === res.data?.login?.id,
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

  return !isLoggedIn || !connected ? (
    <div>
      <Button
        onClick={async () => {
          if (!connected && typeof window !== 'undefined' && window.ethereum) {
            on();
            await connectToMetamask();
          } else if (!isLoggedIn) {
            await handleLogin();
          }
        }}
        background='linear-gradient(-45deg, var(--chakra-colors-pink-500), var(--chakra-colors-red-500), var(--chakra-colors-blue-500), var(--chakra-colors-purple-500))'
        backgroundSize='600% 400%'
        _hover={{
          animation: 'encounterShimmer 4s ease infinite;',
        }}>
        Login
      </Button>
    </div>
  ) : null;
};

export default GameLogin;
