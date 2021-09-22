import { ethers, utils, BigNumber } from 'ethers';
import type { NextPage } from 'next'
import { CONTRACT_ADDRESS } from '~/config/env';
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";
import { Rat } from '~/types';
import { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { Minter } from '~/components/minting/Minter';
import { Hero } from '~/components/index/hero/Hero';
import { About } from '~/components/index/about/About';
import { Roadmap } from '~/components/index/roadmap/Roadmap';
import { RatRace } from '~/components/index/rat-race/RatRace';
import { Layout } from '~/components/layout/Layout';

const Home: NextPage = () => {
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
    <Layout className="bg-dark">
      <Hero />
      <About />
      <Roadmap />
      <RatRace />
    </Layout>
  )
}

export default Home
