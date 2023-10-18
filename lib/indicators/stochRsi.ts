import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { RSI } from './rsi';

export class StochRSI implements Indicator {
  constructor(
    public readonly name: string,
    public readonly weight: number,
  ) {
    this.rsi = new RSI(name, weight);
  }

  public value: number = 0;

  private rsi: RSI;
  private rsiHistory: number[] = [];

  public update(candle: Candle): number {
    this.rsi.update(candle);

    const rsi = this.rsi.value;
    this.rsiHistory.push(rsi);

    if (this.rsiHistory.length > this.weight) {
      this.rsiHistory.shift();
    }

    const lowest = Math.min(...this.rsiHistory);
    const highest = Math.max(...this.rsiHistory);
    this.value = (rsi - lowest) / (highest - lowest) * 100;
    return this.value;
  }
}