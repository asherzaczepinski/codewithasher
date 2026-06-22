'use client';

import { useState } from 'react';

// The 5 mean-centered student points (math, physics).
const POINTS = [
  [-15, -17],
  [-5, -3],
  [0, -1],
  [5, 4],
  [15, 17],
];

const PAD = 36;
const SIZE = 440;
const inner = SIZE - 2 * PAD;
const RANGE = 22;

const sx = (x: number) => PAD + ((x + RANGE) / (2 * RANGE)) * inner;
const sy = (y: number) => PAD + ((RANGE - y) / (2 * RANGE)) * inner;

export default function PCAVarianceDirection() {
  const [deg, setDeg] = useState(30);
  const theta = (deg * Math.PI) / 180;
  const ux = Math.cos(theta);
  const uy = Math.sin(theta);

  // Project each point onto unit direction u: t_i = p · u.
  const projections = POINTS.map(([px, py]) => px * ux + py * uy);
  const meanT = projections.reduce((a, b) => a + b, 0) / projections.length; // ≈ 0 (centered)
  const variance =
    projections.reduce((a, t) => a + (t - meanT) * (t - meanT), 0) / projections.length;

  const maxVar = 224.5;
  const nearMax = Math.abs(variance - maxVar) < 8;

  // Direction line endpoints (long).
  const L = 21;

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
        <line x1={PAD} y1={sy(0)} x2={SIZE - PAD} y2={sy(0)} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={SIZE - PAD} stroke="#e5e7eb" strokeWidth={1} />

        {/* direction line through origin */}
        <line
          x1={sx(-L * ux)}
          y1={sy(-L * uy)}
          x2={sx(L * ux)}
          y2={sy(L * uy)}
          stroke={nearMax ? '#dc2626' : '#3b82f6'}
          strokeWidth={2.5}
        />

        {/* perpendiculars + projected points */}
        {POINTS.map(([px, py], i) => {
          const t = projections[i];
          const fx = t * ux;
          const fy = t * uy;
          return (
            <g key={i}>
              <line
                x1={sx(px)}
                y1={sy(py)}
                x2={sx(fx)}
                y2={sy(fy)}
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <circle cx={sx(fx)} cy={sy(fy)} r={4} fill={nearMax ? '#dc2626' : '#3b82f6'} />
              <circle cx={sx(px)} cy={sy(py)} r={5} fill="#2563eb" />
            </g>
          );
        })}

        <text x={SIZE - PAD} y={sy(0) - 8} textAnchor="end" fontSize={12} fill="#64748b">
          centered math →
        </text>
        <text x={sx(0) + 8} y={PAD + 4} textAnchor="start" fontSize={12} fill="#64748b">
          centered physics ↑
        </text>
      </svg>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
          Direction angle θ = {deg}°
        </label>
        <input
          type="range"
          min={0}
          max={180}
          step={1}
          value={deg}
          onChange={(e) => setDeg(parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: 6 }}
        />
      </div>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 8,
          background: nearMax ? '#fef2f2' : '#f8fafc',
          border: `1px solid ${nearMax ? '#fecaca' : '#e2e8f0'}`,
        }}
      >
        <div style={{ fontSize: 15, color: '#1e293b' }}>
          Variance of projected scores:{' '}
          <strong style={{ color: nearMax ? '#dc2626' : '#2563eb' }}>{variance.toFixed(1)}</strong>
        </div>
        {nearMax && (
          <div style={{ fontSize: 13, color: '#dc2626', marginTop: 4, fontWeight: 600 }}>
            Maximum! This direction (≈45°) is the first principal component — it matches λ₁ ≈ 224.5.
          </div>
        )}
        {!nearMax && (
          <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
            Rotate toward 45° to maximize the spread of the projections.
          </div>
        )}
      </div>
    </div>
  );
}
