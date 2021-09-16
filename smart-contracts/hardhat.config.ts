// Required imports for hardhat to run
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "tsconfig-paths/register";
import "hardhat-watcher";

import { HardhatUserConfig, task } from "hardhat/config";
import {
  MUMBAI_TESTNET,
  MUMBAI_TESTNET_CHAIN_ID,
  PRIVATE_KEY_ADMIN,
  PRIVATE_KEY_USER,
  CONTRACT_ADDRESS
} from "./src/config/env";

task("update-contract-uri", "Script to update the contract metadata uri for our collection on OpenSea").addPositionalParam("uri", "The new metadata URI that will be set on the smart-contract").setAction(async ({uri}, hre) => {
  try {
    const signer = await hre.ethers.getSigner(PRIVATE_KEY_ADMIN ?? "")
    const Rat = await hre.ethers.getContractFactory("Rat", signer)
    const rat = Rat.attach(CONTRACT_ADDRESS ?? "")
    const tx = await rat.setContractURI(uri).then(t => t.wait());
    console.log("Transaction Hash:", tx.transactionHash);
  } catch (err) {
    console.error(err)
  }
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
    local: {
      url: "http://localhost:7545",
      accounts: [PRIVATE_KEY_ADMIN, PRIVATE_KEY_USER].filter(
        (k) => k !== undefined
      ) as string[],
    },
    polygonTest: {
      url: MUMBAI_TESTNET,
      chainId: MUMBAI_TESTNET_CHAIN_ID,
      accounts: [PRIVATE_KEY_ADMIN, PRIVATE_KEY_USER].filter(
        (k) => k !== undefined
      ) as string[],
    },
  },
  paths: {
    sources: "./src/contracts",
  },
  typechain: {
    outDir: "./src/types/typechain",
  },
  watcher: {
    compilation: {
      tasks: ['compile']
    }
  }
};

export default config;
