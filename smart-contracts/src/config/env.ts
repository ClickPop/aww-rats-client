import { config } from "dotenv";
config();

export const PRIVATE_KEY_ADMIN = process.env.PRIVATE_KEY_ADMIN;
export const PRIVATE_KEY_USER = process.env.PRIVATE_KEY_USER;
export const TEST_PRIVATE_KEY_ADMIN = process.env.TEST_PRIVATE_KEY_ADMIN;
export const MUMBAI_TESTNET = "https://rpc-mumbai.maticvigil.com/";
export const MUMBAI_TESTNET_CHAIN_ID = 80001;
export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
export const CONTRACT_URI = process.env.CONTRACT_URI ?? ""
export const WETH_CONTRACT_ADDRESS = process.env.WETH_CONTRACT_ADDRESS ?? ""
