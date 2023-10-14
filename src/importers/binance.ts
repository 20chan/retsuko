import { setTimeout } from 'node:timers/promises';
import * as R from 'remeda';
import { MainClient } from 'binance';
import { Candle } from '../core/candle';

export type BinanceInterval = (
  | '1s'
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '2h'
  | '4h'
  | '6h'
  | '8h'
  | '12h'
  | '1d'
  | '3d'
  | '1w'
  | '1M'
)

export class BinanceImporter {
  private client: MainClient;

  constructor() {
    this.client = new MainClient();
  }

  public async *loadCandles(options: { symbol: string, interval: BinanceInterval, startTime?: number }) {
    const { symbol, interval, startTime } = options;

    let rows = await this.client.getKlines({
      symbol,
      interval,
      limit: 1000,
      startTime,
    });

    const xs = rows.map(x => ({
      ts: x[0],
      open: parseFloat(x[1].toString()),
      high: parseFloat(x[2].toString()),
      low: parseFloat(x[3].toString()),
      close: parseFloat(x[4].toString()),
      volume: parseFloat(x[5].toString()),
    }));
    yield xs;

    while (rows.length = 1000) {
      rows = await this.client.getKlines({
        symbol,
        interval,
        endTime: rows[0][0],
        limit: 1000,
      });
      yield rows.map(x => ({
        ts: x[0],
        open: parseFloat(x[1].toString()),
        high: parseFloat(x[2].toString()),
        low: parseFloat(x[3].toString()),
        close: parseFloat(x[4].toString()),
        volume: parseFloat(x[5].toString()),
      }));

      await setTimeout(100);
    }
  }
}