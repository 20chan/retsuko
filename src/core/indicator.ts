import { EMA } from '../indicators/ema';
import { Candle } from './candle';

export interface Indicator {
  value: number;
  update(candle: Candle): number;
}

export class IndicatorManager {
  private indicators: Indicator[] = [];

  public update(candle: Candle) {
    for (const indicator of this.indicators) {
      indicator.update(candle);
    }
  }

  public ema(weight: number): Indicator {
    const indicator = new EMA(weight);
    this.indicators.push(indicator);
    return indicator;
  }
}