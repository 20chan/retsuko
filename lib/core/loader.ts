import { Candle, CandleCompressed } from './candle';

export interface LoadOption {
  startTs?: number;
  endTs?: number;
}

export interface Loader {
  load(options?: LoadOption): AsyncIterableIterator<Candle>;
  loadAll(options?: LoadOption): Promise<Candle[]>;
  loadAllCompressed(options?: LoadOption): Promise<CandleCompressed[]>;
}