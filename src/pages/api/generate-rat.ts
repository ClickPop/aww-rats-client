// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { pubsub } from '~/lib/pubsub'
import {GetTopicsResponse} from '@google-cloud/pubsub'

type Data = {
  status: 'success' | 'error',
  error?: unknown
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
    const data = Buffer.from(body);
    await pubsub.topic("projects/awwrats/topics/TokenMinted").publish(data);
    res.status(200).json({status: 'success'})
  } catch (err) {
    console.error(err);
    return res.status(500).json({status: 'error', error: err});
  }
}
