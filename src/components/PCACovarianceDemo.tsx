'use client';

// Three side-by-side scatter plots: Positive / Zero / Negative covariance.
// Each point colored by the sign of its (xᵢ−x̄)(yᵢ−ȳ) product so the viewer
// sees why the products sum positive for positively-correlated data.

const PANEL = 150;
const PAD = 16;
const inner = PANEL - 2 * PAD;
const RANGE = 1.1;

const sx = (x: number) => PAD + ((x + RANGE) / (2 * RANGE)) * inner;
const sy = (y: number) => PAD + ((RANGE - y) / (2 * RANGE)) * inner;

// Deterministic base points (centered, mean 0).
const BASE = [
  [-0.9, -0.8],
  [-0.6, -0.5],
  [-0.3, -0.25],
  [-0.1, 0.05],
  [0.15, 0.1],
  [0.35, 0.4],
  [0.55, 0.45],
  [0.8, 0.85],
  [-0.45, -0.55],
  [0.45, 0.5],
];

// Map base x to y for each scenario.
function makePanel(mode: 'pos' | 'zero' | 'neg') {
  return BASE.map(([x, yBase]) => {
    let y: number;
    if (mode === 'pos') y = yBase;
    else if (mode === 'neg') y = -yBase;
    else y = ((x * 7.3) % 1) - 0.5; // scrambled, ~uncorrelated with x
    return { x, y, prod: x * y };
  });
}

const PANELS: { label: string; mode: 'pos' | 'zero' | 'neg'; color: string }[] = [
  { label: 'Positive', mode: 'pos', color: '#10b981' },
  { label: 'Zero', mode: 'zero', color: '#64748b' },
  { label: 'Negative', mode: 'neg', color: '#dc2626' },
];

export default function PCACovarianceDemo() {
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
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {PANELS.map(({ label, mode, color }) => {
          const pts = makePanel(mode);
          const sum = pts.reduce((a, p) => a + p.prod, 0);
          return (
            <div key={label} style={{ textAlign: 'center', flex: '1 1 130px', minWidth: 130 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 4 }}>{label}</div>
              <svg viewBox={`0 0 ${PANEL} ${PANEL}`} style={{ width: '100%', maxWidth: 150, height: 'auto' }}>
                <rect x={0} y={0} width={PANEL} height={PANEL} fill="#f8fafc" rx={6} />
                <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={PANEL - PAD} stroke="#e5e7eb" strokeWidth={1} />
                <line x1={PAD} y1={sy(0)} x2={PANEL - PAD} y2={sy(0)} stroke="#e5e7eb" strokeWidth={1} />
                {pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={sx(p.x)}
                    cy={sy(p.y)}
                    r={4}
                    fill={p.prod >= 0 ? '#10b981' : '#dc2626'}
                    opacity={0.85}
                  />
                ))}
              </svg>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                Σ products ≈ <strong style={{ color }}>{sum.toFixed(1)}</strong>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 13, color: '#64748b', margin: '12px 0 0', textAlign: 'center' }}>
        <span style={{ color: '#10b981', fontWeight: 600 }}>Green</span> dots have a positive
        (xᵢ−x̄)(yᵢ−ȳ) product; <span style={{ color: '#dc2626', fontWeight: 600 }}>red</span> dots
        negative. When green dominates, covariance is positive.
      </p>
    </div>
  );
}
