// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sdk } from '~/lib/graphql';
import { InsertRewardsMutation, Rewards_Insert_Input } from '~/schema/requests';

const { insertRewards } = sdk;

interface Request extends Exclude<NextApiRequest, 'body'> {
  body: {
    encounters: Rewards_Insert_Input | Rewards_Insert_Input[];
  };
}

export default async function handler(
  req: Request,
  res: NextApiResponse<
    InsertRewardsMutation | { status: 'error'; error: string }
  >,
) {
  if (req.method !== 'POST') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { body } = req;
    const rewards = await insertRewards(
      typeof body === 'string' ? JSON.parse(body) : body,
    );
    res.status(200).json(rewards);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
