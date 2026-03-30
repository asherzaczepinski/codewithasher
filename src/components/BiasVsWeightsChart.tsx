'use client';

import { useState } from 'react';

export default function BiasVsWeightsChart() {
  const [inputVal, setInputVal] = useState(0.4);

  // Both inputs = inputVal for simplicity
  // Small weights (0.5, 0.5), no bias: sum = inputVal
  // Real weights (3, 3), bias -4:     sum = 6*inputVal - 4

  const smallSum = inputVal;
  const biasSum = 6 * inputVal - 4;

  const W = 210, H = 185;
  const pad = { top: 28, right: 18, bottom: 38, left: 46 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const yMin = -4.5, yMax = 1.8;
  const yRange = yMax - yMin;

  const toX = (x: number) => pad.left + x * plotW;
  const toY = (y: number) => pad.top + ((yMax - y) / yRange) * plotH;
  const zeroY = toY(0);

  const pts = Array.from({ length: 101 }, (_, i) => i / 100);
  const toPath = (fn: (x: number) => number) =>
    pts.map((x, i) => `${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(fn(x)).toFixed(1)}`).join(' ');

  const smallPath = toPath(x => x);
  const biasPath  = toPath(x => 6 * x - 4);

  const yTicks = [-4, -3, -2, -1, 0, 1];

  const Chart = ({
    title, subtitle, path, dotY, dotColor, sumLabel, aboveNote, belowNote, lineColor,
  }: {
    title: string; subtitle: string; path: string; dotY: number;
    dotColor: string; sumLabel: string; aboveNote: string; belowNote: string; lineColor: string;
  }) => (
    <div className="chart-wrap">
      <div className="chart-title">{title}</div>
      <div className="chart-sub">{subtitle}</div>
      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
        {/* Silent zone */}
        <rect x={pad.left} y={zeroY} width={plotW} height={Math.max(0, pad.top + plotH - zeroY)} fill="rgba(239,68,68,0.08)" />
        {/* Fires zone */}
        <rect x={pad.left} y={pad.top} width={plotW} height={Math.max(0, zeroY - pad.top)} fill="rgba(34,197,94,0.1)" />

        {/* Y axis ticks */}
        {yTicks.map(v => (
          <g key={v}>
            <line x1={pad.left - 4} y1={toY(v)} x2={pad.left} y2={toY(v)} stroke="#94a3b8" strokeWidth={1} />
            <text x={pad.left - 7} y={toY(v) + 4} textAnchor="end" fontSize={9} fill="#64748b">{v}</text>
          </g>
        ))}

        {/* Axes */}
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top + plotH} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={pad.left} y1={pad.top + plotH} x2={pad.left + plotW} y2={pad.top + plotH} stroke="#cbd5e1" strokeWidth={1} />

        {/* Zero line */}
        <line x1={pad.left} y1={zeroY} x2={pad.left + plotW} y2={zeroY}
          stroke="#475569" strokeWidth={1.2} strokeDasharray="4,3" />

        {/* Zone labels */}
        <text x={pad.left + plotW - 4} y={zeroY - 5} textAnchor="end" fontSize={8.5} fill="#16a34a" fontWeight="600">{aboveNote}</text>
        <text x={pad.left + plotW - 4} y={zeroY + 11} textAnchor="end" fontSize={8.5} fill="#dc2626" fontWeight="600">{belowNote}</text>

        {/* The line */}
        <path d={path} fill="none" stroke={lineColor} strokeWidth={2.2} strokeLinejoin="round" />

        {/* Moving dot */}
        <line x1={toX(inputVal)} y1={pad.top} x2={toX(inputVal)} y2={pad.top + plotH}
          stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,2" />
        <circle cx={toX(inputVal)} cy={toY(dotY)} r={5}
          fill={dotColor} stroke="white" strokeWidth={1.5} />

        {/* Sum label */}
        <text
          x={Math.min(toX(inputVal) + 6, W - 55)}
          y={Math.max(toY(dotY) - 7, pad.top + 10)}
          fontSize={9.5} fill="#1e293b" fontWeight="700">{sumLabel}</text>

        {/* X axis labels */}
        <text x={toX(0)} y={pad.top + plotH + 14} textAnchor="middle" fontSize={9} fill="#64748b">0</text>
        <text x={toX(0.5)} y={pad.top + plotH + 14} textAnchor="middle" fontSize={9} fill="#64748b">0.5</text>
        <text x={toX(1)} y={pad.top + plotH + 14} textAnchor="middle" fontSize={9} fill="#64748b">1.0</text>
        <text x={pad.left + plotW / 2} y={H - 4} textAnchor="middle" fontSize={9} fill="#94a3b8">input strength</text>
      </svg>
    </div>
  );

  return (
    <div className="bvw-wrap">
      <div className="slider-row">
        <label>
          Input strength: <strong>{inputVal.toFixed(2)}</strong>
          <span className="hint"> (both temp &amp; humidity set to this value)</span>
        </label>
        <input type="range" min="0" max="1" step="0.01" value={inputVal}
          onChange={e => setInputVal(parseFloat(e.target.value))} />
      </div>

      <div className="charts-row">
        <Chart
          title="Small weights (0.5, 0.5)"
          subtitle="no bias"
          path={smallPath}
          dotY={smallSum}
          dotColor={smallSum > 0 ? '#16a34a' : '#dc2626'}
          sumLabel={`sum = ${smallSum.toFixed(2)}`}
          aboveNote="fires ↑"
          belowNote="silent ↓"
          lineColor="#3b82f6"
        />
        <Chart
          title="Real weights (3, 3)"
          subtitle="bias = −4"
          path={biasPath}
          dotY={biasSum}
          dotColor={biasSum > 0 ? '#16a34a' : '#dc2626'}
          sumLabel={`sum = ${biasSum.toFixed(2)}`}
          aboveNote="fires ↑"
          belowNote="silent ↓"
          lineColor="#8b5cf6"
        />
      </div>

      <div className="callout">
        {inputVal < 0.67
          ? <>At input <strong>{inputVal.toFixed(2)}</strong>: small weights give <strong style={{ color: '#16a34a' }}>{smallSum.toFixed(2)}</strong> — already firing. Real weights + bias give <strong style={{ color: '#dc2626' }}>{biasSum.toFixed(2)}</strong> — definitively silent. The bias creates a dead zone small weights never can.</>
          : <>At input <strong>{inputVal.toFixed(2)}</strong>: both fire now — but drag the slider left and watch how small weights fire even on weak signals while bias stays silent until the threshold is crossed.</>
        }
      </div>

      <style jsx>{`
        .bvw-wrap {
          margin: 1.25rem 0;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .slider-row {
          margin-bottom: 1rem;
        }
        .slider-row label {
          display: block;
          font-size: 14px;
          color: #334155;
          margin-bottom: 0.4rem;
        }
        .slider-row strong { color: #2563eb; }
        .hint { font-size: 11px; color: #94a3b8; }
        .slider-row input[type="range"] {
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          background: #e2e8f0;
          border-radius: 4px;
          outline: none;
        }
        .slider-row input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
        }
        .charts-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .chart-wrap {
          flex: 1;
          min-width: 200px;
          max-width: 230px;
        }
        .chart-title {
          text-align: center;
          font-weight: 700;
          font-size: 13px;
          color: #1e293b;
          margin-bottom: 1px;
        }
        .chart-sub {
          text-align: center;
          font-size: 11px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .callout {
          margin-top: 0.75rem;
          padding: 0.6rem 0.85rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          color: #334155;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
