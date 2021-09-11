// Required imports for hardhat to run
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "tsconfig-paths/register";
import "hardhat-watcher";

import { HardhatUserConfig } from "hardhat/config";
import {
  MUMBAI_TESTNET,
  MUMBAI_TESTNET_CHAIN_ID,
  PRIVATE_KEY_ADMIN,
  PRIVATE_KEY_USER,
} from "./src/config/env";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: true,
    },
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
