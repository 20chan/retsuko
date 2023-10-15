import { EMA } from '../indicators/ema';
import { Candle } from './candle';

export interface Indicator {
  name: string;
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

  public ema(name: string, weight: number): Indicator {
    const indicator = new EMA(name, weight);
    this.indicators.push(indicator);
    return indicator;
  }
}