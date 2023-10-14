import { Candle } from './candle';
import { Indicators } from './indicator';

export abstract class Strategy {
  constructor() {

  }

  protected advice(direction: 'long' | 'short') {

  }

  public abstract init(): Promise<void>;

  public abstract update(candle: Candle, indicators: Indicators): Promise<void>;
}