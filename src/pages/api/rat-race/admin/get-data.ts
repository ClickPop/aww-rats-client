// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sdk } from '~/lib/graphql';

const { getAdminData } = sdk;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const adminData = await getAdminData();
    res.status(200).json(adminData);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
