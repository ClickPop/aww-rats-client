import React from 'react';
import { useEthers } from '~/hooks/useEthers';

import { CHAIN_ID } from '~/config/env';

export const Connect = () => {
  const { provider, network, connected } = useEthers();

  console.log(provider);

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
        className='px-4 py-3 rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold'
        onClick={connectToMetamask}>
        Connect to MetaMask
      </button>
    );
  }

  if (network?.chainId !== CHAIN_ID) {
    return (
      <div className='px-4 py-3 text-xs leading-5'>
        <span className="italic">Switch to Polygon</span>
        <a
          href='https://quickswap-layer2.medium.com/guide-how-to-set-up-custom-matic-mainnet-rpc-for-metamask-transfer-assets-from-l1-to-l2-to-use-3b1e55ccb5cb'
          target='_blank'
          className='inline-block w-4 h-4 leading-4 text-xs text-center ml-1 rounded-full bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold'
          rel='noreferrer'
          title="Learn more">
          ?
        </a>
      </div>
    );
  }

  return (<></>);
};
