'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// Locked toy numbers. Weights from softmax; values = the raw embeddings.
const ROWS: { word: string; weight: number; vec: [number, number, number] }[] = [
  { word: 'The', weight: 0.15, vec: [0.1, 0.0, 0.9] },
  { word: 'sky', weight: 0.69, vec: [1.0, 0.7, 0.0] },
  { word: 'is',  weight: 0.16, vec: [0.1, 0.2, 0.8] },
];
const CONTEXT: [number, number, number] = [0.72, 0.52, 0.26];
const RAW_IS: [number, number, number] = [0.1, 0.2, 0.8];

function BlendViz() {
  const [dim, setDim] = useState(0);
  const contributions = ROWS.map(r => r.weight * r.vec[dim]);
  const total = CONTEXT[dim];
  const maxContrib = Math.max(...contributions, 0.001);

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {['dim 1', 'dim 2', 'dim 3'].map((label, i) => (
          <button
            key={label}
            onClick={() => setDim(i)}
            style={{
              padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer',
              border: '1px solid ' + (dim === i ? '#7c3aed' : '#e2e8f0'),
              background: dim === i ? '#7c3aed' : '#fff',
              color: dim === i ? '#fff' : '#64748b',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ROWS.map((r, i) => (
          <div key={r.word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 90, fontSize: 12.5, fontFamily: 'monospace', color: '#334155' }}>
              {r.weight.toFixed(2)} × {r.vec[dim].toFixed(1)}
            </span>
            <div style={{ flex: 1, height: 18, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(contributions[i] / maxContrib) * 100}%`, transition: 'width 0.3s ease', background: 'linear-gradient(90deg,#c4b5fd,#7c3aed)' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#1e293b', width: 56, textAlign: 'right' }}>
              {contributions[i].toFixed(3)}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '1rem', paddingTop: '0.9rem', borderTop: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 90, fontSize: 12.5, fontWeight: 700, color: '#5b21b6' }}>sum →</span>
        <div style={{ flex: 1, height: 22, background: '#ede9fe', borderRadius: 5, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(total / maxContrib) * 100}%`, transition: 'width 0.3s ease', background: 'linear-gradient(90deg,#7c3aed,#5b21b6)' }} />
        </div>
        <span style={{ fontSize: 15, fontWeight: 800, fontFamily: 'monospace', color: '#5b21b6', width: 56, textAlign: 'right' }}>
          {total.toFixed(2)}
        </span>
      </div>
      <p style={{ margin: '1rem 0 0', fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
        Because sky carries 69% of the weight, its number dominates the blend in every dimension. The
        result is the new value for <strong>dim {dim + 1}</strong> of the context vector.
      </p>
    </div>
  );
}

export default function Step17() {
  return (
    <div>
      <ExplanationBox title="The Weights Were Only Half the Job">
        <p>
          Two steps of work gave us a set of attention weights for the query{' '}
          <strong>&ldquo;is&rdquo;</strong>: <strong>sky 69%, is 16%, The 15%</strong>. But weights by
          themselves are just instructions. They say <em>how much</em> to look at each word — they are not
          the answer. Now we cash them in.
        </p>
        <p>
          Each word offers a <strong>value</strong> — the actual content attention carries away. (For our
          toy, a word&apos;s value is just its embedding; real models pass it through a learned{' '}
          <code>W<sub>V</sub></code> matrix first, but the mechanism is identical.) We take a{' '}
          <strong>weighted blend</strong> of those values, using the attention weights as the mix. The
          result is the <strong>context vector</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Blend Formula">
        <p>
          A weighted blend is exactly what it sounds like: multiply each value by its weight, then add
          everything up. For &ldquo;is&rdquo;:
        </p>
        <MathFormula label="context vector for &ldquo;is&rdquo;">
          context = 0.15·The + 0.69·sky + 0.16·is
        </MathFormula>
        <p>
          That is three vectors being mixed in proportions 15% / 69% / 16%. We do it one dimension at a
          time — coordinate 1 with coordinate 1, and so on — because vectors add component by component.
        </p>
      </ExplanationBox>

      <WorkedExample title="Blending the Values, Dimension by Dimension">
        <p>
          Values: <strong>The</strong> [0.1, 0.0, 0.9], <strong>sky</strong> [1.0, 0.7, 0.0],{' '}
          <strong>is</strong> [0.1, 0.2, 0.8]. Weights: 0.15, 0.69, 0.16.
        </p>
        <CalcStep number={1}>
          <strong>dim 1</strong>: (0.15 × 0.1) + (0.69 × 1.0) + (0.16 × 0.1) = 0.015 + 0.69 + 0.016 = <strong>0.72</strong>
        </CalcStep>
        <CalcStep number={2}>
          <strong>dim 2</strong>: (0.15 × 0.0) + (0.69 × 0.7) + (0.16 × 0.2) = 0 + 0.483 + 0.032 ≈ <strong>0.52</strong>
        </CalcStep>
        <CalcStep number={3}>
          <strong>dim 3</strong>: (0.15 × 0.9) + (0.69 × 0.0) + (0.16 × 0.8) = 0.135 + 0 + 0.128 ≈ <strong>0.26</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Stack the three results: <strong>context(&ldquo;is&rdquo;) = [0.72, 0.52, 0.26]</strong>. In
          every dimension, sky&apos;s contribution (the middle term) does most of the work, because it
          holds 69% of the weight.
        </p>
      </WorkedExample>

      <ExplanationBox title="See Each Dimension Get Blended">
        <p>Switch between dimensions to watch the three weighted contributions add up to the new value:</p>
        <BlendViz />
      </ExplanationBox>

      <ExplanationBox title="What Just Happened to &ldquo;is&rdquo;">
        <p>
          Compare the before and after. The raw embedding of &ldquo;is&rdquo; was{' '}
          <code>[{RAW_IS.join(', ')}]</code> — a near-pure grammar word, heavy in the last (GRAMMAR)
          slot and almost empty in the TOPIC and BRIGHT slots. Its new context vector is{' '}
          <code>[{CONTEXT.join(', ')}]</code> — strong TOPIC (0.72), real BRIGHT content (0.52), and the
          grammar slot pulled down to 0.26.
        </p>
        <p>
          In plain terms: <strong>&ldquo;is&rdquo; is no longer an isolated, generic word.</strong> By
          spending most of its attention on &ldquo;sky,&rdquo; it has become <em>sky-flavored</em>. The
          vector sitting at the &ldquo;is&rdquo; position now <em>knows the sentence is about the sky</em>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="This Is the Bank / Riverbank Fix, in Real Numbers">
        <p>
          Way back in Part 3 we raised the problem: a fixed embedding cannot tell a <em>river bank</em>{' '}
          from a <em>money bank</em>, because the word is identical in isolation. Attention is the cure,
          and you just executed it on actual numbers. The vector at a position is no longer frozen — it{' '}
          <strong>absorbs the words around it</strong>. Here, &ldquo;is&rdquo; absorbed &ldquo;sky.&rdquo;
        </p>
        <p>
          This context vector — <code>[0.72, 0.52, 0.26]</code> — is the payload attention produces. It is
          what gets handed up through the rest of the network, and eventually it is what the prediction
          machinery reads to guess the next word. We are not there yet: there are more layers to pass
          through first. But hold onto this vector — it comes back at the climax.
        </p>
      </ExplanationBox>
    </div>
  );
}
