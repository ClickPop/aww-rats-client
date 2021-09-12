import {ethers} from 'hardhat'
import { RAT_COST } from '~/config/env';

(async () => {
  const [owner] = await ethers.getSigners();
  const Rat = await ethers.getContractFactory("Rat", owner);
  const rat = await Rat.deploy(RAT_COST).then(r => r.deployed());
  console.log(rat.address);
})().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});