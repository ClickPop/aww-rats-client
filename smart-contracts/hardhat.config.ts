// Required imports for hardhat to run
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';
import 'tsconfig-paths/register';
import 'hardhat-watcher';
import '@openzeppelin/hardhat-upgrades';

import { readFile, writeFile } from 'fs/promises';
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
  CLOSET_ADDRESS,
} from './src/config/env';
import { ContractFactory } from '@ethersproject/contracts';
import { parseEther } from '@ethersproject/units';
import axios from 'axios';
import { cursorTo } from 'readline';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import path from 'path';
import { Closet } from '~/types';
import inquirer from 'inquirer';

const ratLoader = (msg: string, interval?: number) => {
  process.stdout.write(`🐀            ${msg}`);
  let i = 0;
  return setInterval(() => {
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

task('deploy-rat', 'Deploy contract to the blockchain')
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
          'Rat',
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

task('deploy-closet', 'Deploy closet contract')
  .addOptionalParam('tokensFile', 'Array of tokens to seed the contract with')
  .addOptionalParam(
    'tokenAddress',
    'Address of the ERC-20 contract we are using for accepting payments',
  )
  .setAction(async ({ tokenAddress, tokensFile }, hre) => {
    const interval = ratLoader('Deploying Closet Contract');
    try {
      const [signer] = await hre.ethers.getSigners();
      const Closet = await hre.ethers.getContractFactory('Closet', signer);
      const tokens = tokensFile
        ? JSON.parse((await readFile(path.join(tokensFile))).toString())
        : [];
      if (!(tokenAddress ?? WETH_CONTRACT_ADDRESS)) {
        throw new Error(
          'Either supply an ERC20 token address, or set the WETH_CONTRACT_ADDRESS value in your env',
        );
      }
      if (
        !Array.isArray(tokens) ||
        !tokens.every((token) => isClosetToken(token))
      ) {
        throw new Error('Supplied tokens are not valid');
      }
      const closet = (await hre.upgrades
        .deployProxy(Closet)
        .then((c) => c.deployed())) as Closet;
      await closet
        .changeERC20Contract(tokenAddress ?? WETH_CONTRACT_ADDRESS)
        .then((t) => t.wait());
      if (tokens.length) {
        await closet.batchAddNewTokenType(tokens).then((t) => t.wait());
      }
      clearInterval(interval);
      console.log();
      console.log(`Deployed closet! Closet address: ${closet.address}`);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
    }
  });

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
      const interval = ratLoader('Regenerating rat');
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
      clearInterval(interval);
      console.log();
      console.log('The rat is in! 🐀 \n', {
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
    const interval = ratLoader(
      'Loading stuck rats from contract (This can take a while)',
    );
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
    clearInterval(interval);
    console.log();
    console.log(
      stuckIds.length > 0
        ? stuckIds
        : 'All rats are hatched and cozied up in their corner of the sewer 🐀 ',
    );
  } catch (err) {
    console.error(err);
  }
});

task('add-closet-item', 'Add new closet token')
  .addOptionalParam('numTokens', 'Number of tokens to generate', 0, types.int)
  .addOptionalParam(
    'tokensFile',
    'Path to local JSON file with an array of Token Objects',
  )
  .setAction(async ({ numTokens, tokensFile }, hre) => {
    try {
      if (!(numTokens || tokensFile)) {
        throw new Error(
          'Please supply either a num-tokens or tokens-path array',
        );
      }
      const [signer] = await hre.ethers.getSigners();
      const Closet = await hre.ethers.getContractFactory('Closet', signer);
      const closet = Closet.attach(CLOSET_ADDRESS ?? '');
      let tokens: Token[] = [];
      let tokenMeta: any[] = [];
      if (numTokens) {
        for (let i = 0; i < numTokens; i++) {
          console.log(`Token #${i + 1}`);
          const token = await inquirer.prompt([
            {
              name: 'name',
              message: 'What is the token name?',
            },
            {
              name: 'cost',
              message: 'What is the token cost in eth?',
              validate: (input: BigNumber) => BigNumber.isBigNumber(input),
              filter: (input: string) => hre.ethers.utils.parseEther(input),
            },
            {
              name: 'maxTokens',
              message: 'What is the max tokens?',
              default: 0,
            },
            {
              name: 'maxPerWallet',
              message: 'What is the maxPerWallet?',
              default: 0,
            },
            {
              name: 'active',
              message: 'Is this token active?',
              default: false,
              type: 'confirm',
            },
            {
              name: 'revShareAddress',
              message: 'What is the rev share address?',
              default: signer.address,
            },
            {
              name: 'revShareAmount',
              message: 'What is the rev share amount?',
              validate: (input: number[]) => {
                try {
                  return !!(
                    input.length == 2 &&
                    input.every((num) => typeof num === 'number')
                  );
                } catch (error) {
                  return false;
                }
              },
              filter: (input: string) =>
                input.split(',').map((num) => parseInt(num, 10)),
              default: '1,1',
            },
          ]);
          tokens.push(token);
        }
      }

      if (tokensFile) {
        const file = JSON.parse(
          (await readFile(path.join(tokensFile))).toString(),
        );
        tokens = file.tokens;
        tokenMeta = file.meta;
        if (
          !Array.isArray(tokens) ||
          !tokens.length ||
          !tokens.every((token) => isClosetToken(token))
        ) {
          throw new Error('Supplied tokens are not valid');
        }
      }
      const tx = await closet
        .batchAddNewTokenType(
          tokens.map((token) => ({
            ...token,
            cost: BigNumber.isBigNumber(token.cost)
              ? token.cost
              : hre.ethers.utils.parseEther(token.cost as string),
          })),
        )
        .then((r) => r.wait());
      const tokenIds = tx.events
        ?.map((e) =>
          e.event === 'TokenTypeAdded' && e.args?.tokenId && e.args?.token
            ? {
                [e.args.token.name as string]:
                  e.args.tokenId.toString() as string,
              }
            : null,
        )
        .filter((id) => id !== null);

      if (tokenIds) {
        if (numTokens) {
          for (const token of tokenIds) {
            if (token) {
              const [[k, v]] = Object.entries(token);
              console.log(`Token ID: ${v}`);
              const meta = await inquirer.prompt([
                {
                  name: 'image',
                  message: 'What is the image filename',
                  filter: (input: string) =>
                    `https://awwrats.com/images/closet/${
                      input.includes('.png') ? input : input + '.png'
                    }`,
                },
                {
                  name: 'description',
                  message: 'Please enter a description',
                },
              ]);

              const attr = await inquirer.prompt([
                {
                  name: 'Piece Type',
                  message: 'What piece type is this?',
                },
                {
                  name: 'Collection',
                  message: 'What Collection is this?',
                },
              ]);

              let sponsored = await inquirer.prompt([
                {
                  name: 'isSponsored',
                  message: 'Is this piece sponsored?',
                  type: 'confirm',
                  default: false,
                },
              ]);

              if (sponsored.isSponsored) {
                sponsored = await inquirer.prompt([
                  {
                    name: 'Sponsor',
                    message: 'What is the sponsors name?',
                  },
                  {
                    name: 'Sponsor URL',
                    message: 'What is the sponsor url',
                  },
                ]);
              }

              await writeFile(
                path.join(__dirname, '..', 'public', `${v}.json`),
                JSON.stringify({
                  name: k,
                  ...meta,
                  attributes: [
                    ...Object.entries(attr).map(([key, val]) => ({
                      trait_type: key,
                      value: val,
                    })),
                    ...Object.entries(sponsored.Sponsor ? sponsored : {}).map(
                      ([key, val]) => ({ trait_type: key, value: val }),
                    ),
                  ],
                }),
              );
            }
          }
        }

        if (tokensFile) {
          for (const token of tokenIds) {
            if (token) {
              const [[k, v]] = Object.entries(token);
              const meta = tokenMeta.find((m) => m.name === 'k');
              if (meta) {
                await writeFile(
                  path.join(__dirname, '..', 'public', `${v}.json`),
                  JSON.stringify(meta),
                );
              }
            }
          }
        }
      }

      console.log(
        `Added new closet token! TX hash: ${
          tx.transactionHash
        }. Token ID's: ${JSON.stringify(tokenIds)}`,
      );
    } catch (err) {
      console.error(err);
    }
  });

task(
  'update-closet-erc20-address',
  'Update the address for the ERC-20 contract we use for payments',
)
  .addPositionalParam(
    'address',
    'The address of the ERC-20 token to use for accepting payment',
  )
  .setAction(async ({ address }, hre) => {
    try {
      const [signer] = await hre.ethers.getSigners();
      const Closet = await hre.ethers.getContractFactory('Closet', signer);
      const closet = Closet.attach(CLOSET_ADDRESS ?? '');
      const tx = await closet
        .changeERC20Contract(address)
        .then((t) => t.wait());
      console.log('Transaction Hash:', tx.transactionHash);
    } catch (err) {
      console.error(err);
    }
  });

type Token = {
  name: string;
  cost: BigNumberish;
  maxTokens: BigNumberish;
  maxPerWallet: BigNumberish;
  active: boolean;
  revShareAddress: string;
  revShareAmount: [BigNumberish, BigNumberish];
};

const isClosetToken = (token: any): token is Token =>
  (token instanceof Object &&
    typeof token.name == 'string' &&
    typeof token.cost === 'number') ||
  typeof token.cost === 'string' ||
  (BigNumber.isBigNumber(token.cost) && typeof token.maxTokens === 'number') ||
  typeof token.maxTokens === 'string' ||
  (BigNumber.isBigNumber(token.maxTokens) &&
    typeof token.maxPerWallet === 'number') ||
  typeof token.maxPerWallet === 'string' ||
  (BigNumber.isBigNumber(token.maxPerWallet) &&
    typeof token.active == 'boolean' &&
    typeof token.revShareAddress == 'string' &&
    Array.isArray(token.revShareAmount) &&
    token.revShareAmount.length == 2 &&
    typeof token.revShareAmount[0] === 'number') ||
  typeof token.revShareAmount[0] === 'string' ||
  (BigNumber.isBigNumber(token.revShareAmount[0]) &&
    typeof token.revShareAmount[1] === 'number') ||
  typeof token.revShareAmount[1] === 'string' ||
  BigNumber.isBigNumber(token.revShareAmount[1]);

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
        runs: 100,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
    mumbai: {
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
