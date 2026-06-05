'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

// Toy 2-D embeddings so similarity is visible on a plane. Hand-placed so related
// words cluster. Axes loosely mean "royalty/person" (x) and "gender" (y).
const EMB: Record<string, [number, number]> = {
  king: [0.9, 0.8],
  queen: [0.9, -0.8],
  man: [0.3, 0.7],
  woman: [0.3, -0.7],
  prince: [0.7, 0.6],
  princess: [0.7, -0.6],
  dog: [-0.8, 0.1],
  cat: [-0.7, -0.1],
};
const WORDS = Object.keys(EMB);

const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1];
const mag = (a: number[]) => Math.hypot(a[0], a[1]);
const cosine = (a: number[], b: number[]) => dot(a, b) / (mag(a) * mag(b) || 1);

function EmbeddingDemo() {
  const [sel, setSel] = useState('king');
  const sv = EMB[sel];
  // map [-1,1] to svg
  const X = (x: number) => 150 + x * 120;
  const Y = (y: number) => 150 - y * 120;
  const ranked = WORDS.filter(w => w !== sel)
    .map(w => ({ w, sim: cosine(sv, EMB[w]) }))
    .sort((a, b) => b.sim - a.sim);
  return (
    <div className="emb-box">
      <div className="emb-grid">
        <svg viewBox="0 0 300 300" className="emb-svg">
          <line x1={30} y1={150} x2={270} y2={150} stroke="#e2e8f0" />
          <line x1={150} y1={30} x2={150} y2={270} stroke="#e2e8f0" />
          {WORDS.map(w => {
            const [x, y] = EMB[w];
            const on = w === sel;
            return (
              <g key={w} className="emb-pt" onClick={() => setSel(w)} style={{ cursor: 'pointer' }}>
                <circle cx={X(x)} cy={Y(y)} r={on ? 7 : 5} fill={on ? '#7c3aed' : '#c4b5fd'} />
                <text x={X(x)} y={Y(y) - 10} textAnchor="middle" fontSize={11} fill={on ? '#5b21b6' : '#64748b'} fontWeight={on ? 700 : 400}>{w}</text>
              </g>
            );
          })}
        </svg>
        <div className="emb-rank">
          <p className="emb-rank-title">Closest to <strong>{sel}</strong></p>
          {ranked.slice(0, 4).map(r => (
            <div key={r.w} className="emb-rrow">
              <span>{r.w}</span>
              <span className="emb-track"><span className="emb-fill" style={{ width: `${Math.max(0, r.sim) * 100}%` }} /></span>
              <span className="emb-sim">{r.sim.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="emb-note">
        Click any word. Words with similar meaning sit close together and score a high{' '}
        <strong>cosine similarity</strong> (near 1). &quot;king&quot; is near &quot;prince&quot; and
        &quot;man&quot;; &quot;dog&quot; and &quot;cat&quot; cluster off on their own. Position <em>is</em> meaning.
      </p>
      <style jsx>{`
        .emb-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .emb-grid { display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; }
        .emb-svg { width: 100%; max-width: 300px; height: auto; background: white; border: 1px solid #e2e8f0; border-radius: 8px; }
        .emb-rank { flex: 1; min-width: 200px; }
        .emb-rank-title { font-size: 13px; color: #64748b; margin: 0 0 0.6rem; }
        .emb-rrow { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; font-size: 13px; color: #334155; }
        .emb-rrow > span:first-child { width: 64px; }
        .emb-track { flex: 1; height: 8px; background: #eef2f7; border-radius: 4px; overflow: hidden; }
        .emb-fill { display: block; height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); }
        .emb-sim { width: 34px; text-align: right; font-variant-numeric: tabular-nums; color: #64748b; }
        .emb-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="From Meaningless IDs to Meaningful Vectors">
        <p>
          A token ID is just a name tag. ID 6766 isn&apos;t bigger or smaller than 6767 in any meaningful
          way — they&apos;re arbitrary labels. So the first thing the model does is swap each ID for a list
          of numbers called an <strong>embedding</strong>: a vector that places the token somewhere in a
          high-dimensional &quot;meaning space.&quot;
        </p>
        <p>
          The magic is that during training, the model arranges this space so that{' '}
          <strong>tokens with similar meanings end up near each other</strong>. Real models use hundreds or
          thousands of dimensions, but the idea works in 2-D, where we can actually see it:
        </p>
        <EmbeddingDemo />
      </ExplanationBox>

      <ExplanationBox title="Measuring 'Closeness' With Cosine Similarity">
        <p>
          How do we measure whether two embedding vectors point the same way? With{' '}
          <strong>cosine similarity</strong> — the dot product of the two vectors divided by their lengths.
          It&apos;s 1 when they point in exactly the same direction, 0 when they&apos;re unrelated
          (perpendicular), and negative when they point opposite ways.
        </p>
        <MathFormula label="Cosine similarity">
          similarity(a, b) = (a · b) / (‖a‖ × ‖b‖)
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          This is the same dot product you used to combine weights and inputs in a neuron — here it&apos;s
          measuring how aligned two meanings are. Direction carries the meaning; that&apos;s why
          &quot;king&quot; and &quot;queen&quot; can be close on one axis and far apart on another.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why This Matters for What's Next">
        <p>
          Embeddings give every token a rich, trainable representation instead of a bare number. But there&apos;s
          still a problem: the embedding for &quot;bank&quot; is the same whether you mean a riverbank or a
          place that holds money. The word&apos;s meaning depends on the words <em>around</em> it.
        </p>
        <p>
          The model needs a way for each token to look at its neighbors and adjust its representation based
          on context. That mechanism — the heart of every modern LLM — is <strong>attention</strong>, and
          it&apos;s where we go next.
        </p>
      </ExplanationBox>

    </div>
  );
}
