// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { MORALIS_API_ENDPOINT, MORALIS_API_KEY } from '~/config/env';
import { MoralisTokensResponse, ParsedMoralisTokenMeta } from '~/types';
import { getIPFSGateway } from '~/utils/getIPFSGateway';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { wallet, chain, limit, offset } = req.query;
    const queryLimit = limit ? parseInt(limit as string, 10) : 500;
    let queryOffset = offset ? parseInt(offset as string, 10) : 0;
    let tokenResult: ParsedMoralisTokenMeta[] = [];
    const dupeTokens: string[] = [];

    let i = queryLimit;
    while (tokenResult.length < queryLimit) {
      const URL = `${MORALIS_API_ENDPOINT}/${wallet}/nft?chain=${chain}&format=decimal&limit=${i}&offset=${queryOffset}`;
      const tokens: MoralisTokensResponse = await fetch(URL, {
        headers: {
          'x-api-key': MORALIS_API_KEY ?? '',
        },
      }).then((r) => r.json());
      if (tokens.result.length < 1) {
        break;
      }
      const tokensWithMeta = tokens.result
        .map((token) => {
          if (token.metadata) {
            const meta = JSON.parse(token.metadata);
            meta.image = meta.image_url_cdn ?? meta.image_url ?? meta.image;
            return { ...token, metadata: meta };
          }
          return false;
        })
        .filter(
          (token) =>
            typeof token === 'object' &&
            typeof token.metadata?.image === 'string',
        )
        .map(
          (token, i) =>
            ({
              ...token,
              metadata: {
                ...(token as ParsedMoralisTokenMeta).metadata,
                image: (token as ParsedMoralisTokenMeta).metadata.image.replace(
                  'ipfs://',
                  getIPFSGateway(i),
                ),
              },
            } as ParsedMoralisTokenMeta),
        )
        .filter((t: ParsedMoralisTokenMeta) => {
          if (dupeTokens.includes(t.metadata.image)) {
            return false;
          }
          dupeTokens.push(t.metadata.image);
          return true;
        });
      tokenResult = [...tokenResult, ...tokensWithMeta];
      queryOffset += i;
      i = queryLimit - tokenResult.length;
    }

    res.status(200).json({ status: 'success', data: tokenResult });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
