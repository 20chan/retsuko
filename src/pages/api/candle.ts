import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3';
import { SqliteLoader } from '../../../lib/loaders/sqliteLoader';
import { Candle, CandleCompressed } from '../../../lib/core/candle';

export type CandleRequest = {
  dbName: string;
  startTs: string;
  endTs: string;
}

export type CandleResponse = CandleCompressed[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CandleResponse>
) {
  const { dbName, startTs: startTsRaw, endTs: endTsRaw } = req.query as CandleRequest;
  const startTs = parseInt(startTsRaw);
  const endTs = parseInt(endTsRaw);

  const options = {
    startTs: (isNaN(startTs) || startTs === 0) ? undefined : startTs,
    endTs: (isNaN(endTs) || endTs === 0) ? undefined : endTs,
  };

  const db = new Database(`db/${dbName}`);
  const loader = new SqliteLoader(db);

  const candles = await loader.loadAllCompressed(options);

  res.status(200).json(candles);
}