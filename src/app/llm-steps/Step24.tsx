'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

const WORDS = ['blue', 'clear', 'grey', 'falling', 'pizza'];
const LOGITS = [2.51, 1.24, 0.44, 0.44, -0.05];

function softmax(xs: number[], T = 1): number[] {
  const z = xs.map(x => x / T);
  const m = Math.max(...z);
  const e = z.map(x => Math.exp(x - m));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map(x => x / s);
}

function TemperatureDemo() {
  const [T, setT] = useState(1);
  const probs = softmax(LOGITS, T);
  const label = T < 0.7 ? 'colder → sharper, more confident' : T > 1.4 ? 'hotter → flatter, more random' : 'neutral';
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <label style={{ fontSize: 13, color: '#334155', display: 'block', marginBottom: 4 }}>
        Temperature: <strong style={{ color: '#7c3aed' }}>{T.toFixed(2)}</strong> <span style={{ color: '#94a3b8' }}>({label})</span>
      </label>
      <input type="range" min={0.3} max={2} step={0.05} value={T} onChange={e => setT(+e.target.value)} style={{ width: '100%', accentColor: '#7c3aed', marginBottom: '1rem' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {WORDS.map((w, i) => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 60, fontWeight: 600, fontSize: 13, color: '#334155' }}>{w}</span>
            <div style={{ flex: 1, height: 18, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${probs[i] * 100}%`, background: i === 0 ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)', transition: 'width .15s' }} />
            </div>
            <span style={{ width: 44, textAlign: 'right', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: '#1e293b' }}>{Math.round(probs[i] * 100)}%</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '1rem 0 0', fontSize: 12, color: '#64748b' }}>
        Slide to <strong>0.30</strong> and blue swallows almost everything (greedy, repetitive). Slide to{' '}
        <strong>2.0</strong> and the field flattens (wilder, more surprising). At <strong>1.0</strong> you
        get the model&apos;s honest distribution.
      </p>
    </div>
  );
}

export default function Step23() {
  return (
    <div>
      <ExplanationBox title="Softmax, One Last Time">
        <p>
          We ended last step with five raw logits: <code>blue 2.51, clear 1.24, grey 0.44, falling 0.44,
          pizza −0.05</code>. Softmax turns any list of scores into a probability distribution with the
          exact recipe you used inside attention: <strong>exponentiate each score, then divide by the
          total</strong>. Exponentiating makes everything positive and stretches the leader&apos;s
          advantage; dividing forces the results to sum to 100%.
        </p>
      </ExplanationBox>

      <WorkedExample title="From Logits to Probabilities">
        <CalcStep number={1}>
          Exponentiate each logit: e<sup>2.51</sup> ≈ 12.30, e<sup>1.24</sup> ≈ 3.46, e<sup>0.44</sup> ≈ 1.55, e<sup>0.44</sup> ≈ 1.55, e<sup>−0.05</sup> ≈ 0.95
        </CalcStep>
        <CalcStep number={2}>
          Add them up: 12.30 + 3.46 + 1.55 + 1.55 + 0.95 = <strong>19.81</strong>
        </CalcStep>
        <CalcStep number={3}>
          Divide each by the total: 12.30 / 19.81 ≈ <strong>0.62</strong>, 3.46 / 19.81 ≈ 0.17, 1.55 / 19.81 ≈ 0.08, 1.55 / 19.81 ≈ 0.08, 0.95 / 19.81 ≈ 0.05
        </CalcStep>
        <CalcStep number={4}>
          Check: 0.62 + 0.17 + 0.08 + 0.08 + 0.05 = <strong>1.00</strong> ✓
        </CalcStep>
      </WorkedExample>

      <ExplanationBox title="The Reveal">
        <div style={{ margin: '1.25rem 0', padding: '1.75rem', background: 'linear-gradient(135deg,#faf5ff,#eff6ff)', border: '1px solid #ddd6fe', borderRadius: 14, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#1e293b', marginBottom: 14 }}>
            The sky is <span style={{ color: '#7c3aed', borderBottom: '3px solid #c4b5fd', padding: '0 6px' }}>blue</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxWidth: 420, margin: '0 auto' }}>
            {WORDS.map((w, i) => {
              const p = [62, 17, 8, 8, 5][i];
              return (
                <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 56, textAlign: 'right', fontSize: 13, fontWeight: 600, color: '#334155' }}>{w}</span>
                  <div style={{ flex: 1, height: 20, background: '#fff', borderRadius: 5, overflow: 'hidden', border: '1px solid #ede9fe' }}>
                    <div style={{ height: '100%', width: `${p}%`, background: i === 0 ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : '#c4b5fd' }} />
                  </div>
                  <span style={{ width: 40, textAlign: 'right', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: '#5b21b6' }}>{p}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <p>
          There it is. <strong>62% for &ldquo;blue.&rdquo;</strong> Not pulled from a lookup table, not
          hand-typed — it fell out of a chain you computed yourself: tokenize &ldquo;The sky is,&rdquo;
          embed each token into a vector, let attention pull &ldquo;is&rdquo; toward &ldquo;sky,&rdquo;
          refine in the block, score against the vocabulary, and softmax the logits. Every multiply and
          sum was real. <em>That</em> is a language model predicting the next word.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Temperature: A Dial on the Confidence">
        <p>
          The 62% is the model&apos;s honest opinion, but at generation time we get one extra knob:{' '}
          <strong>temperature</strong>. Before softmax, divide every logit by a number{' '}
          <em>T</em>. <em>T</em> below 1 spreads the logits apart (sharper, more deterministic); above 1
          squishes them together (flatter, more random). It is the difference between a model that always
          says the safest word and one that takes creative risks.
        </p>
        <TemperatureDemo />
        <p>
          Hold onto that 62%. In two steps, when we train the model, this exact number becomes the thing
          the training loop rewards or punishes — and you will watch it climb.
        </p>
      </ExplanationBox>
    </div>
  );
}
