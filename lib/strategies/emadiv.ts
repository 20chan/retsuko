import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { Strategy, StrategyConfig } from '../core/strategy';

export interface EMADIVConfig extends StrategyConfig {
  long: number;
  short: number;
  emaWeight: number;
}

export interface EMADIVState {
  trend: 'long' | 'short';
}

export class EMADIVStrategy extends Strategy<EMADIVConfig> {
  private state: EMADIVState | null = null;
  private ema: Indicator;

  constructor(
    config?: EMADIVConfig,
  ) {
    super(config);
    this.ema = this.indicator.ema('ema', this.config.emaWeight);
  }

  public defaultConfig(): EMADIVConfig {
    return {
      long: -2,
      short: 2,
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
        };

        this.advice(candle, 'long');
      }
    } else if (diff >= this.config.short) {
      if (this.state?.trend !== 'short') {
        this.state = {
          trend: 'short',
        };

        this.advice(candle, 'short');
      }
    }
  }
}