import { createContext, FC, useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { EthersContextType, Rat } from '~/types';
import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';
import { CONTRACT_ADDRESS, CHAIN_ID } from '~/config/env';
import { ethers } from 'ethers';

const defaultEthersContext: EthersContextType = {
  connectToMetamask: () => undefined,
};

export const EthersContext = createContext(defaultEthersContext);

export const EthersContextProvider: FC = ({ children }) => {
  const [contract, setContract] = useState<Rat | undefined>();
  const [signerAddr, setSignerAddr] = useState('');
  const etherState = useEthers();
  const { provider, signer, connected, network } = etherState;
  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && connected && network?.chainId === CHAIN_ID) {
        try {
          const c = new ethers.Contract(
            CONTRACT_ADDRESS,
            RatABI.abi,
            signer,
          ) as Rat;
          console.log(c);
          setContract(c);
        } catch (err) {
          console.error(err);
        }
      }

      if (signer) {
        const addr = await signer.getAddress();
        setSignerAddr(addr);
      }
    })();
  }, [connected, signer, provider, network]);

  const connectToMetamask = async () => {
    try {
      await provider?.send('eth_requestAccounts', []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EthersContext.Provider
      value={{ ...etherState, contract, connectToMetamask, signerAddr }}>
      {children}
    </EthersContext.Provider>
  );
};
