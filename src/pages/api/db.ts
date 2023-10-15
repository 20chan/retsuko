import type { NextApiRequest, NextApiResponse } from 'next'
import { readdir } from 'fs/promises';
import Database from 'better-sqlite3';
import { SqliteLoader } from '../../../lib/loaders/sqliteLoader';

export type DBResponse = Array<{
  name: string;
  startTs: number;
  endTs: number;
}>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DBResponse>
) {
  const files = await readdir('db');

  const dbs = [];
  for (const file of files) {
    const db = new Database(`db/${file}`);
    const loader = new SqliteLoader(db);
    const { startTs, endTs } = await loader.getDateRange();
    dbs.push({
      name: file,
      startTs,
      endTs,
    });
  }

  res.status(200).json(dbs);
}