import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { EMA } from './ema';

export class DEMA implements Indicator {
  constructor(
    public readonly name: string,
    public readonly weight: number,
  ) {
    this.inner = new EMA(name, weight);
    this.outer = new EMA(name, weight);
  }

  private inner: EMA;
  private outer: EMA;

  public value: number = 0;

  public update(candle: Candle): number {
    this.inner.update(candle);
    this.outer.update({ ...candle, close: this.inner.value });
    this.value = 2 * this.inner.value - this.outer.value;
    return this.value;
  }
}