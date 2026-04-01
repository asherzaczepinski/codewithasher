'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Generate a random number from a normal distribution using Box-Muller transform
function randomNormal(mean: number, stdDev: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stdDev;
}

function BellCurveGraph({ stdDev, weights }: { stdDev: number; weights: number[] }) {
  const width = 600;
  const height = 240;
  const padding = 40;
  const graphW = width - padding * 2;
  const graphH = height - 60;

  const xMin = -stdDev * 3.5;
  const xMax = stdDev * 3.5;

  const toX = (v: number) => padding + ((v - xMin) / (xMax - xMin)) * graphW;
  const gaussian = (x: number) => Math.exp(-(x * x) / (2 * stdDev * stdDev));
  const topPad = 30;
  const toY = (gVal: number) => topPad + (1 - gVal) * graphH;

  const curvePoints: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    const y = gaussian(x);
    curvePoints.push(`${i === 0 ? 'M' : 'L'}${toX(x).toFixed(1)},${toY(y).toFixed(1)}`);
  }

  const baseY = topPad + graphH;
  const fillPath = curvePoints.join(' ') + ` L${toX(xMax).toFixed(1)},${baseY.toFixed(1)} L${toX(xMin).toFixed(1)},${baseY.toFixed(1)} Z`;
  const ticks = [-3, -2, -1, 0, 1, 2, 3].map(m => m * stdDev).filter(v => v >= xMin && v <= xMax);
  const y1Sigma = toY(gaussian(stdDev));

  return (
    <div style={{ margin: '1rem 0' }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <path d={fillPath} fill="#3b82f6" opacity="0.1" />
        <path d={curvePoints.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        <line x1={padding} y1={baseY} x2={width - padding} y2={baseY} stroke="#94a3b8" strokeWidth="1" />
        <line x1={toX(0)} y1={topPad - 5} x2={toX(0)} y2={baseY} stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
        {/* ±1σ shaded zone + dashed lines */}
        <rect x={toX(-stdDev)} y={topPad - 5} width={toX(stdDev) - toX(-stdDev)} height={graphH + 5} fill="#3b82f6" opacity="0.08" rx="3" />
        <line x1={toX(-stdDev)} y1={y1Sigma} x2={toX(-stdDev)} y2={baseY} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4" />
        <line x1={toX(stdDev)} y1={y1Sigma} x2={toX(stdDev)} y2={baseY} stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4" />
        <text x={(toX(-stdDev) + toX(stdDev)) / 2} y={topPad - 10} textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="600">
          ~ 68% of weights
        </text>
        {ticks.map(v => (
          <g key={v}>
            <line x1={toX(v)} y1={baseY - 3} x2={toX(v)} y2={baseY + 3} stroke="#94a3b8" strokeWidth="1" />
            <text x={toX(v)} y={baseY + 16} textAnchor="middle" fontSize="10" fill="#94a3b8">
              {v === 0 ? '0' : v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2)}
            </text>
          </g>
        ))}
        {weights.map((w, i) => {
          const wx = toX(Math.max(xMin, Math.min(xMax, w)));
          const wy = baseY;
          return (
            <g key={i}>
              <text x={wx} y={wy - 12} textAnchor="middle" fontSize="9" fill="#ef4444" fontWeight="600">
                w{i + 1}
              </text>
              <circle cx={wx} cy={wy} r="5" fill="#ef4444" stroke="white" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function FullFlowDemo() {
  const n = 5;
  const stdDev = 1 / Math.sqrt(n);
  const labels = ['temp', 'humid', 'wind', 'press', 'cloud'];

  // Different input sets to cycle through
  const inputSets = [
    [2400, 3, 1985, 8200, 2],
    [1800, 4, 2005, 5400, 3],
    [3200, 5, 1972, 12000, 4],
    [950, 2, 2020, 3100, 1],
    [4100, 6, 1998, 15000, 3],
  ];

  const [inputIdx, setInputIdx] = useState(0);
  const [weights, setWeights] = useState<number[]>(() =>
    Array.from({ length: n }, () => randomNormal(0, stdDev))
  );

  const rawInputs = inputSets[inputIdx];
  const mean = rawInputs.reduce((a, b) => a + b, 0) / n;
  const std = Math.sqrt(rawInputs.reduce((a, b) => a + (b - mean) ** 2, 0) / n);
  const normalized = rawInputs.map(v => (v - mean) / std);

  const products = normalized.map((inp, i) => inp * weights[i]);
  const z = products.reduce((a, b) => a + b, 0);

  const regenerate = () => {
    setWeights(Array.from({ length: n }, () => randomNormal(0, stdDev)));
    setInputIdx((inputIdx + 1) % inputSets.length);
  };

  const cellStyle = {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '0.4rem',
    textAlign: 'center' as const
  };
  const labelStyle = { fontSize: '11px', color: '#64748b' };
  const valueStyle = {
    fontSize: '14px',
    fontWeight: '600' as const,
    fontFamily: 'Georgia, serif',
    color: '#1e293b'
  };

  const zColor = Math.abs(z) <= 4 ? '#16a34a' : '#dc2626';

  return (
    <div>
      {/* Regenerate button */}
      <div style={{ marginBottom: '0.75rem' }}>
        <button onClick={regenerate} style={{
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '0.5rem 1.25rem',
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Regenerate ↻
        </button>
      </div>

      {/* Step 1: Raw inputs */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>
          Raw inputs:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
          {rawInputs.map((v, i) => (
            <div key={i} style={cellStyle}>
              <div style={labelStyle}>{labels[i]}</div>
              <div style={valueStyle}>{v.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', fontSize: '18px', color: '#94a3b8', margin: '0.25rem 0' }}>↓ normalize</div>

      {/* Step 2: Normalized inputs */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>
          Normalized inputs (std dev ≈ 1):
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
          {normalized.map((v, i) => (
            <div key={i} style={cellStyle}>
              <div style={labelStyle}>{labels[i]}</div>
              <div style={{ ...valueStyle, color: '#2563eb' }}>
                {v >= 0 ? '+' : ''}{v.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', fontSize: '18px', color: '#94a3b8', margin: '0.25rem 0' }}>× weights (Xavier, std dev = 1/√5 ≈ 0.447)</div>

      {/* Bell curve + weights */}
      <BellCurveGraph stdDev={stdDev} weights={weights} />

      {/* Weight values */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
          {weights.map((w, i) => (
            <div key={i} style={cellStyle}>
              <div style={labelStyle}>w{i + 1}</div>
              <div style={{ ...valueStyle, color: '#ef4444' }}>
                {w >= 0 ? '+' : ''}{w.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div style={{ textAlign: 'center', fontSize: '18px', color: '#94a3b8', margin: '0.25rem 0' }}>↓ multiply &amp; sum</div>

      {/* Step 4: Products and z */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem' }}>
          Each term (input × weight):
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
          {products.map((p, i) => (
            <div key={i} style={cellStyle}>
              <div style={labelStyle}>{normalized[i].toFixed(2)} × {weights[i].toFixed(3)}</div>
              <div style={valueStyle}>
                {p >= 0 ? '+' : ''}{p.toFixed(3)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final z */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.75rem',
        background: Math.abs(z) <= 4 ? '#f8fafc' : '#f8fafc',
        border: `1px solid ${Math.abs(z) <= 4 ? '#e2e8f0' : '#e2e8f0'}`,
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>z = </span>
        <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Georgia, serif', color: zColor }}>
          {z >= 0 ? '+' : ''}{z.toFixed(3)}
        </span>
        <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '0.75rem' }}>
          {Math.abs(z) <= 4 ? '✓ in sigmoid\'s sweet spot (-4 to +4)' : '✗ outside sigmoid\'s range!'}
        </span>
      </div>
    </div>
  );
}

export default function Step10() {
  return (
    <div>

      <ExplanationBox title="The Problem: z Can Go Anywhere">
        <p>
          We just saw that sigmoid only works well when z is between -4 and +4. But remember
          what z actually is:
        </p>
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '0.75rem',
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          z = (input<sub>1</sub> × weight<sub>1</sub>) + (input<sub>2</sub> × weight<sub>2</sub>) + ... + bias
        </div>
        <p style={{ marginTop: '0.75rem' }}>
          Since z is a sum of many input × weight terms, the more inputs you have, the more
          terms get added together — and z can easily become massive, way beyond the -4 to +4
          range where sigmoid actually works. Our rain neuron only had 2 inputs and got z = −0.6 (safe),
          but a real weather model might have dozens of inputs, pushing z way out of range.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          We already learned about weights and normalization in earlier steps — now we&apos;re going
          to learn the precise math behind how to set them up so z stays in range. Let&apos;s start
          with the weights.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Improvement 1: Better Normalization (Fixing the Inputs)">
        <p>
          Back in Step 3, we learned to normalize inputs to a 0-1 range using:
        </p>
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '0.75rem',
          fontFamily: 'Georgia, serif',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          normalized = (value - min) / (max - min)
        </div>
        <p style={{ marginTop: '0.75rem' }}>
          This works — it gets all our inputs onto the same scale so no single input dominates.
          But there&apos;s a problem: all the values end up between <strong>0 and 1</strong>. They&apos;re
          all positive. Look at what that does to z:
        </p>

        <p><strong>The problem with 0-1 normalization:</strong></p>
        <p style={{ marginTop: '0.5rem' }}>
          If all inputs are positive (between 0 and 1), and we multiply them by positive weights,
          every term in the z sum is positive. The terms can only <em>add up</em>, never cancel each
          other out. This pushes z away from 0 and toward the edges of sigmoid&apos;s effective zone.
        </p>

        <p style={{ marginTop: '0.75rem' }}>
          A better approach is to center the values <strong>around 0</strong> instead:
        </p>
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '0.75rem'
        }}>
          <p><strong>1. Find the average</strong> of all values for that input</p>
          <p style={{ marginTop: '0.5rem' }}><strong>2. Find the standard deviation</strong> (how far values typically are from the average)</p>
          <p style={{ marginTop: '0.5rem' }}><strong>3. For each value:</strong> subtract the average, then divide by the standard deviation</p>
          <div style={{
            fontFamily: 'Georgia, serif',
            fontSize: '18px',
            textAlign: 'center',
            margin: '0.75rem 0',
            padding: '0.5rem',
            background: 'white',
            borderRadius: '6px'
          }}>
            normalized value = (value - average) / standard deviation
          </div>
        </div>
        <p style={{ marginTop: '0.75rem' }}>
          Now values are centered around 0 — some positive, some negative. This means the terms
          in the z equation can cancel each other out, keeping z closer to 0 (right in the sweet
          spot of sigmoid). And because we&apos;re dividing by the standard deviation, most normalized
          values end up within ±1 of the center — the standard deviation of our inputs is now ~1.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          You might remember that standard deviation doesn&apos;t just average the distances from the
          mean — it squares them first, averages the squares, then takes the square root. Why not
          just use the plain average distance? Because squaring punishes outliers more heavily. A
          value that&apos;s 10 away from the mean contributes 100 to the calculation, while a value
          that&apos;s 1 away only contributes 1. This means standard deviation is more sensitive to
          extreme values, which is exactly what we want — we&apos;re trying to prevent z from landing
          in sigmoid&apos;s flat zones, and it only takes one extreme input to push z out of range.
          Standard deviation catches those dangerous outliers better than a simple average would.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Improvement 2: Xavier Initialization (Fixing Normalization's Blind Spot)">
        <p>
          OK so we fixed the inputs — they&apos;re now centered around 0 with a standard deviation of ~1.
          Problem solved, right? Not quite. Normalization only controls the inputs, but z
          isn&apos;t just the inputs — it&apos;s inputs <em>times weights</em>, all added up. In theory,
          every time you add another input × weight term to the sum, the positives and negatives
          should cancel out — after all, we centered everything around 0 with normalization, so
          there should be just as many positive terms as negative ones.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          But in reality, the cancellation is never perfect. We can see why with a simple coin
          flip game. Each flip gives you +1 or -1 at random. After 4 flips, you&apos;d expect to be
          back at 0 — the +1s and -1s should cancel, right? But try it: you might get +1, -1, -1, +1
          (total: 0), or you might get +1, +1, -1, +1 (total: +2). Sometimes they cancel perfectly,
          but usually you drift a bit. Let&apos;s actually compute the standard deviation to see how
          far you typically drift. Say we run the 4-flip game many times and get totals of: +2, 0,
          -2, +2, 0, -2, +2, -2, 0, +2. The mean is 0.2. To get the standard deviation: square
          each distance from the mean (3.24, 0.04, 4.84, ...), average them (3.56), and take the
          square root: <strong>√3.56 ≈ 1.89 ≈ √4</strong>. After 100 flips, the same math gives a
          standard deviation of √100 = 10. The pattern: after n flips, the standard deviation
          of your position is <strong>√n</strong>.
        </p>

        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '0.75rem',
          marginTop: '0.75rem',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <strong style={{ color: '#1e293b' }}>Why √n? Why not just track average distance?</strong> Because
          average distance gets tricked by cancellation. Say A is either +1 or -1, and B is either
          +1 or -1. The possible sums are: +2, 0, 0, -2. Look at those two zeros — when +1 and -1
          cancel out perfectly, the sum is 0 distance from center. Average distance sees that and
          thinks &quot;no spread here!&quot; So the average distance of the sums is (2 + 0 + 0 + 2) / 4
          = <strong>1.0</strong> — the same as each individual value. It didn&apos;t grow at all,
          because the cancellations fooled it into thinking the spread stayed the same.
          <br /><br />
          Think about it: with just one coin flip you get results of {'{'}+1, -1{'}'} — average
          distance from 0 is <strong>1.0</strong>. With two coin flips you get {'{'}+2, 0, 0, -2{'}'} —
          average distance from 0 is also <strong>1.0</strong>. But intuitively, adding more random
          values <em>should</em> make the total more spread out — you can now reach ±2 instead of
          just ±1! Average distance can&apos;t see this because the extra zeros from cancellation
          drag the average back down, hiding the real growth.
          <br /><br />
          Standard deviation doesn&apos;t get fooled, because it <em>squares</em> the distances
          first. When you square, every value becomes positive — a result of 0 still had two
          values that each contributed spread, and squaring preserves that information instead of
          letting the cancellation hide it. That&apos;s why the std dev of the sums comes out
          to √2 ≈ 1.41 — it grew by exactly <strong>√2</strong>, correctly reflecting that adding
          a second random value really does make things more spread out, even when some results
          happen to cancel. This predictable √n growth is what lets us calculate exactly how much
          to shrink each weight.
        </div>

        <p style={{ marginTop: '0.75rem' }}>
          The exact same thing happens with z. Each input × weight term is like one of those coin
          flips — a small random contribution that&apos;s equally likely to be positive or negative.
          When you add up n of them, z doesn&apos;t stay at 0 — it drifts, and its standard deviation
          grows by √n. So if each weight has a standard deviation of 1, z&apos;s standard deviation
          would be √n — fine for 5 inputs (√5 ≈ 2.2), but way too big for 100 inputs (√100 = 10).
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So Xavier&apos;s fix is simple: if adding up n terms multiplies the standard deviation by √n,
          just shrink each weight&apos;s standard deviation by √n to cancel it out. Set each weight&apos;s
          standard deviation to <strong>1/√n</strong>, and z&apos;s standard deviation stays at ~1 no
          matter how many inputs we have — right in sigmoid&apos;s sweet spot where the neuron&apos;s
          confidence can meaningfully change. For 5 inputs,
          1/√5 = 0.447, so about 68% of weights land between -0.447 and +0.447.
        </p>

      </ExplanationBox>

      <ExplanationBox title="Why do the starting weights matter so much?">
        <p>
          You might think: &quot;Can&apos;t the network just <em>fix</em> bad weights during
          training?&quot; The problem is that learning depends on the <strong>gradient</strong> — how
          much the output changes when you tweak a weight. If z is way out in sigmoid&apos;s flat
          zone (like z = 50), the gradient is basically <strong>zero</strong>. The network has no
          signal telling it which direction to move. It&apos;s like being lost in a perfectly flat
          desert — you know you need to go somewhere, but there&apos;s no slope to follow. You&apos;re stuck.
          Even if the gradient isn&apos;t completely zero, a bad starting point means the network
          wastes tons of training steps just getting weights to a reasonable range before it can
          start learning useful patterns. Starting smart with Xavier saves all of that — the rain
          neuron can immediately start learning which inputs matter instead of spending ages just
          trying to get unstuck.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Putting It All Together">
        <p>
          Here&apos;s the full picture. Our goal is to keep z in sigmoid&apos;s effective range (-4 to +4).
          Normalization handles the inputs: it centers them around 0 and scales them so their
          standard deviation is ~1, giving each input × weight term a reasonable size. But
          normalization can&apos;t control what happens when all those terms get summed — adding up n
          terms makes z&apos;s standard deviation grow by √n. So Xavier handles the weights: it sets
          each weight&apos;s standard deviation to 1/√n, which cancels out that √n growth and keeps
          z&apos;s standard deviation at ~1. Normalization fixes the inputs, Xavier fixes the sum —
          together they guarantee z lands right where sigmoid works best.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Try regenerating to see the full flow — raw inputs get normalized, then multiplied by
          Xavier-scaled weights, and z consistently lands in sigmoid&apos;s sweet spot:
        </p>

        <FullFlowDemo />

      </ExplanationBox>

    </div>
  );
}
