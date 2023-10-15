import { StrategyConfig } from '../core/strategy';
import { EMADIVStrategy } from './emadiv';

export const strategies = [
  {
    name: 'EMADIV',
    description: 'EMA divergence',
    loader: (config?: StrategyConfig) => new EMADIVStrategy(config as any),
    defaultConfig: new EMADIVStrategy().defaultConfig(),
  },
];