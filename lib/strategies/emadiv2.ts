import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { Strategy, StrategyConfig } from '../core/strategy';

export interface EMADIV2Config extends StrategyConfig {
  long: number;
  short: number;
  emaWeight: number;
}

export interface EMADIV2State {
  trend: 'long' | 'short';
  prevCandle: Candle | null;
}

export class EMADIV2Strategy extends Strategy<EMADIV2Config> {
  private state: EMADIV2State | null = null;
  private ema: Indicator;

  constructor(
    config?: EMADIV2Config,
  ) {
    super(config);
    this.ema = this.indicator.ema('ema', this.config.emaWeight);
  }

  public defaultConfig(): EMADIV2Config {
    return {
      long: -3,
      short: 3,
      emaWeight: 50,
    };
  }

  public override async update(candle: Candle): Promise<void> {
    super.update(candle);

    const price = candle.close;
    const ema = this.ema.value;

    const diff = (price / ema * 100) - 100;

    if (diff <= this.config.long) {
      if (this.state?.trend !== 'long') {
        this.state = {
          trend: 'long',
          prevCandle: null,
        };
      }

      if (this.state?.prevCandle !== null) {
        if (price > this.state.prevCandle.close) {
          this.advice(candle, 'long');
        }
      }

      this.state.prevCandle = { ...candle };
    } else if (diff >= this.config.short) {
      if (this.state?.trend !== 'short') {
        this.state = {
          trend: 'short',
          prevCandle: null,
        };
      }

      if (this.state?.prevCandle !== null) {
        if (price < this.state.prevCandle.close) {
          this.advice(candle, 'short');
        }
      }

      this.state.prevCandle = { ...candle };
    } else {
      this.state = null;
    }
  }
}