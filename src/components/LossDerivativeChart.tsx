'use client';

import { useState } from 'react';

export default function LossDerivativeChart() {
  const [errorVal, setErrorVal] = useState(0.9);

  const smoothLoss = errorVal * errorVal;
  const smoothSlope = 2 * errorVal;

  const absLoss = Math.abs(errorVal);
  const absSlope = errorVal === 0 ? 0 : Math.sign(errorVal);

  const W = 260, H = 215;
  const pad = { top: 26, right: 18, bottom: 60, left: 38 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const xMin = -1.5, xMax = 1.5;
  const xRange = xMax - xMin;
  const yMin = 0, yMax = 2.4;
  const yRange = yMax - yMin;

  const toX = (x: number) => pad.left + ((x - xMin) / xRange) * plotW;
  const toY = (y: number) => pad.top + ((yMax - y) / yRange) * plotH;

  const xAxisY = toY(0);

  const pts = Array.from({ length: 121 }, (_, i) => xMin + (i / 120) * xRange);
  const toPath = (fn: (x: number) => number) =>
    pts.map((x, i) => `${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(fn(x)).toFixed(1)}`).join(' ');

  const squarePath = toPath(x => x * x);
  const absPath = toPath(x => Math.abs(x));

  const tangentDX = 0.55;
  const shiftScale = 22;

  type ChartProps = {
    chartId: string;
    title: string;
    formula: string;
    curvePath: string;
    curveColor: string;
    loss: number;
    slope: number;
    tangentY: (x: number) => number;
  };

  const Chart = ({ chartId, title, formula, curvePath, curveColor, loss, slope, tangentY }: ChartProps) => {
    const tanX1 = Math.max(xMin + 0.05, errorVal - tangentDX);
    const tanX2 = Math.min(xMax - 0.05, errorVal + tangentDX);
    const arrowPxLen = -slope * shiftScale;

    return (
      <div className="chart-wrap">
        <div className="chart-title">{title}</div>
        <div className="chart-sub">slope here = <strong>{formula}</strong></div>
        <svg width={W} height={H} style={{ display: 'block', margin: '0 auto' }}>
          <defs>
            <marker id={`arrow-${chartId}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
            </marker>
          </defs>

          {/* y-axis (vertical line at x=0) */}
          <line x1={toX(0)} y1={pad.top} x2={toX(0)} y2={xAxisY} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3,3" />
          {/* x-axis */}
          <line x1={pad.left} y1={xAxisY} x2={pad.left + plotW} y2={xAxisY} stroke="#94a3b8" strokeWidth={1.2} />

          {/* y-ticks */}
          {[0.5, 1, 1.5, 2].map(v => (
            <g key={v}>
              <line x1={pad.left - 3} y1={toY(v)} x2={pad.left} y2={toY(v)} stroke="#94a3b8" strokeWidth={1} />
              <text x={pad.left - 5} y={toY(v) + 3} textAnchor="end" fontSize={9} fill="#64748b">{v}</text>
            </g>
          ))}

          {/* x-ticks */}
          {[-1, 1].map(v => (
            <text key={v} x={toX(v)} y={xAxisY + 12} textAnchor="middle" fontSize={9} fill="#64748b">{v}</text>
          ))}
          <text x={toX(0)} y={xAxisY + 12} textAnchor="middle" fontSize={9.5} fill="#16a34a" fontWeight="700">0</text>

          {/* Loss curve */}
          <path d={curvePath} fill="none" stroke={curveColor} strokeWidth={2.4} strokeLinejoin="round" />

          {/* Tangent line at current point */}
          <line
            x1={toX(tanX1)} y1={toY(tangentY(tanX1))}
            x2={toX(tanX2)} y2={toY(tangentY(tanX2))}
            stroke="#f59e0b" strokeWidth={2.6} />

          {/* Vertical guide from point to x-axis */}
          <line x1={toX(errorVal)} y1={toY(loss)} x2={toX(errorVal)} y2={xAxisY}
                stroke="#94a3b8" strokeWidth={0.8} strokeDasharray="2,2" />

          {/* Current point dot */}
          <circle cx={toX(errorVal)} cy={toY(loss)} r={5.5} fill="#1e293b" stroke="white" strokeWidth={2} />

          {/* x-axis label */}
          <text x={pad.left + plotW / 2} y={xAxisY + 26} textAnchor="middle" fontSize={10} fill="#64748b">
            error (prediction − target)
          </text>

          {/* Shift indicator track */}
          <g transform={`translate(0, ${H - 14})`}>
            <line x1={pad.left + 10} y1={0} x2={pad.left + plotW - 10} y2={0} stroke="#e2e8f0" strokeWidth={2} />
            {/* target tick */}
            <line x1={toX(0)} y1={-5} x2={toX(0)} y2={5} stroke="#16a34a" strokeWidth={2} />
            <text x={toX(0)} y={-8} textAnchor="middle" fontSize={8.5} fill="#16a34a" fontWeight="700">target</text>
            {/* shift arrow */}
            {Math.abs(slope) > 0.02 && (
              <line
                x1={toX(errorVal)} y1={0}
                x2={toX(errorVal) + arrowPxLen} y2={0}
                stroke="#dc2626" strokeWidth={2.8}
                markerEnd={`url(#arrow-${chartId})`} />
            )}
            <circle cx={toX(errorVal)} cy={0} r={3.5} fill="#1e293b" />
          </g>
        </svg>
        <div className="metrics">
          <span>loss <strong>{loss.toFixed(3)}</strong></span>
          <span>slope <strong style={{ color: '#f59e0b' }}>{slope.toFixed(2)}</strong></span>
          <span>shift <strong style={{ color: '#dc2626' }}>{(-slope).toFixed(2)}</strong></span>
        </div>
      </div>
    );
  };

  return (
    <div className="ld-wrap">
      <div className="slider-row">
        <label>
          Drag the error (prediction − target):{' '}
          <strong>{errorVal >= 0 ? '+' : ''}{errorVal.toFixed(2)}</strong>
        </label>
        <input type="range" min="-1.4" max="1.4" step="0.01" value={errorVal}
               onChange={e => setErrorVal(parseFloat(e.target.value))} />
      </div>

      <div className="legend">
        <span><i style={{ background: '#3b82f6' }}/> loss curve</span>
        <span><i style={{ background: '#f59e0b' }}/> tangent (slope at this point)</span>
        <span><i style={{ background: '#dc2626' }}/> shift the network wants to make</span>
      </div>

      <div className="charts-row">
        <Chart
          chartId="sq"
          title="Squared loss:  y = x²"
          formula="2x"
          curvePath={squarePath}
          curveColor="#3b82f6"
          loss={smoothLoss}
          slope={smoothSlope}
          tangentY={(x) => smoothLoss + smoothSlope * (x - errorVal)}
        />
        <Chart
          chartId="abs"
          title="Absolute loss:  y = |x|"
          formula="+1 or −1"
          curvePath={absPath}
          curveColor="#8b5cf6"
          loss={absLoss}
          slope={absSlope}
          tangentY={(x) => absLoss + absSlope * (x - errorVal)}
        />
      </div>

      <div className="callout">
        {Math.abs(errorVal) < 0.06 ? (
          <>At <strong>error ≈ 0</strong> (basically at the target): x² has slope ≈ 0, so the network correctly stops moving. But |x| has a sharp corner here — its slope flips between −1 and +1 with no warning, so training stays jittery exactly where you want it to settle down.</>
        ) : Math.abs(errorVal) < 0.35 ? (
          <>We&apos;re <strong>close to the target</strong>. x² gives a tiny shift of <strong style={{ color: '#3b82f6' }}>{(-smoothSlope).toFixed(2)}</strong> — a gentle nudge. But |x| still demands a full <strong style={{ color: '#8b5cf6' }}>{(-absSlope).toFixed(2)}</strong> shift — way more than the small correction we actually need. That&apos;s how |x| overshoots and bounces around the target.</>
        ) : (
          <>We&apos;re <strong>far from the target</strong>. x² gives a big shift of <strong style={{ color: '#3b82f6' }}>{(-smoothSlope).toFixed(2)}</strong> — proportional to how wrong we are, urging fast correction. |x| only gives <strong style={{ color: '#8b5cf6' }}>{(-absSlope).toFixed(2)}</strong>, the same step it would give if we were almost right. It learns the same speed whether the answer is close or miles off.</>
        )}
      </div>

      <style jsx>{`
        .ld-wrap {
          margin: 1.25rem 0;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .slider-row { margin-bottom: 0.75rem; }
        .slider-row label {
          display: block;
          font-size: 14px;
          color: #334155;
          margin-bottom: 0.4rem;
        }
        .slider-row strong { color: #2563eb; }
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
        .legend {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 0.85rem;
          font-size: 11.5px;
          color: #475569;
        }
        .legend span {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .legend i {
          display: inline-block;
          width: 14px;
          height: 3px;
          border-radius: 2px;
        }
        .charts-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .chart-wrap {
          flex: 1;
          min-width: 240px;
          max-width: 280px;
        }
        .chart-title {
          text-align: center;
          font-weight: 700;
          font-size: 13.5px;
          color: #1e293b;
        }
        .chart-sub {
          text-align: center;
          font-size: 11.5px;
          color: #64748b;
          margin-bottom: 4px;
        }
        .chart-sub strong {
          color: #f59e0b;
          font-variant-numeric: tabular-nums;
        }
        .metrics {
          display: flex;
          justify-content: space-around;
          margin-top: 0.35rem;
          font-size: 11.5px;
          color: #475569;
        }
        .metrics strong {
          color: #1e293b;
          font-variant-numeric: tabular-nums;
        }
        .callout {
          margin-top: 0.9rem;
          padding: 0.75rem 0.95rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 13px;
          color: #334155;
          line-height: 1.55;
        }
      `}</style>
    </div>
  );
}
