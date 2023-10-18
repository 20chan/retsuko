import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';

export class SMA implements Indicator {
  constructor(
    public readonly name: string,
    public readonly windowLength: number,
  ) {
  }

  public value: number = 0;

  private prices: number[] = [];
  private age = 0;
  private sum = 0;


  public update(candle: Candle): number {
    const price = candle.close;

    const tail = this.prices[this.age] || 0;
    this.prices[this.age] = price;
    this.sum += price - tail;
    this.value = this.sum / this.prices.length;
    this.age = (this.age + 1) % this.windowLength;
    return this.value;
  }
}