import { Candle } from '../../lib/core/candle';
import { Trade } from '../../lib/core/trade';
import { Chart, Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
  TimeSeriesScale,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeSeriesScale,
);

export interface BacktestChartProps {
  strategy: string;
  candles: Candle[];
  trades: Trade[];
  startTime: number;
  endTime: number;
}

function formatTs(ts: number) {
  const date = new Date(ts);

  const YY = date.getFullYear().toString().slice(2);
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  const DD = date.getDate().toString().padStart(2, '0');
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');

  return `${YY}${MM}${DD} ${hh}:${mm}`;
}

export function BacktestChart(props: BacktestChartProps) {
  const { strategy, candles, trades, startTime: startTime0, endTime: endTime0 } = props;

  const startTs = startTime0 === 0 ? candles[0].ts : startTime0;
  const endTs = endTime0 === 0 ? candles[candles.length - 1].ts : endTime0;

  const startTimeIndex = candles.findIndex(candle => candle.ts >= startTs);
  const endTimeIndex = candles.findIndex(candle => candle.ts >= endTs);

  const dataViewStart = Math.max(startTimeIndex, 0);
  const dataViewEnd = Math.min(endTimeIndex, candles.length - 1);

  const datasets = [
    {
      type: 'line' as const,
      label: 'Candles',
      data: candles.map(candle => ({
        x: new Date(candle.ts),
        y: candle.close,
      })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 1,
      pointStyle: false as any,
      order: 2,
      spanGaps: true,
      yAxisID: 'y',
    },
    {
      type: 'bubble' as const,
      label: 'Long/Buy',
      data: trades.filter(x => x.action === 'buy').map(trade => ({
        x: new Date(trade.ts),
        y: trade.price,
        r: Math.min(10, Math.max(5, trade.total / 200)),
      })),
      backgroundColor: 'rgb(14, 203, 129, 0.5)',
      order: 1,
      yAxisID: 'y',
    },
    {
      type: 'bubble' as const,
      label: 'Short/Sell',
      data: trades.filter(x => x.action === 'sell').map(trade => ({
        x: new Date(trade.ts),
        y: trade.price,
        r: Math.min(10, Math.max(5, trade.total / 200)),
      })),
      backgroundColor: 'rgb(246, 70, 93, 0.5)',
      order: 1,
      yAxisID: 'y',
    },
    {
      type: 'line' as const,
      label: 'Balance',
      data: trades.map(trade => ({
        x: new Date(trade.ts),
        y: trade.total,
      })),
      borderColor: 'rgb(72, 128, 238)',
      backgroundColor: 'rgb(72, 128, 238, 0.5)',
      pointRadius: 1,
      borderWidth: 2,
      yAxisID: 'balanceY',
    },
  ];

  const data = {
    datasets,
  };

  const dataForBalance = {
    datasets: [
    ],
  };

  const options = {
    responsive: false,
    animation: false,
    plugins: {
      title: {
        display: false,
        text: strategy,
      },
      verticalLine: {
        startTs,
        endTs,
        candles,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        min: candles[dataViewStart].ts,
        max: candles[dataViewEnd].ts,
        type: 'timeseries',
        unit: 'day',
        time: {
          displayFormats: {
            day: 'YY-MM-DD hh:mm'
          },
        },
        ticks: {
          sampleSize: 10,
        },
      },
      y: {
        type: 'linear',
        position: 'left',
      },
      balanceY: {
        type: 'linear',
        position: 'right',
        grid: {
          display: false,
        },
      },
    },
  };

  const optionsForBalance = {
    responsive: false,
    plugins: {
      title: {
        display: true,
        text: 'balance',
      },
      verticalLine: {
        startTs,
        endTs,
        candles,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: true,
        type: 'timeseries',
        unit: 'day',
        time: {
          displayFormats: {
            day: 'YY-MM-DD hh:mm'
          },
        },
      },
    },
  };

  const verticalLinePlugin: Plugin = {
    id: 'verticalLine',
    afterDatasetsDraw(chart, args, _options, cancelable) {
      const { ctx, scales } = chart;
      const { top, bottom } = chart.chartArea;

      let { startTs, endTs, candles } = (chart.options as typeof options).plugins.verticalLine;

      const startTimeIndex = candles.findIndex(candle => candle.ts >= startTs);
      let endTimeIndex = candles.findIndex(candle => candle.ts >= endTs);
      if (endTimeIndex === -1) {
        endTimeIndex = candles.length - 1;
      }

      const lineStart = scales.x.getPixelForValue(startTimeIndex);
      const lineEnd = scales.x.getPixelForValue(endTimeIndex);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lineStart, top);
      ctx.lineTo(lineStart, bottom);
      ctx.moveTo(lineEnd, top);
      ctx.lineTo(lineEnd, bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff0000';
      ctx.stroke();
      ctx.restore();
    },
  };

  return (
    <div>
      <Chart
        type='line'
        style={{ width: '1200px', height: '300px' }}
        width={1200}
        height={300}
        options={options as any}
        data={data}
        plugins={[
          verticalLinePlugin,
          {
            id: 'trades',
            afterDatasetsDraw(chart, args, _options, cancelable) {
            },
          }
        ]}
      />
    </div>
  )
}