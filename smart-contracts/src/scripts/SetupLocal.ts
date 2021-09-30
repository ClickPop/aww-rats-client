import { ethers } from "hardhat";

(async () => {
  const [admin, ...rest] = await ethers.getSigners();
  const erc20 = await ethers.getContractFactory("MockERC20", admin);
  const contract = await erc20.deploy().then(c => c.deployed());
  console.log('ERC-20 Deployed at', contract.address);
  for (const user of rest) {
    await contract.transfer(user.address, ethers.utils.parseEther("10")).then(t => t.wait());
    console.log("10 tokens transferred to address", user.address);
  }
  const rat = await ethers.getContractFactory("Rat", admin);
  const ratContract = await rat.deploy("test", "", contract.address, 0, 1000, "AwwRat", "RAT").then(c => c.deployed());
  console.log("RAT deployed at", ratContract.address);
})();