'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * A 3D loss "landscape" for two of the rain network's weights. Height = loss.
 * Gradient descent uses the derivative in each direction to walk downhill to
 * the lowest point. Rendered as a projected wireframe/surface (no 3D library).
 */

// loss surface over two weights — a bowl with a gentle second ripple so it
// looks like a real landscape, minimum near (c1, c2)
const C1 = 0.35, C2 = -0.2;
const lossAt = (w1: number, w2: number) => {
  const bowl = (w1 - C1) * (w1 - C1) + (w2 - C2) * (w2 - C2);
  const ripple = 0.18 * Math.sin(2.2 * w1) * Math.cos(2.0 * w2);
  return bowl + ripple + 0.05;
};
// gradient (partial derivatives) used for descent
const grad = (w1: number, w2: number): [number, number] => {
  const d1 = 2 * (w1 - C1) + 0.18 * 2.2 * Math.cos(2.2 * w1) * Math.cos(2.0 * w2);
  const d2 = 2 * (w2 - C2) - 0.18 * 2.0 * Math.sin(2.2 * w1) * Math.sin(2.0 * w2);
  return [d1, d2];
};

const RANGE = 1.9;        // weights span [-RANGE, RANGE]
const N = 16;             // grid resolution
const START: [number, number] = [-1.6, 1.55];

// lerp between two hex colors
function mix(a: string, b: string, t: number) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

export default function LossSurface3D() {
  const [azimuth, setAzimuth] = useState(0.7);
  const [path, setPath] = useState<[number, number][]>([START]);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const lr = 0.12;

  const W = 420, H = 360;
  const cx = W / 2, cy = H / 2 + 40;
  const elev = 0.62;            // tilt
  const scale = 78;
  const zScale = 42;

  // height range for coloring
  const { minZ, maxZ } = useMemo(() => {
    let lo = Infinity, hi = -Infinity;
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const z = lossAt(-RANGE + (2 * RANGE * i) / N, -RANGE + (2 * RANGE * j) / N);
      if (z < lo) lo = z; if (z > hi) hi = z;
    }
    return { minZ: lo, maxZ: hi };
  }, []);

  // project a data point (w1, w2, z) to screen
  const project = (w1: number, w2: number, z: number) => {
    const u = w1 / RANGE, v = w2 / RANGE;
    const ct = Math.cos(azimuth), st = Math.sin(azimuth);
    const u2 = u * ct - v * st;
    const v2 = u * st + v * ct;
    const hNorm = (z - minZ) / (maxZ - minZ || 1);
    const sx = cx + (u2 - v2) * Math.cos(elev) * scale;
    const sy = cy + (u2 + v2) * Math.sin(elev) * scale - hNorm * zScale - 30;
    return { sx, sy, depth: u2 + v2, hNorm };
  };

  // build surface quads, sorted back-to-front (React Compiler memoizes this)
  const quads: { d: string; depth: number; color: string }[] = [];
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const corners = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) => {
        const w1 = -RANGE + (2 * RANGE * a) / N;
        const w2 = -RANGE + (2 * RANGE * b) / N;
        return project(w1, w2, lossAt(w1, w2));
      });
      const depth = corners.reduce((s, c) => s + c.depth, 0) / 4;
      const hAvg = corners.reduce((s, c) => s + c.hNorm, 0) / 4;
      // low loss = green, mid = blue, high = indigo
      const color = hAvg < 0.5
        ? mix('#16a34a', '#3b82f6', hAvg * 2)
        : mix('#3b82f6', '#6366f1', (hAvg - 0.5) * 2);
      const d = `M${corners[0].sx.toFixed(1)},${corners[0].sy.toFixed(1)} `
        + corners.slice(1).map(c => `L${c.sx.toFixed(1)},${c.sy.toFixed(1)}`).join(' ') + ' Z';
      quads.push({ d, depth, color });
    }
  }
  quads.sort((a, b) => a.depth - b.depth);

  const projectedPath = path.map(([w1, w2]) => project(w1, w2, lossAt(w1, w2)));
  const cur = path[path.length - 1];
  const curProj = projectedPath[projectedPath.length - 1];

  const reset = () => { setRunning(false); setPath([START]); };

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setPath(prev => {
        const [w1, w2] = prev[prev.length - 1];
        const [g1, g2] = grad(w1, w2);
        if (Math.hypot(g1, g2) < 0.02 || prev.length > 80) { setRunning(false); return prev; }
        return [...prev, [w1 - lr * g1, w2 - lr * g2]];
      });
    }, 280);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running]);

  // slow auto-spin while idle is nice but optional; keep manual for clarity
  const curLoss = lossAt(cur[0], cur[1]);

  return (
    <div className="ls-wrap">
      <div className="controls">
        <button className="btn primary" onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Roll downhill ▶'}</button>
        <button className="btn ghost" onClick={reset}>Reset</button>
        <label className="rot">
          rotate
          <input type="range" min="0" max={(2 * Math.PI).toFixed(2)} step="0.01" value={azimuth}
                 onChange={e => setAzimuth(parseFloat(e.target.value))} />
        </label>
      </div>

      <svg width={W} height={H} style={{ display: 'block', margin: '0 auto', maxWidth: '100%' }}>
        {/* surface */}
        {quads.map((q, i) => (
          <path key={i} d={q.d} fill={q.color} fillOpacity={0.82} stroke="#ffffff" strokeOpacity={0.25} strokeWidth={0.5} />
        ))}

        {/* descent path */}
        <polyline
          points={projectedPath.map(p => `${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ')}
          fill="none" stroke="#dc2626" strokeWidth={2.4} strokeLinejoin="round"
        />
        {projectedPath.map((p, i) => (
          <circle key={i} cx={p.sx} cy={p.sy} r={2.4} fill="#dc2626" opacity={0.7} />
        ))}

        {/* current ball */}
        <circle cx={curProj.sx} cy={curProj.sy} r={6.5} fill="#dc2626" stroke="white" strokeWidth={2} />

        {/* labels */}
        <text x={cx} y={H - 8} textAnchor="middle" fontSize={11} fill="#64748b">weight A × weight B  ·  height = loss</text>
      </svg>

      <div className="readout">
        <div className="r-item"><span className="r-label">step</span><span className="r-val">{path.length - 1}</span></div>
        <div className="r-item"><span className="r-label">weight A</span><span className="r-val">{cur[0].toFixed(2)}</span></div>
        <div className="r-item"><span className="r-label">weight B</span><span className="r-val">{cur[1].toFixed(2)}</span></div>
        <div className="r-item"><span className="r-label">loss</span><span className="r-val">{curLoss.toFixed(3)}</span></div>
      </div>

      <div className="callout">
        Real networks have <strong>thousands</strong> of weights, so the true loss landscape lives in
        thousands of dimensions — impossible to draw. Here are just <strong>two</strong> of the rain
        network&apos;s weights with loss as the height. The derivative in each direction (the gradient)
        points straight uphill; the red ball steps the opposite way and rolls to the <strong>bottom</strong> —
        the weights that make the network most accurate. Spin the surface to look around.
      </div>

      <style jsx>{`
        .ls-wrap {
          margin: 1.25rem 0; padding: 1.25rem;
          background: #0f172a;
          border-radius: 12px; border: 1px solid #1e293b;
        }
        .controls { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.5rem; }
        .btn {
          font-size: 13px; padding: 0.45rem 0.8rem; border-radius: 7px;
          border: 1px solid #334155; background: #1e293b; color: #e2e8f0; cursor: pointer;
        }
        .btn:hover { background: #334155; }
        .btn.primary { background: #2563eb; border-color: #2563eb; color: white; }
        .btn.primary:hover { background: #1d4ed8; }
        .btn.ghost { color: #94a3b8; }
        .rot { display: flex; align-items: center; gap: 0.5rem; font-size: 11.5px; color: #94a3b8; margin-left: auto; }
        .rot input { width: 120px; }
        .readout {
          display: flex; justify-content: space-around; flex-wrap: wrap; gap: 0.5rem;
          margin-top: 0.4rem; padding-top: 0.6rem; border-top: 1px solid #1e293b;
        }
        .r-item { display: flex; flex-direction: column; align-items: center; }
        .r-label { font-size: 11px; color: #94a3b8; }
        .r-val { font-size: 14px; font-weight: 700; color: #f1f5f9; font-variant-numeric: tabular-nums; }
        .callout {
          margin-top: 0.9rem; padding: 0.75rem 0.95rem; background: #1e293b;
          border: 1px solid #334155; border-radius: 8px; font-size: 13px;
          color: #cbd5e1; line-height: 1.55;
        }
      `}</style>
    </div>
  );
}
