import { Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { SIGNER_MESSAGE } from '~/config/env';
import { useLoginMutation } from '~/schema/generated';

const Login = () => {
  const [login, { loading, error }] = useLoginMutation();
  const { signer, signerAddr, setLoggedIn } = useContext(EthersContext);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>An error occurred, please check the console</div>;
  }

  const handleLogin = async () => {
    if (signer && signerAddr) {
      try {
        const msg = await signer.signMessage(SIGNER_MESSAGE);
        const res = await login({
          variables: {
            wallet: signerAddr,
            msg,
          },
        });
        if (signerAddr === res.data?.login?.id) {
          setLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
