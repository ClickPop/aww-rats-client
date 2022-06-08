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
import 'hardhat-contract-sizer';

import { promises, readFileSync, createReadStream } from 'fs';
const { readFile, writeFile } = promises;
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
  IPFS_API_KEY,
  IPFS_API_SECRET,
} from './src/config/env';
import FormData from 'form-data';
import { ContractFactory } from '@ethersproject/contracts';
import { parseEther } from '@ethersproject/units';
import axios from 'axios';
import { cursorTo } from 'readline';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import path from 'path';
import { Closet } from './src/types';
import inquirer from 'inquirer';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { createHash } from 'crypto';

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
        await closet.addNewTokenTypes(tokens).then((t) => t.wait());
      }
      clearInterval(interval);
      console.log();
      console.log(`Deployed closet! Closet address: ${closet.address}`);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
    }
  });

task('upgrade-closet', 'Upgrade closet contract').setAction(async (_, hre) => {
  const interval = ratLoader('Deploying Closet Contract');
  try {
    const [signer] = await hre.ethers.getSigners();
    const Closet = await hre.ethers.getContractFactory('Closet', signer);
    if (!CLOSET_ADDRESS) {
      throw new Error('CLOSET_ADDRESS env var not set');
    }
    const oldCloset = Closet.attach(CLOSET_ADDRESS);
    console.log(oldCloset.address);
    const closet = (await hre.upgrades
      .upgradeProxy(oldCloset, Closet)
      .then((c) => c.deployed())) as Closet;
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

task('migrate-rat', 'Migrate a rat from old contract to new one')
  .addPositionalParam('metadataPath', 'Relative path to the metadata file')
  .addPositionalParam('imagePath', 'Relative path to the image to upload')
  .addPositionalParam('birthday', "The rat's birthday", '', types.string)
  .setAction(async ({ metadataPath, imagePath, birthday }, hre) => {
    try {
      const interval = ratLoader('Migrating rat to new contract');
      const [signer] = await hre.ethers.getSigners();
      const Rat = await hre.ethers.getContractFactory('Rat', signer);
      const Weth = await hre.ethers.getContractFactory('ERC20', signer);
      const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
      const weth = Weth.attach(WETH_CONTRACT_ADDRESS ?? '');
      await weth.approve(rat.address, await rat.cost());
      const img = readFileSync(imagePath);
      const hash = createHash('md5').update(img).digest('hex');
      const image = createReadStream(imagePath);
      const imageForm = new FormData();
      imageForm.append('file', image);
      imageForm.append(
        'pinataMetadata',
        JSON.stringify({ name: `${hash}.png` }),
      );
      const headers = {
        pinata_api_key: IPFS_API_KEY,
        pinata_secret_api_key: IPFS_API_SECRET,
      };
      const imageRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        imageForm,
        {
          maxBodyLength: Infinity,
          headers: {
            ...headers,
            'Content-Type': `multipart/form-data; boundary=${imageForm.getBoundary()}`,
          },
        },
      );
      console.log(' Image IPFS data', imageRes.data);
      const metaBuffer = readFileSync(metadataPath);
      const meta = JSON.parse(metaBuffer.toString());
      // @ts-ignore
      meta.image = `ipfs://${imageRes.data.IpfsHash}`;
      if (birthday) {
        const birthdayUnix = Math.round(new Date(birthday).getTime() / 1000);
        meta.attributes.push({
          trait_type: 'birthday',
          display_type: 'date',
          value: birthdayUnix,
        });
      }
      const body = {
        pinataContent: meta,
        pinataMetadata: {
          name: `${hash}.json`,
        },
      };
      const metaRes = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        body,
        {
          maxBodyLength: Infinity,
          headers: {
            ...headers,
            'Content-Type': `application/json`,
          },
        },
      );
      console.log(' Metadata IPFS data', metaRes.data);
      const ratTx = await rat.createToken().then((t) => t.wait());
      const tokenId = ratTx.events?.find((e) => e.args?.['tokenId'])?.args?.[
        'tokenId'
      ] as BigNumber;
      console.log(' Token minted. Token Id:', tokenId.toString());
      if (tokenId) {
        const uriTx = await rat
          .storeAsset(
            tokenId,
            // @ts-ignore
            `ipfs://${metaRes.data.IpfsHash}`,
          )
          .then((t) => t.wait());
        if (uriTx) {
          console.log(' New token URI', await rat.tokenURI(tokenId));
        }
      }
      clearInterval(interval);
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

task('add-closet-items', 'Add new closet token')
  .addOptionalParam('numTokens', 'Number of tokens to generate', 0, types.int)
  .addOptionalParam(
    'tokensFile',
    'Path to local JSON file with an array of Token Objects',
  )
  .addFlag('includeMeta', 'Generate meta files')
  .addFlag('onlyMeta', 'Only generate meta files')
  .setAction(async ({ numTokens, tokensFile, includeMeta, onlyMeta }, hre) => {
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
        console.log('Reading json file');
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
      let tokenIds:
        | ({
            [x: string]: string;
          } | null)[]
        | undefined;
      if (!onlyMeta) {
        console.log('Sending tokens to contract');
        const tx = await closet
          .addNewTokenTypes(
            tokens.map((token) => ({
              ...token,
              cost: BigNumber.isBigNumber(token.cost)
                ? token.cost
                : hre.ethers.utils.parseEther(token.cost as string),
            })),
          )
          .then((r) => r.wait());
        tokenIds = tx.events
          ?.map((e) =>
            e.event === 'TokenTypeAdded' && e.args?.tokenId && e.args?.token
              ? {
                  [e.args.token.name as string]:
                    e.args.tokenId.toString() as string,
                }
              : null,
          )
          .filter((id) => id !== null);
        console.log(
          `Added new closet token! TX hash: ${
            tx.transactionHash
          }. Token ID's: ${JSON.stringify(tokenIds)}`,
        );
      }
      if (tokenIds && (includeMeta || onlyMeta)) {
        console.log('Generating meta files');
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
              console.log(
                `Writing file to ${path.join(
                  __dirname,
                  '..',
                  'public',
                  'closet',
                  hre.network.name === 'polygon' ? 'tokens' : 'test-tokens',
                  `${v}.json`,
                )}`,
              );
              await writeFile(
                path.join(
                  __dirname,
                  '..',
                  'public',
                  'closet',
                  hre.network.name === 'polygon' ? 'tokens' : 'test-tokens',
                  `${v}.json`,
                ),
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
              const meta = tokenMeta.find((m) => m.name === k);
              if (meta) {
                const filepath = path.join(
                  __dirname,
                  '../../apps/awwrats',
                  'public',
                  'closet',
                  hre.network.name === 'polygon' ? 'tokens' : 'test-tokens',
                  `${v}.json`,
                );
                console.log(`Writing file to ${filepath}`);
                await writeFile(filepath, JSON.stringify(meta));
              }
            }
          }
        }
      }
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

task('set-token-uri', '')
  .addPositionalParam('id', '')
  .addPositionalParam('uri', '')
  .setAction(async ({ id, uri }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Rat = await hre.ethers.getContractFactory('Rat', signer);
    const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
    const tx = await rat.storeAsset(id, uri);
    console.log(tx.hash);
  });

task(
  'closet-public-call',
  'Call a public method on the closet contract',
).setAction(async (_, hre) => {
  const [signer] = await hre.ethers.getSigners();
  const Closet = await hre.ethers.getContractFactory('Closet', signer);
  const closet = Closet.attach(CLOSET_ADDRESS ?? '');
  const { methods }: { methods: string[] } = await inquirer.prompt([
    {
      name: 'methods',
      type: 'checkbox',
      choices: [
        'getAllTokenIds',
        'getAllTokens',
        'getActiveTokens',
        'getTokensByWallet',
        'getTokenById',
      ],
      message: 'Please select the methods to run:',
    },
  ]);
  for (const method of methods) {
    switch (method) {
      case 'getAllTokenIds':
        const ids = await closet.getAllTokenIds();
        console.log(
          `${method}:`,
          ids.map((id) => id.toString()),
        );
        break;
      case 'loadCloset':
        const { limit, offset }: { limit: number; offset: number } =
          await inquirer.prompt([
            {
              name: 'limit',
              type: 'number',
              message: 'Please enter the number of tokens to return:',
            },
            {
              name: 'offset',
              type: 'number',
              message: 'Please enter the number of tokens to skip:',
            },
          ]);
        const tokens = await closet.loadCloset(limit, offset);
        console.log(
          `${method}:`,
          tokens.map(({ id, supply, amount, token }) => ({
            id: id.toString(),
            supply: supply.toString(),
            amount: amount.toString(),
            token: formatToken(token, hre),
          })),
        );
        break;
      case 'getTokenById':
        const { id }: { id: string } = await inquirer.prompt([
          {
            name: 'id',
            message: 'What is the id you want to check?',
          },
        ]);
        const token = await closet.getTokenById(id);
        console.log(`${method}:`, formatToken(token, hre));
        break;
      default:
        break;
    }
  }
});

task('closet-update-token-uri', 'Update the closet token URI')
  .addOptionalPositionalParam(
    'newUri',
    'New Token URI (Must include {id} to substitute the token id)',
  )
  .setAction(async ({ newUri }, hre) => {
    if (newUri && !newUri.includes('{id}')) {
      throw new Error('New URI must include {id} to be used for substitution');
    }
    const [signer] = await hre.ethers.getSigners();
    const Closet = await hre.ethers.getContractFactory('Closet', signer);
    const closet = Closet.attach(CLOSET_ADDRESS ?? '');
    let answer: { uri: string } = { uri: '' };
    if (!newUri) {
      answer = await inquirer.prompt([
        {
          name: 'uri',
          message: 'What is the new URI?',
          validate: (input: string) =>
            input.includes('{id}') ||
            'New URI must include {id} to be used for substitution',
        },
      ]);
    }

    if (!answer.uri && !newUri) {
      throw new Error(
        'Must either supply the newUri cli arg or fill in the prompt',
      );
    }

    const tx = await closet.setUri(newUri || answer.uri);
    console.log(`Tx hash: ${tx.hash}`);
  });

task('change-closet-token', 'Change a closet token')
  .addPositionalParam('tokenId', 'The token ID to change')
  .setAction(async ({ tokenId }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Closet = await hre.ethers.getContractFactory('Closet', signer);
    const closet = Closet.attach(CLOSET_ADDRESS ?? '');
    const token = await closet.getTokenById(tokenId);
    const newToken = await inquirer.prompt([
      {
        name: 'name',
        message: 'What is the token name?',
        default: token.name,
      },
      {
        name: 'cost',
        message: 'What is the token cost in eth?',
        validate: (input: BigNumber) => BigNumber.isBigNumber(input),
        filter: (input: string) => hre.ethers.utils.parseEther(input),
        default: hre.ethers.utils.formatEther(token.cost.toString()),
      },
      {
        name: 'maxTokens',
        message: 'What is the max tokens?',
        default: token.maxTokens.toString(),
      },
      {
        name: 'maxPerWallet',
        message: 'What is the maxPerWallet?',
        default: token.maxPerWallet.toString(),
      },
      {
        name: 'active',
        message: 'Is this token active?',
        default: token.active,
        type: 'confirm',
      },
      {
        name: 'revShareAddress',
        message: 'What is the rev share address?',
        default: token.revShareAddress,
      },
      {
        name: 'revShareAmount',
        message: 'What is the rev share amount?',
        validate: (input: number[]) => {
          try {
            return !!(
              input.length == 2 && input.every((num) => typeof num === 'number')
            );
          } catch (error) {
            return false;
          }
        },
        filter: (input: string) =>
          input.split(',').map((num) => parseInt(num, 10)),
        default: token.revShareAmount.join(','),
      },
    ]);

    const tx = await closet.changeTokens([{ id: tokenId, token: newToken }]);
    console.log(`Tx hash: ${tx.hash}`);
  });
task(
  'change-closet-tokens-status',
  'Change the closet tokens status to either active or inactive',
)
  .addOptionalPositionalParam(
    'tokenIds',
    'A JSON array of token ids to change',
    [],
    types.json,
  )
  .addOptionalPositionalParam(
    'status',
    'The status to set for those tokens',
    false,
    types.boolean,
  )
  .setAction(async ({ tokenIds, status }, hre) => {
    const [signer] = await hre.ethers.getSigners();
    const Closet = await hre.ethers.getContractFactory('Closet', signer);
    const closet = Closet.attach(CLOSET_ADDRESS ?? '');
    if (!Array.isArray(tokenIds)) {
      throw new Error('tokenIds must be an array');
    }
    const tx = await closet.setTokensStatus(tokenIds, status);
    console.log(`Tx hash: ${tx.hash}`);
  });

task('closet-promo-mint', 'Mint and transfer tokens')
  .addPositionalParam(
    'tokenIds',
    'The tokens to mint, comma separated with no spaces',
  )
  .addPositionalParam(
    'amounts',
    'The amounts of each token, comma separated with no spaces (If you are using the same amount for all just provide one amount)',
  )
  .addOptionalPositionalParam(
    'wallets',
    'A comma separated list of wallets to transfer the tokens to after minting',
  )
  .addOptionalParam(
    'gasMultiple',
    'The amount to multiply the gas limit by to increase tx speed',
    1,
    types.int,
  )
  .addFlag('ratHolders', 'Promo mints for all Rat holders')
  .setAction(
    async (
      {
        wallets,
        tokenIds,
        amounts,
        ratHolders,
        gasMultiple,
      }: {
        wallets?: string;
        tokenIds: string;
        amounts: string;
        ratHolders?: boolean;
        gasMultiple: number;
      },
      hre,
    ) => {
      const ids = tokenIds.split(',');
      const amnts = amounts.split(',');
      if (gasMultiple < 1) {
        throw new Error('Gas multiple must be a positive integer');
      }
      console.log('Setting up env');
      const [signer] = await hre.ethers.getSigners();
      const Closet = await hre.ethers.getContractFactory('Closet', signer);
      const Weth = await hre.ethers.getContractFactory('ERC20', signer);
      const closet = Closet.attach(CLOSET_ADDRESS ?? '');
      const Rat = await hre.ethers.getContractFactory('Rat', signer);
      const rat = Rat.attach(CONTRACT_ADDRESS ?? '');
      const addresses = (
        ratHolders ? await rat.getTokenOwners() : wallets?.split(',')
      )?.filter((a) => a !== signer.address);
      if (!addresses) {
        throw new Error(
          'Must specify either a list of wallets or the --rat-holders flag',
        );
      }
      const weth = Weth.attach(await closet.erc20());
      console.log('Checking ERC20 allowance');
      const totalCost = (
        await Promise.all(ids.map((id) => closet.getTokenById(id)))
      )
        .map((token, i) => token.cost.mul(amnts.length > 1 ? amnts[i] ?? 0 : 1))
        .reduce((acc, curr) => acc.add(curr), BigNumber.from(0))
        .mul(ids.length)
        .mul(addresses.length);
      const allowance = await weth.allowance(signer.address, closet.address);
      if (allowance.lt(totalCost)) {
        await weth
          .increaseAllowance(closet.address, totalCost.sub(allowance))
          .then((t) => t.wait());
      }
      console.log('Handle minting');

      if (ids.length !== amnts.length && amnts.length !== 1) {
        throw new Error('Mismatched tokenIds and amounts length');
      }

      for (const wallet of addresses) {
        const mintable: { id: string; amount: string }[] = [];
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          const amount = amnts.length > 1 ? amnts[i] : amnts[0];
          const token = await closet.getTokenById(id);
          const bal = await closet.balanceOf(wallet, id);
          const total = await closet.totalSupply(id);
          const walletTotal = await closet.maxTokensPerWalletById(id, wallet);
          const balAfterMint = bal.add(amount);
          const totalAfterMint = total.add(
            amnts.length > 1 ? amnts[i] : amnts[0],
          );
          const maxTokensExceeded =
            !token.maxTokens.eq(0) && totalAfterMint.gt(token.maxTokens);
          const maxWalletExceeded =
            (!token.maxPerWallet.eq(0) &&
              balAfterMint.gt(token.maxPerWallet)) ||
            (!walletTotal.eq(0) && balAfterMint.gt(walletTotal));

          if (!maxTokensExceeded && !maxWalletExceeded) {
            mintable.push({ id, amount });
          } else {
            console.log(
              `TokenId: ${id} in not mintable for wallet ${wallet}. Reason(s): ${
                maxTokensExceeded ? 'Total supply would exceed max tokens' : ''
              } ${
                maxWalletExceeded
                  ? 'Token balance for this wallet would exceed maximum'
                  : ''
              }`,
            );
          }
        }

        if (mintable.length > 0) {
          const gasLimit = await closet.estimateGas.promoMint(
            mintable.map((m) => m.id),
            mintable.map((m) => m.amount),
            wallet,
          );
          const tx = await closet.promoMint(
            mintable.map((m) => m.id),
            mintable.map((m) => m.amount),
            wallet,
            {
              gasLimit: gasLimit.mul(gasMultiple),
            },
          );
          console.log(`Waiting on tx: ${tx.hash} for wallet: ${wallet}`);
          await tx.wait();
        } else {
          console.log('No items to mint');
        }
      }
    },
  );

const formatToken = (token: Token, hre: HardhatRuntimeEnvironment) => ({
  name: token.name,
  active: token.active,
  maxTokens: token.maxTokens.toString(),
  maxPerWallet: token.maxPerWallet.toString(),
  cost: hre.ethers.utils.formatEther(token.cost),
  revShareAddress: token.revShareAddress,
  revShareAmount: token.revShareAmount.map((a) => a.toString()),
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
        runs: 50,
      },
    },
  },
  networks: {
    hardhat: {
      initialBaseFeePerGas: 0, // workaround from https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136 . Remove when that issue is closed.
    },
    local: {
      url: 'http://127.0.0.1:8545/',
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
