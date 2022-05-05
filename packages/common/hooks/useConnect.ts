import { FetchResult } from '@apollo/client';
import { utils } from 'ethers';
import { useContext, useState } from 'react';
import { EthersContext } from 'common/components/context/EthersContext';
import { SIGNER_MESSAGE } from 'common/env';
import { useEthers } from './useEthers';
import { ChainData, NetworkSwitchError, Mutation } from 'types';
import { JsonRpcSigner } from 'common/../smart-contracts/node_modules/@ethersproject/providers/lib';

export enum Supported_Chains_Enum {
  polygon = 'polygon',
  ethereum = 'ethereum',
}

export const chainData: Record<Supported_Chains_Enum, ChainData> = {
  polygon: {
    id: 137,
    name: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpc: ['https://polygon-rpc.com/'],
    scan: ['https://polygonscan.com'],
  },
  ethereum: {
    id: 1,
    name: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'Eth',
      decimals: 18,
    },
    rpc: ['https://mainnet.infura.io/v3'],
    scan: ['https://etherscan.io'],
  },
};

export const chainDataByChainId: Record<number, ChainData> = {
  137: {
    id: 137,
    name: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpc: ['https://polygon-rpc.com/'],
    scan: ['https://polygonscan.com'],
  },
  1: {
    id: 1,
    name: 'Ethereum Mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'Eth',
      decimals: 18,
    },
    rpc: ['https://mainnet.infura.io/v3'],
    scan: ['https://etherscan.io'],
  },
};

export const useConnect = <
  D,
  R = FetchResult<D>,
  T extends Mutation<D, R> = Mutation<D, R>,
>(
  login?: T,
  checkLogin?: (returnData: R, signerAddr: string) => boolean,
  signerMsg?: string,
): {
  connectToMetamask: () => Promise<{
    addr?: string;
    sig?: JsonRpcSigner;
  } | null>;
  switchAddNetwork: (network: Supported_Chains_Enum) => Promise<void>;
  handleLogin: (wallet?: string) => Promise<void>;
  switchChainError: NetworkSwitchError | null;
} => {
  const { provider } = useEthers();
  const [switchChainError, setSwitchChainError] =
    useState<NetworkSwitchError | null>(null);
  const { signer, signerAddr, setLoggedIn } = useContext(EthersContext);

  const handleLogin = async (wallet?: string, sig?: JsonRpcSigner) => {
    if ((signer || sig) && (signerAddr || wallet) && login) {
      const addr = wallet ?? signerAddr!;
      const s = sig ?? signer!;
      try {
        const msg = await s.signMessage(signerMsg ?? SIGNER_MESSAGE);
        const res = await login({
          variables: {
            wallet: addr,
            msg,
          },
        });
        if (checkLogin && checkLogin(res, addr)) {
          setLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const parseError = (error: any) => {
    if (typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case -32002:
          setSwitchChainError({
            state: 'pending',
            message: 'Switch Network action pending in your wallet...',
            error: error,
          });
          break;
        case 4001:
          setSwitchChainError({
            state: 'user-rejected',
            message: 'Looks like the switch/add network action was declined.',
            error: error,
          });
          break;
        case 4902:
          setSwitchChainError({
            state: 'not-added',
            message: 'Attempting to add the network to your wallet...',
            error: error,
          });
          break;
        default:
          setSwitchChainError({
            state: 'unknown',
            message:
              'An error was encountered, reach out to the discord community if the issue persists.',
            error: error,
          });
      }
    }
  };
  const connectToMetamask = async () => {
    try {
      const accounts = await provider?.send('eth_requestAccounts', []);
      const sig = provider?.getSigner();
      return {
        addr: accounts?.length > 0 ? utils.getAddress(accounts[0]) : undefined,
        sig,
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const switchAddNetwork = async (network: Supported_Chains_Enum) => {
    setSwitchChainError({
      state: 'active',
      message: `Switching to ${network}...`,
    });
    const chain = chainData[network];
    if (chain) {
      const switchParams = [
        { chainId: utils.hexStripZeros(utils.hexlify(chain.id)) },
      ];
      const addParams = [
        {
          chainId: utils.hexStripZeros(utils.hexlify(chain.id)),
          chainName: chain.name,
          nativeCurrency: chain.nativeCurrency,
          rpcUrls: chain.rpc,
          blockExplorerUrls: chain.scan,
        },
      ];

      try {
        await provider?.send('wallet_switchEthereumChain', switchParams);
      } catch (switchError: any) {
        parseError(switchError);
        if (typeof switchError === 'object' && 'code' in switchError) {
          if (switchError.code === 4902) {
            try {
              await provider?.send('wallet_addEthereumChain', addParams);
              setSwitchChainError(null);
            } catch (err) {
              parseError(err);
              console.error(err);
            }
          } else {
            console.error(switchError);
          }
        } else {
          setSwitchChainError({
            state: 'unknown',
            message:
              'An error was encountered, reach out to the discord community if the issue persists.',
            error: switchError,
          });
          console.error(switchError);
        }
      }
    }
  };

  return {
    connectToMetamask,
    switchAddNetwork,
    handleLogin,
    switchChainError,
  };
};
