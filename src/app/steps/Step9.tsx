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

function BellCurveGraph({ stdDev, weights, onRegenerate }: { stdDev: number; weights: number[]; onRegenerate: () => void }) {
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
        {/* Regenerate button */}
        <g onClick={onRegenerate} style={{ cursor: 'pointer' }}>
          <rect x="8" y="8" width="119" height="30" rx="6" fill="#2563eb" />
          <text x="68" y="28" textAnchor="middle" fontSize="15" fill="white" fontWeight="600">Regenerate ↻</text>
        </g>
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

function WeightGenerator() {
  const n = 5;
  const stdDev = 1 / Math.sqrt(n); // 0.447
  const [weights, setWeights] = useState<number[]>(() =>
    Array.from({ length: 5 }, () => randomNormal(0, stdDev))
  );

  const generateWeights = () => {
    const newWeights = Array.from({ length: 5 }, () => randomNormal(0, stdDev));
    setWeights(newWeights);
  };

  return (
    <div>
      <BellCurveGraph stdDev={stdDev} weights={weights} onRegenerate={generateWeights} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '0.5rem',
        marginTop: '0.5rem',
      }}>
        {weights.map((w, i) => (
          <div key={i} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '0.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>w{i + 1}</div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: 'Georgia, serif',
              color: '#1e293b'
            }}>
              {w >= 0 ? '+' : ''}{w.toFixed(3)}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default function Step9() {
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
          range where sigmoid actually works.
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

        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '0.75rem'
        }}>
          <p><strong>The problem with 0-1 normalization:</strong></p>
          <p style={{ marginTop: '0.5rem' }}>
            If all inputs are positive (between 0 and 1), and we multiply them by positive weights,
            every term in the z sum is positive. The terms can only <em>add up</em>, never cancel each
            other out. This pushes z away from 0 and toward the edges of sigmoid&apos;s effective zone.
          </p>
        </div>

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
          isn&apos;t just the inputs — it&apos;s inputs <em>times weights</em>, all added up. Even with
          perfectly normalized inputs, every time you add another input × weight term to the sum,
          z&apos;s range gets wider. Normalization has no idea this is happening — it did its job on
          each input individually, but it can&apos;t control what happens when they all get multiplied
          by weights and summed together. We need the weights themselves to actively <em>counteract</em> this
          growth and keep z in sigmoid&apos;s sweet spot (-4 to +4).
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Think of it like a coin flip game. Each flip gives you +1 or -1 at random. After 1 flip,
          you&apos;re at +1 or -1. After 4 flips, you might expect to be at ±4 — but you&apos;re not,
          because the +1s and -1s partially cancel out. On average you end up around ±2 (which
          is √4). After 100 flips, you don&apos;t end up at ±100 — you land around ±10 (which is √100).
          The pattern: after n flips, your position&apos;s <strong>standard deviation</strong> is √n.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The exact same thing happens with z. Remember from normalization that standard deviation
          measures how far values typically spread from the center. Each input × weight term in z is
          like one of those coin flips — a small random contribution. When you add up n of them,
          z&apos;s standard deviation isn&apos;t n times bigger, it&apos;s <strong>√n</strong> times bigger,
          because the positive and negative terms keep partially cancelling. So if each weight has
          a standard deviation of 1, z&apos;s standard deviation would be √n — fine for 5
          inputs (√5 ≈ 2.2), but way too big for 100 inputs (√100 = 10).
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So Xavier&apos;s fix is simple: if adding up n terms multiplies the standard deviation by √n,
          just shrink each weight&apos;s standard deviation by √n to cancel it out. Set each weight&apos;s
          standard deviation to <strong>1/√n</strong>, and z&apos;s standard deviation stays at ~1 no
          matter how many inputs we have — right in sigmoid&apos;s sweet spot. For 5 inputs,
          1/√5 = 0.447, so about 68% of weights land between -0.447 and +0.447. Try generating
          weights from this distribution:
        </p>

        <WeightGenerator />

      </ExplanationBox>

      <ExplanationBox title="Why can't the network just learn to adjust the starting weights?">
          <p>
            You might think: &quot;Can&apos;t the network just <em>fix</em> bad weights during
            training?&quot; The problem is that learning depends on the <strong>gradient</strong> — how
            much the output changes when you tweak a weight. If z is way out in sigmoid&apos;s flat
            zone (like z = 50), the gradient is basically <strong>zero</strong>. The network has no
            signal telling it which direction to move. It&apos;s like being lost in a perfectly flat
            desert — you know you need to go somewhere, but there&apos;s no slope to follow. You&apos;re stuck.
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Even if the gradient isn&apos;t completely zero, a bad starting point means the network
            wastes tons of training steps just getting weights to a reasonable range before it can
            start learning useful patterns. Starting smart with Xavier saves all of that.
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
      </ExplanationBox>
    </div>
  );
}
