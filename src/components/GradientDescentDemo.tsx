'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Watch a single weight roll downhill. The loss as a function of one weight is
 * a bowl; the derivative (slope) at the current weight tells us which way to
 * step and how big. w ← w − learningRate · slope. This is gradient descent.
 */

const TARGET_W = 0.6;          // the weight that minimizes loss
const loss = (w: number) => (w - TARGET_W) * (w - TARGET_W);
const dLoss = (w: number) => 2 * (w - TARGET_W); // derivative
const START_W = 2.5;

export default function GradientDescentDemo() {
  const [lr, setLr] = useState(0.15);
  const [w, setW] = useState(START_W);
  const [history, setHistory] = useState<number[]>([START_W]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = () => {
    setW(prev => {
      const next = prev - lr * dLoss(prev);
      setHistory(h => [...h, next]);
      return next;
    });
  };

  const reset = () => {
    setRunning(false);
    setW(START_W);
    setHistory([START_W]);
  };

  // auto-run loop, stops when essentially at the minimum
  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setW(prev => {
        if (Math.abs(dLoss(prev)) < 0.01) {
          setRunning(false);
          return prev;
        }
        const next = prev - lr * dLoss(prev);
        setHistory(h => (h.length > 60 ? h : [...h, next]));
        return next;
      });
    }, 450);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running, lr]);

  const slope = dLoss(w);
  const curLoss = loss(w);

  const W = 380, H = 300;
  const pad = { top: 20, right: 20, bottom: 42, left: 46 };
  const plotW = W - pad.left - pad.right;
  const plotH = H - pad.top - pad.bottom;

  const xMin = -1.6, xMax = 2.8;
  const xRange = xMax - xMin;
  const yMin = 0, yMax = loss(START_W) * 1.05;
  const yRange = yMax - yMin;

  const toX = (x: number) => pad.left + ((x - xMin) / xRange) * plotW;
  const toY = (y: number) => pad.top + ((yMax - y) / yRange) * plotH;
  const xAxisY = toY(0);

  const pts = Array.from({ length: 121 }, (_, i) => xMin + (i / 120) * xRange);
  const curvePath = pts
    .map((x, i) => `${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(loss(x)).toFixed(1)}`)
    .join(' ');

  // step arrow (where the derivative wants to move the weight)
  const nextW = w - lr * slope;

  return (
    <div className="gd-wrap">
      <div className="controls">
        <button className="btn primary" onClick={step} disabled={running}>Take one step ↓</button>
        <button className="btn" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Auto-run ▶'}</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
        <label className="lr">
          learning rate <strong>{lr.toFixed(2)}</strong>
          <input type="range" min="0.02" max="0.95" step="0.01" value={lr}
                 onChange={e => { setLr(parseFloat(e.target.value)); }} />
        </label>
      </div>

      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        <defs>
          <marker id="gd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#dc2626" />
          </marker>
        </defs>

        {/* axes */}
        <line x1={pad.left} y1={xAxisY} x2={pad.left + plotW} y2={xAxisY} stroke="#94a3b8" strokeWidth={1.2} />

        {/* minimum marker */}
        <line x1={toX(TARGET_W)} y1={pad.top} x2={toX(TARGET_W)} y2={xAxisY} stroke="#16a34a" strokeWidth={1} strokeDasharray="3,3" />
        <text x={toX(TARGET_W)} y={pad.top - 6} textAnchor="middle" fontSize={9.5} fill="#16a34a" fontWeight="700">best weight</text>

        {/* loss curve */}
        <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth={2.6} strokeLinejoin="round" />

        {/* trajectory of past steps */}
        {history.map((hw, i) => (
          <circle key={i} cx={toX(hw)} cy={toY(loss(hw))} r={3} fill="#94a3b8" opacity={0.55} />
        ))}

        {/* tangent at current weight */}
        <line
          x1={toX(w - 0.6)} y1={toY(curLoss + slope * -0.6)}
          x2={toX(w + 0.6)} y2={toY(curLoss + slope * 0.6)}
          stroke="#f59e0b" strokeWidth={2.6} strokeLinecap="round"
        />

        {/* step arrow along the x-axis */}
        {Math.abs(slope) > 0.02 && (
          <line x1={toX(w)} y1={xAxisY} x2={toX(nextW)} y2={xAxisY}
                stroke="#dc2626" strokeWidth={3} markerEnd="url(#gd-arrow)" />
        )}

        {/* current point */}
        <circle cx={toX(w)} cy={toY(curLoss)} r={6.5} fill="#1e293b" stroke="white" strokeWidth={2} />

        <text x={pad.left + plotW / 2} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">weight value</text>
        <text x={14} y={pad.top + plotH / 2} fontSize={11} fill="#64748b" transform={`rotate(-90, 14, ${pad.top + plotH / 2})`} textAnchor="middle">loss</text>
      </svg>

      <div className="readout">
        <div className="r-item"><span className="r-label">step</span><span className="r-val">{history.length - 1}</span></div>
        <div className="r-item"><span className="r-label">weight</span><span className="r-val">{w.toFixed(3)}</span></div>
        <div className="r-item"><span className="r-label">slope (deriv.)</span><span className="r-val amber">{slope >= 0 ? '+' : ''}{slope.toFixed(3)}</span></div>
        <div className="r-item"><span className="r-label">loss</span><span className="r-val">{curLoss.toFixed(4)}</span></div>
      </div>

      <div className="callout">
        Each step does <code>weight ← weight − {lr.toFixed(2)} × slope</code>. The slope points{' '}
        <strong>uphill</strong>, so subtracting it walks <strong>downhill</strong> toward the lowest loss.
        Big slope → big correction; near the bottom the slope shrinks → the steps shrink → it settles.
        {lr > 0.7 && <> <strong style={{ color: '#dc2626' }}>Try a smaller learning rate</strong> — this one is so big it overshoots and bounces across the bowl.</>}
      </div>

      <style jsx>{`
        .gd-wrap {
          margin: 1.25rem 0; padding: 1.25rem; background: #f8fafc;
          border-radius: 12px; border: 1px solid #e2e8f0;
        }
        .controls {
          display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;
          margin-bottom: 0.85rem;
        }
        .btn {
          font-size: 13px; padding: 0.45rem 0.8rem; border-radius: 7px;
          border: 1px solid #cbd5e1; background: white; color: #334155; cursor: pointer;
        }
        .btn:hover { background: #f1f5f9; }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .btn.primary { background: #2563eb; border-color: #2563eb; color: white; }
        .btn.primary:hover { background: #1d4ed8; }
        .btn.ghost { color: #64748b; }
        .lr { display: flex; flex-direction: column; font-size: 11.5px; color: #475569; margin-left: auto; min-width: 130px; }
        .lr strong { color: #2563eb; }
        .lr input { width: 100%; }
        .readout { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.6rem; }
        .r-item { display: flex; flex-direction: column; align-items: center; }
        .r-label { font-size: 11px; color: #64748b; }
        .r-val { font-size: 14px; font-weight: 700; color: #1e293b; font-variant-numeric: tabular-nums; }
        .r-val.amber { color: #f59e0b; }
        .callout {
          margin-top: 0.9rem; padding: 0.75rem 0.95rem; background: white;
          border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px;
          color: #334155; line-height: 1.55;
        }
        .callout code { background: #eef2ff; padding: 1px 5px; border-radius: 4px; font-size: 12px; }
      `}</style>
    </div>
  );
}
