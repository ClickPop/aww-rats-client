// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { imageURL } = req.query;
    const image = await fetch(imageURL as string)
      .then((res) => res.blob())
      .then((data) => data.stream())
    image.pipe(res);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
