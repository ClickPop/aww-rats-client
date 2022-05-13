import { createContext, ReactNode, useMemo } from 'react';
import {
  CheckAuth,
  CheckLogin,
  EthersContextType,
  LoginQueryVariables,
} from 'types';
import { MutationTuple, MutationHookOptions } from '@apollo/client';
import { useAuth } from '../../hooks/useAuth';
import { useAccount } from 'wagmi';

interface Props<
  D extends {
    login?: Record<string, unknown> | null | undefined;
  },
> {
  children: ReactNode | null;
  checkAuth: CheckAuth;
  useLogin: (
    baseOptions?: MutationHookOptions<D, LoginQueryVariables>,
  ) => MutationTuple<D, LoginQueryVariables>;
  checkFunc: CheckLogin<D>;
}

const defaultEthersContext: EthersContextType = {
  isLoggedIn: false,
  setLoggedIn: () => {},
  authLoading: true,
  handleLogin: async () => {},
  connected: false,
};

export const EthersContext = createContext(defaultEthersContext);

export const EthersContextProvider = <
  D extends {
    login?: Record<string, unknown> | null | undefined;
  },
>({
  children,
  checkAuth,
  useLogin,
  checkFunc,
}: Props<D>) => {
  const [login, { loading: authLoading, error: authError }] = useLogin();
  const authState = useAuth<D>(checkAuth, login, checkFunc);
  const { data: account } = useAccount();
  const connected = useMemo(() => !!account?.address, [account]);

  return (
    <EthersContext.Provider
      value={{
        ...authState,
        authLoading,
        authError,
        connected,
      }}>
      {children}
    </EthersContext.Provider>
  );
};
