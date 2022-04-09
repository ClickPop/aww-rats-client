import { createContext, FC, useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { Closet, EthersContextType, Rat } from '~/types';
import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';
import ClosetABI from 'smart-contracts/artifacts/src/contracts/Closet.sol/Closet.json';
import { CONTRACT_ADDRESS, CHAIN_ID, CLOSET_ADDRESS } from '~/config/env';
import { ethers, utils } from 'ethers';
import { useCheckAuthLazyQuery } from '~/schema/generated';
import { apolloBacktalkClient } from '~/lib/graphql';

const defaultEthersContext: EthersContextType = {
  isLoggedIn: false,
  isLoggedInBacktalk: false,
  setLoggedIn: () => {},
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

  const [checkAuth, { loading: authLoading }] = useCheckAuthLazyQuery();
  const [BacktalkAuth, { loading: backtalkAuthLoading }] =
    useCheckAuthLazyQuery({
      client: apolloBacktalkClient,
    });

  useEffect(() => {
    const { signer, connected, network, accounts } = etherState;

    const handleCheckAuth = async () => {
      const auth = await checkAuth();
      const backtalkAuth = await BacktalkAuth();
      setLoggedIn(
        !!(
          auth.data?.checkAuth?.role === 'user' &&
          accounts?.[0] === auth.data?.checkAuth?.id &&
          connected &&
          signer
        ),
      );
      setLoggedInBacktalk(
        !!(
          backtalkAuth.data?.checkAuth?.role === 'user' &&
          accounts?.[0] === backtalkAuth.data?.checkAuth?.id &&
          connected &&
          signer
        ),
      );
    };

    handleCheckAuth();

    (async () => {
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
    })();
  }, [etherState, checkAuth, BacktalkAuth]);

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
      }}>
      {children}
    </EthersContext.Provider>
  );
};
