import React from 'react'
import { ethers, utils, BigNumber } from 'ethers';
import { CONTRACT_ADDRESS } from '~/config/env';
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";
import { Rat } from '~/types';
import { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { Image } from '~/components/shared/Image'
import { Link } from '~/components/shared/Link'
import logo from '~/assets/images/aww-rats-logo.png'
import rat01 from '~/assets/images/rats/rat-01.png'
import rat02 from '~/assets/images/rats/rat-02.png'
import rat03 from '~/assets/images/rats/rat-03.png'
import rat04 from '~/assets/images/rats/rat-04.png'
import rat05 from '~/assets/images/rats/rat-05.png'
import rat06 from '~/assets/images/rats/rat-06.png'
import rat07 from '~/assets/images/rats/rat-07.png'
// import { Minter } from '~/components/minting/Minter';

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
    <div className="pb-24 pt-4 overflow-hidden text-white w-full">
      <Image className="max-w-md mx-auto mb-8 p-4" src={logo} alt="Aww, Rats! Logo" placeholder="blur" />
      <div className="text-center justify-center items-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl mb-2 font-bold">An NFT Project By Creators, for Creators.</h1>
      </div>
      <div className="w-screen my-12 overflow-hidden">
        <div className="flex flex-row items-center justify-center overflow-hidden">
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat01} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat02} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat03} alt="" />
          <Image className="ratvatar ratvatar-lg imgfix overflow-hidden rounded-full mx-8" src={rat04} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat05} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat06} alt="" />
          <Image className="ratvatar imgfix overflow-hidden rounded-full mx-8" src={rat07} alt="" />
        </div>
      </div>
      <div className="text-center justify-center items-center max-w-2xl mx-auto px-4">
        <p className="text-lg mb-8">We&apos;re sharing the tools we built and the skills we learned with all of our rat holders so more artists can make generative art and NFTs.</p>
        <p className="text-lg">We&apos;re getting ready to launch our mint - join our Discord to be in the know.</p>
        <p className="mt-8"><Link href="https://discord.gg/2cwxkBkgf5" className="rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold px-4 py-3">Join the Discord</Link></p>
        {/* <div className="text-light w-fit mx-auto">
          <Minter />
        </div> */}
      </div>
    </div>
  )
}
