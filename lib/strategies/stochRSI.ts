import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { Strategy, StrategyConfig } from '../core/strategy';

export interface StochRSIStrategyConfig extends StrategyConfig {
  weight: number;
  low: number;
  high: number;
  persistence: number;
  reversed: number;
}

export interface StochRSIState {
  direction: 'up' | 'down' | 'none';
  duration: number;
  persisted: boolean;
  adviced: boolean;
}

export class StochRSIStrategy extends Strategy<StochRSIStrategyConfig> {
  private state: StochRSIState;
  private stochRsi: Indicator;

  constructor(
    config?: StochRSIStrategyConfig,
  ) {
    super(config);
    this.stochRsi = this.indicator.stochRsi('stochRsi', config?.weight ?? 14);
    this.state = {
      direction: 'none',
      duration: 0,
      persisted: false,
      adviced: false,
    };
  }

  public defaultConfig(): StochRSIStrategyConfig {
    return {
      weight: 3,
      low: 20,
      high: 80,
      persistence: 3,
      reversed: 0,
    };
  }

  adviceWrapper(candle: Candle, direction: 'short' | 'long') {
    if (this.config.reversed === 1) {
      this.advice(candle, direction === 'short' ? 'long' : 'short');
    } else {
      this.advice(candle, direction);
    }
  }

  public override async update(candle: Candle): Promise<void> {
    super.update(candle);

    const stochRsi = this.stochRsi.value;

    if (stochRsi > this.config.high) {
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
        this.adviceWrapper(candle, 'short');
      }
    } else if (stochRsi < this.config.low) {
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
        this.adviceWrapper(candle, 'long');
      }
    } else {
      this.state.duration = 0;
    }
  }
}