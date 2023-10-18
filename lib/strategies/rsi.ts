import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { Strategy, StrategyConfig } from '../core/strategy';

export interface RSIStrategyConfig extends StrategyConfig {
  weight: number;
  low: number;
  high: number;
  persistence: number;
}

export interface RSIState {
  direction: 'up' | 'down' | 'none';
  duration: number;
  persisted: boolean;
  adviced: boolean;
}

export class RSIStrategy extends Strategy<RSIStrategyConfig> {
  private state: RSIState;
  private rsi: Indicator;

  constructor(
    config?: RSIStrategyConfig,
  ) {
    super(config);
    this.rsi = this.indicator.rsi('rsi', config?.weight ?? 14);
    this.state = {
      direction: 'none',
      duration: 0,
      persisted: false,
      adviced: false,
    };
  }

  public defaultConfig(): RSIStrategyConfig {
    return {
      weight: 14,
      low: 30,
      high: 70,
      persistence: 1,
    };
  }

  public override async update(candle: Candle): Promise<void> {
    super.update(candle);

    const rsi = this.rsi.value;

    if (rsi > this.config.high) {
      if (this.state.direction !== 'up') {
        this.state = {
          direction: 'up',
          duration: 0,
          persisted: false,
          adviced: false,
        };
      }

      this.state.duration += 1;

      if (this.state.duration >= this.config.persistence) {
        this.state.persisted = true;
      }

      if (this.state.persisted && !this.state.adviced) {
        this.state.adviced = true;
        this.advice(candle, 'short');
      }
    } else if (rsi < this.config.low) {
      if (this.state.direction !== 'down') {
        this.state = {
          direction: 'down',
          duration: 0,
          persisted: false,
          adviced: false,
        };
      }

      this.state.duration += 1;

      if (this.state.duration >= this.config.persistence) {
        this.state.persisted = true;
      }

      if (this.state.persisted && !this.state.adviced) {
        this.state.adviced = true;
        this.advice(candle, 'long');
      }
    }
  }
}