import { ethers, ContractTransaction, utils, BigNumber } from 'ethers';
import type { NextPage } from 'next'
import { CONTRACT_ADDRESS } from '~/config/env';
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";
import { Rat } from '~/types';
import { useEffect, useState } from 'react';
import { useEthers } from '~/hooks/useEthers';
const Home: NextPage = () => {
  const [weiCost, setWeiCost] = useState(BigNumber.from(0));
  const [ethCost, setEthCost] = useState(0);
  const [contract, setContract] = useState<Rat | null>(null);
  const [metamaskConn, setMetamaskConn] = useState(false);
  const { provider, signer } = useEthers();
  const test = async () => {
    if (contract && provider) {
      try {
        const tx = await contract.createToken({ value: weiCost }).then((t: ContractTransaction) => t.wait());
        const tokenId = tx?.events?.[1].args?.["tokenId"].toString();
        fetch("./api/generate-rat", {
          method: "post",
          body: JSON.stringify({
            tokenId
          })
        }).then(res => res.json()).then(console.log);
      } catch (err: any) {
        console.error(err.message);
      }
    }
  };

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
      {metamaskConn ? <><h1>Cost: {ethCost}eth</h1>
        <button onClick={test}>Click Me</button></> : <button onClick={connectToMetamask}>Connect to metamask</button>}
    </div>
  )
}

export default Home
