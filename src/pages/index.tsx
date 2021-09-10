import { ethers, ContractReceipt, ContractTransaction } from 'ethers';
import type { NextPage } from 'next'
import { CONTRACT_ADDRESS } from '../config/env';
import {provider, signer} from '../lib/ethers'
const Home: NextPage = () => {
  const abi = [
    "function name() view returns (string)",
    "function cost() view returns (uint256)",
    "function createToken() public payable returns (uint256)",
  ]
  const test = async () => {
    if (CONTRACT_ADDRESS) {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
      const cost = await contract.cost().then(data => ethers.BigNumber.from(data).toBigInt())
      signer.getBalance().then(data => console.log(ethers.BigNumber.from(data).toBigInt()))
      try {
        const tx: ContractReceipt = await contract.createToken({value: cost}).then((t: ContractTransaction) => t.wait());
        console.log(tx?.events?.[1].args);
      } catch (err) {
        console.error(err.message);
      }
    }
  };
  return (
    <div>
      <button onClick={test}>Click Me</button>
    </div>
  )
}

export default Home
