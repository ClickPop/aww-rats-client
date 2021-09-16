import {ethers} from 'hardhat'
import { CONTRACT_ADDRESS } from '~/config/env';

(async () => {
  const [owner] = await ethers.getSigners();
  const Rat = await ethers.getContractFactory("Rat", owner);
  const rat = Rat.attach(CONTRACT_ADDRESS ?? "");
  const tx = await rat.withdraw().then(t => t.wait());
  console.log(tx.transactionHash)
})().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});