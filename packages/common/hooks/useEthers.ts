import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { EthersState, UseEthersHook } from 'types';

export const useEthers: UseEthersHook = () => {
  let [ethState, setEthState] = useState<EthersState>({ connected: false });

  useEffect(() => {
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
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setEthState((s) => ({ ...s, connected: !!accounts, accounts }));
      });
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
      ethState.provider?.removeAllListeners();
    };
  }, [ethState.provider]);

  return ethState;
};
