'use client';

import { useState } from 'react';

/**
 * Interactive y = x² with a draggable point. Shows the tangent line at that
 * point and reads off the derivative (slope = 2x). The whole idea: the
 * derivative is just the slope of the curve at a single point.
 */
export default function TangentExplorer() {
  const [x0, setX0] = useState(1.2);

  const y0 = x0 * x0;
  const slope = 2 * x0; // derivative of x²

  const W = 380, H = 320;
  const pad = { top: 20, right: 20, bottom: 40, left: 44 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const xMin = -3, xMax = 3;
  const xRange = xMax - xMin;
  const yMin = 0, yMax = 9;
  const yRange = yMax - yMin;

  const toX = (x: number) => pad.left + ((x - xMin) / xRange) * plotW;
  const toY = (y: number) => pad.top + ((yMax - y) / yRange) * plotH;

  const xAxisY = toY(0);

  // Loss curve y = x²
  const pts = Array.from({ length: 121 }, (_, i) => xMin + (i / 120) * xRange);
  const curvePath = pts
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(x * x).toFixed(1)}`)
    .join(' ');

  // Tangent line: y = y0 + slope * (x - x0), drawn across a fixed pixel span
  const tangentY = (x: number) => y0 + slope * (x - x0);
  const tanSpan = 1.5;
  const tx1 = Math.max(xMin, x0 - tanSpan);
  const tx2 = Math.min(xMax, x0 + tanSpan);

  // "rise over run" guide marks one step to the right of the point
  const runEnd = Math.min(xMax - 0.1, x0 + 0.8);
  const run = runEnd - x0;
  const rise = slope * run;

  return (
    <div className="te-wrap">
      <div className="slider-row">
        <label>
          Drag the point — move <strong>x</strong>:{' '}
          <strong className="xval">{x0 >= 0 ? '+' : ''}{x0.toFixed(2)}</strong>
        </label>
        <input
          type="range" min="-2.8" max="2.8" step="0.01" value={x0}
          onChange={e => setX0(parseFloat(e.target.value))}
        />
      </div>

      <div className="legend">
        <span><i style={{ background: '#3b82f6' }} /> the curve y = x²</span>
        <span><i style={{ background: '#f59e0b' }} /> tangent (the slope right here)</span>
      </div>

      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {/* axes */}
        <line x1={toX(0)} y1={pad.top} x2={toX(0)} y2={pad.top + plotH} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={pad.left} y1={xAxisY} x2={pad.left + plotW} y2={xAxisY} stroke="#94a3b8" strokeWidth={1.2} />

        {/* y ticks */}
        {[2, 4, 6, 8].map(v => (
          <g key={v}>
            <line x1={pad.left - 3} y1={toY(v)} x2={pad.left} y2={toY(v)} stroke="#94a3b8" strokeWidth={1} />
            <text x={pad.left - 6} y={toY(v) + 3} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
          </g>
        ))}
        {/* x ticks */}
        {[-2, -1, 1, 2].map(v => (
          <text key={v} x={toX(v)} y={xAxisY + 15} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
        ))}

        {/* curve */}
        <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.6} strokeLinejoin="round" />

        {/* rise / run triangle */}
        <line x1={toX(x0)} y1={toY(y0)} x2={toX(runEnd)} y2={toY(y0)} stroke="#10b981" strokeWidth={1.6} strokeDasharray="4,3" />
        <line x1={toX(runEnd)} y1={toY(y0)} x2={toX(runEnd)} y2={toY(tangentY(runEnd))} stroke="#10b981" strokeWidth={1.6} strokeDasharray="4,3" />
        <text x={(toX(x0) + toX(runEnd)) / 2} y={toY(y0) + 14} textAnchor="middle" fontSize={9.5} fill="#059669">run {run.toFixed(2)}</text>
        <text x={toX(runEnd) + 5} y={(toY(y0) + toY(tangentY(runEnd))) / 2} fontSize={9.5} fill="#059669">rise {rise.toFixed(2)}</text>

        {/* tangent line */}
        <line
          x1={toX(tx1)} y1={toY(tangentY(tx1))}
          x2={toX(tx2)} y2={toY(tangentY(tx2))}
          stroke="#f59e0b" strokeWidth={3} strokeLinecap="round"
        />

        {/* point */}
        <circle cx={toX(x0)} cy={toY(y0)} r={6} fill="#1e293b" stroke="white" strokeWidth={2} />

        {/* x axis label */}
        <text x={pad.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">x</text>
      </svg>

      <div className="readout">
        <div className="r-item">
          <span className="r-label">point</span>
          <span className="r-val">({x0.toFixed(2)}, {y0.toFixed(2)})</span>
        </div>
        <div className="r-item">
          <span className="r-label">slope = 2x</span>
          <span className="r-val amber">{slope >= 0 ? '+' : ''}{slope.toFixed(2)}</span>
        </div>
        <div className="r-item">
          <span className="r-label">rise ÷ run</span>
          <span className="r-val green">{rise.toFixed(2)} ÷ {run.toFixed(2)} = {slope.toFixed(2)}</span>
        </div>
      </div>

      <div className="callout">
        {Math.abs(slope) < 0.15 ? (
          <>At <strong>x ≈ 0</strong> the curve is flat — the tangent is horizontal and the slope is <strong>≈ 0</strong>. The bottom of the bowl: nowhere left to descend.</>
        ) : x0 < 0 ? (
          <>On the <strong>left side</strong> the curve heads downhill, so the slope is <strong>negative</strong> ({slope.toFixed(2)}). The further left you go, the steeper it gets.</>
        ) : (
          <>On the <strong>right side</strong> the curve climbs, so the slope is <strong>positive</strong> ({slope.toFixed(2)}). Notice the tangent matches <strong>2x</strong> exactly — that&apos;s the derivative.</>
        )}
      </div>

      <style jsx>{`
        .te-wrap {
          margin: 1.25rem 0;
          padding: 1.25rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .slider-row { margin-bottom: 0.75rem; }
        .slider-row label { display: block; font-size: 14px; color: #334155; margin-bottom: 0.4rem; }
        .slider-row .xval { color: #2563eb; font-variant-numeric: tabular-nums; }
        .slider-row input[type="range"] {
          width: 100%; height: 8px; -webkit-appearance: none;
          background: #e2e8f0; border-radius: 4px; outline: none;
        }
        .slider-row input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 20px; height: 20px;
          background: #2563eb; border-radius: 50%; cursor: pointer;
        }
        .legend {
          display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
          margin-bottom: 0.5rem; font-size: 11.5px; color: #475569;
        }
        .legend span { display: inline-flex; align-items: center; gap: 0.4rem; }
        .legend i { display: inline-block; width: 14px; height: 3px; border-radius: 2px; }
        .readout {
          display: flex; justify-content: space-around; flex-wrap: wrap; gap: 0.5rem;
          margin-top: 0.6rem;
        }
        .r-item { display: flex; flex-direction: column; align-items: center; }
        .r-label { font-size: 11px; color: #64748b; }
        .r-val { font-size: 14px; font-weight: 700; color: #1e293b; font-variant-numeric: tabular-nums; }
        .r-val.amber { color: #f59e0b; }
        .r-val.green { color: #059669; font-size: 12.5px; }
        .callout {
          margin-top: 0.9rem; padding: 0.75rem 0.95rem; background: white;
          border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px;
          color: #334155; line-height: 1.55;
        }
      `}</style>
    </div>
  );
}
