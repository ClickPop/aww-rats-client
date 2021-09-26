export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "", 10) ?? 80001;
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
export const PROJECT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID;
export const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_PUBSUB_API_KEY;
export const GENERATOR_URL = process.env.GENERATOR_URL;