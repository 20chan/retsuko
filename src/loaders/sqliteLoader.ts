import { Candle } from '../core/candle';
import { Loader } from '../core/loader';

import { Database } from 'better-sqlite3';

export class SqliteLoader implements Loader {
  constructor(
    private readonly db: Database,
  ) { }

  async *load(): AsyncIterableIterator<Candle> {
    const rows = this.db.prepare('SELECT * FROM candles').all() as Candle[];

    for (const row of rows) {
      yield {
        ts: row.ts,
        open: row.open,
        close: row.close,
        high: row.high,
        low: row.low,
        volume: row.volume,
      };
    }
  }
}