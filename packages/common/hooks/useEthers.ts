import { ethers, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { EthersState, UseEthersHook } from 'types';

export const useEthers: UseEthersHook = () => {
  let [ethState, setEthState] = useState<EthersState>({ connected: false });
  useEffect(() => {
    setEthState((s) => ({
      ...s,
      signerAddr: window.ethereum.selectedAddress
        ? utils.getAddress(window.ethereum.selectedAddress)
        : undefined,
      connected: !!window.ethereum.selectedAddress,
    }));
  }, []);
  useEffect(() => {
    let handleChange = true;
    const handleAccountsChanged = () => {
      if (handleChange) {
        setEthState((s) => ({
          ...s,
          connected: !!window.ethereum.selectedAddress,
          signerAddr: window.ethereum.selectedAddress
            ? utils.getAddress(window.ethereum.selectedAddress)
            : undefined,
        }));
      }
    };
    const ethProvider = new ethers.providers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/',
      1,
    );
    const polyProvider = new ethers.providers.JsonRpcProvider(
      'https://polygon-rpc.com/',
      137,
    );
    if (typeof window != 'undefined' && window.ethereum && !ethState.provider) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any',
      );
      provider.on('network', (network) => {
        setEthState((s) => ({ ...s, network }));
      });
      if (window.ethereum.listeners('accountsChanged').length > 0) {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged,
        );
      }
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      const signer = provider.getSigner();
      provider.listAccounts().then(async (accounts: string[]) => {
        setEthState((s) => ({
          ...s,
          accounts: accounts,
          connected: accounts.length > 0,
        }));
      });
      setEthState((s) => ({
        ...s,
        provider,
        signer,
        ethProvider,
        polyProvider,
      }));
    }

    return () => {
      handleChange = false;
      ethState.provider?.removeAllListeners();
    };
  }, [ethState.provider]);

  return ethState;
};
