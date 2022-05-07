import {
  Web3Provider,
  JsonRpcProvider,
  JsonRpcSigner,
} from '@ethersproject/providers';
import { providers } from 'ethers';
import { Dispatch, SetStateAction } from 'react';
import {
  BaseMutationOptions,
  FetchResult,
  MutationFunctionOptions,
} from '@apollo/client';
export * from 'smart-contracts/src/types';

declare global {
  interface Window {
    ethereum: any;
  }
}

export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

export type Mutation<D, R = FetchResult<D>> = (
  options?: MutationFunctionOptions<D, Exact<{ wallet: string; msg: string }>>,
) => Promise<R>;

export interface ReducerAction {
  type: string;
  payload?: unknown;
}

export type UseEthersHook = () => [
  EthersState,
  Dispatch<SetStateAction<EthersState>>,
];

export enum ProviderType {
  metamask = 'metamask',
  walletConnect = 'walletConnect',
}

export type EthersState = {
  provider?: Web3Provider;
  signer?: JsonRpcSigner;
  network?: providers.Network;
  connected?: boolean;
  signerAddr?: string;
  ethProvider?: JsonRpcProvider;
  polyProvider?: JsonRpcProvider;
  providerType?: ProviderType;
};

export interface EthersContextType extends EthersState {
  signerAddr?: string;
  isLoggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  authLoading: boolean;
  setEthState: Dispatch<SetStateAction<EthersState>>;
}

export interface NetworkSwitchError {
  state: string;
  message: string;
  error?: any;
}

export interface ChainCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ChainData {
  id: number;
  name: string;
  nativeCurrency: ChainCurrency | null;
  rpc: string[] | string;
  scan: string[] | string;
}
