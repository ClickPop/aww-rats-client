export const currentURL =
  process.env.VERCEL_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;
export const CHAIN_ID = 137;
export const ETH_CHAIN_ID = 1;
export const PROJECT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_ID;
export const API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_CLOUD_PROJECT_PUBSUB_API_KEY;

export const HASURA_BASE_URL = process.env.NEXT_PUBLIC_HASURA_BASE_URL ?? '';
export const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET ?? '';
export const SIGNER_MESSAGE = process.env.NEXT_PUBLIC_SIGNER_MESSAGE ?? '';

export const GCP_CLIENT_EMAIL = process.env.GCP_CLIENT_EMAIL ?? '';
export const GCP_PRIVATE_KEY = process.env.GCP_PRIVATE_KEY ?? '';

export const FEEDER_ID = process.env.NEXT_PUBLIC_FEEDER_ID ?? '';
