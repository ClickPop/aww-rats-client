import React from 'react';
import { useEthers } from '~/hooks/useEthers';

import { CHAIN_ID } from '~/config/env';

export const Connect = () => {
  const { provider, network, connected } = useEthers();

  const connectToMetamask = async () => {
    try {
      await provider?.send('eth_requestAccounts', []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!connected) {
    return (
      <button
        className='px-4 py-3 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light font-bold'
        onClick={connectToMetamask}>
        Connect to MetaMask
      </button>
    );
  }

  if (network?.chainId !== CHAIN_ID) {
    return (
      <div className='px-4 py-3'>
        It looks like your wallet is on the wrong network. Make sure you&apos;re
        on the Matic Network (
        <a
          href='https://quickswap-layer2.medium.com/guide-how-to-set-up-custom-matic-mainnet-rpc-for-metamask-transfer-assets-from-l1-to-l2-to-use-3b1e55ccb5cb'
          target='_blank'
          className='underline'
          rel='noreferrer'>
          learn more
        </a>
        ).
      </div>
    );
  }

  return <></>;
};
