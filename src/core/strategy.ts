import { PaperTrader } from '../trader/paperTrader';
import { Candle } from './candle';
import { IndicatorManager } from './indicator';

export abstract class Strategy {
  protected indicator: IndicatorManager = new IndicatorManager();
  public trader: PaperTrader | null = null;

  // TODO: 이벤트만 전달하는 파이프라인으로 바꿔야함
  public register(trader: PaperTrader) {
    this.trader = trader;
  }

  protected advice(candle: Candle, direction: 'long' | 'short') {
    if (this.trader) {
      const resp = this.trader.handleAdvice(candle, direction);
      console.log(`${new Date(candle.ts).toISOString()} ${direction} ${resp.asset} ${resp.balance} ${resp.total}`);
    }
  }

  public async update(candle: Candle): Promise<void> {
    this.indicator.update(candle);
  }
}