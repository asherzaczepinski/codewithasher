'use client';

import { useState } from 'react';

const PAD = 36;
const SIZE = 440;
const inner = SIZE - 2 * PAD;
const RANGE = 1.25;

const sx = (x: number) => PAD + ((x + RANGE) / (2 * RANGE)) * inner;
const sy = (y: number) => PAD + ((RANGE - y) / (2 * RANGE)) * inner;

// Covariance matrix C = [[100, 109], [109, 129]]
const C = [
  [100, 109],
  [109, 129],
];

function applyC(vx: number, vy: number) {
  return [C[0][0] * vx + C[0][1] * vy, C[1][0] * vx + C[1][1] * vy];
}

export default function PCAEigenDemo() {
  const [deg, setDeg] = useState(20);

  const theta = (deg * Math.PI) / 180;
  // Unit input vector
  const ix = Math.cos(theta);
  const iy = Math.sin(theta);

  // Output Cv (large numbers — scale down to fit the unit-ish plot)
  const [ox, oy] = applyC(ix, iy);
  const outLen = Math.hypot(ox, oy);
  const SCALE = 1 / 130; // squeeze ~224 magnitude into the box
  const dox = ox * SCALE;
  const doy = oy * SCALE;

  // Angle between input and output (0 or 180 => parallel => eigenvector)
  const dot = ix * ox + iy * oy;
  const cosA = dot / (1 * outLen);
  const angleBetween = (Math.acos(Math.max(-1, Math.min(1, Math.abs(cosA)))) * 180) / Math.PI;
  const isEigen = angleBetween < 3; // within 3° of parallel/anti-parallel

  // Effective stretch factor (output magnitude / input magnitude) when aligned
  const lambdaApprox = outLen; // input is unit length

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
        <defs>
          <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#2563eb" />
          </marker>
          <marker id="arrowRed" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
            <path d="M0,0 L7,3 L0,6 Z" fill="#dc2626" />
          </marker>
        </defs>

        {/* axes */}
        <line x1={PAD} y1={sy(0)} x2={SIZE - PAD} y2={sy(0)} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={SIZE - PAD} stroke="#e5e7eb" strokeWidth={1} />

        {/* eigenvector reference lines (45° and 135°) */}
        <line
          x1={sx(-1.2)}
          y1={sy(-1.2)}
          x2={sx(1.2)}
          y2={sy(1.2)}
          stroke="#cbd5e1"
          strokeWidth={1}
          strokeDasharray="4 5"
        />
        <line
          x1={sx(-1.2)}
          y1={sy(1.2)}
          x2={sx(1.2)}
          y2={sy(-1.2)}
          stroke="#cbd5e1"
          strokeWidth={1}
          strokeDasharray="4 5"
        />

        {/* output Cv (red) — drawn first so input sits on top */}
        <line
          x1={sx(0)}
          y1={sy(0)}
          x2={sx(dox)}
          y2={sy(doy)}
          stroke="#dc2626"
          strokeWidth={3}
          markerEnd="url(#arrowRed)"
        />
        {/* input v (blue) */}
        <line
          x1={sx(0)}
          y1={sy(0)}
          x2={sx(ix)}
          y2={sy(iy)}
          stroke="#2563eb"
          strokeWidth={3}
          markerEnd="url(#arrowBlue)"
        />

        <text x={sx(ix) + 6} y={sy(iy) - 6} fontSize={13} fill="#2563eb" fontWeight={700}>
          v (input)
        </text>
        <text x={sx(dox) + 6} y={sy(doy) + 14} fontSize={13} fill="#dc2626" fontWeight={700}>
          C·v (output)
        </text>

        {isEigen && (
          <text x={SIZE / 2} y={SIZE - 10} textAnchor="middle" fontSize={14} fill="#16a34a" fontWeight={700}>
            eigenvector! output = λ·input
          </text>
        )}
      </svg>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
          Input angle θ = {deg}°
        </label>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={deg}
          onChange={(e) => setDeg(parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: 6 }}
        />
        <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0' }}>
          Angle between v and C·v: <strong>{angleBetween.toFixed(1)}°</strong>
          {isEigen ? (
            <>
              {' '}— they point along the same line, so v is an{' '}
              <strong style={{ color: '#16a34a' }}>eigenvector</strong>. The matrix only
              stretched it (by λ ≈ {lambdaApprox.toFixed(1)}), never rotated it.
            </>
          ) : (
            <>
              {' '}— the matrix rotated v as well as stretching it, so this is{' '}
              <strong>not</strong> an eigenvector. Try the dashed diagonals near 45° and 135°.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
