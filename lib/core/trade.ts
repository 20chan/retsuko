export interface Trade {
  ts: number;

  action: 'buy' | 'sell';
  asset: number;
  balance: number;
  total: number;

  price: number;
}