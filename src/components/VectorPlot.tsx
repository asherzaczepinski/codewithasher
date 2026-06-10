'use client';

export interface PlotArrow {
  /** tip coordinates in math space */
  x: number;
  y: number;
  /** tail coordinates in math space (defaults to origin) */
  fromX?: number;
  fromY?: number;
  color?: string;
  label?: string;
  /** render as a thin dashed guide instead of a solid arrow */
  dashed?: boolean;
  /** draw without an arrowhead (e.g. a connecting segment) */
  noHead?: boolean;
}

interface VectorPlotProps {
  arrows: PlotArrow[];
  /** half-width of the visible region in math units (axes run -range..range) */
  range?: number;
  caption?: string;
  /** highlighted points drawn as dots */
  points?: { x: number; y: number; color?: string; label?: string }[];
}

const ACCENT = '#2563eb';
const SIZE = 360;
const PAD = 28;

export default function VectorPlot({ arrows, range = 5, caption, points = [] }: VectorPlotProps) {
  const inner = SIZE - PAD * 2;
  // map math coords -> svg pixel coords
  const sx = (x: number) => PAD + ((x + range) / (2 * range)) * inner;
  const sy = (y: number) => PAD + ((range - y) / (2 * range)) * inner;

  const gridLines = [];
  for (let i = -range; i <= range; i++) {
    const major = i === 0;
    gridLines.push(
      <line
        key={`v${i}`}
        x1={sx(i)} y1={sy(-range)} x2={sx(i)} y2={sy(range)}
        stroke={major ? '#94a3b8' : '#eef2f7'} strokeWidth={major ? 1.4 : 1}
      />,
      <line
        key={`h${i}`}
        x1={sx(-range)} y1={sy(i)} x2={sx(range)} y2={sy(i)}
        stroke={major ? '#94a3b8' : '#eef2f7'} strokeWidth={major ? 1.4 : 1}
      />
    );
  }

  return (
    <figure style={{ margin: '1.25rem 0', textAlign: 'center' }}>
      <svg
        width="100%" viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ maxWidth: 420, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10 }}
        role="img"
        aria-label={caption || 'Vector diagram'}
      >
        <defs>
          {Array.from(new Set(arrows.map((a) => a.color || ACCENT))).map((c) => (
            <marker
              key={c}
              id={`head-${c.replace('#', '')}`}
              markerWidth="9" markerHeight="9" refX="6.5" refY="3.2"
              orient="auto" markerUnits="userSpaceOnUse"
            >
              <path d="M0,0 L7,3.2 L0,6.4 Z" fill={c} />
            </marker>
          ))}
        </defs>

        {gridLines}

        {arrows.map((a, i) => {
          const c = a.color || ACCENT;
          const x1 = sx(a.fromX ?? 0), y1 = sy(a.fromY ?? 0);
          const x2 = sx(a.x), y2 = sy(a.y);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={c}
              strokeWidth={a.dashed ? 1.6 : 2.6}
              strokeDasharray={a.dashed ? '5 4' : undefined}
              markerEnd={a.noHead ? undefined : `url(#head-${c.replace('#', '')})`}
            />
          );
        })}

        {points.map((p, i) => (
          <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={4} fill={p.color || ACCENT} />
        ))}

        {arrows.filter((a) => a.label).map((a, i) => {
          const c = a.color || ACCENT;
          const mx = (a.fromX ?? 0) + a.x * 0.5;
          const my = (a.fromY ?? 0) + a.y * 0.5;
          return (
            <text
              key={`l${i}`}
              x={sx(mx) + 8} y={sy(my) - 6}
              fill={c} fontSize="14" fontWeight={700}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {a.label}
            </text>
          );
        })}

        {points.filter((p) => p.label).map((p, i) => (
          <text
            key={`pl${i}`}
            x={sx(p.x) + 7} y={sy(p.y) - 7}
            fill={p.color || ACCENT} fontSize="13" fontWeight={600}
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {p.label}
          </text>
        ))}
      </svg>
      {caption && (
        <figcaption style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>{caption}</figcaption>
      )}
    </figure>
  );
}
