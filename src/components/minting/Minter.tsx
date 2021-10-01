import React, { useEffect, useState } from 'react'
import { useEthers } from '~/hooks/useEthers';
import { ethers, BigNumber, ContractTransaction, ContractReceipt } from "ethers";
import { GeneratorResponse, LOADING_STATE, Metadata, Rat } from '~/types';
import { CHAIN_ID, CONTRACT_ADDRESS } from '~/config/env';
import { Image } from '~/components/shared/Image'
import { format } from 'date-fns';
import loader from '~/assets/images/loader-cheese.gif'
import RatABI from "smart-contracts/artifacts/src/contracts/Rat.sol/Rat.json";

export const Minter = () => {
  const { provider, signer, network, connected, account } = useEthers();
  const [ethCost, setEthCost] = useState(0);
  const [contract, setContract] = useState<Rat | null>(null);
  const [loading, setLoading] = useState<LOADING_STATE>(null)
  const [mintTx, setMintTx] = useState("")
  const [completedRat, setCompletedRat] = useState<GeneratorResponse | null>(null)
  const [imageURL, setImageURL] = useState('');
  const [tokenMetadata, setTokenMetadata] = useState<Metadata | null>(null);

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
        setLoading("METADATA")
        const metaHash = rat.data?.tokenUri.split("//")[1];
        if (metaHash) {
          const meta: Metadata = await fetch(`https://ipfs.io/ipfs/${metaHash}`).then(res => res.json());
          setTokenMetadata(meta);
          const imageHash = meta.image.split("//")[1];
          if (imageHash) {
            const imageURL = `https://ipfs.io/ipfs/${imageHash}`;
            fetch(imageURL).then(res => res.blob()).then(data => {
              const url = URL.createObjectURL(data);
              setImageURL(url);
            }).catch(err => {
              console.error(err);
              setImageURL('/rat-egg.png');
            });
          }
        }
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
            You&apos;ll need to confirm a transaction that gives our smart contract permission to transfer {ethCost} from your wallet.
          </p>
        </>
      }
      {loading === "TOKEN" && 
        <>
          <p className="px-4 py-2">
            Minting Token...
          </p>
          <p className="bg-light text-gray-700 rounded-md mt-4 p-3">
            Now you confirm your actual rat mint. Once the mint is successful, we&apos;ll charge you {ethCost} for you rat.
          </p>
        </>
      }
      {loading === "GENERATOR" && 
        <p className="px-4 py-2">
          Generating Rat...
        </p>
      }

      {loading === "METADATA" && 
        <p className="px-4 py-2">
          Retreiving Metadata...
        </p>
      }
      {!loading && <>
        <div>
          <button className="rounded-md bg-light hover:bg-yellow-200 duration-300 text-gray-700 font-bold" onClick={test}><span className="px-4 py-3 inline-block border-r-2 border-black">Mint a Rat</span> <span className="px-4 py-3 pl-2 inline-block">{ethCost}weth</span></button>
          <p className="mt-4 max-w-md mx-auto">You&apos;re going to need a very small amount of matic for your transactions. You can get some from <a href="https://matic.supply/" target="_blank" rel="noreferrer">a faucet</a> or ask in our discord.</p>
        </div>
        <div className="mt-8">
          {tokenMetadata && <div className="rounded-md max-w-sm mx-auto bg-white p-4 text-gray-800 text-left">
            <h2 className="text-2xl font-semibold mb-4 mt-2">Your new friend {tokenMetadata.name} was just born!</h2>
            {completedRat && <>
              <p className="mb-2"><a href={`https://testnets.opensea.io/assets/mumbai/${CONTRACT_ADDRESS}/${completedRat.data?.tokenId}`} target="_blank" className="underline" rel="noreferrer">View your new rat on OpenSea</a></p>
            </>}

            {mintTx && completedRat && <p className="mb-4"><a href={`https://mumbai.polygonscan.com/tx/${mintTx}`} target="_blank" rel="noopener noreferrer" className="underline">View transaction on polygonscan</a></p>}
            {imageURL && <Image src={imageURL} alt="Your newborn rat" width={352} height={352} className="rounded-full overflow-hidden" />}

            <p className="mb-8">{tokenMetadata.description}</p>
            
            <p className="font-semibold">Rattributes and Stats</p>
            {tokenMetadata.attributes.map(attr => (
              <div className="mt-4 bg-blue-100 border border-solid border-blue-400 rounded-md px-2 py-1" key={attr.trait_type ?? attr.value}>
                {attr.display_type === 'date' ? (<><p>{attr.trait_type}</p>
                <p>{format(new Date(attr.value as number * 1000), "MMM dd yyyy")}</p></>) : (<><p className="font-semibold">{attr.trait_type}</p>
                <p>{attr.value}</p></>)}
              </div>
            ))}  
          </div>}
        </div>
      </>}
    </>
  )
}
