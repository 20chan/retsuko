import { Candle } from '../core/candle';
import { Trade } from '../core/trade';

export class PaperTrader {
  private balance: number;
  private asset: number;

  private trades: Trade[];

  constructor(
    private readonly initialBalance: number,
    private readonly fee: number,
  ) {
    this.balance = initialBalance;
    this.asset = 0;
    this.trades = [];
  }

  public handleAdvice(candle: Candle, direction: 'long' | 'short') {
    if (direction === 'long') {
      this.asset += this.extractFee(this.balance / candle.close);
      this.balance = 0;
    } else if (direction === 'short') {
      this.balance += this.extractFee(this.asset * candle.close);
      this.asset = 0;
    }

    const trade: Trade = {
      ts: candle.ts,
      action: direction === 'long' ? 'buy' : 'sell',
      asset: this.asset,
      balance: this.balance,
      total: this.balance + candle.close * this.asset,
    };
    this.trades.push(trade);
    return trade;
  }

  public state(candle: Candle) {
    return {
      balance: this.balance,
      asset: this.asset,
      total: this.balance + candle.close * this.asset,
    };
  }

  private extractFee(amount: number): number {
    amount *= 1e8;
    amount *= this.fee;
    amount = Math.floor(amount);
    amount /= 1e8;
    return amount;
  }
}