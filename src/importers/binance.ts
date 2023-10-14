import { MainClient } from 'binance';

export class BinanceExporter {
  private client: MainClient;

  constructor() {
    this.client = new MainClient({
      api_key: process.env.BINANCE_API_KEY,
      api_secret: process.env.BINANCE_API_SECRET,
    });
  }

  async load() {
    this.client.getAggregateTrades({
      symbol: 'BTC',
    });
  }
}