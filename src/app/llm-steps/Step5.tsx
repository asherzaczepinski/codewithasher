'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// ─── helpers ──────────────────────────────────────────────────────────────────
const dot2 = (a: [number,number], b: [number,number]) => a[0]*b[0]+a[1]*b[1];
const mag2 = (a: [number,number]) => Math.hypot(a[0], a[1]);
const cos2 = (a: [number,number], b: [number,number]) => dot2(a,b)/(mag2(a)*mag2(b)||1);

// ─── Our toy world: three tiny embeddings used for the rest of the course ─────
const TOY = [
  { word: 'cat', nums: [1.0, 0.2, 0.1] },
  { word: 'sat', nums: [0.3, 1.0, 0.4] },
  { word: 'mat', nums: [0.9, 0.3, 0.2] },
];

function ToyVectors() {
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.75rem', fontSize: 13, color: '#64748b' }}>
        Our toy world&apos;s embeddings — small enough to compute with by hand:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TOY.map(t => (
          <div key={t.word} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 40, fontWeight: 700, fontSize: 14, color: '#334155', flexShrink: 0 }}>{t.word}</span>
            <span style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0 }}>→</span>
            <span style={{ fontFamily: 'var(--font-mono), monospace', fontSize: 14, color: '#5b21b6', fontWeight: 600 }}>
              [{t.nums.map(n => n.toFixed(1)).join(', ')}]
            </span>
          </div>
        ))}
      </div>
      <p style={{ margin: '0.75rem 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        Notice <strong>cat</strong> and <strong>mat</strong> have similar numbers (they show up in similar
        sentences in our tiny world), while <strong>sat</strong> — a verb — points a different way.
        Remember these three vectors: they come back when we compute attention.
      </p>
    </div>
  );
}

// ─── Dot product demo ─────────────────────────────────────────────────────────
function DotProductDemo() {
  const [angleA, setAngleA] = useState(30);
  const [angleB, setAngleB] = useState(70);
  const W=220,H=220,CX=110,CY=130,R=85;
  const rad = (d: number) => d*Math.PI/180;
  const ax=CX+R*Math.cos(rad(angleA)), ay=CY-R*Math.sin(rad(angleA));
  const bx=CX+R*Math.cos(rad(angleB)), by=CY-R*Math.sin(rad(angleB));
  const vA:[number,number]=[Math.cos(rad(angleA)),Math.sin(rad(angleA))];
  const vB:[number,number]=[Math.cos(rad(angleB)),Math.sin(rad(angleB))];
  const dotVal=dot2(vA,vB), diffDeg=Math.abs(angleA-angleB);
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <svg width={W} height={H} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', display: 'block' }}>
            <line x1={20} y1={CY} x2={W-10} y2={CY} stroke="#e2e8f0" />
            <line x1={CX} y1={10} x2={CX} y2={H-10} stroke="#e2e8f0" />
            <path d={`M ${CX+22} ${CY} A 22 22 0 ${diffDeg>180?1:0} 1 ${CX+22*Math.cos(rad(angleB))} ${CY-22*Math.sin(rad(angleB))}`} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
            <text x={CX+28} y={CY-12} fontSize={10} fill="#64748b">{diffDeg}°</text>
            <line x1={CX} y1={CY} x2={ax} y2={ay} stroke="#7c3aed" strokeWidth={2.5} />
            <circle cx={ax} cy={ay} r={4} fill="#7c3aed" />
            <text x={ax+6} y={ay} fontSize={12} fill="#7c3aed" fontWeight="bold">a</text>
            <line x1={CX} y1={CY} x2={bx} y2={by} stroke="#2563eb" strokeWidth={2.5} />
            <circle cx={bx} cy={by} r={4} fill="#2563eb" />
            <text x={bx+6} y={by} fontSize={12} fill="#2563eb" fontWeight="bold">b</text>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            <label style={{ fontSize: 12, color: '#7c3aed' }}>Vector <b>a</b>: {angleA}°<input type="range" min={0} max={90} value={angleA} onChange={e=>setAngleA(+e.target.value)} style={{ width: '100%', accentColor: '#7c3aed' }} /></label>
            <label style={{ fontSize: 12, color: '#2563eb' }}>Vector <b>b</b>: {angleB}°<input type="range" min={0} max={90} value={angleB} onChange={e=>setAngleB(+e.target.value)} style={{ width: '100%', accentColor: '#2563eb' }} /></label>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ background: '#ede9fe', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem' }}>
            <div style={{ fontSize: 12, color: '#6d28d9', marginBottom: 4, fontWeight: 600 }}>Formula</div>
            <code style={{ fontSize: 13, color: '#4c1d95' }}>a · b = a₁×b₁ + a₂×b₂ + … + aₙ×bₙ</code>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Live result</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1e293b' }}>{dotVal.toFixed(3)}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>= {vA[0].toFixed(2)} × {vB[0].toFixed(2)} + {vA[1].toFixed(2)} × {vB[1].toFixed(2)}</div>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.6, color: '#475569', background: '#f1f5f9', padding: '10px 12px', borderRadius: 8 }}>
            <b>Problem with raw dot product:</b> if one vector is very long and the other short, the result is big even if they point in completely different directions. The size of the vector pollutes the similarity score. That&apos;s what cosine similarity fixes.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cosine similarity demo ───────────────────────────────────────────────────
function CosineSimilarityDemo() {
  const [angleA, setAngleA] = useState(30);
  const [angleB, setAngleB] = useState(70);
  const W=220,H=220,CX=110,CY=130,R=85;
  const rad = (d: number) => d*Math.PI/180;
  const ax=CX+R*Math.cos(rad(angleA)), ay=CY-R*Math.sin(rad(angleA));
  const bx=CX+R*Math.cos(rad(angleB)), by=CY-R*Math.sin(rad(angleB));
  const vA:[number,number]=[Math.cos(rad(angleA)),Math.sin(rad(angleA))];
  const vB:[number,number]=[Math.cos(rad(angleB)),Math.sin(rad(angleB))];
  const dotVal=dot2(vA,vB), cosVal=cos2(vA,vB), diffDeg=Math.abs(angleA-angleB);
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div>
          <svg width={W} height={H} style={{ background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0', display: 'block' }}>
            <line x1={20} y1={CY} x2={W-10} y2={CY} stroke="#e2e8f0" />
            <line x1={CX} y1={10} x2={CX} y2={H-10} stroke="#e2e8f0" />
            <path d={`M ${CX+22} ${CY} A 22 22 0 ${diffDeg>180?1:0} 1 ${CX+22*Math.cos(rad(angleB))} ${CY-22*Math.sin(rad(angleB))}`} fill="none" stroke="#94a3b8" strokeWidth={1.5} />
            <text x={CX+28} y={CY-12} fontSize={10} fill="#64748b">{diffDeg}°</text>
            <line x1={CX} y1={CY} x2={ax} y2={ay} stroke="#7c3aed" strokeWidth={2.5} />
            <circle cx={ax} cy={ay} r={4} fill="#7c3aed" />
            <text x={ax+6} y={ay} fontSize={12} fill="#7c3aed" fontWeight="bold">a</text>
            <line x1={CX} y1={CY} x2={bx} y2={by} stroke="#2563eb" strokeWidth={2.5} />
            <circle cx={bx} cy={by} r={4} fill="#2563eb" />
            <text x={bx+6} y={by} fontSize={12} fill="#2563eb" fontWeight="bold">b</text>
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            <label style={{ fontSize: 12, color: '#7c3aed' }}>Vector <b>a</b>: {angleA}°<input type="range" min={0} max={90} value={angleA} onChange={e=>setAngleA(+e.target.value)} style={{ width: '100%', accentColor: '#7c3aed' }} /></label>
            <label style={{ fontSize: 12, color: '#2563eb' }}>Vector <b>b</b>: {angleB}°<input type="range" min={0} max={90} value={angleB} onChange={e=>setAngleB(+e.target.value)} style={{ width: '100%', accentColor: '#2563eb' }} /></label>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ background: '#dbeafe', borderRadius: 8, padding: '10px 14px', marginBottom: '1rem' }}>
            <div style={{ fontSize: 12, color: '#1d4ed8', marginBottom: 4, fontWeight: 600 }}>Formula</div>
            <code style={{ fontSize: 13, color: '#1e3a8a' }}>cos(θ) = (a · b) / (‖a‖ × ‖b‖)</code>
          </div>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 2 }}>Dot product: <span style={{ color: '#1e293b', fontWeight: 600 }}>{dotVal.toFixed(3)}</span> ÷ magnitudes</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: cosVal>0.7?'#059669':cosVal>0.3?'#d97706':'#dc2626', marginTop: 4 }}>{cosVal.toFixed(3)}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>angle: {diffDeg}°</div>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.8, color: '#475569', background: '#f1f5f9', padding: '10px 12px', borderRadius: 8 }}>
            <b>1.0</b> — same direction (identical meaning)<br />
            <b>0.0</b> — perpendicular (unrelated)<br />
            <b>−1.0</b> — opposite directions<br /><br />
            Right now: <b style={{ color: cosVal>0.7?'#059669':cosVal>0.3?'#d97706':'#dc2626' }}>
              {cosVal>0.95?'Nearly identical.':cosVal>0.7?'Very similar.':cosVal>0.3?'Loosely related.':cosVal>0?'Barely related.':'Opposites.'}
            </b>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Meet Our Toy World">
        <p>
          From here on, the course has a running example — just like the rain network. Our world has a
          handful of words, and each gets a tiny <strong>3-dimensional</strong> embedding instead of 768
          dimensions. Three numbers per word means every calculation fits on a napkin, but the math is{' '}
          <em>identical</em> to what runs inside GPT-4.
        </p>
        <ToyVectors />
        <p>
          Now the question from last step: how do we <strong>measure</strong> that cat and mat are
          similar while cat and sat aren&apos;t? We need to turn two lists of numbers into a single
          similarity score.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 1: The Dot Product">
        <p>
          The workhorse is the <strong>dot product</strong>: multiply each pair of coordinates and add
          them all up. If the vectors point in the same direction, you get a big positive number.
          Opposite directions give a negative number. You&apos;ve seen this before — it&apos;s the exact
          same multiply-and-sum a neuron does with inputs and weights. Drag the vectors and watch:
        </p>
        <DotProductDemo />
      </ExplanationBox>

      <WorkedExample title="Dot Products in Our Toy World">
        <p>Let&apos;s score <strong>cat</strong> against the other two words, by hand:</p>

        <CalcStep number={1}>cat = [1.0, 0.2, 0.1], mat = [0.9, 0.3, 0.2], sat = [0.3, 1.0, 0.4]</CalcStep>
        <CalcStep number={2}>cat · mat = (1.0 × 0.9) + (0.2 × 0.3) + (0.1 × 0.2) = 0.90 + 0.06 + 0.02 = <strong>0.98</strong></CalcStep>
        <CalcStep number={3}>cat · sat = (1.0 × 0.3) + (0.2 × 1.0) + (0.1 × 0.4) = 0.30 + 0.20 + 0.04 = <strong>0.54</strong></CalcStep>

        <p style={{ marginTop: '1rem' }}>
          0.98 vs 0.54 — the numbers agree with our intuition: <strong>cat is much more similar to mat
          than to sat</strong>. Two multiplications-and-sums, and &quot;similarity of meaning&quot; became
          something a computer can rank. Keep these two scores in mind — in the attention step,
          numbers exactly like them decide which words listen to which.
        </p>
      </WorkedExample>

      <ExplanationBox title="Step 2: Cosine Similarity">
        <p>
          The dot product has a flaw — longer vectors produce bigger numbers even for the same angle.{' '}
          <strong>Cosine similarity</strong> fixes this by dividing by both vectors&apos; lengths, so only
          the angle matters. The result is always between −1 and 1.
        </p>
        <CosineSimilarityDemo />
      </ExplanationBox>

      <WorkedExample title="Cosine Similarity, By Hand">
        <p>Same toy vectors. A vector&apos;s length (‖a‖) is the square root of the sum of its squared coordinates:</p>

        <CalcStep number={1}>‖cat‖ = √(1.0² + 0.2² + 0.1²) = √1.05 ≈ 1.025</CalcStep>
        <CalcStep number={2}>‖mat‖ = √(0.9² + 0.3² + 0.2²) = √0.94 ≈ 0.970</CalcStep>
        <CalcStep number={3}>‖sat‖ = √(0.3² + 1.0² + 0.4²) = √1.25 ≈ 1.118</CalcStep>
        <CalcStep number={4}>cos(cat, mat) = 0.98 / (1.025 × 0.970) = 0.98 / 0.994 ≈ <strong>0.986</strong></CalcStep>
        <CalcStep number={5}>cos(cat, sat) = 0.54 / (1.025 × 1.118) = 0.54 / 1.146 ≈ <strong>0.471</strong></CalcStep>

        <p style={{ marginTop: '1rem' }}>
          On the clean −1-to-1 scale: cat and mat are at <strong>0.986</strong> — nearly identical
          direction — while cat and sat sit at <strong>0.471</strong>, loosely related (they do appear in
          the same sentences, after all). This is the same scale the demo above shows.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why This Is the Most Important Operation in the Course">
        <p>
          Here&apos;s the punchline: <strong>almost everything an LLM does is dot products</strong>.
          When the model decides how much the word &quot;it&quot; should pay attention to
          &quot;animal,&quot; that&apos;s a dot product between two vectors. When it scores 50,000
          vocabulary words to pick the next token, that&apos;s 50,000 dot products. The entire
          intelligence of the system is built out of this one cheap, simple operation, repeated
          billions of times.
        </p>
        <p>
          One problem remains. The embedding for &quot;bank&quot; is the <em>same vector</em> whether
          you mean a riverbank or a financial institution — meaning depends on{' '}
          <em>context</em>, and so far each word&apos;s vector is fixed in isolation. The mechanism that
          fixes this is <strong>attention</strong> — Part 2 of the course, starting now.
        </p>
      </ExplanationBox>
    </div>
  );
}
