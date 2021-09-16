import { ethers, utils, BigNumber } from 'ethers';
import type { NextPage } from 'next'
import { CONTRACT_ADDRESS } from '~/config/env';
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";
import { Rat } from '~/types';
import { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
import { Minter } from '~/components/minting/Minter';

const Home: NextPage = () => {
  const [metamaskConn, setMetamaskConn] = useState(false);
  const [weiCost, setWeiCost] = useState(BigNumber.from(0));
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
          setWeiCost(data);
        })
      }
    })();
  }, [metamaskConn, signer]);

  return (
    <div>
      {metamaskConn ? <Minter weiCost={weiCost} ethCost={ethCost} contract={contract} /> : <button onClick={connectToMetamask}>Connect to metamask</button>}
    </div>
  )
}

export default Home
