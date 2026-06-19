'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// Three tokens, each a tiny 3-dim vector — the SAME toy embeddings from the
// similarity step. To keep arithmetic followable we let Query = Key = Value =
// the embedding itself (real models multiply by learned matrices first; the
// mechanism is identical).
const TOKENS = ['cat', 'sat', 'mat'];
const VEC: number[][] = [
  [1.0, 0.2, 0.1], // cat
  [0.3, 1.0, 0.4], // sat
  [0.9, 0.3, 0.2], // mat (close to cat)
];
const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);
const f2 = (x: number) => x.toFixed(2);

function softmax(xs: number[]): number[] {
  const m = Math.max(...xs);
  const ex = xs.map(x => Math.exp(x - m));
  const sum = ex.reduce((s, v) => s + v, 0);
  return ex.map(e => e / sum);
}

function QKVDemo() {
  const [q, setQ] = useState(0);
  const query = VEC[q];
  const dk = query.length;
  const scores = VEC.map(k => dot(query, k) / Math.sqrt(dk)); // scaled dot product
  const weights = softmax(scores);
  const output = [0, 1, 2].map(d => weights.reduce((s, w, i) => s + w * VEC[i][d], 0));

  return (
    <div className="qkv-box">
      <div className="qkv-pick">
        <span>Query word:</span>
        {TOKENS.map((t, i) => (
          <button key={t} className={i === q ? 'on' : ''} onClick={() => setQ(i)}>{t}</button>
        ))}
      </div>

      <table className="qkv-table">
        <thead>
          <tr><th>vs. key</th><th>score = Q·K / √d</th><th>attention (softmax)</th></tr>
        </thead>
        <tbody>
          {TOKENS.map((t, i) => (
            <tr key={t} className={i === q ? 'self' : ''}>
              <td>{t}</td>
              <td>{f2(scores[i])}</td>
              <td>
                <span className="qkv-track"><span className="qkv-fill" style={{ width: `${weights[i] * 100}%` }} /></span>
                <span className="qkv-pct">{Math.round(weights[i] * 100)}%</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="qkv-out">
        <span className="qkv-out-label">New vector for &quot;{TOKENS[q]}&quot; (blend of all values):</span>
        <span className="qkv-out-vec">[{output.map(f2).join(', ')}]</span>
      </div>

      <p className="qkv-note">
        &quot;{TOKENS[q]}&quot; compares itself (its <strong>query</strong>) against every word&apos;s{' '}
        <strong>key</strong> with a dot product. Higher dot product → more aligned → more attention. After{' '}
        <strong>softmax</strong> turns the scores into percentages that sum to 100%, the output is the
        weighted blend of every word&apos;s <strong>value</strong>. Pick &quot;cat&quot; and notice it
        attends to &quot;mat&quot; too — their vectors point similar ways.
      </p>
      <style jsx>{`
        .qkv-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .qkv-pick { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-size: 14px; color: #334155; }
        .qkv-pick button { padding: 0.3rem 0.7rem; border: 1px solid #cbd5e1; border-radius: 7px; background: white; cursor: pointer; font-weight: 600; color: #334155; }
        .qkv-pick button.on { background: #7c3aed; border-color: #7c3aed; color: white; }
        .qkv-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .qkv-table th { text-align: left; color: #64748b; font-weight: 500; padding: 0.4rem 0.5rem; border-bottom: 1px solid #e2e8f0; }
        .qkv-table td { padding: 0.5rem; border-bottom: 1px solid #f1f5f9; color: #334155; font-variant-numeric: tabular-nums; }
        .qkv-table tr.self td { background: #faf5ff; }
        .qkv-track { display: inline-block; width: 90px; height: 8px; background: #eef2f7; border-radius: 4px; overflow: hidden; vertical-align: middle; margin-right: 0.5rem; }
        .qkv-fill { display: block; height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); }
        .qkv-pct { font-variant-numeric: tabular-nums; color: #64748b; }
        .qkv-out { margin-top: 1rem; padding: 0.7rem 0.9rem; background: white; border: 1px solid #e9d5ff; border-radius: 8px; display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
        .qkv-out-label { font-size: 13px; color: #64748b; }
        .qkv-out-vec { font-family: var(--font-mono), monospace; font-weight: 700; color: #5b21b6; }
        .qkv-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Let's Run Attention on Our Toy World">
        <p>
          Time to make good on the course promise: you&apos;re going to compute attention yourself and
          get the same numbers the machine gets. Our sentence is &quot;cat sat mat&quot; (our toy world
          is small, the grammar is loose), using the <strong>exact embeddings from step 5</strong>.
        </p>
        <p>
          One simplification to keep the arithmetic followable: we&apos;ll let each word&apos;s query,
          key, and value all equal its embedding, skipping the W<sub>Q</sub>, W<sub>K</sub>,{' '}
          W<sub>V</sub> multiplications. Real models do those multiplications first, but the attention
          mechanism itself — score, scale, softmax, blend — is computed identically. First, play with
          the live version:
        </p>
        <QKVDemo />
      </ExplanationBox>

      <WorkedExample title="Attention for 'cat', By Hand">
        <p>
          Let&apos;s reproduce the demo&apos;s numbers for query = <strong>cat</strong>, one step at a
          time. The vectors: cat = [1.0, 0.2, 0.1], sat = [0.3, 1.0, 0.4], mat = [0.9, 0.3, 0.2].
        </p>

        <CalcStep number={1}>
          <strong>Score against every key</strong> (dot products — two of these you already computed in
          step 5): cat·cat = 1.05, cat·sat = 0.54, cat·mat = 0.98
        </CalcStep>
        <CalcStep number={2}>
          <strong>Scale by √d:</strong> our vectors have d = 3 dimensions, √3 ≈ 1.732. Scores become
          1.05/1.732 ≈ 0.61, 0.54/1.732 ≈ 0.31, 0.98/1.732 ≈ 0.57
        </CalcStep>
        <CalcStep number={3}>
          <strong>Exponentiate each score</strong> (the softmax&apos;s first half): e^0.61 ≈ 1.83,
          e^0.31 ≈ 1.37, e^0.57 ≈ 1.76
        </CalcStep>
        <CalcStep number={4}>
          <strong>Divide each by the total</strong> (1.83 + 1.37 + 1.76 = 4.96): attention weights ≈{' '}
          <strong>0.37, 0.28, 0.36</strong> — they sum to 1 ✓
        </CalcStep>
        <CalcStep number={5}>
          <strong>Blend the values, dimension by dimension.</strong> First dimension:
          (0.37 × 1.0) + (0.28 × 0.3) + (0.36 × 0.9) ≈ 0.77
        </CalcStep>
        <CalcStep number={6}>
          Second: (0.37 × 0.2) + (0.28 × 1.0) + (0.36 × 0.3) ≈ 0.46.
          Third: (0.37 × 0.1) + (0.28 × 0.4) + (0.36 × 0.2) ≈ 0.22
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          New vector for cat: <strong>[0.77, 0.46, 0.22]</strong> — match it against the demo above with
          &quot;cat&quot; selected. It worked: cat kept most of itself (37%), pulled in a lot of mat
          (36%, because their vectors align), and took a smaller helping of sat (28%). The word&apos;s
          representation is no longer isolated — it&apos;s <em>contextual</em>, a mix of everything
          relevant around it. That&apos;s the bank/riverbank fix, in real numbers.
        </p>
      </WorkedExample>

      <ExplanationBox title="Softmax: The Sigmoid's Sibling">
        <p>
          Step 3 of that calculation deserves a closer look. <strong>Softmax</strong> turns any list of
          scores into clean percentages: exponentiate each one (using <strong>e</strong>, the same
          constant from the sigmoid), then divide by the total. The exponentiation makes everything
          positive and stretches gaps apart — bigger scores grab disproportionately more of the pie —
          and the division guarantees the results sum to exactly 1.
        </p>
        <p>
          In fact, softmax over two options <em>is</em> the sigmoid, just written differently. Same
          family, same smooth differentiability, which matters for the same reason as before: training
          needs to send gradients back through every one of these operations.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Divide by √d? You Already Know This Trick">
        <p>
          Remember the sigmoid&apos;s <strong>effective zone</strong> from the neural network course?
          When z drifted past ±4, the curve went flat, gradients died, and learning stopped — so we used
          normalization and Xavier initialization to keep z in range. The √d scaling is the{' '}
          <strong>same trick for softmax</strong>.
        </p>
        <p>
          A dot product adds up d terms, so with big vectors (d = 768, not 3) raw scores grow large —
          and a softmax fed large scores collapses: one weight goes to ~100%, the rest to ~0%, and the
          gradients through it vanish. Dividing by √d cancels that growth — the same √n logic from
          Xavier initialization — keeping scores in the range where softmax stays soft and trainable.
          Two courses, one principle: <strong>keep the numbers where the curve still has slope</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Real-World Wrinkle: No Peeking Ahead">
        <p>
          In our demo, every word attends to every word — including ones that come after it. GPT-style
          models add one restriction: a word may only attend to words <strong>at or before</strong> its
          own position. This is called <strong>causal masking</strong> (the scores for future positions
          are zeroed out before the softmax).
        </p>
        <p>
          Why? Because the model&apos;s job is to <em>predict the next word</em>. If &quot;sat&quot;
          could peek at &quot;mat&quot; during training, predicting &quot;mat&quot; would be cheating —
          the answer would be in the input. Masking keeps the game honest, which is exactly what makes
          the trained model able to generate text it&apos;s never seen.
        </p>
      </ExplanationBox>
    </div>
  );
}
