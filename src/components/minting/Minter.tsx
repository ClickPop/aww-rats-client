import React, { useEffect, useState } from 'react'
import { useEthers } from '~/hooks/useEthers';
import {ethers, BigNumber, ContractTransaction, ContractReceipt} from "ethers";
import { GeneratorResponse, LOADING_STATE, Rat } from '~/types';
import { CHAIN_ID, CONTRACT_ADDRESS } from '~/config/env';
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";

export const Minter = () => {
  const { provider, signer, network } = useEthers();
  const [metamaskConn, setMetamaskConn] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [ethCost, setEthCost] = useState(0);
  const [contract, setContract] = useState<Rat | null>(null);
  const [loading, setLoading] = useState<LOADING_STATE>(null)
  const [mintTx, setMintTx] = useState("")
  const [completedRat, setCompletedRat] = useState<GeneratorResponse | null>(null)

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
      if (provider) {
        const addrs = await provider.listAccounts();
        setMetamaskConn(addrs.length > 0);
        console.log(network);
        setCorrectNetwork(network?.chainId === CHAIN_ID)
      }
      if (CONTRACT_ADDRESS && metamaskConn && network?.chainId === CHAIN_ID) {
        try {
          const c = new ethers.Contract(CONTRACT_ADDRESS, RatABI.abi, signer) as Rat
          setContract(c);
          c.cost().then(data => {
            setEthCost(parseFloat(ethers.utils.formatEther(data)));
          })
        } catch (err) {
          console.error(err);
          
        }
      }
    })();
  }, [metamaskConn, signer, provider, correctNetwork, network]);

  const test = async () => {
    if (contract && provider && signer) {
      try {
        setLoading("TOKEN");
        const wethAddr = await contract.erc20();
        const weth = new ethers.Contract(wethAddr, ["function balanceOf(address owner) view returns (uint256)", "function approve(address spender, uint256 tokens) public returns (bool success)", "function name() view returns (string memory)", "function symbol() view returns (string memory)"], signer);
        const cost = ethers.utils.parseEther(`${ethCost}`);
        const bal: BigNumber = await weth.balanceOf(await signer.getAddress());
        const t: ContractReceipt = await weth.approve(contract.address, cost).then((t: ContractTransaction) => t.wait());
        const tx = await contract.createToken().then(t => t.wait());
        setMintTx(tx.transactionHash)
        console.log(tx?.events?.map(e => e.args));
        const tokenId = tx?.events?.find(e => e.args?.['tokenId'])?.args?.["tokenId"].toString();
        setLoading("GENERATOR");
        const rat: GeneratorResponse = await fetch("./api/generate-rat", {
          method: "post",
          body: JSON.stringify({
            tokenId
          })
        }).then(res => res.json());
        console.log({rat});
        setCompletedRat(rat)
        setLoading(null);
      } catch (err: any) {
        // TODO: Handle error better lol
        console.error(err.message);
        setLoading(null);
      }
    }
  };

  if (!metamaskConn) {
    return <button onClick={connectToMetamask}>Connect to MetaMask</button>
  }

  if (!correctNetwork) {
    return <div>Please select the correct network</div>
  }

  return (
    <>
      {loading === "TOKEN" && <h1>
        Minting token...
      </h1>}
      {loading === "GENERATOR" && <h1>
        Generating rat...
      </h1>}
      <div>
        <h1>Cost: {ethCost}weth</h1>
        <button onClick={test}>Click Me</button>
      </div>
      <div>
        {mintTx && <p>Minting tx: <a href={`https://mumbai.polygonscan.com/tx/${mintTx}`} target="_blank" rel="noopener noreferrer">{mintTx}</a></p>}
        {completedRat && <>
          <p>SetTokenURI tx hash: <a href={`https://mumbai.polygonscan.com/tx/${completedRat.data?.txHash}`} target="_blank" rel="noopener noreferrer">{completedRat.data?.txHash}</a></p>  
          <p>Token Id: {completedRat.data?.tokenId}</p>  
          <p>Token URI: <a href={completedRat.data?.tokenUri} target="_blank" rel="noopener noreferrer">{completedRat.data?.tokenUri}</a></p>  
        </>}
      </div>
    </>
  )
}
