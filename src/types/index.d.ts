import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

export * from 'smart-contracts/src/types';

export type UseEthersHook = () => EthersState

export type EthersState = {
  ethereum?: any;
  provider?: Web3Provider,
  signer?: JsonRpcSigner
}