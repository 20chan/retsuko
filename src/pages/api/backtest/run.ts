import type { NextApiRequest, NextApiResponse } from 'next'
import { existsSync } from 'fs';
import { Candle } from '../../../../lib/core/candle'
import { Trade } from '../../../../lib/core/trade';
import { SqliteLoader } from '../../../../lib/loaders/sqliteLoader';
import Database from 'better-sqlite3';
import { EMADIVStrategy } from '../../../../lib/strategies/emadiv';
import { PaperTrader } from '../../../../lib/trader/paperTrader';
import { StrategyConfig } from '../../../../lib/core/strategy';
import { strategies } from '../../../../lib/strategies';

export type BacktestRequest = {
  dbName: string;

  startTs?: number;
  endTs?: number;

  strategy: string;
  config?: StrategyConfig;
}

export type BacktestResponse = {
  trades: Trade[];
  result: {
    balance: number;
    asset: number;
    total: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BacktestResponse>
) {
  const {
    dbName,
    startTs,
    endTs,
    strategy: strategyName,
    config,
  } = JSON.parse(req.body) as BacktestRequest;

  if (!existsSync(`db/${dbName}`)) {
    console.log(`db/${dbName} not found`);
    res.status(404).json({} as any);
    return;
  }

  const strategyEntry = strategies.find(x => x.name === strategyName);
  if (!strategyEntry) {
    console.log(`strategy ${strategyName} not found`);
    res.status(404).json({} as any);
    return;
  }

  const db = new Database(`db/${dbName}`);
  const loader = new SqliteLoader(db);
  const strategy = strategyEntry.loader(config);
  const trader = new PaperTrader(1000, 1 - 0 / 100);
  strategy.eventHandlers.push(trader);

  let lastCandle = null;
  for await (const x of loader.load({ startTs, endTs })) {
    await strategy.update(x);
    lastCandle = x;
  }

  res.status(200).json({
    trades: trader.trades ?? [],
    result: trader.state(lastCandle!),
  })
}