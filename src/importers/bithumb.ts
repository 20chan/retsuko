import fetch from 'node-fetch';
import { Candle } from '../core/candle';

export type BithumbInterval = (
  | '1m'
  | '3m'
  | '5m'
  | '10m'
  | '30m'
  | '1h'
  | '6h'
  | '12h'
  | '24h'
)

type BithumbCandlestick = [number, number, number, number, number, number];

interface BithumbCandlestickResponse {
  status: string;
  data: BithumbCandlestick[];
}

export class BithumbImporter {
  public async loadCandles(options: { currency: string, interval: BithumbInterval }) {
    const { currency, interval } = options;

    const resp = await fetch(`https://api.bithumb.com/public/candlestick/${currency}_KRW/${interval}`);
    const json = await resp.json() as BithumbCandlestickResponse;

    if (json.status !== '0000') {
      throw new Error(`Failed to load candlesticks: ${json.status}`);
    }

    const rows: Candle[] = json.data.map((row) => ({
      ts: row[0],
      open: row[1],
      close: row[2],
      high: row[3],
      low: row[4],
      volume: row[5],
    }));
    return rows;
  }
}