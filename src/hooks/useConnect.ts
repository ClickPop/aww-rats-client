import { BaseMutationOptions, FetchResult } from '@apollo/client';
import { utils } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { CHAIN_ID, SIGNER_MESSAGE } from '~/config/env';
import { useEthers } from '~/hooks/useEthers';
import { Exact, LoginMutationOptions } from '~/schema/generated';
import { ChainCurrency, ChainData, NetworkSwitchError } from '~/types';

export const useConnect = <
  D,
  R = FetchResult<D>,
  T extends (
    opts: BaseMutationOptions<D, Exact<{ wallet: string; msg: string }>>,
  ) => Promise<R> = (
    opts: BaseMutationOptions<D, Exact<{ wallet: string; msg: string }>>,
  ) => Promise<R>,
>(
  login?: T,
  checkLogin?: (returnData: R, signerAddr: string) => boolean,
  signerMsg?: string,
  isBacktalk?: boolean,
) => {
  const { provider } = useEthers();
  const [addNetworkActive, setAddNetworkActive] = useState<boolean>(false);
  const [chainData, setChainData] = useState<ChainData | null>(null);
  const [switchChainError, setSwitchChainError] =
    useState<NetworkSwitchError | null>(null);
  const { signer, signerAddr, setLoggedIn, setLoggedInBacktalk } =
    useContext(EthersContext);

  const handleLogin = async () => {
    if (signer && signerAddr && login) {
      try {
        const msg = await signer.signMessage(signerMsg ?? SIGNER_MESSAGE);
        const res = await login({
          variables: {
            wallet: signerAddr,
            msg,
          },
        });
        if (checkLogin && checkLogin(res, signerAddr)) {
          if (isBacktalk) {
            setLoggedInBacktalk(true);
          } else {
            setLoggedIn(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

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
        chain_rpc = ['https://matic-mumbai.chainstacklabs.com'];
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
  }, []);

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

  return {
    connectToMetamask,
    switchAddPolygonNetwork,
    handleLogin,
    chainData,
    addNetworkActive,
    switchChainError,
  };
};
