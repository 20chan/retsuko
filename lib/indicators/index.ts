import { DEMA } from './dema';
import { EMA } from './ema';
import { RSI } from './rsi';
import { SMA } from './sma';
import { SMMA } from './smma';

export const Indicators = [
  {
    name: 'EMA',
    defaultWeight: 50,
    yAxis: 'price',
    loader: (name: string, weight: number) => new EMA(name, weight),
  },
  {
    name: 'DEMA',
    defaultWeight: 50,
    yAxis: 'price',
    loader: (name: string, weight: number) => new DEMA(name, weight),
  },
  {
    name: 'SMA',
    defaultWeight: 50,
    yAxis: 'price',
    loader: (name: string, weight: number) => new SMA(name, weight),
  },
  {
    name: 'SMMA',
    defaultWeight: 50,
    yAxis: 'price',
    loader: (name: string, weight: number) => new SMMA(name, weight),
  },
  {
    name: 'RSI',
    defaultWeight: 50,
    yAxis: 'oscillator',
    loader: (name: string, weight: number) => new RSI(name, weight),
  },
];