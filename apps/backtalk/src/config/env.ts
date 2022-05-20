export const currentURL =
  process.env.VERCEL_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
export const CHAIN_ID = 137;
export const ETH_CHAIN_ID = 1;
export const HASURA_BASE_URL = process.env.NEXT_PUBLIC_HASURA_BASE_URL ?? '';
export const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET ?? '';
export const SIGNER_MESSAGE = process.env.NEXT_PUBLIC_SIGNER_MESSAGE ?? '';
export const FEEDER_ID = process.env.NEXT_PUBLIC_FEEDER_ID ?? '';
export const HASH_IDS_SALT = process.env.NEXT_HASH_IDS_SALT ?? 'test';
