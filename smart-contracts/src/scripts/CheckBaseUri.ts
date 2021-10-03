import { ethers } from "hardhat";
import { CONTRACT_ADDRESS } from "~/config/env";

(async () => {
  const [admin] = await ethers.getSigners();
  const rat = await ethers.getContractFactory("Rat", admin);
  const ratContract = rat.attach(CONTRACT_ADDRESS ?? "")
  console.log(await ratContract.tokenURI(0));
})();