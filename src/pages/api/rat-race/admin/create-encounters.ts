// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { sdk } from '~/lib/graphql';
import { Encounters_Insert_Input } from '~/schema/requests';

const { insertEncounters } = sdk;

interface Request extends Exclude<NextApiRequest, 'body'> {
  body: {
    encounters: Encounters_Insert_Input | Encounters_Insert_Input[];
  };
}

export default async function handler(req: Request, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(400).json({ status: 'error', error: 'Incorrect method' });
  }
  try {
    const { body } = req;
    const encounters = await insertEncounters(body);
    res.status(200).json(encounters);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: 'error', error: (err as Error).message });
  }
}
