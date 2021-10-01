import React, { useEffect, useState } from 'react'
import { useEthers } from '~/hooks/useEthers';
import { ethers, BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { GeneratorResponse, LOADING_STATE, Rat } from '~/types';
import { CHAIN_ID, CONTRACT_ADDRESS } from '~/config/env';
import { Image } from '~/components/shared/Image'
import loader from '~/assets/images/loader-cheese.gif'
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";

export const Minter = () => {
  const { provider, signer, network, connected, account } = useEthers();
  const [ethCost, setEthCost] = useState(0);
  const [contract, setContract] = useState<Rat | null>(null);
  const [loading, setLoading] = useState<LOADING_STATE>(null)
  const [mintTx, setMintTx] = useState("")
  const [completedRat, setCompletedRat] = useState<GeneratorResponse | null>(null)

  const connectToMetamask = async () => {
    try {
      await provider?.send("eth_requestAccounts", []);
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    (async () => {
      if (CONTRACT_ADDRESS && connected && network?.chainId === CHAIN_ID) {
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
  }, [connected, signer, provider, network]);

  const test = async () => {
    if (contract && provider && signer) {
      try {
        setLoading("APPROVAL");
        const wethAddr = await contract.erc20();
        const weth = new ethers.Contract(wethAddr, ["function balanceOf(address owner) view returns (uint256)", "function approve(address spender, uint256 tokens) public returns (bool success)", "function name() view returns (string memory)", "function symbol() view returns (string memory)"], signer);
        const cost = ethers.utils.parseEther(`${ethCost}`);
        const bal: BigNumber = await weth.balanceOf(await signer.getAddress());
        const t: ContractReceipt = await weth.approve(contract.address, cost).then((t: ContractTransaction) => t.wait());
        setLoading("TOKEN");
        const tx = await contract.createToken().then(t => t.wait());
        setMintTx(tx.transactionHash)
        const tokenId = tx?.events?.find(e => e.args?.['tokenId'])?.args?.["tokenId"].toString();
        setLoading("GENERATOR");
        const rat: GeneratorResponse = await fetch("./api/generate-rat", {
          method: "post",
          body: JSON.stringify({
            tokenId
          })
        }).then(res => res.json());
        setCompletedRat(rat)
        setLoading(null);
      } catch (err: any) {
        // TODO: Handle error better lol
        console.error(err.message);
        setLoading(null);
      }
    }
  };

  if (!connected) {
    return <button className="px-4 py-3 rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold" onClick={connectToMetamask}>Connect to MetaMask</button>
  }

  if (network?.chainId !== CHAIN_ID) {
    return <div className="px-4 py-3">It looks like your wallet is on the wrong network. Make sure you&apos;re on the Matic Network (<a href="https://quickswap-layer2.medium.com/guide-how-to-set-up-custom-matic-mainnet-rpc-for-metamask-transfer-assets-from-l1-to-l2-to-use-3b1e55ccb5cb" target="_blank" className="underline" rel="noreferrer">learn more</a>).</div>
  }

  return (
    <>
      {loading && <Image src={loader} className="w-10 inline-block" alt="Rat Cheese Loader"/>}
      {loading === "APPROVAL" && 
        <>
          <p className="px-4 py-2">
            Approving WETH transfer...<br />
          </p>
          <p className="bg-light text-gray-700 rounded-md mt-4 p-3">
            You'll need to confirm a transaction that gives our smart contract permission to transfer {ethCost} from your wallet.
          </p>
        </>
      }
      {loading === "TOKEN" && 
        <>
          <p className="px-4 py-2">
            Minting Token...
          </p>
          <p className="bg-light text-gray-700 rounded-md mt-4 p-3">
            Now you confirm your actual rat mint. Once the mint is successful, we'll charge you {ethCost} for you rat.
          </p>
        </>
      }
      {loading === "GENERATOR" && 
        <p className="px-4 py-@">
          Generating Rat...
        </p>
      }
      {!loading && <>
        <div>
          <button className="rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold" onClick={test}><span className="px-4 py-3 inline-block border-r-2 border-black">Mint a Rat</span> <span className="px-4 py-3 pl-2 inline-block">{ethCost}weth</span></button>
        </div>
        <div className="mt-8">
          {mintTx && completedRat && <p>Your token id is {completedRat.data?.tokenId}. <a href={`https://mumbai.polygonscan.com/tx/${mintTx}`} target="_blank" rel="noopener noreferrer" className="underline">See your transaction on polygonscan</a></p>}
          {completedRat && <>
            <p><a href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${completedRat.data?.tokenId}`} target="_blank" className="underline">View your new rat on OpenSea</a></p>
            <p><a href={completedRat.data?.tokenUri} target="_blank" rel="noopener noreferrer">{completedRat.data?.tokenUri}</a></p>
          </>}
        </div>
      </>}
    </>
  )
}
