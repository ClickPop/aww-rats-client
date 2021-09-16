import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

export * from 'smart-contracts/src/types';

export type UseEthersHook = () => EthersState

export type EthersState = {
  ethereum?: any;
  provider?: Web3Provider,
  signer?: JsonRpcSigner
}

export type LOADING_STATE = "TOKEN" | "GENERATOR" | null

export type GeneratorResponse = {
  status: 'success' | 'error',
  error?: unknown
  data?: GeneratorSuccessData 
}

type GeneratorSuccessData = {
  status: string
  tokenId: string
  tokenUri: string
  txHash: string
}
