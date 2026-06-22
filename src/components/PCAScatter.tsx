'use client';

import { useState } from 'react';

// Fixed pseudo-random base values in [-1, 1] for x, and an independent noise
// component for y. No Math.random at render — fully deterministic.
const BASE_X = [
  -0.92, -0.81, -0.74, -0.63, -0.55, -0.47, -0.38, -0.29, -0.21, -0.12,
  -0.04, 0.05, 0.13, 0.22, 0.31, 0.39, 0.48, 0.56, 0.64, 0.73,
  0.81, 0.9, -0.66, -0.18, 0.27, 0.6, -0.35, 0.42, -0.5, 0.7,
];
const NOISE_Y = [
  0.41, -0.62, 0.18, 0.73, -0.34, 0.55, -0.81, 0.29, 0.66, -0.47,
  0.12, -0.7, 0.38, -0.21, 0.84, -0.05, 0.49, -0.58, 0.23, -0.66,
  0.31, -0.4, 0.6, -0.27, 0.77, -0.15, 0.53, -0.72, 0.36, -0.44,
];

const PAD = 36;
const SIZE = 440;
const inner = SIZE - 2 * PAD;
const RANGE = 1.25;

const sx = (x: number) => PAD + ((x + RANGE) / (2 * RANGE)) * inner;
const sy = (y: number) => PAD + ((RANGE - y) / (2 * RANGE)) * inner;

export default function PCAScatter() {
  const [rho, setRho] = useState(0.8);

  // y = rho * x + sqrt(1 - rho^2) * noise  → keeps unit-ish spread, tilts cloud.
  const k = Math.sqrt(Math.max(0, 1 - rho * rho));
  const points = BASE_X.map((x, i) => ({
    x,
    y: rho * x + k * NOISE_Y[i] * 0.85,
  }));

  // Dominant direction: along (1, rho) roughly — draw a guide line.
  const dirLen = 1.15;
  const dirAngle = Math.atan2(rho, 1); // slope of correlation line

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

        {/* dominant direction guide */}
        {Math.abs(rho) > 0.05 && (
          <line
            x1={sx(-dirLen * Math.cos(dirAngle))}
            y1={sy(-dirLen * Math.sin(dirAngle))}
            x2={sx(dirLen * Math.cos(dirAngle))}
            y2={sy(dirLen * Math.sin(dirAngle))}
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="6 5"
            opacity={0.85}
          />
        )}

        {/* points */}
        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4.5} fill="#2563eb" opacity={0.8} />
        ))}

        {/* axis labels */}
        <text x={SIZE - PAD} y={sy(0) - 8} textAnchor="end" fontSize={13} fill="#64748b">
          math score →
        </text>
        <text x={sx(0) + 8} y={PAD + 4} textAnchor="start" fontSize={13} fill="#64748b">
          physics score ↑
        </text>
      </svg>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
          Correlation ρ = {rho.toFixed(2)}
        </label>
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={rho}
          onChange={(e) => setRho(parseFloat(e.target.value))}
          style={{ width: '100%', marginTop: 6 }}
        />
        <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0' }}>
          {rho > 0.6
            ? 'Strongly positive — a tight diagonal cloud. One direction explains almost everything.'
            : rho > 0.2
            ? 'Positive — the cloud tilts upward; the two scores move together.'
            : rho > -0.2
            ? 'Near zero — a round, directionless blob. No single axis dominates.'
            : rho > -0.6
            ? 'Negative — the cloud tilts downward; high math pairs with low physics.'
            : 'Strongly negative — a tight anti-diagonal line.'}
        </p>
      </div>
    </div>
  );
}
