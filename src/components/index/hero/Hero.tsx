import React from 'react'
import { ethers, utils, BigNumber } from 'ethers';
import { CONTRACT_ADDRESS } from '~/config/env';
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";
import { Rat } from '~/types';
import { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { Image } from '~/components/shared/Image'
import rats from '~/assets/images/rats.gif'
import { Minter } from '~/components/minting/Minter';

export const Hero = () => {

  const [metamaskConn, setMetamaskConn] = useState(false);
  const [ethCost, setEthCost] = useState(0);
  const [contract, setContract] = useState<Rat | null>(null);
  const { provider, signer } = useEthers();

  const connectToMetamask = async () => {
    try {
      await provider?.send("eth_requestAccounts", []);
      setMetamaskConn(true);
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && metamaskConn) {
        const c = new ethers.Contract(CONTRACT_ADDRESS, RatABI.abi, signer) as Rat
        setContract(c);
        c.cost().then(data => {
          setEthCost(parseFloat(utils.formatEther(data)));
        })
      }
    })();
  }, [metamaskConn, signer]);

  return (
    <div className="pb-16 text-white w-full">
      <div className="text-center grid md:grid-cols-3 justify-center items-center max-w-4xl h-full mx-auto">
        <Image className="imgfix overflow-hidden rounded-full mt-3 mb-8" src={rats} alt="Rotating gif displaying some rats" />
        <div className="px-4 md:col-span-2 md:text-left">
          <h1 className="text-4xl mb-2 font-bold">An NFT Project By Creators, for Creators.</h1>
          <p className="text-lg">We&apos;re sharing the tools we built and the skills we learned with all of our rat holders so more artists can make generative art and NFTs.</p>
          <div className="text-light w-fit mx-auto">
            <div className="text-light w-fit mx-auto">
              <Minter />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
