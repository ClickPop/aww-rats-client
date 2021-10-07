// Required imports for hardhat to run
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'tsconfig-paths/register';
import 'hardhat-watcher';

import { HardhatUserConfig, task, types } from 'hardhat/config';
import {
  MUMBAI_TESTNET,
  MUMBAI_TESTNET_CHAIN_ID,
  PRIVATE_KEY,
  CONTRACT_ADDRESS,
  CONTRACT_URI,
  WETH_CONTRACT_ADDRESS,
  ETHERSCAN_API_KEY,
  DEFAULT_TOKEN_URI,
} from './src/config/env';
import { ContractFactory } from '@ethersproject/contracts';
import { parseEther } from '@ethersproject/units';
import axios from 'axios';
import { cursorTo } from 'readline';

const ratLoader = (msg: string, interval?: number) => {
  process.stdout.write(`🐀            ${msg}`);
  let i = 0;
  setInterval(() => {
    let newChar = '';
    switch (i % 4) {
      case 0:
        newChar = '🐀 🐀         ';
        break;
      case 1:
        newChar = '🐀 🐀 🐀      ';
        break;
      case 2:
        newChar = '🐀 🐀 🐀 🐀   ';
        break;
      case 3:
        newChar = '🐀           ';
        break;
    }
    cursorTo(process.stdout, 0);
    process.stdout.write(newChar);
    cursorTo(process.stdout, process.stdout.columns);
    i++;
  }, interval ?? 250);
};

task('deploy', 'Deploy contract to the blockchain')
  .addPositionalParam(
    'contractName',
    'Contract to deploy (This is case sensitive, use the same name of the contract)',
    'Rat',
    types.string,
  )
  .addPositionalParam(
    'name',
    'Name to pass to the contract constructor',
    'AwwRat',
    types.string,
  )
  .addPositionalParam(
    'symbol',
    'Symbol to pass to the contract constructor',
    'RAT',
    types.string,
  )
  .addPositionalParam(
    'baseId',
    'Base Id to pass to the contract constructor',
    100,
    types.int,
  )
  .addPositionalParam(
    'maxTokens',
    'Max Token Count to pass to the contract constructor',
    99,
    types.int,
  )
  .addOptionalParam(
    'contractUri',
    'The URI to the base contract metadata used by Opensea',
  )
  .addOptionalParam(
    'tokenAddress',
    'Address of the ERC-20 contract we are using for accepting payments',
  )
  .addOptionalParam(
    'defaultTokenUri',
    'Default Token URI for tokens to use before the actual token URI is set',
  )
  .addOptionalParam('cost', 'Cost to mint a token', 0, types.float)
  .setAction(
    async (
      {
        contractUri,
        tokenAddress,
        defaultTokenUri,
        contractName,
        name,
        symbol,
        baseId,
        maxTokens,
        cost,
      },
      { ethers },
    ) => {
      try {
        if (!(tokenAddress ?? WETH_CONTRACT_ADDRESS)) {
          throw new Error(
            'Either supply an ERC20 token address, or set the WETH_CONTRACT_ADDRESS value in your env',
          );
        }
        const [owner] = await ethers.getSigners();
        const Rat = (await ethers.getContractFactory(
          contractName,
          owner,
        )) as ContractFactory;
        const rat = await Rat.deploy(
          contractUri ?? CONTRACT_URI,
          defaultTokenUri ?? DEFAULT_TOKEN_URI,
          tokenAddress ?? WETH_CONTRACT_ADDRESS,
          baseId,
          maxTokens,
          1,
          parseEther(`${cost}`),
          name,
          symbol,
        ).then((r) => r.deployed());
        console.log(rat.address);
      } catch (err) {
        console.error(err);
      }
    },
  );

task(
  'update-contract-uri',
  'Update the contract metadata uri for our collection on OpenSea',
)
  .addPositionalParam(
    'uri',
    'The new metadata URI that will be set on the smart-contract',
  )
  .setAction(async ({ uri }, hre) => {
    try {
      const [signer] = await hre.ethers.getSigners();
      const Rat = await hre.ethers.getContractFactory('Rat', signer);
      const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
      const tx = await rat.setContractURI(uri).then((t) => t.wait());
      console.log('Transaction Hash:', tx.transactionHash);
    } catch (err) {
      console.error(err);
    }
  });

task(
  'update-erc20-address',
  'Update the address for the ERC-20 contract we use for payments',
)
  .addPositionalParam(
    'address',
    'The address of the ERC-20 token to use for accepting payment',
  )
  .setAction(async ({ address }, hre) => {
    try {
      const [signer] = await hre.ethers.getSigners();
      const Rat = await hre.ethers.getContractFactory('Rat', signer);
      const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
      const tx = await rat.setERC20Address(address).then((t) => t.wait());
      console.log('Transaction Hash:', tx.transactionHash);
    } catch (err) {
      console.error(err);
    }
  });

task('update-cost', 'Update the cost of minting a token in ether')
  .addPositionalParam('cost', 'The new cost in eth', 0.025, types.float)
  .setAction(async ({ cost }, hre) => {
    try {
      const [signer] = await hre.ethers.getSigners();
      const Rat = await hre.ethers.getContractFactory('Rat', signer);
      const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
      const tx = await rat
        .setCost(hre.ethers.utils.parseEther(`${cost}`))
        .then((t) => t.wait());
      console.log('Transaction Hash:', tx.transactionHash);
    } catch (err) {
      console.error(err);
    }
  });

task('regenerate-rat', "Regenerate a Rat that doesn't have metadata")
  .addPositionalParam('id', 'Token ID to update', 0, types.int)
  .setAction(async ({ id }, hre) => {
    try {
      ratLoader('Regenerating rat');
      const [signer] = await hre.ethers.getSigners();
      const Rat = await hre.ethers.getContractFactory('Rat', signer);
      const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
      const uri = await rat.tokenURI(id);
      if (
        uri !== 'https://www.awwrats.com/default-erc721-token-metadata.json'
      ) {
        throw new Error('Token already has metadata');
      }
      const res = await axios.post('https://awwrats.com/api/generate-rat', {
        tokenId: `${id}`,
      });
      console.log('Token stored', {
        id,
        // @ts-ignore
        txHash: res.data.data.txHash,
        // @ts-ignore
        tokenUri: res.data.data.tokenUri,
      });
    } catch (err) {
      console.error(err);
    }
  });

task(
  'list-limbo-rats',
  "Lists all rats that don't have an IPFS uri set for the token",
).setAction(async (_, hre) => {
  try {
    ratLoader('Loading stuck rats from contract (This can take a while)');
    const [signer] = await hre.ethers.getSigners();
    const Rat = await hre.ethers.getContractFactory('Rat', signer);
    const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
    const numTokens = await rat.numTokens();
    const tokenIds = new Array(numTokens.toNumber())
      .fill(0)
      .map((_, i) => i + 100);
    const stuckIds: string[] = [];
    for (const id of tokenIds) {
      const uri = await rat.tokenURI(id);
      if (
        uri === 'https://www.awwrats.com/default-erc721-token-metadata.json'
      ) {
        stuckIds.push(id.toString());
      }
    }
    console.log(stuckIds);
  } catch (err) {
    console.error(err);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
    polygonTest: {
      url: MUMBAI_TESTNET,
      chainId: MUMBAI_TESTNET_CHAIN_ID,
      accounts: [PRIVATE_KEY].filter((k) => k !== undefined) as string[],
    },
    polygon: {
      url: 'https://polygon-rpc.com/',
      chainId: 137,
      accounts: [PRIVATE_KEY].filter((k) => k !== undefined) as string[],
    },
  },
  paths: {
    sources: './src/contracts',
  },
  typechain: {
    outDir: './src/types/typechain',
  },
  watcher: {
    compilation: {
      tasks: ['compile'],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
