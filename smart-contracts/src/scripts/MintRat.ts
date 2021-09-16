import { ethers } from "hardhat";
import { RAT_COST, CONTRACT_ADDRESS } from "~/config/env";

(async () => {
  const [_, user] = await ethers.getSigners();
  const Rat = await ethers.getContractFactory("Rat", user);
  const rat = Rat.attach(CONTRACT_ADDRESS ?? "");
  try {
    const tx = await rat.createToken({ value: RAT_COST }).then((r) => r.wait());
    console.log(tx.transactionHash)
    const tokenMintedId = tx.events?.find((e) => e.event === "TokenMinted")?.args?.["tokenId"];
    if (tokenMintedId) {
      const tokenId = ethers.BigNumber.from(tokenMintedId);
      console.log(tokenId);
      const store = await rat.storeAsset(tokenId, "test").then(r => r.wait());
      console.log(store.gasUsed.toNumber())
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
