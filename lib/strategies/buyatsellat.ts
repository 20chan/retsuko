import { Candle } from '../core/candle';
import { Strategy, StrategyConfig } from '../core/strategy';

export interface BuyAtSellAtConfig extends StrategyConfig {
  buyAt: number;
  sellAt: number;
  stopLossPct: number;
  sellAtUp: number;
}

export interface BuyAtSellAtState {
  prevAction: 'buy' | 'sell';
  prevPrice: number;
}

export class BuyAtSellAtStrategy extends Strategy<BuyAtSellAtConfig> {
  private state: BuyAtSellAtState;

  constructor(
    config?: BuyAtSellAtConfig,
  ) {
    super(config);
    this.state = {
      prevAction: 'sell',
      prevPrice: Infinity,
    };
  }

  public defaultConfig(): BuyAtSellAtConfig {
    return {
      buyAt: 1.2,
      sellAt: 0.98,
      stopLossPct: 0.85,
      sellAtUp: 1.01,
    };
  }

  public override async update(candle: Candle): Promise<void> {
    super.update(candle);

    const { state, config } = this;
    const price = candle.close;

    if (state.prevAction === 'buy') {
      const threshold = state.prevPrice * config.buyAt;
      const stopLoss = state.prevPrice * config.stopLossPct;

      if (price > threshold || price < stopLoss) {
        this.advice(candle, 'short');
        this.state = {
          prevAction: 'sell',
          prevPrice: price,
        };
      }
    } else if (state.prevAction === 'sell') {
      const threshold = state.prevPrice * config.sellAt;
      const sellAtUpPrice = state.prevPrice * config.sellAtUp;

      if (price < threshold || price > sellAtUpPrice) {
        this.advice(candle, 'long');
        this.state = {
          prevAction: 'buy',
          prevPrice: price,
        };
      }
    }
  }
}