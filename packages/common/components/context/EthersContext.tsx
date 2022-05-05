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
  const [signerAddr, setSignerAddr] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const etherState = useEthers();
  const { loading: authLoading, data: authData, refetch } = checkAuth();
  useEffect(() => {
    const recheck = () => {
      if (authLoading) {
        console.log('refetch');
        refetch();
      }
    };
    const timeout = setTimeout(recheck, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [authLoading, refetch]);
  useEffect(() => {
    const { signer, connected, accounts } = etherState;
    setLoggedIn(
      !!(
        authData?.checkAuth?.role === 'user' &&
        accounts?.[0] === authData?.checkAuth?.id &&
        connected &&
        signer
      ),
    );

    if (accounts?.[0]) {
      setSignerAddr(utils.getAddress(accounts[0]));
    }
  }, [etherState, authData?.checkAuth]);

  return (
    <EthersContext.Provider
      value={{
        ...etherState,
        signerAddr,
        isLoggedIn,
        setLoggedIn,
        authLoading,
      }}>
      {children}
    </EthersContext.Provider>
  );
};
