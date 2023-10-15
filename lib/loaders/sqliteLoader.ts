import { Candle, CandleCompressed } from '../core/candle';
import { LoadOption, Loader } from '../core/loader';

import { Database } from 'better-sqlite3';

const END_TS_FALLBACK = 4102444800000;

export class SqliteLoader implements Loader {
  constructor(
    private readonly db: Database,
  ) { }

  public async getDateRange(): Promise<{ startTs: number, endTs: number }> {
    const stmt = this.db.prepare('SELECT MIN(ts) AS min, MAX(ts) AS max FROM candles');
    const row = stmt.get() as { min: number, max: number };
    return {
      startTs: row.min,
      endTs: row.max,
    };
  }

  async *load(options?: LoadOption): AsyncIterableIterator<Candle> {
    const rows = this.loadInner(options);

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

  async loadAll(options?: LoadOption): Promise<Candle[]> {
    const rows = this.loadInner(options);

    return rows.map(row => ({
      ts: row.ts,
      open: row.open,
      close: row.close,
      high: row.high,
      low: row.low,
      volume: row.volume,
    }));
  }


  async loadAllCompressed(options?: LoadOption): Promise<CandleCompressed[]> {
    const rows = this.loadInner(options);

    return rows.map(row => [
      row.ts,
      row.open,
      row.close,
      row.high,
      row.low,
      row.volume,
    ]);
  }

  loadInner(options?: LoadOption): Candle[] {
    const stmt = this.db.prepare('SELECT * FROM candles WHERE ts >= ? AND ts <= ?');
    const rows = stmt.all(options?.startTs ?? 0, options?.endTs ?? END_TS_FALLBACK) as Candle[];
    return rows;
  }
}