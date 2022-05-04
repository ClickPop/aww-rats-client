import type { NextApiRequest, NextApiResponse } from 'next';
import {
  MORALIS_API_ENDPOINT,
  MORALIS_API_KEY,
  CONTRACT_ADDRESS,
} from '~/config/env';
import { MoralisTokensResponse } from '~/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { wallet } = req.query;
    const chain: string = 'polygon';
    const URL = `${MORALIS_API_ENDPOINT}/${wallet}/nft/${CONTRACT_ADDRESS}/?chain=${chain}&format=decimal`;
    let isHodler = false;
    const moralisResponse: MoralisTokensResponse = await fetch(URL, {
      headers: {
        'x-api-key': MORALIS_API_KEY ?? '',
      },
    }).then((r) => r.json());

    if (moralisResponse.total > 0) {
      isHodler = true;
    }

    res.status(200).json({
      status: 'success',
      data: {
        wallet: wallet,
        hodler: isHodler,
        contract: CONTRACT_ADDRESS,
        chain: chain,
        tokenCount: moralisResponse.total ?? 0,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
