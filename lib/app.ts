import { setTimeout } from 'node:timers/promises';
import * as R from 'remeda';
import Database from 'better-sqlite3';
import { BithumbImporter, BithumbInterval } from './importers/bithumb';
import { SqliteLoader } from './loaders/sqliteLoader';
import { EMADIVStrategy } from './strategies/emadiv';
import { PaperTrader } from './trader/paperTrader';
import { BinanceImporter } from './importers/binance';

async function save(importer: BinanceImporter, symbol: string, interval: BithumbInterval) {
  const db = new Database(`db/binance_${symbol}_${interval}.db`);
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

  const rows0 = importer.loadCandles({
    symbol,
    interval: interval,
    startTime: symbol === 'BTCUSDT' && interval === '1m' ? new Date('2017-08-17T04:00:00.000Z').getTime() : undefined,
  });

  for await (const rows of rows0) {
    if (rows.length < 1000) {
      break;
    }
    console.log(`${new Date().toISOString()} ${symbol}:${interval} ${rows.length} rows loaded`);
    console.log(`first row: ${JSON.stringify(new Date(rows[0].ts).toISOString())}`);
    console.log(`last row: ${JSON.stringify(new Date(rows[rows.length - 1].ts).toISOString())}`);

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO candles (ts, open, close, high, low, volume)
      VALUES (:ts, :open, :close, :high, :low, :volume)
    `);
    for (const row of rows) {
      stmt.run(row);
    }
  }
}

async function dump() {
  const importer = new BinanceImporter();

  const currencies = ['BTCUSDT', 'ETHUSDT', 'XRPUSDT']
  const intervals = ['1m', '5m', '30m', '1h', '12h'] as const;

  for (const currency of currencies) {
    for (const interval of intervals) {
      console.log(`loading ${currency}:${interval}`);
      await save(importer, currency, interval);
      await setTimeout(1000);
    }
  }
}

async function main() {
  const loader = new SqliteLoader(new Database('db/binance_BTCUSDT_1h.db'));

  const strategy = new EMADIVStrategy();
  const trader = new PaperTrader(100, 1 - 0.25 / 100);

  strategy.eventHandlers.push(trader);

  let lastCandle = null;
  for await (const x of loader.load()) {
    await strategy.update(x);
    lastCandle = x;
  }

  console.log(trader.state(lastCandle!));
}

main()
  .then(() => console.log('done'))
  .catch((err) => console.error(err));