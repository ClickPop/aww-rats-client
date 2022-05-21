import { JsonRpcProvider } from '@ethersproject/providers';
import { Dispatch, SetStateAction } from 'react';
import {
  FetchResult,
  MutationFunctionOptions,
  QueryHookOptions,
  QueryResult,
  ApolloError,
} from '@apollo/client';
export * from 'smart-contracts/src/types';

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

export enum ProviderType {
  metamask = 'metamask',
  walletConnect = 'walletConnect',
}

export interface EthersContextType {
  isLoggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  authLoading: boolean;
  authError?: ApolloError;
  ethProvider?: JsonRpcProvider;
  polyProvider?: JsonRpcProvider;
  handleLogin: () => Promise<void>;
  connected: boolean;
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

type CheckAuthQuery = {
  checkAuth: { role: string; id?: string | null | undefined };
};
type CheckAuthQueryVariables = Exact<{ [key: string]: never }>;

export type LoginQueryVariables = Exact<{
  wallet: string;
  msg: string;
}>;

export type LoginReturnVal = {
  login?: Record<string, unknown> | null | undefined;
};

export type CheckAuth = (
  baseOptions?: QueryHookOptions<CheckAuthQuery, CheckAuthQueryVariables>,
) => QueryResult<CheckAuthQuery, CheckAuthQueryVariables>;

export type CheckLogin<D> = (
  returnData: FetchResult<D>,
  signerAddr: string,
) => boolean;

export type UseAuthHook = <D extends LoginReturnVal>(
  checkAuth: CheckAuth,
  login: Mutation<D, FetchResult<D>>,
  checkLogin: CheckLogin<D>,
  signerMsg?: string,
) => {
  handleLogin: () => Promise<void>;
  isLoggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  authLoading: boolean;
};
