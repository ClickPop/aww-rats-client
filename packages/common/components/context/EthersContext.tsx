import { createContext, ReactNode, useEffect, useState } from 'react';
import { useEthers } from 'common/hooks/useEthers';
import { EthersContextType, Exact } from 'types';
import { utils } from 'ethers';
import { QueryResult, QueryHookOptions } from '@apollo/client';

type CheckAuthQuery = {
  checkAuth: { role: string; id?: string | null | undefined };
};
type CheckAuthQueryVariables = Exact<{ [key: string]: never }>;

interface Props {
  children: ReactNode | null;
  checkAuth: (
    baseOptions?: QueryHookOptions<CheckAuthQuery, CheckAuthQueryVariables>,
  ) => QueryResult<CheckAuthQuery, CheckAuthQueryVariables>;
}

const defaultEthersContext: EthersContextType = {
  isLoggedIn: false,
  setLoggedIn: () => {},
  authLoading: true,
};

export const EthersContext = createContext(defaultEthersContext);

export const EthersContextProvider = ({ children, checkAuth }: Props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const etherState = useEthers();
  const { loading: authLoading, data: authData } = checkAuth({
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const { signer, connected, signerAddr } = etherState;
    setLoggedIn(
      !!(
        authData?.checkAuth?.role === 'user' &&
        signerAddr === authData?.checkAuth?.id &&
        connected &&
        !!signer
      ),
    );
  }, [etherState, authData?.checkAuth]);

  return (
    <EthersContext.Provider
      value={{
        ...etherState,
        isLoggedIn,
        setLoggedIn,
        authLoading,
      }}>
      {children}
    </EthersContext.Provider>
  );
};
