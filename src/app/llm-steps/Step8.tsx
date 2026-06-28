'use client';

import type { CSSProperties } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// topic colours, matching the hand-by-hand demo on the previous step
const THEME: Record<string, string> = {
  the: '#94a3b8', is: '#94a3b8', a: '#94a3b8', in: '#94a3b8', are: '#94a3b8',
  sky: '#2563eb', sun: '#2563eb', cloud: '#2563eb', bright: '#2563eb', grey: '#2563eb',
  sea: '#0891b2', wave: '#0891b2', ocean: '#0891b2', deep: '#0891b2', fish: '#0891b2', water: '#0891b2',
  dog: '#d97706', cat: '#d97706', pet: '#d97706', pets: '#d97706', runs: '#d97706', barks: '#d97706', furry: '#d97706',
  blue: '#7c3aed',
};
const colorOf = (w: string) => THEME[w] || '#64748b';

// ─── Static schematic of the skip-gram network that produces the embeddings ──────
function SkipGramDiagram() {
  const inputs = [
    { w: 'the', on: false }, { w: 'sky', on: true }, { w: 'is', on: false }, { w: 'blue', on: false }, { w: 'dog', on: false },
  ];
  const outputs = [
    { w: 'blue', p: 0.31 }, { w: 'sun', p: 0.24 }, { w: 'cloud', p: 0.18 }, { w: 'is', p: 0.12 }, { w: 'dog', p: 0.03 },
  ];
  const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' };
  const arrow: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11, minWidth: 70, gap: 2 };
  return (
    <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
        {/* input one-hot */}
        <div style={col}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>input word</div>
          {inputs.map(n => (
            <div key={n.w} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 30, textAlign: 'right', fontSize: 11, fontWeight: 600, color: n.on ? '#5b21b6' : '#cbd5e1' }}>{n.w}</span>
              <span style={{ width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: n.on ? '#7c3aed' : '#eef2f7', color: n.on ? '#fff' : '#94a3b8' }}>{n.on ? 1 : 0}</span>
            </div>
          ))}
        </div>

        <div style={arrow}><span style={{ fontWeight: 700, color: '#7c3aed' }}>W</span><span>embedding</span><span>matrix</span><span style={{ fontSize: 16 }}>→</span></div>

        {/* hidden = sky's row */}
        <div style={col}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>sky&apos;s vector</div>
          {[1.0, 0.7, 0.0].map((v, i) => (
            <span key={i} style={{ width: 44, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'monospace', fontWeight: 700, background: '#ede9fe', color: '#4c1d95' }}>{v.toFixed(1)}</span>
          ))}
        </div>

        <div style={arrow}><span style={{ fontWeight: 700, color: '#0891b2' }}>W&prime;</span><span>context</span><span>matrix</span><span style={{ fontSize: 16 }}>→</span></div>

        {/* output softmax over context words */}
        <div style={col}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>P(nearby word)</div>
          {outputs.map(o => (
            <div key={o.w} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 32, textAlign: 'right', fontSize: 11, fontWeight: 600, color: colorOf(o.w) }}>{o.w}</span>
              <div style={{ width: 60, height: 12, background: '#eef2f7', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${o.p * 100 / 0.31}%`, background: colorOf(o.w) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ margin: '1rem 0 0', fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
        Feed in one word, ask the network to predict the words <em>around</em> it. The arrows are two grids
        of weights, <strong style={{ color: '#7c3aed' }}>W</strong> and <strong style={{ color: '#0891b2' }}>W&prime;</strong> —
        exactly the kind of weight matrices from the neural-network course. The clever part:{' '}
        <strong>row number 6766 of W <em>is</em> sky&apos;s embedding.</strong> Training the network to
        predict context automatically trains those rows into the vectors we use.
      </p>
    </div>
  );
}

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="The Actual Network Doing It">
        <p>
          On the last step we did it by hand — list a word&apos;s neighbours, compare, place it close or
          far. A real model reaches the <em>same</em> place automatically, with a small neural network — the
          one Word2Vec made famous — built from pieces you already know. Its job is our neighbour rule in
          disguise: <strong>given a word, predict the words likely to appear around it.</strong>
        </p>
        <SkipGramDiagram />
        <p>
          Trace it left to right. The input word is a <strong>one-hot</strong> column — all zeros except a
          single 1 marking which word it is. Multiplying that by the weight matrix{' '}
          <strong style={{ color: '#7c3aed' }}>W</strong> simply <em>selects one row</em> — and that row is
          the word&apos;s embedding. The second matrix{' '}
          <strong style={{ color: '#0891b2' }}>W&prime;</strong> turns that little vector into a score for
          every word in the vocabulary, and a <strong>softmax</strong> (the same one from the rain network)
          squashes the scores into probabilities of being a nearby word.
        </p>
      </ExplanationBox>
    </div>
  );
}
