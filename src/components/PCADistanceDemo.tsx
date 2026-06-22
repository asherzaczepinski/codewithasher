'use client';

import { useState } from 'react';

// Deterministic closed-form approximation of distance concentration.
// For n points uniform in the d-dimensional unit cube:
//   mean pairwise distance ≈ sqrt(d / 6)
//   the spread of distances grows like sqrt(d) * const, but RELATIVE spread
//   (std / mean) shrinks ~ 1/sqrt(d), so (max - min)/min → 0.
// We model a representative near/far pair to make the collapse visceral.

function stats(d: number) {
  const mean = Math.sqrt(d / 6);
  // Std of a single coordinate's squared diff is constant; summed over d dims,
  // the std of the squared distance ~ sqrt(d). Distance std ~ const (independent
  // of d to first order). Relative spread therefore ~ 1/sqrt(d).
  const distStd = 0.31; // approx std of pairwise distance, roughly d-independent
  const nearest = Math.max(0.01, mean - 1.6 * distStd);
  const farthest = mean + 1.6 * distStd;
  const ratio = (farthest - nearest) / nearest; // → 0 as d grows
  return { mean, nearest, farthest, ratio };
}

const BAR_W = 360;

export default function PCADistanceDemo() {
  const [d, setD] = useState(2);
  const { mean, nearest, farthest, ratio } = stats(d);

  // gauge: ratio at d=1 is large; normalize against that for the bar fill.
  const ratioAt1 = stats(1).ratio;
  const fill = Math.min(1, ratio / ratioAt1);

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 16,
        margin: '16px 0',
      }}
    >
      <div style={{ fontSize: 14, color: '#1e293b', fontWeight: 600, marginBottom: 4 }}>
        Dimensions d = {d}
      </div>
      <input
        type="range"
        min={1}
        max={50}
        step={1}
        value={d}
        onChange={(e) => setD(parseInt(e.target.value, 10))}
        style={{ width: '100%' }}
      />

      <svg
        viewBox="0 0 440 200"
        style={{ width: '100%', maxWidth: 440, height: 'auto', display: 'block', margin: '12px auto 0' }}
      >
        {/* distance line: nearest and farthest markers on a shared scale */}
        <text x={40} y={28} fontSize={13} fill="#64748b">
          A random point&apos;s nearest vs. farthest neighbor:
        </text>

        {/* track */}
        <line x1={40} y1={70} x2={40 + BAR_W} y2={70} stroke="#e5e7eb" strokeWidth={6} strokeLinecap="round" />

        {/* map distances onto track using a fixed max scale */}
        {(() => {
          const scaleMax = stats(50).farthest;
          const px = (v: number) => 40 + (v / scaleMax) * BAR_W;
          return (
            <>
              <line x1={px(nearest)} y1={70} x2={px(farthest)} y2={70} stroke="#2563eb" strokeWidth={6} strokeLinecap="round" opacity={0.5} />
              <circle cx={px(nearest)} cy={70} r={7} fill="#10b981" />
              <circle cx={px(farthest)} cy={70} r={7} fill="#dc2626" />
              <text x={px(nearest)} y={94} fontSize={11} fill="#10b981" textAnchor="middle">
                near {nearest.toFixed(2)}
              </text>
              <text x={px(farthest)} y={56} fontSize={11} fill="#dc2626" textAnchor="middle">
                far {farthest.toFixed(2)}
              </text>
            </>
          );
        })()}

        {/* relative spread gauge */}
        <text x={40} y={130} fontSize={13} fill="#1e293b" fontWeight={600}>
          (far − near) / near = {(ratio * 100).toFixed(0)}%
        </text>
        <rect x={40} y={140} width={BAR_W} height={16} rx={8} fill="#f1f5f9" />
        <rect x={40} y={140} width={Math.max(2, fill * BAR_W)} height={16} rx={8} fill={ratio < 0.3 ? '#dc2626' : '#3b82f6'} />
        <text x={40} y={182} fontSize={12} fill="#64748b">
          avg distance ≈ √(d/6) = {mean.toFixed(2)}
        </text>
      </svg>

      <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0' }}>
        {ratio < 0.25
          ? 'In high dimensions the nearest and farthest neighbors are almost the same distance away. "Nearest neighbor" has stopped meaning anything.'
          : ratio < 0.7
          ? 'Distances are starting to bunch up. The gap between near and far is shrinking fast.'
          : 'In low dimensions, near and far neighbors are clearly different distances apart — geometry still works.'}
      </p>
    </div>
  );
}
