'use client';

import { useState } from 'react';

const PAD = 44;
const SIZE = 440;
const inner = SIZE - 2 * PAD;
// raw scores roughly 55..95
const MIN = 54;
const MAX = 96;

const sx = (x: number) => PAD + ((x - MIN) / (MAX - MIN)) * inner;
const sy = (y: number) => PAD + ((MAX - y) / (MAX - MIN)) * inner;

const MEAN = [75, 75];
const INV_SQRT2 = 0.707;

// Raw student points (math, physics)
const STUDENTS = [
  { id: 1, x: 60, y: 58 },
  { id: 2, x: 70, y: 72 },
  { id: 3, x: 75, y: 74 },
  { id: 4, x: 80, y: 79 },
  { id: 5, x: 90, y: 92 },
];

// PC1 score for a raw point
function scorePC1(p: { x: number; y: number }) {
  return (p.x - MEAN[0]) * INV_SQRT2 + (p.y - MEAN[1]) * INV_SQRT2;
}
// Reconstruct from PC1 only: x_hat = score * v1 + mean
function reconPC1(p: { x: number; y: number }) {
  const s = scorePC1(p);
  return { x: s * INV_SQRT2 + MEAN[0], y: s * INV_SQRT2 + MEAN[1] };
}

export default function PCAReconstruction() {
  const [k, setK] = useState(1);

  // total reconstruction error (sum of squared residuals) for k=1
  let totalErr = 0;
  STUDENTS.forEach((s) => {
    const r = reconPC1(s);
    totalErr += (s.x - r.x) ** 2 + (s.y - r.y) ** 2;
  });

  const showResiduals = k === 1;

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
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ width: '100%', maxWidth: 440, height: 'auto', display: 'block', margin: '0 auto' }}
      >
        {/* axes */}
        <line x1={PAD} y1={sy(MIN)} x2={SIZE - PAD} y2={sy(MIN)} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={sx(MIN)} y1={PAD} x2={sx(MIN)} y2={SIZE - PAD} stroke="#e5e7eb" strokeWidth={1} />
        <text x={SIZE - PAD} y={sy(MIN) + 20} textAnchor="end" fontSize={12} fill="#64748b">
          math →
        </text>
        <text x={sx(MIN) - 8} y={PAD + 4} textAnchor="end" fontSize={12} fill="#64748b">
          physics ↑
        </text>

        {/* PC1 line through the mean, 45° */}
        <line
          x1={sx(MEAN[0] - 24)}
          y1={sy(MEAN[1] - 24)}
          x2={sx(MEAN[0] + 24)}
          y2={sy(MEAN[1] + 24)}
          stroke="#dc2626"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          opacity={0.6}
        />

        {/* residual lines (k=1) */}
        {showResiduals &&
          STUDENTS.map((s) => {
            const r = reconPC1(s);
            return (
              <line
                key={`res-${s.id}`}
                x1={sx(s.x)}
                y1={sy(s.y)}
                x2={sx(r.x)}
                y2={sy(r.y)}
                stroke="#f59e0b"
                strokeWidth={2}
              />
            );
          })}

        {/* reconstructed points */}
        {STUDENTS.map((s) => {
          const r = k === 1 ? reconPC1(s) : { x: s.x, y: s.y };
          return (
            <circle
              key={`recon-${s.id}`}
              cx={sx(r.x)}
              cy={sy(r.y)}
              r={5}
              fill="none"
              stroke="#dc2626"
              strokeWidth={2}
            />
          );
        })}

        {/* original points */}
        {STUDENTS.map((s) => (
          <g key={`orig-${s.id}`}>
            <circle cx={sx(s.x)} cy={sy(s.y)} r={5} fill="#2563eb" />
            <text x={sx(s.x) + 8} y={sy(s.y) - 7} fontSize={11} fill="#1e293b">
              S{s.id}
            </text>
          </g>
        ))}

        {/* legend */}
        <g transform={`translate(${PAD + 4}, ${SIZE - PAD + 4})`}>
          <circle cx={6} cy={0} r={5} fill="#2563eb" />
          <text x={16} y={4} fontSize={11} fill="#64748b">
            original
          </text>
          <circle cx={86} cy={0} r={5} fill="none" stroke="#dc2626" strokeWidth={2} />
          <text x={96} y={4} fontSize={11} fill="#64748b">
            reconstructed
          </text>
        </g>
      </svg>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
          Components kept: k = {k}
        </label>
        <input
          type="range"
          min={1}
          max={2}
          step={1}
          value={k}
          onChange={(e) => setK(parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: 6 }}
        />
        <div
          style={{
            marginTop: 10,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '10px 12px',
          }}
        >
          {k === 1 ? (
            <p style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>
              With <strong>k = 1</strong> we rebuild every point from its PC1 score only:
              x̂ = score · [0.707, 0.707] + [75, 75]. The reconstructed points (red rings) all
              land exactly on the PC1 line. The orange residual lines show what we lost — the
              math-vs-physics imbalance that lived on PC2.
              <br />
              Total squared reconstruction error ≈ <strong>{totalErr.toFixed(1)}</strong>. That
              residual is the variance carried by the discarded PC2 — tied to λ₂ ≈ 4.6.
            </p>
          ) : (
            <p style={{ fontSize: 13, color: '#1e293b', margin: 0 }}>
              With <strong>k = 2</strong> we keep both components, so reconstruction is{' '}
              <strong>exact</strong>: every red ring sits on its blue point. Total error ={' '}
              <strong>0</strong>. Keeping all components means no compression and no loss.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
