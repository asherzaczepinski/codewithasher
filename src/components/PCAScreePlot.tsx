'use client';

import { useState } from 'react';

const W = 440;
const H = 300;
const PAD_L = 44;
const PAD_R = 44;
const PAD_T = 24;
const PAD_B = 40;
const plotW = W - PAD_L - PAD_R;
const plotH = H - PAD_T - PAD_B;

const DATASETS: Record<string, { label: string; eig: number[] }> = {
  four: { label: '4-feature example', eig: [180, 60, 8, 2] },
  student: { label: 'student exam data', eig: [224.5, 4.6] },
};

export default function PCAScreePlot() {
  const [which, setWhich] = useState<'four' | 'student'>('four');
  const [k, setK] = useState(2);

  const eig = DATASETS[which].eig;
  const n = eig.length;
  const total = eig.reduce((a, b) => a + b, 0);
  const maxEig = Math.max(...eig);

  // clamp k to dataset size
  const kClamped = Math.min(k, n);

  // cumulative EVR up to each index
  const cumEVR: number[] = [];
  let running = 0;
  eig.forEach((e) => {
    running += e / total;
    cumEVR.push(running);
  });

  const barSlot = plotW / n;
  const barW = barSlot * 0.55;

  const barX = (i: number) => PAD_L + i * barSlot + (barSlot - barW) / 2;
  const barCenter = (i: number) => PAD_L + i * barSlot + barSlot / 2;
  const barTop = (e: number) => PAD_T + plotH - (e / maxEig) * plotH;
  // cumulative line uses 0..1 mapped to full plot height
  const cumY = (c: number) => PAD_T + plotH - c * plotH;

  // cutoff line sits between bar k-1 and bar k
  const cutoffX = PAD_L + kClamped * barSlot;

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
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', maxWidth: 440, height: 'auto', display: 'block', margin: '0 auto' }}
      >
        {/* y axis (eigenvalue, left) */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        {/* x axis */}
        <line x1={PAD_L} y1={PAD_T + plotH} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />
        {/* right axis (cumulative %) */}
        <line x1={PAD_L + plotW} y1={PAD_T} x2={PAD_L + plotW} y2={PAD_T + plotH} stroke="#e5e7eb" strokeWidth={1} />

        {/* right axis 0/50/100 ticks */}
        {[0, 0.5, 1].map((f) => (
          <g key={`rt-${f}`}>
            <line
              x1={PAD_L + plotW}
              y1={cumY(f)}
              x2={PAD_L + plotW + 4}
              y2={cumY(f)}
              stroke="#cbd5e1"
              strokeWidth={1}
            />
            <text x={PAD_L + plotW + 7} y={cumY(f) + 4} fontSize={10} fill="#94a3b8">
              {Math.round(f * 100)}%
            </text>
          </g>
        ))}

        {/* bars */}
        {eig.map((e, i) => {
          const kept = i < kClamped;
          return (
            <g key={`bar-${i}`}>
              <rect
                x={barX(i)}
                y={barTop(e)}
                width={barW}
                height={PAD_T + plotH - barTop(e)}
                fill={kept ? '#2563eb' : '#cbd5e1'}
                rx={3}
              />
              <text x={barCenter(i)} y={barTop(e) - 5} textAnchor="middle" fontSize={11} fill="#1e293b" fontWeight={600}>
                {e}
              </text>
              <text x={barCenter(i)} y={PAD_T + plotH + 16} textAnchor="middle" fontSize={11} fill="#64748b">
                λ{i + 1}
              </text>
            </g>
          );
        })}

        {/* cumulative EVR line */}
        <polyline
          points={cumEVR.map((c, i) => `${barCenter(i)},${cumY(c)}`).join(' ')}
          fill="none"
          stroke="#dc2626"
          strokeWidth={2}
        />
        {cumEVR.map((c, i) => (
          <g key={`cum-${i}`}>
            <circle cx={barCenter(i)} cy={cumY(c)} r={3.5} fill="#dc2626" />
            <text x={barCenter(i)} y={cumY(c) - 8} textAnchor="middle" fontSize={10} fill="#dc2626" fontWeight={700}>
              {(c * 100).toFixed(c >= 0.999 ? 0 : 1)}%
            </text>
          </g>
        ))}

        {/* cutoff line */}
        <line
          x1={cutoffX}
          y1={PAD_T - 4}
          x2={cutoffX}
          y2={PAD_T + plotH}
          stroke="#16a34a"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text x={cutoffX + 4} y={PAD_T + 8} fontSize={10} fill="#16a34a" fontWeight={700}>
          keep {kClamped}
        </text>
      </svg>

      <div style={{ marginTop: 12 }}>
        <label style={{ fontSize: 14, color: '#1e293b', fontWeight: 600 }}>
          Components kept: k = {kClamped} of {n}
        </label>
        <input
          type="range"
          min={1}
          max={n}
          step={1}
          value={kClamped}
          onChange={(e) => setK(parseInt(e.target.value, 10))}
          style={{ width: '100%', marginTop: 6 }}
        />

        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          {(['four', 'student'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setWhich(key);
                setK(Math.min(k, DATASETS[key].eig.length));
              }}
              style={{
                fontSize: 13,
                padding: '6px 12px',
                borderRadius: 8,
                border: which === key ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: which === key ? '#eff6ff' : '#fff',
                color: which === key ? '#2563eb' : '#64748b',
                cursor: 'pointer',
                fontWeight: which === key ? 700 : 500,
              }}
            >
              {DATASETS[key].label}
            </button>
          ))}
        </div>

        <p style={{ fontSize: 13, color: '#64748b', margin: '10px 0 0' }}>
          Blue bars are the components you keep; grey bars are dropped. The red line is the{' '}
          <strong>cumulative explained variance</strong>. With k = {kClamped} you retain{' '}
          <strong style={{ color: '#dc2626' }}>{(cumEVR[kClamped - 1] * 100).toFixed(cumEVR[kClamped - 1] >= 0.999 ? 0 : 1)}%</strong>{' '}
          of the total variance. Look for the &quot;elbow&quot; where the bars suddenly flatten —
          that&apos;s a natural place to cut.
        </p>
      </div>
    </div>
  );
}
