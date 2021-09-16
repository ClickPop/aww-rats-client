// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GENERATOR_URL } from '~/config/env';

type Data = {
  status: 'success' | 'error',
  error?: unknown
  data?: unknown
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(400).json({status: 'error', error: "Incorrect method"});
  }
  try {
    const {body} = req;
    const tokenId = typeof body === "object" ? body.tokenId : JSON.parse(body).tokenId;
    if (!GENERATOR_URL) {
      throw new Error("Unknown generator URL")
    }
    const generatedRes = await fetch(GENERATOR_URL, {
      method: "post",
      body: JSON.stringify({
        tokenId
      })
    });
    const generated = await generatedRes.json();
    if (!generatedRes.ok) {
      throw new Error(generated.error)
    }
    res.status(200).json({status: 'success', data: generated});
  } catch (err) {
    console.error(err);
    return res.status(500).json({status: 'error', error: (err as Error).message});
  }
}
