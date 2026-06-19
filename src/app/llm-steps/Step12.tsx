'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// Raw scores (logits) the model produced for the next word after "My favorite food is".
const CANDIDATES = ['pizza', 'sushi', 'pasta', 'tacos', 'rocks', 'velocity'];
const LOGITS = [3.1, 2.6, 2.2, 1.8, -0.5, -1.2];

function softmaxT(logits: number[], temp: number): number[] {
  const t = Math.max(0.05, temp);
  const scaled = logits.map(l => l / t);
  const m = Math.max(...scaled);
  const ex = scaled.map(s => Math.exp(s - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map(e => e / sum);
}

function TemperatureDemo() {
  const [temp, setTemp] = useState(0.8);
  const probs = softmaxT(LOGITS, temp);
  const order = CANDIDATES.map((w, i) => ({ w, p: probs[i] })).sort((a, b) => b.p - a.p);
  return (
    <div className="tp-box">
      <div className="tp-prompt">My favorite food is <span className="tp-blank">____</span></div>
      <div className="tp-rows">
        {order.map(o => (
          <div key={o.w} className="tp-row">
            <span className="tp-word">{o.w}</span>
            <span className="tp-track"><span className="tp-fill" style={{ width: `${o.p * 100}%` }} /></span>
            <span className="tp-pct">{(o.p * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>
      <div className="tp-control">
        <label>Temperature: <strong>{temp.toFixed(2)}</strong></label>
        <input type="range" min={0.05} max={2} step={0.05} value={temp} onChange={e => setTemp(parseFloat(e.target.value))} />
        <div className="tp-ends"><span>0 = safe / repetitive</span><span>2 = wild / creative</span></div>
      </div>
      <p className="tp-note">
        {temp < 0.4
          ? 'Low temperature: the distribution sharpens onto the top word. The model almost always says "pizza" — safe but predictable.'
          : temp > 1.3
            ? 'High temperature: the distribution flattens. Unlikely words like "rocks" get a real shot — creative, but it can go off the rails.'
            : 'Medium temperature: a healthy balance — usually sensible, occasionally surprising.'}
      </p>
      <style jsx>{`
        .tp-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .tp-prompt { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 1rem; }
        .tp-blank { color: #7c3aed; border-bottom: 2px dashed #c4b5fd; padding: 0 0.3rem; }
        .tp-rows { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
        .tp-row { display: flex; align-items: center; gap: 0.7rem; font-size: 14px; }
        .tp-word { width: 72px; font-weight: 600; color: #334155; }
        .tp-track { flex: 1; height: 12px; background: #eef2f7; border-radius: 6px; overflow: hidden; }
        .tp-fill { display: block; height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); transition: width 0.15s; }
        .tp-pct { width: 48px; text-align: right; font-variant-numeric: tabular-nums; color: #64748b; }
        .tp-control label { font-size: 14px; color: #334155; }
        .tp-control label strong { color: #7c3aed; font-variant-numeric: tabular-nums; }
        .tp-control input { width: 100%; accent-color: #7c3aed; margin-top: 0.3rem; }
        .tp-ends { display: flex; justify-content: space-between; font-size: 11px; color: #94a3b8; }
        .tp-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step12() {
  return (
    <div>
      <ExplanationBox title="From the Top of the Stack Back to a Word">
        <p>
          After the final transformer block, each token has a rich vector that has soaked up the whole
          context. For the <em>last</em> position, the model takes that vector and runs it through one more
          linear layer to produce a <strong>logit</strong> — a raw score — for every token in the vocabulary.
          And that layer is nothing exotic: each vocabulary word&apos;s score is a{' '}
          <strong>dot product</strong> between the final vector and that word&apos;s output weights.
          50,000 words, 50,000 dot products. Step 5&apos;s little operation, one last time, at full scale.
        </p>
        <p>
          Then the familiar move: <strong>softmax</strong> turns those tens of thousands of scores into a
          probability distribution over the entire vocabulary. That distribution <em>is</em> the prediction
          we started the course with — &quot;how likely is each word to come next.&quot;
        </p>
        <MathFormula label="Next-token probabilities">
          probabilities = softmax( final_vector · W_vocab )
        </MathFormula>
      </ExplanationBox>

      <WorkedExample title="Logits → Probabilities, By Hand">
        <p>
          Suppose after &quot;My favorite food is&quot; the model&apos;s logits for six candidate words are:
          pizza 3.1, sushi 2.6, pasta 2.2, tacos 1.8, rocks −0.5, velocity −1.2. Softmax them, exactly like
          the attention step:
        </p>

        <CalcStep number={1}>
          <strong>Exponentiate:</strong> e³·¹ ≈ 22.20, e²·⁶ ≈ 13.46, e²·² ≈ 9.03, e¹·⁸ ≈ 6.05,
          e⁻⁰·⁵ ≈ 0.61, e⁻¹·² ≈ 0.30
        </CalcStep>
        <CalcStep number={2}>
          <strong>Sum:</strong> 22.20 + 13.46 + 9.03 + 6.05 + 0.61 + 0.30 = 51.65
        </CalcStep>
        <CalcStep number={3}>
          <strong>Divide each by the sum:</strong> pizza ≈ <strong>43%</strong>, sushi ≈ <strong>26%</strong>,
          pasta ≈ <strong>17%</strong>, tacos ≈ <strong>12%</strong>, rocks ≈ <strong>1.2%</strong>,
          velocity ≈ <strong>0.6%</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice what the exponential did: pizza&apos;s logit was only 0.5 above sushi&apos;s, but it gets
          nearly twice the probability. And &quot;rocks,&quot; with its negative logit, is squashed to
          almost nothing — but <em>not</em> exactly zero. Every word always keeps a sliver of probability.
          That sliver is about to matter.
        </p>
      </WorkedExample>

      <ExplanationBox title="Picking a Word: Temperature">
        <p>
          Now the model has to actually <em>choose</em>. Always taking the single highest-probability word
          (called <strong>greedy</strong> decoding) makes the text repetitive and robotic — every run of
          &quot;My favorite food is&quot; would say &quot;pizza,&quot; forever. Instead, models usually{' '}
          <strong>sample</strong> from the distribution — pizza wins 43% of the time, sushi 26% — and a
          knob called <strong>temperature</strong> controls how adventurous that sampling is. It divides
          the logits before the softmax: low temperature exaggerates the gaps (sharpening toward the
          favorite), high temperature shrinks them (flattening things out).
        </p>
        <TemperatureDemo />
        <p>
          This is the knob behind &quot;why does ChatGPT give a different answer every time?&quot; — and
          it&apos;s also one ingredient in why models sometimes say weird things. At any temperature above
          zero, the occasional &quot;rocks&quot; can come up. Real systems add guardrails like top-k or
          top-p sampling — cut the candidate list to the most plausible words first, <em>then</em> sample —
          to keep creativity without the nonsense.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Guess Down">
        <p>
          The model just produced one word. A chatbot answer needs hundreds. You already know the trick
          from step 2 — append the word, feed everything back, guess again. Next step, we actually run
          that loop on our toy world and watch a sentence build itself.
        </p>
      </ExplanationBox>
    </div>
  );
}
