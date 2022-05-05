import React, { useContext } from 'react';
import { CHAIN_ID } from '~/config/env';
import { useConnect, Supported_Chains_Enum } from 'common/hooks/useConnect';
import { EthersContext } from 'common/components/context/EthersContext';

export const Connect = () => {
  const { connected, network } = useContext(EthersContext);
  const { connectToMetamask, switchAddNetwork, switchChainError } =
    useConnect();

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
      <div className='bg-light p-4 rounded-md text-black w-fit mx-auto'>
        <div className='px-4 py-3'>
          <>
            <p>It looks like your wallet is on the wrong network.</p>
            <div className='mt-2 text-sm'>
              <button
                className='px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light text-sm font-bold'
                onClick={() => {
                  switchAddNetwork(Supported_Chains_Enum.polygon);
                }}>
                Switch to Polygon
              </button>
              {switchChainError ? (
                <p className='m2-2 italic'>{switchChainError.message}</p>
              ) : (
                <p className='mt-1 italic'>
                  Don&apos;t have the Polygon Network?
                  <br />
                  No problem, this button will add it as well!
                </p>
              )}
            </div>

            <p className='mt-4'>
              Want to set it up yourself?{' '}
              <a
                href='https://quickswap-layer2.medium.com/guide-how-to-set-up-custom-matic-mainnet-rpc-for-metamask-transfer-assets-from-l1-to-l2-to-use-3b1e55ccb5cb'
                target='_blank'
                className='underline'
                rel='noreferrer'>
                Learn how here.
              </a>
            </p>
          </>
        </div>
      </div>
    );
  }

  return null;
};
