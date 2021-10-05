import axios from "axios";
import { ethers } from "hardhat";
import { CONTRACT_ADDRESS } from "~/config/env";

const handleUnhatchedRats = async () => {
  const [admin] = await ethers.getSigners();
  const rat = await ethers.getContractFactory("Rat", admin);
  const ratContract = rat.attach(CONTRACT_ADDRESS ?? "")
  const numTokens = await ratContract.numTokens();
  const tokens = new Array(numTokens.toNumber()).fill(null).map((_, i) => i + 100);
  for (const token of tokens) {
    try {
      const uri = await ratContract.tokenURI(token);
      if (uri === 'https://www.awwrats.com/default-erc721-token-metadata.json') {
        const res = await axios.post("https://awwrats.com/api/generate-rat", {
          "tokenId": `${token}`
        });
        // @ts-ignore
        await ratContract.storeAsset(token, res.data.tokenUri).then(t => t.wait());
      }
    } catch (err) {
      console.error(err);
    }
  }
}

handleUnhatchedRats();