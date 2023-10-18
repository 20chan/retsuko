import { DEMA } from '../indicators/dema';
import { EMA } from '../indicators/ema';
import { RSI } from '../indicators/rsi';
import { SMA } from '../indicators/sma';
import { SMMA } from '../indicators/smma';
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

  public dema(name: string, weight: number): Indicator {
    const indicator = new DEMA(name, weight);
    this.indicators.push(indicator);
    return indicator;
  }

  public sma(name: string, windowLength: number): Indicator {
    const indicator = new SMA(name, windowLength);
    this.indicators.push(indicator);
    return indicator;
  }

  public smma(name: string, windowLength: number): Indicator {
    const indicator = new SMMA(name, windowLength);
    this.indicators.push(indicator);
    return indicator;
  }

  public rsi(name: string, windowLength: number): Indicator {
    const indicator = new RSI(name, windowLength);
    this.indicators.push(indicator);
    return indicator;
  }
}