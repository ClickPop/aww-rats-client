import React, { FC, useState } from 'react'
import { BigNumber, ContractTransaction } from 'smart-contracts/node_modules/ethers/lib';
import { useEthers } from '~/hooks/useEthers';
import { GeneratorResponse, LOADING_STATE, Rat } from '~/types';

type Props = {
  weiCost: BigNumber;
  ethCost: number;
  contract: Rat | null
}

export const Minter: FC<Props> = ({weiCost, ethCost, contract}) => {
  const [loading, setLoading] = useState<LOADING_STATE>(null)
  const [mintTx, setMintTx] = useState("")
  const [completedRat, setCompletedRat] = useState<GeneratorResponse | null>(null)
  const { provider } = useEthers();
  const test = async () => {
    if (contract && provider) {
      try {
        setLoading("TOKEN");
        const tx = await contract.createToken({ value: weiCost }).then((t: ContractTransaction) => t.wait());
        setMintTx(tx.transactionHash)
        const tokenId = tx?.events?.[1].args?.["tokenId"].toString();
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

  if (loading === "TOKEN") {
    return (
      <h1>
        Minting token...
      </h1>
    )
  }

  if (loading === "GENERATOR") {
    return (
      <h1>
        Generating rat...
      </h1>
    )
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
        <h1>Cost: {ethCost}eth</h1>
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
