import { Candle } from './candle';

export interface Loader {
  load(): AsyncIterableIterator<Candle>;
}