// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MORALIS_API_ENDPOINT, MORALIS_API_KEY } from '~/config/env';
import { MoralisTokensResponse } from '~/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { wallet, chain } = req.query;
    const URL = `${MORALIS_API_ENDPOINT}/${wallet}/nft?chain=${chain}&format=decimal`;
    const tokens: MoralisTokensResponse = await fetch(URL, {
      headers: {
        'x-api-key': MORALIS_API_KEY ?? '',
      },
    }).then((r) => r.json());
    const tokensWithMeta = tokens.result
      .map((token) => {
        if (token.metadata) {
          const meta = JSON.parse(token.metadata);
          return meta;
        }
        return false;
      })
      .filter((token) => typeof token?.image === 'string');
    res.status(200).json({ status: 'success', data: tokensWithMeta });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
