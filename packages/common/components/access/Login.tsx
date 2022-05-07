import { Box } from '@chakra-ui/react';
import { ReactNode, useContext } from 'react';
import { EthersContext } from '../../components/context/EthersContext';
import { SIGNER_MESSAGE } from '../../env';
import { useConnect } from '../../hooks/useConnect';
import { ApolloError, FetchResult } from '@apollo/client';
import { Mutation } from 'types';

type Props<
  D,
  R extends FetchResult<D> = FetchResult<D>,
  T extends Mutation<D, R> = Mutation<D, R>,
> = {
  children: ReactNode | undefined;
  login: T;
  checkFunc: (returnData: R, signerAddr: string) => boolean;
  loading: boolean;
  error: ApolloError | undefined;
};

const Login = <
  D extends {
    login?: Record<string, unknown> | null | undefined;
  },
  R extends FetchResult<D> = FetchResult<D>,
  T extends Mutation<D, R> = Mutation<D, R>,
>({
  children,
  login,
  loading,
  error,
  checkFunc,
}: Props<D, R, T>) => {
  const { connected, isLoggedIn, signer, signerAddr } =
    useContext(EthersContext);
  const { handleLogin, connectToMetamask } = useConnect<D, R, T>(
    login,
    checkFunc,
    SIGNER_MESSAGE,
  );

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>An error occurred, please check the console</div>;
  }

  return !isLoggedIn || !connected ? (
    <Box
      as='span'
      onClick={async () => {
        if (!connected) {
          const connection = await connectToMetamask();
          if (connection?.addr && connection?.sig) {
            console.log('handle', connection);
            await handleLogin(connection.addr, connection.sig);
          }
        } else if (!isLoggedIn && signerAddr && signer) {
          await handleLogin(signerAddr, signer);
        }
      }}>
      {children}
    </Box>
  ) : null;
};

export default Login;
