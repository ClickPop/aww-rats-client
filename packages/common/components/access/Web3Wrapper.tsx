import React, { FC } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
  connectorsForWallets,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { INFURA_ID } from '../../env';

const { chains, provider } = configureChains(
  [chain.polygon, chain.mainnet],
  [infuraProvider({ apiKey: INFURA_ID }), publicProvider()],
);
const { wallets } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const connectors = connectorsForWallets(wallets);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export const Web3Wrapper: FC = ({ children }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
};
