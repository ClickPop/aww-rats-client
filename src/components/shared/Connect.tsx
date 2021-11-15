import React, { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';

import { CHAIN_ID } from '~/config/env';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { utils } from 'ethers/lib/ethers';
interface NetworkSwitchError {
  state: string;
  message: string;
  error?: any;
}

interface ChainCurrency {
  name: string;
  symbol: string;
  decimals: number;
}
interface ChainData {
  id: number;
  name: string;
  nativeCurrency: ChainCurrency | null;
  rpc: string[] | string;
  scan: string[] | string;
}

export const Connect = () => {
  const { provider, network, connected } = useEthers();
  const [addNetworkActive, setAddNetworkActive] = useState<boolean>(false);
  const [chainData, setChainData] = useState<ChainData | null>(null);
  const [
    switchChainError,
    setSwitchChainError,
  ] = useState<NetworkSwitchError | null>(null);

  useEffect(() => {
    let chain_data: ChainData | null = null;
    let chain_name: string = '';
    let chain_currency: ChainCurrency | null = null;
    let chain_rpc: string[] = [];
    let chain_scan: string[] = [];
    let active: boolean = true;

    switch (CHAIN_ID) {
      case 137:
        chain_name = 'Polygon Mainnet';
        chain_currency = {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        };
        chain_rpc = [
          'https://polygon-rpc.com/',
          'https://rpc-mainnet.matic.network/',
          'https://rpc-mainnet.maticvigil.com/',
          'https://rpc-mainnet.matic.quiknode.pro/',
        ];
        chain_scan = ['https://polygonscan.com/'];
        break;
      case 80001:
        chain_name = 'Polygon Testnet Mumbai';
        chain_currency = {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        };
        chain_rpc = ['https://rpc-mumbai.matic.today/'];
        chain_scan = ['https://mumbai.polygonscan.com/'];
        break;
      default:
        active = false;
    }

    setAddNetworkActive(active);
    chain_data = active
      ? {
          id: CHAIN_ID,
          name: chain_name,
          nativeCurrency: chain_currency,
          rpc: chain_rpc,
          scan: chain_scan,
        }
      : null;
    setChainData(chain_data);
  }, [addNetworkActive, chainData]);

  const parseError = (error: any) => {
    if (typeof error === 'object' && 'code' in error) {
      switch (error.code) {
        case -32002:
          setSwitchChainError({
            state: 'pending',
            message: 'Switch Network action pending in your wallet...',
            error: error,
          });
          break;
        case 4001:
          setSwitchChainError({
            state: 'user-rejected',
            message: 'Looks like the switch/add network action was declined.',
            error: error,
          });
          break;
        case 4902:
          setSwitchChainError({
            state: 'not-added',
            message: 'Attempting to add the network to your wallet...',
            error: error,
          });
          break;
        default:
          setSwitchChainError({
            state: 'unknown',
            message:
              'An error was encountered, reach out to the discord community if the issue persists.',
            error: error,
          });
      }
    }
  };
  const connectToMetamask = async () => {
    try {
      await provider?.send('eth_requestAccounts', []);
    } catch (err) {
      console.error(err);
    }
  };

  const switchAddPolygonNetwork = async () => {
    setSwitchChainError({
      state: 'active',
      message: 'Switching to Polygon...',
    });
    if (addNetworkActive && chainData) {
      const switchParams = [
        { chainId: utils.hexStripZeros(utils.hexlify(chainData.id)) },
      ];
      const addParams = [
        {
          chainId: utils.hexStripZeros(utils.hexlify(chainData.id)),
          chainName: chainData.name,
          nativeCurrency: chainData.nativeCurrency,
          rpcUrls: chainData.rpc,
          blockExplorerUrls: chainData.scan,
        },
      ];

      try {
        await provider?.send('wallet_switchEthereumChain', switchParams);
      } catch (switchError: any) {
        parseError(switchError);
        if (typeof switchError === 'object' && 'code' in switchError) {
          if (switchError.code === 4902) {
            try {
              await provider?.send('wallet_addEthereumChain', addParams);
              setSwitchChainError(null);
            } catch (err) {
              parseError(err);
              console.error(err);
            }
          } else {
            console.error(switchError);
          }
        } else {
          setSwitchChainError({
            state: 'unknown',
            message:
              'An error was encountered, reach out to the discord community if the issue persists.',
            error: switchError,
          });
          console.error(switchError);
        }
      }
    }
  };

  if (!connected) {
    return (
      <button
        className='px-4 py-3 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light font-bold'
        onClick={connectToMetamask}
      >
        Connect to MetaMask
      </button>
    );
  }

  if (network?.chainId !== CHAIN_ID) {
    return (
      <div className='px-4 py-3'>
        {addNetworkActive && chainData ? (
          <>
            <p>It looks like your wallet is on the wrong network.</p>
            <div className='mt-2 text-sm'>
              <button
                className='px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 duration-300 text-light text-sm font-bold'
                onClick={switchAddPolygonNetwork}
              >
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
                rel='noreferrer'
              >
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
                rel='noreferrer'
              >
                learn more
              </a>
              ).
            </p>
          </>
        )}
      </div>
    );
  }

  return <></>;
};
