import { Candle } from '../core/candle';
import { Indicator } from '../core/indicator';
import { Strategy, StrategyConfig } from '../core/strategy';

export interface EMA_OR_PRICE_DIVConfig extends StrategyConfig {
  long: number;
  short: number;
  emaWeight: number;
}

export interface EMA_OR_PRICE_DIVState {
  trend: 'up' | 'down' | 'none';
  longPrice: number;
  shortPrice: number;
}

export class EMA_OR_PRICE_DIVStrategy extends Strategy<EMA_OR_PRICE_DIVConfig> {
  private state: EMA_OR_PRICE_DIVState;
  private ema: Indicator;

  constructor(
    config?: EMA_OR_PRICE_DIVConfig,
  ) {
    super(config);
    this.ema = this.indicator.ema('ema', this.config.emaWeight);
    this.state = {
      trend: 'none',
      longPrice: -1,
      shortPrice: -1,
    };
  }

  public defaultConfig(): EMA_OR_PRICE_DIVConfig {
    return {
      long: -2.5,
      short: 2.5,
      emaWeight: 50,
    };
  }

  adviceWrapper(candle: Candle, direction: 'long' | 'short') {
    if (this.state.longPrice > -1 && direction === 'short') {
      this.advice(candle, direction);
    } else if (this.state.shortPrice > -1 && direction === 'long') {
      // const goodLongPrice = this.state.shortPrice * 0.975;
      // if (candle.close < goodLongPrice) {
      this.advice(candle, direction);
      // } else {
      //   this.state.trend = 'down';
      // }
    }
  };

  public override async update(candle: Candle): Promise<void> {
    super.update(candle);

    const price = candle.close;
    const ema = this.ema.value;

    const { state, config } = this;

    // step 1
    if (state.trend === 'up' && state.longPrice > price) {
      const longDiff = (price / state.longPrice * 100) - 100;

      if (longDiff >= (config.short + Math.abs(config.long))) {
        this.state = {
          ...state,
          trend: 'down',
          shortPrice: price,
        };
        this.adviceWrapper(candle, 'short');
        return;
      }
    } else if (state.trend === 'down' && state.shortPrice < price) {
      const shortDiff = (price / state.shortPrice * 100) - 100;

      if (shortDiff <= (config.long - Math.abs(config.short))) {
        this.state = {
          ...state,
          trend: 'up',
          longPrice: price,
        };
        this.adviceWrapper(candle, 'long');
        return;
      }
    }

    // step 2
    const diff = (price / ema * 100) - 100;

    if (diff <= config.long) {
      if (state.trend !== 'up') {
        this.state = {
          ...state,
          trend: 'up',
          longPrice: price,
        };
        this.adviceWrapper(candle, 'long');
      }
    } else if (diff >= this.config.short) {
      if (state.trend !== 'down') {
        this.state = {
          ...state,
          trend: 'down',
          shortPrice: price,
        };
        this.adviceWrapper(candle, 'short');
      }
    }
  }
}