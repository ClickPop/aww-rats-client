import React, { useEffect, useState, FC, ComponentProps } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { ethers, BigNumber } from 'ethers';
import {
    Rat,
} from '~/types';
import {
  CHAIN_ID,
  CONTRACT_ADDRESS,
} from '~/config/env';

import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';

export const RatPackSize = ({ className, ...rest }) => {
  const [ratPackSize, setRatPackSize] = useState<number>(0);
  const [maxRatPackSize, setMaxRatPackSize] = useState<number>(990);
  const { provider, signer, network, connected } = useEthers();
  
  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && connected && network?.chainId === CHAIN_ID) {
        try {
          const c = new ethers.Contract(
            CONTRACT_ADDRESS,
            RatABI.abi,
            signer,
          ) as Rat;
          c.maxTokens().then((maxTokens: number) => {
            if (maxTokens) {
              setMaxRatPackSize(maxTokens);
            }
          });
          c.numTokens().then((numTokens: BigNumber) => {
            if (numTokens) {
              setRatPackSize(numTokens.toNumber())
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [connected, signer, provider, network]);

  if (ratPackSize > 0 && ratPackSize < maxRatPackSize) {
    return (<div><p className={className}>Currently {ratPackSize} rats in the sewer,<br />but there&apos;s room for {maxRatPackSize - ratPackSize} more...</p></div>)
  } else if (ratPackSize > 0 && ratPackSize >= maxRatPackSize) {
    return (<div><p className={className}>Looks like there&apos;s no more room in the sewer.</p></div>)
  }
  return <></>
}