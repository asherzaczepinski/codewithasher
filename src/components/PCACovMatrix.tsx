'use client';

import { useState } from 'react';

const C = [
  [100, 109],
  [109, 129],
];

const MEANINGS = [
  ['Var(math) = 100 — how much math scores spread on their own.', 'Cov(math, physics) = 109 — how math and physics move together.'],
  ['Cov(physics, math) = 109 — identical to the cell above; the matrix is symmetric.', 'Var(physics) = 129 — how much physics scores spread on their own.'],
];

const MAX = 129;

function shade(v: number) {
  // light blue → deep blue by magnitude
  const t = v / MAX;
  const r = Math.round(219 - t * (219 - 37));
  const g = Math.round(234 - t * (234 - 99));
  const b = Math.round(254 - t * (254 - 235));
  return `rgb(${r},${g},${b})`;
}

const CELL = 110;
const LABEL = 70;

export default function PCACovMatrix() {
  const [hover, setHover] = useState<{ i: number; j: number } | null>(null);

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
        viewBox={`0 0 ${LABEL + 2 * CELL + 16} ${LABEL + 2 * CELL + 16}`}
        style={{ width: '100%', maxWidth: 440, height: 'auto', display: 'block', margin: '0 auto' }}
      >
        {/* column headers */}
        <text x={LABEL + CELL / 2} y={LABEL - 14} textAnchor="middle" fontSize={13} fill="#64748b">
          math
        </text>
        <text x={LABEL + CELL + CELL / 2} y={LABEL - 14} textAnchor="middle" fontSize={13} fill="#64748b">
          physics
        </text>
        {/* row headers */}
        <text x={LABEL - 12} y={LABEL + CELL / 2 + 4} textAnchor="end" fontSize={13} fill="#64748b">
          math
        </text>
        <text x={LABEL - 12} y={LABEL + CELL + CELL / 2 + 4} textAnchor="end" fontSize={13} fill="#64748b">
          physics
        </text>

        {C.map((row, i) =>
          row.map((v, j) => {
            const active = hover && hover.i === i && hover.j === j;
            const isDiag = i === j;
            return (
              <g
                key={`${i}-${j}`}
                onMouseEnter={() => setHover({ i, j })}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={LABEL + j * CELL + 4}
                  y={LABEL + i * CELL + 4}
                  width={CELL - 8}
                  height={CELL - 8}
                  rx={8}
                  fill={shade(v)}
                  stroke={active ? '#2563eb' : isDiag ? '#94a3b8' : '#e2e8f0'}
                  strokeWidth={active ? 3 : isDiag ? 2 : 1}
                />
                <text
                  x={LABEL + j * CELL + CELL / 2}
                  y={LABEL + i * CELL + CELL / 2 + 7}
                  textAnchor="middle"
                  fontSize={22}
                  fontWeight={700}
                  fill={v > 70 ? '#fff' : '#1e293b'}
                >
                  {v}
                </text>
              </g>
            );
          })
        )}
      </svg>

      <div
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 8,
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          minHeight: 44,
          fontSize: 14,
          color: '#1e293b',
        }}
      >
        {hover ? (
          MEANINGS[hover.i][hover.j]
        ) : (
          <span style={{ color: '#64748b' }}>
            Hover a cell to see what it means. Note the two off-diagonal 109s are equal — the
            covariance matrix is symmetric.
          </span>
        )}
      </div>
    </div>
  );
}
