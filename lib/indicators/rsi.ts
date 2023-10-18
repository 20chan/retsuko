import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { SMMA } from './smma';

export class RSI implements Indicator {
  constructor(
    public readonly name: string,
    public readonly weight: number,
  ) {
    this.avgU = new SMMA(name, weight);
    this.avgD = new SMMA(name, weight);
  }

  public value: number = 0;

  private avgU: SMMA;
  private avgD: SMMA;
  private u = 0;
  private d = 0;
  private rs = 0;
  private age = 0;
  private lastPrice: number | null = null;

  public update(candle: Candle): number {
    const price = candle.close;

    if (this.lastPrice === null) {
      this.lastPrice = price;
      this.age += 1;
      return this.value;
    }

    if (price > this.lastPrice) {
      this.u = price - this.lastPrice;
      this.d = 0;
    } else {
      this.u = 0;
      this.d = this.lastPrice - price;
    }

    this.avgU.update({ ...candle, close: this.u });
    this.avgD.update({ ...candle, close: this.d });

    this.rs = this.avgU.value / this.avgD.value;
    this.value = 100 - (100 / (1 + this.rs));

    if (this.avgD.value === 0 && this.avgU.value !== 0) {
      this.value = 100;
    } else if (this.avgD.value === 0) {
      this.value = 0;
    }

    this.lastPrice = price;
    this.age += 1;
    return this.value;
  }
}