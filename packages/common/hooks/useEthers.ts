import { Web3Provider } from 'common/../smart-contracts/node_modules/@ethersproject/providers/lib';
import { ethers, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { EthersState, UseEthersHook } from 'types';

export const useEthers: UseEthersHook = () => {
  const [ethState, setEthState] = useState<EthersState>({ connected: false });

  useEffect(() => {
    const provider = ethState.provider;
    const web3Provider = ethState.provider?.provider as unknown as Web3Provider;
    let handleChange = true;
    const handleAccountsChanged = (accounts: string[]) => {
      if (handleChange) {
        const addr = accounts.length > 0 ? accounts[0] : undefined;
        setEthState((s) => ({
          ...s,
          connected: !!addr,
          signerAddr: addr ? utils.getAddress(addr) : undefined,
        }));
      }
    };
    const handleDisconnect = () => {
      setEthState({ connected: false });
    };
    const ethProvider = new ethers.providers.JsonRpcProvider(
      'https://mainnet.infura.io/v3/',
      1,
    );
    const polyProvider = new ethers.providers.JsonRpcProvider(
      'https://polygon-rpc.com/',
      137,
    );

    if (provider && web3Provider) {
      provider.on('network', (network: ethers.providers.Network) => {
        setEthState((s) => ({ ...s, network }));
      });
      web3Provider.on('disconnect', handleDisconnect);
      web3Provider.on('accountsChanged', handleAccountsChanged);
      const signer = provider.getSigner();
      provider.listAccounts().then(async (accounts: string[]) => {
        const signerAddr = accounts.length > 0 ? accounts[0] : undefined;
        setEthState((s) => ({
          ...s,
          connected: accounts.length > 0,
          signerAddr: signerAddr,
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
      provider?.removeAllListeners();
      web3Provider?.removeAllListeners();
    };
  }, [ethState.provider]);

  return [ethState, setEthState];
};
