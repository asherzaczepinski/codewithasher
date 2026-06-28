'use client';

import { useRef, useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// ─── Interactive draggable dot-product playground (2-D, by hand) ─────────────────
function DotPlayground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [a, setA] = useState<[number, number]>([0.9, 0.3]);
  const [b, setB] = useState<[number, number]>([0.4, 0.85]);
  const [drag, setDrag] = useState<null | 'a' | 'b'>(null);

  const W = 300, H = 300, cx = 150, cy = 150, UNIT = 90;
  const toScreen = (v: [number, number]) => [cx + v[0] * UNIT, cy - v[1] * UNIT] as const;

  const fromEvent = (e: React.PointerEvent): [number, number] => {
    const r = svgRef.current!.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const py = ((e.clientY - r.top) / r.height) * H;
    const x = Math.max(-1.4, Math.min(1.4, (px - cx) / UNIT));
    const y = Math.max(-1.4, Math.min(1.4, (cy - py) / UNIT));
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const p = fromEvent(e);
    if (drag === 'a') setA(p); else setB(p);
  };

  const dp = a[0] * b[0] + a[1] * b[1];
  const magA = Math.hypot(a[0], a[1]) || 1e-6;
  const magB = Math.hypot(b[0], b[1]) || 1e-6;
  const cosT = Math.max(-1, Math.min(1, dp / (magA * magB)));
  const angle = (Math.acos(cosT) * 180) / Math.PI;

  const [ax, ay] = toScreen(a);
  const [bx, by] = toScreen(b);
  const sign = dp > 0.02 ? 'positive' : dp < -0.02 ? 'negative' : 'about zero';
  const signColor = dp > 0.02 ? '#15803d' : dp < -0.02 ? '#b91c1c' : '#64748b';

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.9rem', fontSize: 13, color: '#64748b' }}>
        Drag the two arrow-tips. The dot product is high when they point the <strong>same way</strong>,
        zero when they are at a right angle, and negative when they point apart.
      </p>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} onPointerMove={onMove} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}
          style={{ width: 260, maxWidth: '100%', touchAction: 'none', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
          <line x1={0} y1={cy} x2={W} y2={cy} stroke="#e2e8f0" strokeWidth={1} />
          <line x1={cx} y1={0} x2={cx} y2={H} stroke="#e2e8f0" strokeWidth={1} />
          <defs>
            <marker id="arrA" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2563eb" /></marker>
            <marker id="arrB" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c3aed" /></marker>
          </defs>
          <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="#2563eb" strokeWidth={3} markerEnd="url(#arrA)" />
          <line x1={cx} y1={cy} x2={bx} y2={by} stroke="#7c3aed" strokeWidth={3} markerEnd="url(#arrB)" />
          <circle cx={ax} cy={ay} r={10} fill="#2563eb" opacity={0.18} onPointerDown={() => setDrag('a')} style={{ cursor: 'grab' }} />
          <circle cx={ax} cy={ay} r={5} fill="#2563eb" onPointerDown={() => setDrag('a')} style={{ cursor: 'grab' }} />
          <circle cx={bx} cy={by} r={10} fill="#7c3aed" opacity={0.18} onPointerDown={() => setDrag('b')} style={{ cursor: 'grab' }} />
          <circle cx={bx} cy={by} r={5} fill="#7c3aed" onPointerDown={() => setDrag('b')} style={{ cursor: 'grab' }} />
          <text x={ax + 8} y={ay - 6} fontSize={12} fontWeight={700} fill="#2563eb">a</text>
          <text x={bx + 8} y={by - 6} fontSize={12} fontWeight={700} fill="#7c3aed">b</text>
        </svg>
        <div style={{ flex: 1, minWidth: 180, fontSize: 13 }}>
          <div style={{ fontFamily: 'monospace', color: '#2563eb', marginBottom: 4 }}>a = [{a[0].toFixed(2)}, {a[1].toFixed(2)}]</div>
          <div style={{ fontFamily: 'monospace', color: '#7c3aed', marginBottom: 10 }}>b = [{b[0].toFixed(2)}, {b[1].toFixed(2)}]</div>
          <div style={{ padding: '8px 10px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>multiply &amp; sum</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>
              ({a[0].toFixed(2)}×{b[0].toFixed(2)}) + ({a[1].toFixed(2)}×{b[1].toFixed(2)})
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: signColor }}>a · b = {dp.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: signColor, fontWeight: 600 }}>{sign}</div>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>angle between them ≈ <strong>{angle.toFixed(0)}°</strong></div>
        </div>
      </div>
    </div>
  );
}

export default function Step10() {
  return (
    <div>
      <ExplanationBox title="The One Number That Powers Everything">
        <p>
          We have three words living as points in space, and a hunch about which sit close. Now we make it
          exact. The tool is the <strong>dot product</strong>: feed it two vectors, get back a single
          number that says how much they <em>line up</em>. It shows up everywhere from here on — attention
          scores, the final prediction, all of it — so it is worth nailing now.
        </p>
        <p>The recipe is almost suspiciously simple: <strong>multiply matching slots, then add the results.</strong></p>
        <MathFormula label="Dot product of two vectors">
          a · b = a₁b₁ + a₂b₂ + a₃b₃
        </MathFormula>
        <p>
          That is the whole operation. No square roots, no division — just line the two lists up,
          multiply down each column, and sum. A big positive result means the vectors point the same way;
          near zero means they are unrelated (at a right angle); negative means they point against each
          other.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Feel It First">
        <p>
          Before we plug in our words, get a feel for the number by dragging. Notice the dot product peak
          when the two arrows overlap and drop to zero when they form an L:
        </p>
        <DotPlayground />
        <p>
          There are really two ways to read the same number. The arithmetic way —{' '}
          <em>multiply and sum the coordinates</em> — is what a computer does. The geometric way is{' '}
          <code>a · b = ‖a‖ ‖b‖ cos θ</code>: the two lengths times the cosine of the angle between them.
          Same answer, two viewpoints. The angle viewpoint is exactly why the dot product measures
          alignment — and it is what the next step (cosine similarity) builds on.
        </p>
      </ExplanationBox>

      <WorkedExample title="The Three Dot Products of &ldquo;The sky is&rdquo;">
        <p>
          Our vectors have three slots, so each dot product is three multiplies and a sum. Let&apos;s do
          all three pairings by hand. Recall:{' '}
          <code>The = [0.1, 0.0, 0.9]</code>, <code>sky = [1.0, 0.7, 0.0]</code>,{' '}
          <code>is = [0.1, 0.2, 0.8]</code>.
        </p>
        <CalcStep number={1}>
          <strong>The · sky</strong> = (0.1×1.0) + (0.0×0.7) + (0.9×0.0) = 0.10 + 0 + 0 ={' '}
          <strong>0.10</strong>
        </CalcStep>
        <CalcStep number={2}>
          <strong>The · is</strong> = (0.1×0.1) + (0.0×0.2) + (0.9×0.8) = 0.01 + 0 + 0.72 ={' '}
          <strong>0.73</strong>
        </CalcStep>
        <CalcStep number={3}>
          <strong>sky · is</strong> = (1.0×0.1) + (0.7×0.2) + (0.0×0.8) = 0.10 + 0.14 + 0 ={' '}
          <strong>0.24</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Three numbers fall out: <strong>The·sky = 0.10</strong>, <strong>The·is = 0.73</strong>,{' '}
          <strong>sky·is = 0.24</strong>. The arithmetic just confirmed the hunch from the geometry plot —
          the pair that lines up by far the most is <strong>The</strong> and <strong>is</strong>.
        </p>
      </WorkedExample>

      <ExplanationBox title="Visualising the Gap">
        <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
          {[
            { pair: 'The · is', val: 0.73, note: 'two plumbing words — almost identical' },
            { pair: 'sky · is', val: 0.24, note: 'a little shared content' },
            { pair: 'The · sky', val: 0.10, note: 'basically unrelated' },
          ].map(r => (
            <div key={r.pair} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ width: 78, fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#334155' }}>{r.pair}</span>
              <div style={{ flex: 1, height: 18, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(r.val / 0.73) * 100}%`, background: r.val === 0.73 ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)' }} />
              </div>
              <span style={{ width: 44, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{r.val.toFixed(2)}</span>
              <span style={{ width: 168, fontSize: 11, color: '#94a3b8' }}>{r.note}</span>
            </div>
          ))}
        </div>
      </ExplanationBox>

      <ExplanationBox title="A Quiet Problem: the Strongest Link Is Useless">
        <p>
          Look hard at that winner. The dot product says <strong>The</strong> and <strong>is</strong> are
          the most similar pair in the sentence — a whopping <strong>0.73</strong>, far ahead of anything
          involving <strong>sky</strong>. And of course it does: both are function words, both load up the
          GRAMMAR slot, so multiplying their big last coordinates (0.9 × 0.8 = 0.72) dominates the sum.
        </p>
        <p>
          But pause on what that <em>buys</em> us. We are trying to figure out what comes after{' '}
          &ldquo;The sky is ___&rdquo;. Knowing that <strong>The</strong> resembles <strong>is</strong> tells
          us nothing about the next word — they are interchangeable grammatical glue. The link that raw
          similarity shouts loudest about is exactly the link we cannot use.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px' }}>
          File this away. Raw dot products measure plain look-alike-ness, and look-alike-ness keeps pairing
          off the boring words. Fixing that — teaching the model to ask &ldquo;who matters for{' '}
          <em>prediction</em>&rdquo; instead of &ldquo;who looks alike&rdquo; — is the whole reason
          attention exists later in the course. For now, just notice the gap.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Catch Before We Move On">
        <p>
          The dot product mixes two things together: <em>direction</em> (do they point the same way?) and{' '}
          <em>magnitude</em> (how long are the arrows?). A long vector can rack up a big dot product just
          by being long, even if its direction is only so-so. Sometimes we want alignment <strong>with the
          length removed</strong> — pure direction. That is <strong>cosine similarity</strong>, and it is
          the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
