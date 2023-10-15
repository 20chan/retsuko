import type { NextApiRequest, NextApiResponse } from 'next'
import { StrategyConfig } from '../../../lib/core/strategy';
import { strategies } from '../../../lib/strategies';

export type StrategyResponse = Array<{
  name: string;
  description: string;
  defaultConfig: StrategyConfig;
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<StrategyResponse>
) {
  const resp = strategies.map(x => ({
    name: x.name,
    description: x.description,
    defaultConfig: x.defaultConfig,
  }));

  res.status(200).json(resp);
}