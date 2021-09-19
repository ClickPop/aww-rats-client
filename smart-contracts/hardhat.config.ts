// Required imports for hardhat to run
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "tsconfig-paths/register";
import "hardhat-watcher";

import { HardhatUserConfig, task, types } from "hardhat/config";
import {
  MUMBAI_TESTNET,
  MUMBAI_TESTNET_CHAIN_ID,
  PRIVATE_KEY_ADMIN,
  PRIVATE_KEY_USER,
  CONTRACT_ADDRESS,
  CONTRACT_URI,
  WETH_CONTRACT_ADDRESS
} from "./src/config/env";
import { ContractFactory } from "@ethersproject/contracts";

task("deploy", "Deploy contract to the blockchain").addPositionalParam("contractName", "Contract to deploy (This is case sensitive, use the same name of the contract)", "", types.string).addOptionalParam("contractUri", "The URI to the base contract metadata used by Opensea").addOptionalParam("tokenAddress", "Address of the ERC-20 contract we are using for accepting payments").setAction(async ({contractUri, tokenAddress, contractName}, {ethers}) => {
  const [owner] = await ethers.getSigners();
  const Rat = await ethers.getContractFactory(contractName, owner) as ContractFactory;
  const rat = await Rat.deploy(contractUri ?? CONTRACT_URI, tokenAddress ?? WETH_CONTRACT_ADDRESS, 0, 1000).then(r => r.deployed());
  console.log(rat.address);
})

task("update-contract-uri", "Update the contract metadata uri for our collection on OpenSea").addPositionalParam("uri", "The new metadata URI that will be set on the smart-contract").setAction(async ({uri}, hre) => {
  try {
    const [signer] = await hre.ethers.getSigners();
    const Rat = await hre.ethers.getContractFactory("Rat", signer)
    const rat = Rat.attach(CONTRACT_ADDRESS ?? "")
    const tx = await rat.setContractURI(uri).then(t => t.wait());
    console.log("Transaction Hash:", tx.transactionHash);
  } catch (err) {
    console.error(err)
  }
})

task("update-weth-address", "Update the address for our ERC-20 conversion").addPositionalParam("address", "The address of the ERC-20 token to use for accepting payment").setAction(async ({address}, hre) => {
  try {
    const [signer] = await hre.ethers.getSigners();
    const Rat = await hre.ethers.getContractFactory("Rat", signer)
    const rat = Rat.attach(CONTRACT_ADDRESS ?? "")
    const tx = await rat.setWethAddr(address).then(t => t.wait());
    console.log("Transaction Hash:", tx.transactionHash);
  } catch (err) {
    console.error(err)
  }
})

task("update-cost", "Update the cost of minting a token in ether").addPositionalParam("cost", "The new cost in eth", 0.025, types.float).setAction(async ({cost}, hre) => {
  try {
    const [signer] = await hre.ethers.getSigners();
    const Rat = await hre.ethers.getContractFactory("Rat", signer)
    const rat = Rat.attach(CONTRACT_ADDRESS ?? "")
    const tx = await rat.setCost(hre.ethers.utils.parseEther(`${cost}`)).then(t => t.wait());
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
    settings: {
      optimizer: {
        enabled: true,
      }
    }
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
