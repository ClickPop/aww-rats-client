import { createContext, FC, useMemo } from 'react';
import { Closet__factory, Rat__factory, Closet, Rat } from 'types';
import { CONTRACT_ADDRESS, CLOSET_ADDRESS } from '~/config/env';
import { useSigner } from 'wagmi';

type ContractsContext = {
  closet?: Closet;
  rat?: Rat;
};

const defaultContext: ContractsContext = {};

export const ContractsContext = createContext(defaultContext);

export const ContractsContextProvider: FC = ({ children }) => {
  const { data: signer } = useSigner();
  const closet = useMemo(() => {
    if (signer && CLOSET_ADDRESS) {
      const factory = new Closet__factory(signer);
      return factory.attach(CLOSET_ADDRESS);
    }
  }, [signer]);

  const rat = useMemo(() => {
    if (signer && CONTRACT_ADDRESS) {
      const factory = new Rat__factory(signer);
      return factory.attach(CONTRACT_ADDRESS);
    }
  }, [signer]);

  return (
    <ContractsContext.Provider value={{ closet, rat }}>
      {children}
    </ContractsContext.Provider>
  );
};
