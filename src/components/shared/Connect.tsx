import React, { useContext } from 'react';
import { CHAIN_ID } from '~/config/env';
import { useConnect } from '~/hooks/useConnect';
import { EthersContext } from '~/components/context/EthersContext';

export const Connect = () => {
  const { connected, network } = useContext(EthersContext);
  const {
    connectToMetamask,
    switchAddPolygonNetwork,
    chainData,
    addNetworkActive,
    switchChainError,
  } = useConnect();

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
          {addNetworkActive && chainData ? (
            <>
              <p>It looks like your wallet is on the wrong network.</p>
              <div className='mt-2 text-sm'>
                <button
                  className='px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light text-sm font-bold'
                  onClick={switchAddPolygonNetwork}>
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
          ) : (
            <>
              <p>
                It looks like your wallet is on the wrong network. Make sure
                you&apos;re on the Matic Network (
                <a
                  href='https://quickswap-layer2.medium.com/guide-how-to-set-up-custom-matic-mainnet-rpc-for-metamask-transfer-assets-from-l1-to-l2-to-use-3b1e55ccb5cb'
                  target='_blank'
                  className='underline'
                  rel='noreferrer'>
                  learn more
                </a>
                ).
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
};
