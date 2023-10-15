export interface Candle {
  ts: number;

  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
}

export type CandleCompressed = [number, number, number, number, number, number];

export namespace Candle {
  export function compress(candle: Candle): CandleCompressed {
    return [
      candle.ts,
      candle.open,
      candle.close,
      candle.high,
      candle.low,
      candle.volume,
    ];
  }

  export function decompress(candle: CandleCompressed): Candle {
    return {
      ts: candle[0],
      open: candle[1],
      close: candle[2],
      high: candle[3],
      low: candle[4],
      volume: candle[5],
    };
  }
}