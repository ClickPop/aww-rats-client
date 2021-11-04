import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider';
import { ethers, providers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { Rat } from 'smart-contracts/src/types/index';

export * from 'smart-contracts/src/types';

export type UseEthersHook = () => EthersState;

export type EthersState = {
  provider?: Web3Provider;
  signer?: JsonRpcSigner;
  network?: providers.Network;
  connected?: boolean;
  account?: string;
};

export type LOADING_STATE =
  | 'INITIAL'
  | 'APPROVAL'
  | 'TOKEN'
  | 'GENERATOR'
  | 'METADATA'
  | null;

export type GeneratorResponse = {
  status: 'success' | 'error';
  error?: unknown;
  data?: GeneratorSuccessData;
};

type GeneratorSuccessData = {
  status: string;
  tokenId: string;
  tokenUri: string;
  txHash: string;
};

export type Metadata = {
  image: string;
  name: string;
  description: string;
  attributes: OpenSeaAttribute[];
};

export type OpenSeaAttribute = {
  trait_type?: string;
  display_type?:
    | 'string'
    | 'number'
    | 'boost_percentage'
    | 'boost_number'
    | 'date';
  value: string | number;
  max_value?: nunmber;
};

export interface EthersContextType extends EthersState {
  contract?: Rat;
  connectToMetamask: () => void;
  signerAddr?: string;
}

export type MoralisTokensResponse = {
  status: string;
  total: number;
  page: number;
  page_size: number;
  result: MoralisTokenMeta[];
};

export type MoralisTokenMeta = {
  token_address: string;
  token_id: string;
  name: string;
  symbol: string;
  contract_type: string;
  token_uri?: string;
  metadata?: string;
  synced_at?: string;
  amount?: string;
};

export interface ParsedMoralisTokenMeta extends MoralisTokenMeta {
  metadata: {
    image: string;
    [key: string]: unknown;
  };
}
