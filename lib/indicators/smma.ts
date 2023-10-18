import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { SMA } from './sma';

export class SMMA implements Indicator {
  constructor(
    public readonly name: string,
    public readonly windowLength: number,
  ) {
    this.sma = new SMA(name, windowLength);
  }

  public value: number = 0;

  private sma: SMA;
  private age = 0;

  public update(candle: Candle): number {
    const price = candle.close;
    this.age += 1;

    if (this.age < this.windowLength) {
      this.sma.update(candle);
    } else if (this.age === this.windowLength) {
      this.sma.update(candle);
      this.value = this.sma.value;
    } else {
      this.value = (this.value * (this.windowLength - 1) + price) / this.windowLength;
    }

    return this.value;
  }
}