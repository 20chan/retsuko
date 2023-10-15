import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';

export class EMA implements Indicator {
  constructor(
    public readonly name: string,
    public readonly weight: number,
  ) { }

  public value: number = 0;
  private ready = false;

  public update(candle: Candle): number {
    const price = candle.close;

    if (!this.ready) {
      this.ready = true;
      this.value = price;
      return price;
    }

    const k = 2 / (this.weight + 1);
    this.value = price * k + this.value * (1 - k);
    return this.value;
  }
}