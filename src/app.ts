import { setTimeout } from 'node:timers/promises';
import * as R from 'remeda';
import Database from 'better-sqlite3';
import { BithumbImporter, BithumbInterval } from './importers/bithumb';

async function saveBithumb(currency: string, interval: BithumbInterval) {
  const importer = new BithumbImporter();
  const rows0 = await importer.loadCandles({
    currency,
    interval: interval,
  });

  const rows = R.uniqBy(rows0, (row) => row.ts);

  console.log(`${currency}:${interval} ${rows.length} rows loaded`);
  console.log(`first row: ${JSON.stringify(new Date(rows[0].ts).toISOString())}`);
  console.log(`last row: ${JSON.stringify(new Date(rows[rows.length - 1].ts).toISOString())}`);

  const db = new Database(`db/bithumb_${currency}_${interval}.db`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS candles (
      ts INTEGER PRIMARY KEY,
      open REAL,
      close REAL,
      high REAL,
      low REAL,
      volume REAL
    )
  `);

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO candles (ts, open, close, high, low, volume)
    VALUES (:ts, :open, :close, :high, :low, :volume)
  `);
  for (const row of rows) {
    stmt.run(row);
  }
}

async function main() {
  const currencies = ['BTC', 'XRP', 'SIX', 'ORBS', 'ANKR']
  const intervals = ['1m', '5m', '10m', '30m', '1h', '12h'] as const;

  for (const currency of currencies) {
    for (const interval of intervals) {
      await saveBithumb(currency, interval);
      await setTimeout(1000);
    }
  }
}

async function main2() {

}

main()
  .then(() => console.log('done'))
  .catch((err) => console.error(err));