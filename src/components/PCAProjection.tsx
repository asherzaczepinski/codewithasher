'use client';

import { useState } from 'react';

const PAD = 40;
const SIZE = 440;
const inner = SIZE - 2 * PAD;
const RANGE = 22; // centered coords run roughly -17..+17

const sx = (x: number) => PAD + ((x + RANGE) / (2 * RANGE)) * inner;
const sy = (y: number) => PAD + ((RANGE - y) / (2 * RANGE)) * inner;

// Centered student points (math, physics)
const STUDENTS = [
  { id: 1, cx: -15, cy: -17 },
  { id: 2, cx: -5, cy: -3 },
  { id: 3, cx: 0, cy: -1 },
  { id: 4, cx: 5, cy: 4 },
  { id: 5, cx: 15, cy: 17 },
];

const INV_SQRT2 = 0.707;

// PC1 direction [0.707, 0.707] (45°), PC2 [0.707, -0.707]
function projectPC1(p: { cx: number; cy: number }) {
  return p.cx * INV_SQRT2 + p.cy * INV_SQRT2;
}
function projectPC2(p: { cx: number; cy: number }) {
  return p.cx * INV_SQRT2 - p.cy * INV_SQRT2;
}

// Foot of perpendicular onto PC1 line through origin
function footPC1(p: { cx: number; cy: number }) {
  const t = projectPC1(p); // scalar coord along unit PC1
  return { x: t * INV_SQRT2, y: t * INV_SQRT2 };
}

// 1D number line layout
const NL_Y = SIZE - 26;
const NL_MIN = -25;
const NL_MAX = 25;
const nlx = (v: number) => PAD + ((v - NL_MIN) / (NL_MAX - NL_MIN)) * inner;

export default function PCAProjection() {
  const [showPC2, setShowPC2] = useState(false);
  const [active, setActive] = useState<number | null>(null);

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
        <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={SIZE - PAD - 30} stroke="#e5e7eb" strokeWidth={1} />

        {/* PC1 line (45°) */}
        <line
          x1={sx(-RANGE)}
          y1={sy(-RANGE)}
          x2={sx(RANGE)}
          y2={sy(RANGE)}
          stroke="#dc2626"
          strokeWidth={2}
        />
        <text x={sx(RANGE) - 6} y={sy(RANGE) + 16} textAnchor="end" fontSize={12} fill="#dc2626" fontWeight={700}>
          PC1
        </text>

        {/* PC2 line (135°) */}
        {showPC2 && (
          <line
            x1={sx(-RANGE)}
            y1={sy(RANGE)}
            x2={sx(RANGE)}
            y2={sy(-RANGE)}
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
        )}

        {/* perpendicular shadow lines */}
        {STUDENTS.map((s) => {
          const f = footPC1(s);
          const dim = active !== null && active !== s.id;
          return (
            <line
              key={`shadow-${s.id}`}
              x1={sx(s.cx)}
              y1={sy(s.cy)}
              x2={sx(f.x)}
              y2={sy(f.y)}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={dim ? 0.2 : 0.85}
            />
          );
        })}

        {/* projected feet on PC1 */}
        {STUDENTS.map((s) => {
          const f = footPC1(s);
          const dim = active !== null && active !== s.id;
          return (
            <circle
              key={`foot-${s.id}`}
              cx={sx(f.x)}
              cy={sy(f.y)}
              r={4}
              fill="#dc2626"
              opacity={dim ? 0.25 : 0.9}
            />
          );
        })}

        {/* original points */}
        {STUDENTS.map((s) => {
          const dim = active !== null && active !== s.id;
          return (
            <g
              key={`pt-${s.id}`}
              onMouseEnter={() => setActive(s.id)}
              onMouseLeave={() => setActive(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={sx(s.cx)} cy={sy(s.cy)} r={active === s.id ? 8 : 6} fill="#2563eb" opacity={dim ? 0.3 : 1} />
              <text x={sx(s.cx) + 9} y={sy(s.cy) - 7} fontSize={11} fill="#1e293b" opacity={dim ? 0.3 : 1}>
                S{s.id}
              </text>
            </g>
          );
        })}

        {/* 1D number line of projected coords */}
        <line x1={nlx(NL_MIN)} y1={NL_Y} x2={nlx(NL_MAX)} y2={NL_Y} stroke="#cbd5e1" strokeWidth={1.5} />
        {[-20, -10, 0, 10, 20].map((t) => (
          <g key={`tick-${t}`}>
            <line x1={nlx(t)} y1={NL_Y - 4} x2={nlx(t)} y2={NL_Y + 4} stroke="#cbd5e1" strokeWidth={1} />
            <text x={nlx(t)} y={NL_Y + 18} textAnchor="middle" fontSize={10} fill="#94a3b8">
              {t}
            </text>
          </g>
        ))}
        {STUDENTS.map((s) => {
          const v = projectPC1(s);
          const dim = active !== null && active !== s.id;
          return (
            <g key={`nl-${s.id}`} opacity={dim ? 0.3 : 1}>
              <circle cx={nlx(v)} cy={NL_Y} r={4} fill="#dc2626" />
              <text x={nlx(v)} y={NL_Y - 8} textAnchor="middle" fontSize={10} fill="#dc2626" fontWeight={700}>
                S{s.id}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: '#1e293b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={showPC2} onChange={(e) => setShowPC2(e.target.checked)} />
          Show the PC2 direction (the perpendicular axis we usually drop)
        </label>
        <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0' }}>
          Each blue student point drops a perpendicular &quot;shadow&quot; (grey) onto the red PC1
          line. Read off where the shadow lands and you get a single number — shown on the
          number line below. Hover a point to highlight it.
        </p>
        <table style={{ width: '100%', fontSize: 13, marginTop: 10, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: '#64748b', textAlign: 'left' }}>
              <th style={{ padding: '4px 6px' }}>Student</th>
              <th style={{ padding: '4px 6px' }}>Centered</th>
              <th style={{ padding: '4px 6px' }}>PC1 score</th>
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s) => (
              <tr
                key={`row-${s.id}`}
                onMouseEnter={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                style={{
                  background: active === s.id ? '#eff6ff' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '4px 6px', color: '#1e293b' }}>S{s.id}</td>
                <td style={{ padding: '4px 6px', fontFamily: 'monospace', color: '#64748b' }}>
                  [{s.cx}, {s.cy}]
                </td>
                <td style={{ padding: '4px 6px', fontFamily: 'monospace', color: '#dc2626', fontWeight: 700 }}>
                  {projectPC1(s) >= 0 ? '+' : ''}
                  {projectPC1(s).toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
