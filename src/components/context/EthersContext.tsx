import { createContext, FC, useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { Closet, EthersContextType, Rat } from '~/types';
import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';
import ClosetABI from 'smart-contracts/artifacts/src/contracts/Closet.sol/Closet.json';
import { CONTRACT_ADDRESS, CHAIN_ID, CLOSET_ADDRESS } from '~/config/env';
import { ethers, utils } from 'ethers';
import { useCheckAuthQuery } from '~/schema/generated';
import { apolloBacktalkClient } from '~/lib/graphql';

const defaultEthersContext: EthersContextType = {
  isLoggedIn: false,
  isLoggedInBacktalk: false,
  setLoggedIn: () => {},
  setLoggedInBacktalk: () => {},
  connectToMetamask: () => undefined,
  authLoading: true,
  backtalkAuthLoading: true,
};

export const EthersContext = createContext(defaultEthersContext);

export const EthersContextProvider: FC = ({ children }) => {
  const [contract, setContract] = useState<Rat | undefined>();
  const [closet, setCloset] = useState<Closet | undefined>();
  const [signerAddr, setSignerAddr] = useState('');
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggedInBacktalk, setLoggedInBacktalk] = useState(false);
  const etherState = useEthers();
  const { loading: authLoading, data: authData } = useCheckAuthQuery();
  const { loading: backtalkAuthLoading, data: backtalkAuthData } =
    useCheckAuthQuery({
      client: apolloBacktalkClient,
    });

  useEffect(() => {
    const { signer, connected, network, accounts } = etherState;
    setLoggedIn(
      !!(
        authData?.checkAuth?.role === 'user' &&
        accounts?.[0] === authData?.checkAuth?.id &&
        connected &&
        signer
      ),
    );
    setLoggedInBacktalk(
      !!(
        backtalkAuthData?.checkAuth?.role === 'user' &&
        accounts?.[0] === backtalkAuthData?.checkAuth?.id &&
        connected &&
        signer
      ),
    );

    if (connected && network?.chainId === CHAIN_ID) {
      try {
        if (CONTRACT_ADDRESS) {
          const r = new ethers.Contract(
            CONTRACT_ADDRESS,
            RatABI.abi,
            signer,
          ) as Rat;
          setContract(r);
        }

        if (CLOSET_ADDRESS) {
          const c = new ethers.Contract(
            CLOSET_ADDRESS,
            ClosetABI.abi,
            signer,
          ) as Closet;
          setCloset(c);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (accounts?.[0]) {
      setSignerAddr(utils.getAddress(accounts[0]));
    }
  }, [etherState, authData?.checkAuth, backtalkAuthData?.checkAuth]);

  const connectToMetamask = async () => {
    try {
      await etherState.provider?.send('eth_requestAccounts', []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EthersContext.Provider
      value={{
        ...etherState,
        contract,
        connectToMetamask,
        signerAddr,
        closet,
        isLoggedIn,
        isLoggedInBacktalk,
        setLoggedIn,
        authLoading,
        backtalkAuthLoading,
        setLoggedInBacktalk,
      }}>
      {children}
    </EthersContext.Provider>
  );
};
