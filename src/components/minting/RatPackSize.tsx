import React, { useEffect, useState, FC, useContext } from 'react';
import { ethers, BigNumber } from 'ethers';
import { Rat } from '~/types';
import { CONTRACT_ADDRESS } from '~/config/env';
import RatABI from 'smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json';
import { EthersContext } from '~/components/context/EthersContext';

interface Props {
  className?: string;
}

export const RatPackSize: FC<Props> = ({ className, ...props }) => {
  const [ratPackSize, setRatPackSize] = useState<number>(0);
  const [maxRatPackSize, setMaxRatPackSize] = useState<number>(990);
  const { polyProvider } = useContext(EthersContext);

  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && polyProvider) {
        try {
          const cro = new ethers.Contract(
            CONTRACT_ADDRESS,
            RatABI.abi,
            polyProvider,
          ) as Rat;
          cro.maxTokens().then((maxTokens: number) => {
            if (maxTokens) {
              setMaxRatPackSize(maxTokens);
            }
          });
          cro.numTokens().then((numTokens: BigNumber) => {
            if (numTokens) {
              setRatPackSize(numTokens.toNumber());
            }
          });
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [polyProvider]);

  if (ratPackSize > 0 && ratPackSize < maxRatPackSize) {
    return (
      <div>
        <p className={className}>
          {ratPackSize} of {maxRatPackSize} rats are already in the sewer,
        </p>
      </div>
    );
  } else if (ratPackSize > 0 && ratPackSize >= maxRatPackSize) {
    return (
      <div>
        <p className={className}>
          Looks like there&apos;s no more room in the sewer.
        </p>
      </div>
    );
  }
  return <></>;
};
