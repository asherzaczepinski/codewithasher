'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Standalone "Remember e?" page: why the sigmoid's derivative is so clean, and an
// interactive curve to feel it. The curve uses its OWN violet accent on purpose —
// deliberately not the blue/red used by the network diagrams in the other steps.
const sig = (x: number) => 1 / (1 + Math.exp(-x));
const f2 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace(/^0\./, '.');

// The same starting network as the backprop step, so the output value we quote matches.
const INPUT = [1.0, 0.5];
const W1 = [[-0.3, 0.9], [0.5, 0.7], [-0.4, 0.8]];
const B1 = [0.1, -0.2, 0.15];
const W2 = [[0.6, -0.3, 0.5], [0.4, 0.7, -0.2], [-0.5, 0.6, 0.8]];
const B2 = [-0.1, 0.2, -0.15];
const W3 = [0.7, 0.5, 0.6];
const B3 = -0.2;
const A1 = [0, 1, 2].map(i => sig(INPUT[0] * W1[i][0] + INPUT[1] * W1[i][1] + B1[i]));
const A2 = [0, 1, 2].map(i => sig(A1[0] * W2[i][0] + A1[1] * W2[i][1] + A1[2] * W2[i][2] + B2[i]));
const OUT = sig(A2[0] * W3[0] + A2[1] * W3[1] + A2[2] * W3[2] + B3);

const ACCENT = '#7c3aed'; // violet — this page's own color, not the diagrams' blue/red

// --- interactive sigmoid + tangent ---
const GW = 320, GH = 200, PAD = 34;
const Z_MIN = -8, Z_MAX = 8;
const gx = (z: number) => PAD + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (GW - 2 * PAD);
const gy = (a: number) => (GH - PAD) - a * (GH - 2 * PAD);
const SIG_PATH = (() => {
  const pts: string[] = [];
  for (let z = Z_MIN; z <= Z_MAX + 0.001; z += 0.15) pts.push(`${gx(z).toFixed(1)},${gy(sig(z)).toFixed(1)}`);
  return 'M' + pts.join(' L');
})();

function SigmoidExplorer() {
  const [z, setZ] = useState(0.9);
  const a = sig(z);
  const s = a * (1 - a);                 // the slope: output × (1 − output)
  const px = gx(z), py = gy(a);
  const z0 = z - 3, z1 = z + 3;
  const t0 = gy(a + s * (z0 - z)), t1 = gy(a + s * (z1 - z));

  return (
    <div className="explorer">
      <svg viewBox={`0 0 ${GW} ${GH}`} className="explorer-svg">
        {/* axes + 0/0.5/1 guides */}
        <line x1={PAD} y1={gy(0)} x2={GW - PAD} y2={gy(0)} stroke="#cbd5e1" strokeWidth={1} />
        <line x1={gx(0)} y1={PAD - 10} x2={gx(0)} y2={GH - PAD + 6} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={PAD} y1={gy(1)} x2={GW - PAD} y2={gy(1)} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={PAD} y1={gy(0.5)} x2={GW - PAD} y2={gy(0.5)} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3" />
        <text x={PAD - 6} y={gy(1) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">1</text>
        <text x={PAD - 6} y={gy(0) + 3} textAnchor="end" fontSize={9} fill="#94a3b8">0</text>
        <text x={GW - PAD} y={gy(0) + 16} textAnchor="end" fontSize={9} fill="#94a3b8">weighted sum →</text>

        {/* the sigmoid */}
        <path d={SIG_PATH} fill="none" stroke="#cbd5e1" strokeWidth={2.5} />
        {/* tangent — the slope at this point */}
        <line x1={gx(z0)} y1={t0} x2={gx(z1)} y2={t1} stroke={ACCENT} strokeWidth={2.5} strokeDasharray="5 4" />
        {/* guide drops to the axes */}
        <line x1={px} y1={py} x2={px} y2={gy(0)} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
        <line x1={px} y1={py} x2={gx(0)} y2={py} stroke={ACCENT} strokeWidth={1} strokeDasharray="2 2" opacity={0.5} />
        {/* the point */}
        <circle cx={px} cy={py} r={6} fill={ACCENT} stroke="white" strokeWidth={2} />
      </svg>

      <input
        type="range" min={-8} max={8} step={0.1} value={z}
        onChange={e => setZ(parseFloat(e.target.value))}
        className="explorer-slider"
      />

      <div className="explorer-readout">
        <div className="rd"><span className="rd-label">output</span><span className="rd-val">{f2(a)}</span></div>
        <div className="rd-op">→ slope = {f2(a)} × (1 − {f2(a)}) =</div>
        <div className="rd"><span className="rd-label">slope</span><span className="rd-val accent">{f2(s)}</span></div>
      </div>
      <p className="explorer-note">
        Drag the dot along the curve. The slope is steepest in the middle (around an output of .5)
        and flattens out near 0 and 1 — exactly what <strong>output × (1 − output)</strong> predicts.
        Where the curve is flat, almost no correction can pass through; that&apos;s a neuron that&apos;s
        hard to teach.
      </p>

      <style jsx>{`
        .explorer {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #faf5ff;
          border: 1px solid #e9d5ff;
          border-radius: 12px;
        }
        .explorer-svg {
          width: 100%;
          max-width: 360px;
          height: auto;
          display: block;
          margin: 0 auto;
        }
        .explorer-slider {
          display: block;
          width: 100%;
          max-width: 360px;
          margin: 0.75rem auto 0;
          accent-color: ${ACCENT};
        }
        .explorer-readout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          font-size: 14px;
        }
        .rd {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 0.35rem 0.7rem;
          background: white;
          border: 1px solid #e9d5ff;
          border-radius: 8px;
          line-height: 1.2;
        }
        .rd-label {
          font-size: 10px;
          color: #a78bda;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .rd-val {
          font-weight: 700;
          color: #5b21b6;
          font-variant-numeric: tabular-nums;
        }
        .rd-val.accent { color: ${ACCENT}; }
        .rd-op {
          color: #6b7280;
          font-variant-numeric: tabular-nums;
        }
        .explorer-note {
          margin: 1rem 0 0;
          font-size: 13px;
          line-height: 1.6;
          color: #555;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default function Step16() {
  return (
    <div>
      <ExplanationBox title="Remember e? This Is the Payoff">
        <p>
          Way back when we built the sigmoid, we squashed every signal with the number{' '}
          <strong>e ≈ 2.718</strong> and promised it would quietly pay off once we got to
          training. This is that moment.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          To send a correction backward, each neuron needs to know how much its output moves
          when its weighted sum nudges — that is the <em>slope of its own sigmoid</em>, the same
          slope you saw drawn on the little curve in the backpropagation step. For almost any
          other curve, that slope would be a mess to compute.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Slope Collapses Into One Tidy Term">
        <p>
          Because the sigmoid is built from <strong>e</strong>, its slope collapses into
          something beautifully simple: <strong>output × (1 − output)</strong>. No exponents,
          no <strong>e</strong> left to evaluate — the neuron already knows its own output, so
          it already knows its own slope. Take our starting output neuron at {f2(OUT)}: its slope is just{' '}
          {f2(OUT)} × (1 − {f2(OUT)}) = <strong>{f2(OUT * (1 - OUT))}</strong>.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That clean factor is exactly the <strong>slope</strong> that sits above every neuron in
          the network diagram — each one is just that node&apos;s own output × (1 − output), the
          gate every correction has to pass through on its way back. The tidy{' '}
          <strong>output × (1 − output)</strong> term is the whole reason <strong>e</strong>{' '}
          was worth choosing.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Feel the Slope Yourself">
        <p>
          Slide the dot along the sigmoid and watch the slope read out live. This is the exact
          number backprop multiplies by at every neuron — and you can see why a neuron stuck out
          at the flat ends barely learns, while one in the steep middle soaks up corrections fast.
        </p>
        <SigmoidExplorer />
      </ExplanationBox>
    </div>
  );
}
