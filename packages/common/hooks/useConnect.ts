import { FetchResult } from '@apollo/client';
import { utils, ethers } from 'ethers';
import { useContext, useState } from 'react';
import { EthersContext } from 'common/components/context/EthersContext';
import { SIGNER_MESSAGE } from 'common/env';
import { ChainData, NetworkSwitchError, Mutation } from 'types';
import { JsonRpcSigner } from '@ethersproject/providers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        1: 'https://mainnet.infura.io/v3/',
        137: 'https://polygon-rpc.com/',
      },
    },
  },
};

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
  handleLogin: (wallet: string, sig: JsonRpcSigner) => Promise<void>;
  switchChainError: NetworkSwitchError | null;
} => {
  const [switchChainError, setSwitchChainError] =
    useState<NetworkSwitchError | null>(null);
  const { setLoggedIn, provider, setEthState } = useContext(EthersContext);

  const handleLogin = async (wallet: string, sig: JsonRpcSigner) => {
    if (sig && wallet && login) {
      try {
        console.log('premsg', signerMsg ?? SIGNER_MESSAGE);
        const msg = await sig.signMessage(signerMsg ?? SIGNER_MESSAGE);
        console.log('msg', msg);
        const res = await login({
          variables: {
            wallet,
            msg,
          },
        });
        if (checkLogin && checkLogin(res, wallet)) {
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
      const web3Modal = new Web3Modal({
        providerOptions,
      });
      const newProvider = await web3Modal?.connect();
      const web3Provider = new ethers.providers.Web3Provider(newProvider);
      setEthState((s) => ({ ...s, provider: web3Provider }));
      const sig = web3Provider.getSigner();
      return {
        sig,
        addr: await sig.getAddress(),
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
