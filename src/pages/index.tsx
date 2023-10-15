import { useEffect, useState } from 'react';
import qs from 'qs';
import { BacktestChart } from './BacktestChart';
import { BacktestRequest, BacktestResponse } from './api/backtest/run';
import { DBResponse } from './api/db';
import { Candle } from '../../lib/core/candle';
import { CandleResponse } from './api/candle';
import { StrategyResponse } from './api/strategy';
import { StrategyConfig } from '../../lib/core/strategy';

export default function Index() {
  const [dbs, setDbs] = useState<DBResponse | null>(null);
  const [strategies, setStrategies] = useState<StrategyResponse>([]);
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [backtestResp, setBacktestResp] = useState<BacktestResponse | null>(null);

  const [curDb, setCurDb] = useState<string>('');
  const [curStrategy, setCurStrategy] = useState<string>('');
  const [curStrategyConfig, setCurStrategyConfig] = useState<StrategyConfig>({});
  const [startTs, setStartTs] = useState<number>(0);
  const [endTs, setEndTs] = useState<number>(0);

  const db = dbs?.find(db => db.name === curDb);
  const strategy = strategies?.find(strategy => strategy.name === curStrategy);

  useEffect(() => {
    Promise.all([
      fetch('/api/db')
        .then(res => res.json())
        .then(setDbs),
      fetch('/api/strategy')
        .then(res => res.json())
        .then(setStrategies),
    ]);
  }, []);

  const fetchCandles = () => {
    if (curDb === '') {
      return;
    }

    fetch(`/api/candle?${qs.stringify({
      dbName: curDb,
      startTs,
      endTs,
    })}`)
      .then(res => res.json() as Promise<CandleResponse>)
      .then(xs => xs.map(Candle.decompress))
      .then(setCandles);
  };

  const fetchBacktest = () => {
    if (curDb === '' || curStrategy === '') {
      return;
    }

    const input: BacktestRequest = {
      dbName: curDb,
      startTs,
      endTs,
      strategy: curStrategy,
      config: curStrategyConfig,
    };

    fetch(`/api/backtest/run`, {
      method: 'POST',
      body: JSON.stringify(input),
    })
      .then(res => res.json() as Promise<BacktestResponse>)
      .then(setBacktestResp);
  }

  return (
    <div>
      <select onChange={e => {
        setCurDb(e.target.value);
        setCandles(null);
        setBacktestResp(null);

        const curDb = dbs?.find(db => db.name === e.target.value);
        setStartTs(Math.max(curDb?.startTs ?? 0, startTs));
        setEndTs(endTs === 0 ? curDb?.endTs ?? 0 : Math.min(curDb?.endTs ?? 0, endTs));
      }}
      >
        <option value="">Select a DB</option>
        {dbs?.map(db => (
          <option key={db.name} value={db.name}>{db.name}</option>
        ))}
      </select>

      <select onChange={e => {
        setCurStrategy(e.target.value);

        const curStrategy = strategies?.find(strategy => strategy.name === e.target.value);
        console.log(curStrategy);
        setCurStrategyConfig(curStrategy?.defaultConfig ?? {});
      }}
      >
        <option value="">Select a Strategy</option>
        {strategies?.map(strategy => (
          <option key={strategy.name} value={strategy.name}>{strategy.name}</option>
        ))}
      </select>

      {db && (
        <div>
          <h2>{db.name}</h2>
          <h4>{new Date(db.startTs).toISOString()} ~ {new Date(db.endTs).toISOString()}</h4>

          <button onClick={fetchCandles}>Fetch Candles</button>

          <div>
            <input type="range" min={db.startTs} max={db.endTs} value={startTs} step={60000} onChange={e => setStartTs(parseInt(e.target.value))} />
            <input type="range" min={db.startTs} max={db.endTs} value={endTs} step={60000} onChange={e => setEndTs(parseInt(e.target.value))} />
            {new Date(startTs).toISOString()} ~ {new Date(endTs).toISOString()}
          </div>

          {
            strategy && (
              <div>
                <h3>
                  strategy: {strategy.name}
                </h3>
                {strategy.description}

                {
                  Object.keys(curStrategyConfig).map(key => (
                    <div key={key}>
                      <label htmlFor={key}>{key}</label>
                      <input
                        id={key}
                        type="number"
                        value={curStrategyConfig[key]}
                        onChange={e => {
                          const newConfig = { ...curStrategyConfig };
                          newConfig[key] = e.target.valueAsNumber;
                          setCurStrategyConfig(newConfig);
                        }}
                      />
                    </div>
                  ))
                }

                <br />
                <button onClick={() => fetchBacktest()}>Backtest</button>
              </div>
            )
          }
          {
            candles && (
              <BacktestChart
                candles={candles}
                strategy='test'
                trades={backtestResp?.trades ?? []}
                startTime={startTs}
                endTime={endTs}
              />
            )
          }
        </div>
      )}

    </div>
  )
}