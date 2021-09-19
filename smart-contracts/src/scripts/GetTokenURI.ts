import { ethers } from "hardhat";
import { CONTRACT_ADDRESS } from "~/config/env";

(async () => {
  try {
    const [_, user] = await ethers.getSigners();
    const Rat = await ethers.getContractFactory("Rat", user);
    const rat = Rat.attach(CONTRACT_ADDRESS ?? "");
    const tx = await rat.tokenURI(11);
    console.log(tx)
  } catch (err) {
    console.error(err);
  }
  console.log("token minted");
})()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
