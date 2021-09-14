import {ethers} from "ethers";
import { useEffect, useState } from "react";
import { EthersState, UseEthersHook } from "~/types";
import { CHAIN_ID } from "../config/env";

declare global {
  interface Window {ethereum: any}
}

export const useEthers: UseEthersHook = () => {
  let [ethState, setEthState] = useState<EthersState>({})

  useEffect(() => {
    if (typeof window != 'undefined' && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum, CHAIN_ID)
      const signer = provider.getSigner();
      setEthState({
        provider,
        signer
      });
    }
  }, [])
  
  return ethState;
}