import React, { FC } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  apiProvider,
  configureChains,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiProvider } from 'wagmi';
import { INFURA_ID } from '../../env';

const { chains, provider } = configureChains(
  [chain.polygon],
  [apiProvider.infura(INFURA_ID), apiProvider.fallback()],
);
const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const Web3Wrapper: FC = ({ children }) => {
  return (
    <WagmiProvider client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
};
