import { useState } from 'react';
import { Indicators } from '../../lib/indicators';
import { Candle } from '../../lib/core/candle';

export interface IndicatorState {
  name: string;
  weight: number;
  yAxisID: string;
  values: Array<{ ts: number, value: number }>;
}

export function IndicatorLoader(props: {
  indicators: IndicatorState[];
  setIndicators: (indicators: IndicatorState[]) => void;
  candles: Candle[];
}) {
  const { indicators, setIndicators, candles } = props;

  const [curSelectedIndicatorName, setCurSelectedIndicatorName] = useState<string>(Indicators[0].name);

  return (
    <div>
      <h3>load indicators</h3>

      {
        indicators.map((indicator, i) => (
          <div key={i}>
            {indicator.name}

            <input type='number' value={indicator.weight} onChange={e => {
              const newIndicators = [...indicators];
              newIndicators[i].weight = e.target.valueAsNumber;
              setIndicators(newIndicators);
            }} />
            <button onClick={() => {
              const item = Indicators.find(x => x.name === indicator.name)!;
              const instance = item.loader('test', indicator.weight);

              const result = [];
              for (const x of candles) {
                result.push({
                  ts: x.ts,
                  value: instance.update(x),
                });
              }

              const newIndicators = [...indicators];
              newIndicators[i].values = result;
              setIndicators(newIndicators);
            }}>load</button>
            <button onClick={() => {
              const newIndicators = [...indicators];
              newIndicators.splice(i, 1);
              setIndicators(newIndicators);
            }}>X</button>
          </div>
        ))
      }

      <div>
        <select value={curSelectedIndicatorName} onChange={e => setCurSelectedIndicatorName(e.target.value)}>
          {Indicators.map(indicator => (
            <option key={indicator.name} value={indicator.name}>{indicator.name}</option>
          ))}
        </select>
        <button onClick={() => {
          const item = Indicators.find(indicator => indicator.name === curSelectedIndicatorName)!;
          setIndicators([
            ...indicators,
            {
              name: curSelectedIndicatorName,
              yAxisID: item.yAxis,
              weight: item.defaultWeight,
              values: [],
            },
          ]);
        }}>
          add
        </button>
      </div>
    </div>
  )
}