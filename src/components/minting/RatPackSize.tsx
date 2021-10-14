import React, { useEffect, useState, FC } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { ethers, BigNumber } from 'ethers';
import {
    Rat,
} from '~/types';
import {
  RPC_URL,
  CHAIN_ID,
  CONTRACT_ADDRESS,
} from '~/config/env';
import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';

interface Props {
  className?: string;
}

export const RatPackSize: FC<Props> = ({ className, ...props }) => {
  const [ratPackSize, setRatPackSize] = useState<number>(0);
  const [maxRatPackSize, setMaxRatPackSize] = useState<number>(990);
  const roProvider = new ethers.providers.JsonRpcProvider(RPC_URL, ethers.providers.getNetwork(CHAIN_ID));
  
  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && roProvider) {
        try {
          const cro = new ethers.Contract(
            CONTRACT_ADDRESS,
            RatABI.abi,
            roProvider
          ) as Rat;
          cro.maxTokens().then((maxTokens: number) => {
            if (maxTokens) {
              setMaxRatPackSize(maxTokens);
            }
          });
          cro.numTokens().then((numTokens: BigNumber) => {
            if (numTokens) {
              setRatPackSize(numTokens.toNumber())
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [roProvider]);

  if (ratPackSize > 0 && ratPackSize < maxRatPackSize) {
    return (<div><p className={className}>Currently {ratPackSize} rats in the sewer,<br />but there&apos;s room for {maxRatPackSize - ratPackSize} more...</p></div>)
  } else if (ratPackSize > 0 && ratPackSize >= maxRatPackSize) {
    return (<div><p className={className}>Looks like there&apos;s no more room in the sewer.</p></div>)
  }
  return <></>
}