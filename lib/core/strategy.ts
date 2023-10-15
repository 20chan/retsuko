import { Candle } from './candle';
import { Indicator, IndicatorManager } from './indicator';

export type StrategyConfig = Record<string, number>;

export interface StrategyEventHandler {
  handleCandle?(candle: Candle): Promise<void>;
  handleIndicators?(indicators: Indicator[]): Promise<void>;
  handleAdvice?(candle: Candle, direction: 'long' | 'short'): Promise<void>;
}

export abstract class Strategy<TConfig extends StrategyConfig> {
  public readonly eventHandlers: StrategyEventHandler[] = [];
  public readonly config: TConfig;

  protected indicator: IndicatorManager = new IndicatorManager();

  constructor(
    config?: TConfig,
  ) {
    this.config = config ?? this.defaultConfig();
  }

  public abstract defaultConfig(): TConfig;

  protected advice(candle: Candle, direction: 'long' | 'short') {
    for (const handler of this.eventHandlers) {
      handler.handleAdvice?.(candle, direction);
    }
  }

  public async update(candle: Candle): Promise<void> {
    this.indicator.update(candle);
  }
}