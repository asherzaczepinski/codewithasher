'use client';

import { useRef, useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// ─── Interactive cosine playground: angle sets cosine; length never does ─────────
function CosinePlayground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [angle, setAngle] = useState(35);   // degrees of B above the reference
  const [len, setLen] = useState(1.0);      // length multiplier for B
  const [drag, setDrag] = useState(false);

  const W = 300, H = 300, cx = 150, cy = 150, UNIT = 100;
  // reference vector A points straight right
  const A: [number, number] = [1, 0];
  const rad = (angle * Math.PI) / 180;
  const B: [number, number] = [Math.cos(rad) * len, Math.sin(rad) * len];

  const toScreen = (v: [number, number]) => [cx + v[0] * UNIT, cy - v[1] * UNIT] as const;
  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const r = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W - cx;
    const py = cy - (((e.clientY - r.top) / r.height) * H);
    const ang = Math.round((Math.atan2(py, px) * 180) / Math.PI);
    setAngle(Math.max(-170, Math.min(170, ang)));
  };

  const cos = Math.cos(rad); // since A is unit along x, cos(A,B) = cos(angle)
  const [axx, axy] = toScreen([A[0] * 1.2, A[1] * 1.2]);
  const [bx, by] = toScreen(B);
  const meterColor = cos > 0.15 ? '#15803d' : cos < -0.15 ? '#b91c1c' : '#64748b';

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.9rem', fontSize: 13, color: '#64748b' }}>
        Drag the purple arrow to change the <strong>angle</strong>, and stretch it with the slider to
        change its <strong>length</strong>. Watch the cosine: it tracks the angle and{' '}
        <em>completely ignores</em> the length.
      </p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} onPointerMove={onMove} onPointerUp={() => setDrag(false)} onPointerLeave={() => setDrag(false)}
          style={{ width: 260, maxWidth: '100%', touchAction: 'none', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e2e8f0" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e2e8f0" strokeWidth={1} />
          <defs>
            <marker id="cArrA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" /></marker>
            <marker id="cArrB" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c3aed" /></marker>
          </defs>
          <line x1={cx} y1={cy} x2={axx} y2={axy} stroke="#94a3b8" strokeWidth={3} markerEnd="url(#cArrA)" />
          <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#7c3aed" strokeWidth={3} markerEnd="url(#cArrB)" />
          <circle cx={bx} cy={by} r={11} fill="#7c3aed" opacity={0.18} onPointerDown={() => setDrag(true)} style={{ cursor: 'grab' }} />
          <circle cx={bx} cy={by} r={5} fill="#7c3aed" onPointerDown={() => setDrag(true)} style={{ cursor: 'grab' }} />
          <text x={axx + 6} y={axy + 14} fontSize={12} fontWeight={700} fill="#64748b">reference</text>
          <text x={bx + 8} y={by - 6} fontSize={12} fontWeight={700} fill="#7c3aed">b</text>
        </svg>
        <div style={{ flex: 1, minWidth: 180, fontSize: 13 }}>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>angle ≈ <strong>{Math.abs(angle)}°</strong></div>
          <label style={{ fontSize: 12, color: '#64748b' }}>length of b: {len.toFixed(1)}×</label>
          <input type="range" min={0.4} max={1.4} step={0.1} value={len} onChange={e => setLen(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#7c3aed', margin: '4px 0 12px' }} />
          <div style={{ fontSize: 26, fontWeight: 800, color: meterColor }}>cos = {cos.toFixed(2)}</div>
          {/* −1 .. 1 scale meter */}
          <div style={{ position: 'relative', height: 12, background: 'linear-gradient(90deg,#fecaca,#e5e7eb,#bbf7d0)', borderRadius: 6, marginTop: 8 }}>
            <div style={{ position: 'absolute', top: -3, left: `calc(${((cos + 1) / 2) * 100}% - 3px)`, width: 6, height: 18, background: '#1e293b', borderRadius: 3 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
            <span>−1 opposite</span><span>0 unrelated</span><span>+1 same</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Step10() {
  return (
    <div>
      <ExplanationBox title="Direction Without Size">
        <p>
          Last step the dot product gave us alignment — but it blended two ingredients: which way the
          vectors point, and how long they are. Often we only care about the first. Two words can mean
          almost the same thing while one shows up far more forcefully (a longer vector); we want a score
          that says <em>&ldquo;same direction&rdquo;</em> regardless of size. That score is{' '}
          <strong>cosine similarity</strong>.
        </p>
        <p>
          The trick is to <strong>divide out the lengths</strong>. Take the dot product, then strip away
          each vector&apos;s magnitude. What is left is purely the cosine of the angle between them:
        </p>
        <MathFormula label="Cosine similarity">
          cos(a, b) = (a · b) / (‖a‖ × ‖b‖)
        </MathFormula>
        <p>
          Because it is a cosine, the answer always lands between <strong>−1 and +1</strong>:{' '}
          <strong>+1</strong> means the arrows point the exact same way (identical direction),{' '}
          <strong>0</strong> means they are at a right angle (unrelated), and <strong>−1</strong> means
          they point in opposite directions. A clean, length-proof ruler for meaning.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Watch Length Drop Out">
        <p>
          Here is the property that makes cosine special. Stretch the purple arrow as long or short as you
          like — the cosine does not budge. Only the <strong>angle</strong> moves the needle:
        </p>
        <CosinePlayground />
        <p>
          That is the whole point of dividing by the magnitudes: it normalises both vectors to length 1
          before comparing, so a loud word and a quiet word that mean the same thing still score near +1.
        </p>
      </ExplanationBox>

      <ExplanationBox title="First We Need the Magnitudes">
        <p>
          To divide by a vector&apos;s length we have to compute it. A vector&apos;s magnitude{' '}
          <code>‖v‖</code> is just the Pythagorean theorem in as many dimensions as you like:{' '}
          <strong>square every coordinate, add them up, take the square root.</strong>
        </p>
        <MathFormula label="Magnitude (length) of a 3-D vector">
          ‖v‖ = √(v₁² + v₂² + v₃²)
        </MathFormula>
      </ExplanationBox>

      <WorkedExample title="Step 1 — The Length of Each Word">
        <p>
          Plug our three vectors in. <code>The = [0.1, 0.0, 0.9]</code>,{' '}
          <code>sky = [1.0, 0.7, 0.0]</code>, <code>is = [0.1, 0.2, 0.8]</code>.
        </p>
        <CalcStep number={1}>
          ‖The‖ = √(0.1² + 0.0² + 0.9²) = √(0.01 + 0 + 0.81) = √0.82 ≈ <strong>0.906</strong>
        </CalcStep>
        <CalcStep number={2}>
          ‖sky‖ = √(1.0² + 0.7² + 0.0²) = √(1.00 + 0.49 + 0) = √1.49 ≈ <strong>1.221</strong>
        </CalcStep>
        <CalcStep number={3}>
          ‖is‖ = √(0.1² + 0.2² + 0.8²) = √(0.01 + 0.04 + 0.64) = √0.69 ≈ <strong>0.831</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Note <strong>sky</strong> is the longest arrow (1.221) — it has the most going on. That length
          is exactly what was inflating its dot products, and exactly what we are about to cancel out.
        </p>
      </WorkedExample>

      <WorkedExample title="Step 2 — Divide the Dot Products by the Lengths">
        <p>
          We already computed the three dot products last step: <code>The·is = 0.73</code>,{' '}
          <code>sky·is = 0.24</code>, <code>The·sky = 0.10</code>. Now divide each by the product of the
          two magnitudes.
        </p>
        <CalcStep number={1}>
          cos(The, is) = 0.73 / (0.906 × 0.831) = 0.73 / 0.753 ≈ <strong>0.97</strong>
        </CalcStep>
        <CalcStep number={2}>
          cos(sky, is) = 0.24 / (1.221 × 0.831) = 0.24 / 1.015 ≈ <strong>0.24</strong>
        </CalcStep>
        <CalcStep number={3}>
          cos(The, sky) = 0.10 / (0.906 × 1.221) = 0.10 / 1.106 ≈ <strong>0.09</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          On the clean −1…+1 scale the verdict is stark: <strong>The</strong> and <strong>is</strong>{' '}
          score <strong>0.97</strong> — practically the same direction — while <strong>sky</strong> sits
          almost perpendicular to <strong>The</strong> at <strong>0.09</strong> (essentially unrelated).
        </p>
      </WorkedExample>

      <ExplanationBox title="The Three Scores on One Scale">
        <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
          {[
            { pair: 'cos(The, is)', val: 0.97, note: 'nearly identical direction' },
            { pair: 'cos(sky, is)', val: 0.24, note: 'mildly related' },
            { pair: 'cos(The, sky)', val: 0.09, note: 'all but perpendicular' },
          ].map(r => (
            <div key={r.pair} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ width: 96, fontFamily: 'monospace', fontWeight: 700, fontSize: 12.5, color: '#334155' }}>{r.pair}</span>
              <div style={{ flex: 1, height: 18, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.val * 100}%`, background: r.val > 0.9 ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)' }} />
              </div>
              <span style={{ width: 40, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{r.val.toFixed(2)}</span>
              <span style={{ width: 168, fontSize: 11, color: '#94a3b8' }}>{r.note}</span>
            </div>
          ))}
        </div>
        <p>
          Compare this to the raw dot products from last step. The <em>ranking</em> is the same —{' '}
          <strong>The·is</strong> still wins — but cosine sharpens it into something interpretable: 0.97 is
          almost-a-1, so we can confidently say these two words point the same direction, not merely that
          they happened to have big numbers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Same Warning, Now in Sharp Focus">
        <p>
          Cosine just made the awkward fact undeniable: by pure direction, <strong>The</strong> and{' '}
          <strong>is</strong> are <strong>0.97</strong> similar — about as alike as two different words can
          be. Raw geometry insists they belong together. Yet for guessing what follows{' '}
          &ldquo;The sky is ___&rdquo;, that pairing is dead weight: two function words echoing each other
          tell us nothing about the next word.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px' }}>
          So we close Part 2 with a tension. We can now measure similarity two ways and both agree the
          most-similar words are the least-useful ones. To predict the next word, the model must look past
          raw look-alike-ness and learn to ask &ldquo;<em>who actually matters here?</em>&rdquo; That
          question is the doorway into Part 3 — attention.
        </p>
      </ExplanationBox>
    </div>
  );
}
