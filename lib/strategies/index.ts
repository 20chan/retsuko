import { StrategyConfig } from '../core/strategy';
import { BuyAtSellAtStrategy } from './buyatsellat';
import { EMADIVStrategy } from './emadiv';
import { EMADIV2Strategy } from './emadiv2';
import { EMA_OR_PRICE_DIVStrategy } from './emv_or_price_div';
import { RSIStrategy } from './rsi';
import { StochRSIStrategy } from './stochRSI';

export const strategies = [
  {
    name: 'EMADIV',
    description: 'EMA divergence',
    loader: (config?: StrategyConfig) => new EMADIVStrategy(config as any),
    defaultConfig: new EMADIVStrategy().defaultConfig(),
  },
  {
    name: 'EMADIV2',
    description: 'EMA divergence with trending',
    loader: (config?: StrategyConfig) => new EMADIV2Strategy(config as any),
    defaultConfig: new EMADIV2Strategy().defaultConfig(),
  },
  {
    name: 'EMA_OR_PRICE_DIV',
    description: 'EMA or price divergence',
    loader: (config?: StrategyConfig) => new EMA_OR_PRICE_DIVStrategy(config as any),
    defaultConfig: new EMA_OR_PRICE_DIVStrategy().defaultConfig(),
  },
  {
    name: 'BuyAtSellAt',
    description: 'Buy at, Sell at',
    loader: (config?: StrategyConfig) => new BuyAtSellAtStrategy(config as any),
    defaultConfig: new BuyAtSellAtStrategy().defaultConfig(),
  },
  {
    name: 'RSI',
    description: 'Simple RSI',
    loader: (config?: StrategyConfig) => new RSIStrategy(config as any),
    defaultConfig: new RSIStrategy().defaultConfig(),
  },
  {
    name: 'StochRSI',
    description: 'Simple Stochastic RSI',
    loader: (config?: StrategyConfig) => new StochRSIStrategy(config as any),
    defaultConfig: new StochRSIStrategy().defaultConfig(),
  },
];