import { ethers } from "hardhat";
import {BigNumber, ContractReceipt, ContractTransaction} from 'ethers';
import { CONTRACT_ADDRESS } from "~/config/env";

(async () => {
  const [_, user] = await ethers.getSigners();
  const Rat = await ethers.getContractFactory("Rat", user);
  const rat = Rat.attach(CONTRACT_ADDRESS ?? "");
  try {
    const wethAddr = await rat.weth()
    const weth = await ethers.getContractAt(["function balanceOf(address owner) view returns (uint256)", "function transferFrom(address sender, address recipient, uint256 amount) external returns (bool)", "function allowance(address owner, address spender) external view returns (uint256)", "function approve(address spender, uint256 tokens) public returns (bool success)", "function name() public view returns (string memory)"], wethAddr, user)
    const cost = await rat.cost()
    console.log((await user.getBalance()).toString())
    const approve: ContractReceipt = await weth.approve(rat.address, cost).then((t: ContractTransaction) => t.wait())
    console.log(approve.transactionHash);
    const allowance: BigNumber = await weth.allowance(user.address, rat.address);
    console.log(allowance.toString());
    const tx = await rat.createToken().then((r) => r.wait());
    console.log(tx.transactionHash)
    const tokenMintedId = tx.events?.find((e) => e.event === "TokenMinted")?.args?.["tokenId"];
    if (tokenMintedId) {
      const tokenId = ethers.BigNumber.from(tokenMintedId);
      console.log(tokenId);
    }
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
