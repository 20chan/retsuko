import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { Strategy } from '../core/strategy';

export interface EMADIVConfig {
  long: number;
  short: number;
}

export interface EMADIVState {
  trend: 'long' | 'short';
}

export class EMADIVStrategy extends Strategy {
  private state: EMADIVState | null = null;
  private ema: Indicator;

  constructor(
    private readonly config: EMADIVConfig,
  ) {
    super();
    this.ema = this.indicator.ema(50);
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