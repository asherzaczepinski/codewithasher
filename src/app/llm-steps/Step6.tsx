'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

// Three tokens, each a tiny 3-dim vector. To keep arithmetic followable we let
// Query = Key = Value = the embedding itself (real models multiply by learned
// matrices first; the mechanism is identical).
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

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Query, Key, Value: Attention's Three Roles">
        <p>
          Attention sounds abstract until you see the machinery. Every token produces three vectors, each
          made by multiplying its embedding by a learned weight matrix:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Query (Q)</strong> — &quot;here&apos;s what I&apos;m looking for.&quot;</li>
          <li><strong>Key (K)</strong> — &quot;here&apos;s what I offer / what I&apos;m about.&quot;</li>
          <li><strong>Value (V)</strong> — &quot;here&apos;s the information I&apos;ll hand over if you attend to me.&quot;</li>
        </ul>
        <p>
          A handy analogy: it&apos;s like a search. Your <strong>query</strong> is what you type; each
          document&apos;s <strong>key</strong> is its title; the <strong>value</strong> is its actual
          contents. You match your query against every key, then pull back a blend of the values you matched best.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Recipe, Step by Step">
        <p>For one word attending over a sentence:</p>
        <ol style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Score</strong> the query against every key with a dot product — how aligned are they?</li>
          <li><strong>Scale</strong> by √(dimension) to keep the numbers from blowing up.</li>
          <li><strong>Softmax</strong> the scores into attention weights that sum to 1.</li>
          <li><strong>Blend</strong> the values using those weights — that&apos;s the output.</li>
        </ol>
        <MathFormula label="Scaled dot-product attention">
          Attention(Q, K, V) = softmax( (Q · Kᵀ) / √dₖ ) · V
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          That one line is the engine of every transformer. Let&apos;s run it on three real tokens — pick the
          query word and watch each step compute:
        </p>
        <QKVDemo />
      </ExplanationBox>

      <ExplanationBox title="Softmax: The Same Trick, Again">
        <p>
          That <strong>softmax</strong> step is the same exponential-with-<strong>e</strong> idea from the
          sigmoid: exponentiate each score so everything is positive, then divide by the total so the parts
          sum to 1. It turns raw alignment scores into clean percentages — a probability distribution over
          &quot;how much to attend to each word.&quot;
        </p>
        <p>
          One head of attention learns one kind of relationship (say, matching pronouns to nouns). Real
          models run many heads in parallel — <strong>multi-head attention</strong> — so different heads can
          track grammar, subject matching, topic, and more, all at once. Next we&apos;ll see how these heads
          stack into a full transformer block.
        </p>
      </ExplanationBox>
    </div>
  );
}
