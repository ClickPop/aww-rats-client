import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { EthersState, UseEthersHook } from '~/types';

declare global {
  interface Window {
    ethereum: any;
  }
}

export const useEthers: UseEthersHook = () => {
  let [ethState, setEthState] = useState<EthersState>({ connected: false });

  useEffect(() => {
    if (typeof window != 'undefined' && window.ethereum && !ethState.provider) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any',
      );
      provider.on('network', (network) => {
        setEthState((s) => ({ ...s, network }));
      });
      window.ethereum.on('accountsChanged', ([account]: string[]) => {
        setEthState((s) => ({ ...s, connected: !!account, account }));
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
      }));
    }

    return () => {
      ethState.provider?.removeAllListeners();
    };
  }, [ethState.provider]);

  return ethState;
};
