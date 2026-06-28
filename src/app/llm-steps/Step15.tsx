'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

const softmax = (xs: number[]) => {
  const exps = xs.map(x => Math.exp(x));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
};

const WORDS = ['The', 'sky', 'is'];
const RAW = [8, 2, 3];

function CollapseDemo() {
  const [scaled, setScaled] = useState(false);
  const d = 64;
  const scores = scaled ? RAW.map(x => x / Math.sqrt(d)) : RAW;
  const weights = softmax(scores);
  const max = Math.max(...weights);

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setScaled(s => !s)}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            border: '1px solid #7c3aed', background: scaled ? '#7c3aed' : '#fff', color: scaled ? '#fff' : '#7c3aed',
          }}
        >
          {scaled ? 'Scaling ON  (÷ √64 = ÷8)' : 'Scaling OFF  (raw scores)'}
        </button>
        <span style={{ fontSize: 12.5, color: '#64748b' }}>
          {scaled ? 'Healthy spread — every word still gets a say.' : 'Collapsed — one word eats almost everything.'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {WORDS.map((w, i) => {
          const isTop = weights[i] === max;
          return (
            <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 34, fontWeight: 700, fontSize: 14, color: '#334155' }}>{w}</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 56 }}>
                {scores[i].toFixed(scaled ? 3 : 0)}
              </span>
              <div style={{ flex: 1, height: 20, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${weights[i] * 100}%`, transition: 'width 0.4s ease', background: isTop ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)' }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: '#1e293b', width: 48, textAlign: 'right' }}>
                {Math.round(weights[i] * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Step14() {
  return (
    <div>
      <ExplanationBox title="A Problem We Got to Skip — Until Now">
        <p>
          In the last few steps our scores stayed small (0.16, 1.67, 0.18) because our toy uses only{' '}
          <strong>3 dimensions</strong>. Softmax handled them beautifully. But a real model uses vectors
          with hundreds of dimensions — GPT-style models often use <strong>64</strong> per attention head,
          and many more across the whole layer. That changes the arithmetic in a way that quietly breaks
          things.
        </p>
        <p>
          Here is the issue. A dot product is a <em>sum of products</em>, one term per dimension. With 3
          dimensions you add up 3 terms. With 64 dimensions you add up 64. More terms means a bigger
          total — dot products grow roughly with the dimension. The scores feeding softmax get{' '}
          <strong>large</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Large Scores Break Softmax">
        <p>
          Remember softmax exponentiates. <code>e<sup>x</sup></code> grows explosively: the gap between{' '}
          <code>e<sup>8</sup></code> and <code>e<sup>2</sup></code> is enormous. So when scores are large
          and spread out, softmax does not gently prefer the winner — it <strong>collapses</strong>,
          handing one word ~100% and the rest ~0%.
        </p>
        <p>
          That is a disaster for two reasons. First, attention becomes all-or-nothing: the model can only
          look at a single word instead of blending several. Second — and this is the same lesson from the
          neural-network course — when a weight pins to 0% or 100%, the curve there is{' '}
          <strong>flat</strong>, so the gradient is nearly zero and <strong>learning stalls</strong>. The
          model can no longer tell which direction to nudge.
        </p>
      </ExplanationBox>

      <WorkedExample title="The Collapse, in Numbers">
        <p>
          Suppose at large <code>d</code> the raw scores come out as <strong>[8, 2, 3]</strong>.
          Exponentiate:
        </p>
        <CalcStep number={1}>
          e<sup>8</sup> ≈ 2981, &nbsp; e<sup>2</sup> ≈ 7.4, &nbsp; e<sup>3</sup> ≈ 20.1
        </CalcStep>
        <CalcStep number={2}>
          sum ≈ 2981 + 7.4 + 20.1 ≈ 3009
        </CalcStep>
        <CalcStep number={3}>
          weights ≈ 2981/3009, 7.4/3009, 20.1/3009 ≈ <strong>99% / 0% / 1%</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Collapsed. The first word swallows the entire budget; the other two are effectively invisible,
          and the gradients there are dead.
        </p>
      </WorkedExample>

      <ExplanationBox title="The Fix: Divide by √d">
        <p>
          The cure is one division. Before softmax, divide every score by the{' '}
          <strong>square root of the dimension</strong>, <code>√d</code>. If the dot products grow with{' '}
          <code>d</code>, dividing by <code>√d</code> keeps their typical size roughly constant no matter
          how big the model gets. This is the complete, real attention-scoring formula:
        </p>
        <MathFormula label="scaled attention scores">
          scores = (Q · K) / √d
        </MathFormula>
        <p>
          For <code>d = 64</code>, <code>√d = 8</code>. Take the same raw scores and divide each by 8:
        </p>
      </ExplanationBox>

      <WorkedExample title="Same Scores, Now Scaled">
        <CalcStep number={1}>
          8 / 8 = <strong>1.0</strong>
        </CalcStep>
        <CalcStep number={2}>
          2 / 8 = <strong>0.25</strong>
        </CalcStep>
        <CalcStep number={3}>
          3 / 8 = <strong>0.375</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>Now run softmax on [1.0, 0.25, 0.375]:</p>
        <CalcStep number={4}>
          e<sup>1.0</sup> ≈ 2.72, &nbsp; e<sup>0.25</sup> ≈ 1.28, &nbsp; e<sup>0.375</sup> ≈ 1.45
        </CalcStep>
        <CalcStep number={5}>
          sum ≈ 2.72 + 1.28 + 1.45 ≈ 5.45
        </CalcStep>
        <CalcStep number={6}>
          weights ≈ <strong>50% / 24% / 27%</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Healthy. The winner still leads, but the others keep a real voice — and the curve is no longer
          flat, so gradients flow and the model can keep learning.
        </p>
      </WorkedExample>

      <ExplanationBox title="Flip the Switch">
        <p>Toggle scaling on and off and watch the same three scores either collapse or stay healthy:</p>
        <CollapseDemo />
      </ExplanationBox>

      <ExplanationBox title="The Same Principle, Yet Again">
        <p>
          You have now seen this idea three times. In the neural-network course,{' '}
          <strong>Xavier initialization</strong> set starting weights so signals neither exploded nor
          vanished, and <strong>normalization</strong> kept activations in the responsive middle of the
          curve. Scaling by <code>√d</code> is the exact same instinct, applied to attention:{' '}
          <strong>keep the numbers in the slope zone</strong> where the function still reacts to change.
          Keep that phrase — it is most of what makes deep networks trainable.
        </p>
        <p>
          One bookkeeping note: we did <em>not</em> scale our 3-dimensional toy in the previous steps,
          and that was fine — at <code>d = 3</code> the scores were already small. Scaling is a fix for
          large models; our hand-math weights stay <strong>sky 69%, The 15%, is 16%</strong>. Next we
          finally <em>use</em> those weights.
        </p>
      </ExplanationBox>
    </div>
  );
}
