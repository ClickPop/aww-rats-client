import {ethers} from 'hardhat'
import { CONTRACT_URI, WETH_CONTRACT_ADDRESS } from '~/config/env';

(async () => {
  const [owner] = await ethers.getSigners();
  const Rat = await ethers.getContractFactory("Rat", owner);
  const rat = await Rat.deploy(CONTRACT_URI, WETH_CONTRACT_ADDRESS, 0, 1000).then(r => r.deployed());
  console.log(rat.address);
})().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});