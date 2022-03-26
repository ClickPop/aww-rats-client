// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { add } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import { storage } from '~/lib/gcloud';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { path }: { path: string } = req.body;
    const bucket = storage.bucket('aww-rats').file(path);
    const [signedURL] = await bucket.getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: add(new Date(), { minutes: 10 }),
    });
    return res.json({ path, signedURL });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
