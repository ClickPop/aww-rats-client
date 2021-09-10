import {ethers} from "ethers";
import { CHAIN_ID, RPC_URL } from "../config/env";

declare global {
  interface Window {ethereum: any}
}

export const provider = typeof window !== 'undefined' ? new ethers.providers.Web3Provider(window.ethereum, CHAIN_ID) : new ethers.providers.JsonRpcProvider(RPC_URL)
export const signer = provider.getSigner();