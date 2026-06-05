'use client';

import ExplanationBox from '@/components/ExplanationBox';

// A tiny side-by-side of the two squishes: sigmoid's smooth S vs. ReLU's
// flat-then-straight kink. Purely illustrative — its own muted accent.
const GW = 150, GH = 110, PAD = 16;
const Z_MIN = -6, Z_MAX = 6;
const gx = (z: number) => PAD + ((z - Z_MIN) / (Z_MAX - Z_MIN)) * (GW - 2 * PAD);
const gy = (v: number, vmax: number) => (GH - PAD) - (v / vmax) * (GH - 2 * PAD);

const SIG_PATH = (() => {
  const pts: string[] = [];
  for (let z = Z_MIN; z <= Z_MAX + 1e-6; z += 0.25) pts.push(`${gx(z).toFixed(1)},${gy(1 / (1 + Math.exp(-z)), 1).toFixed(1)}`);
  return 'M' + pts.join(' L');
})();
const RELU_PATH = (() => {
  // scaled so the kink and the rising line both fit nicely in the box
  const cap = 6;
  const pts: string[] = [];
  for (let z = Z_MIN; z <= Z_MAX + 1e-6; z += 0.25) pts.push(`${gx(z).toFixed(1)},${gy(Math.max(0, z), cap).toFixed(1)}`);
  return 'M' + pts.join(' L');
})();

function MiniCurve({ label, path, color }: { label: string; path: string; color: string }) {
  return (
    <div className="mini">
      <svg viewBox={`0 0 ${GW} ${GH}`} className="mini-svg">
        <line x1={PAD} y1={gy(0, 1)} x2={GW - PAD} y2={gy(0, 1)} stroke="#e2e8f0" strokeWidth={1} />
        <line x1={gx(0)} y1={PAD - 6} x2={gx(0)} y2={GH - PAD + 4} stroke="#e2e8f0" strokeWidth={1} />
        <path d={path} fill="none" stroke={color} strokeWidth={2.5} />
      </svg>
      <span className="mini-label" style={{ color }}>{label}</span>
      <style jsx>{`
        .mini { text-align: center; }
        .mini-svg { width: 100%; max-width: 170px; height: auto; display: block; margin: 0 auto; }
        .mini-label { display: block; font-size: 13px; font-weight: 700; margin-top: 0.2rem; }
      `}</style>
    </div>
  );
}

export default function Step12() {
  return (
    <div>
      <ExplanationBox title="A Quick Heads-Up: Sigmoid Isn't the Only Squish">
        <p>
          We use <strong>sigmoid</strong>{' '}for this whole course because it&apos;s the easiest one to
          picture — a smooth squish into 0–1 that doubles as a probability. But it&apos;s worth a quick
          detour to meet the activation that most <em>modern</em> networks actually reach for in their
          hidden layers: <strong>ReLU</strong>{' '}(&quot;rectified linear unit&quot;).
        </p>
        <p style={{ marginTop: '1rem' }}>
          Its rule is almost comically simple: <em>if the number is negative, output 0; otherwise pass
          it straight through, unchanged.</em> That&apos;s the entire function. No <strong>e</strong>,
          no division — just a flat floor at zero and a straight line going up.
        </p>
        <div style={{
          display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap',
          margin: '1.25rem 0 0.25rem',
        }}>
          <MiniCurve label="Sigmoid (the smooth S)" path={SIG_PATH} color="#7c3aed" />
          <MiniCurve label="ReLU (flat, then straight up)" path={RELU_PATH} color="#16a34a" />
        </div>
      </ExplanationBox>

      <ExplanationBox title="Why Modern Networks Prefer It">
        <p>
          Sigmoid has one weakness you&apos;ll see firsthand a few steps from now: when you stack many
          layers, its slope gets tiny out at the flat ends, and the learning signal{' '}
          <strong>fades to almost nothing</strong> on its way back through a deep network. People call
          that the <strong>vanishing gradient</strong>.
        </p>
        <p style={{ marginTop: '1rem' }}>
          ReLU sidesteps it. Wherever it&apos;s active, its slope is just <strong>1</strong> — the
          signal passes back through cleanly, no matter how deep the network gets. That single property
          is a big part of why training networks dozens of layers deep became practical at all.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Idea Doesn't Change">
        <p>
          You still see sigmoid at the very <strong>end</strong> of a network, where you want a clean
          0–1 probability — exactly like our rain output. And the core idea is identical either way: a
          neuron adds up its inputs, then runs the total through a squish.
        </p>
        <p style={{ marginTop: '1rem' }}>
          So everything you&apos;re learning with sigmoid carries straight over. Understand it here, and
          ReLU is just a different shape slotted into the same spot. Now back to our rain network.
        </p>
      </ExplanationBox>
    </div>
  );
}
