'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

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

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="From the Top of the Stack Back to a Word">
        <p>
          After the final transformer block, each token has a rich vector that has soaked up the whole
          context. For the <em>last</em> position, the model takes that vector and runs it through one more
          linear layer to produce a <strong>logit</strong> — a raw score — for every token in the vocabulary.
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

      <ExplanationBox title="Picking a Word: Temperature">
        <p>
          Now the model has to actually <em>choose</em>. Always taking the single highest-probability word
          (called <strong>greedy</strong> decoding) makes the text repetitive and robotic. Instead, models
          usually <strong>sample</strong> from the distribution — and a knob called <strong>temperature</strong>{' '}
          controls how adventurous that sampling is. It divides the logits before the softmax: low temperature
          sharpens toward the favorite, high temperature flattens things out.
        </p>
        <TemperatureDemo />
      </ExplanationBox>

      <ExplanationBox title="The Loop That Writes Everything">
        <p>
          One word isn&apos;t an answer. So the model loops, exactly as we previewed in step 2:
        </p>
        <ol style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>Run the whole context through the transformer.</li>
          <li>Get next-token probabilities; sample one token.</li>
          <li>Append it to the context.</li>
          <li>Repeat — until a stop token or a length limit.</li>
        </ol>
        <p>
          Every word it writes becomes part of the input for the next word. That&apos;s why an LLM can stay on
          topic across a whole paragraph: each step sees everything generated so far.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You've Built the Whole Picture">
        <p>
          Put it together and the &quot;magic&quot; is gone — replaced by something you can actually trace:
        </p>
        <p style={{ padding: '0.7rem 0.9rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', fontSize: '14px', color: '#5b21b6', lineHeight: 1.7 }}>
          <strong>text → tokens → embeddings → (+positions) → a tall stack of attention + feed-forward blocks
          → logits → softmax → sample a token → repeat.</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Every piece is something concrete: dot products, softmax, weighted sums, and the same predict →
          measure → adjust training loop from the neural network course — just scaled up to read the internet
          and wired together with attention. That&apos;s a large language model. Nice work.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="llm.py"
        caption="Temperature sampling: turn the final logit vector into a probability distribution, then sample the next token."
        code={`import numpy as np

# ---------------------------------------------------------------------------
# STEP 5 — NEXT-TOKEN GENERATION
# After the last transformer block, the model has a rich vector for the
# final position.  Two more steps turn that into a new word:
#   1. Linear projection  -> one logit (raw score) per vocabulary token.
#   2. Temperature softmax -> sample from the resulting distribution.
# Then append the sampled token and loop.
# ---------------------------------------------------------------------------

def softmax_with_temperature(logits, temperature=1.0):
    # temperature > 1  flattens the distribution  -> more random / creative
    # temperature < 1  sharpens the distribution  -> more predictable / safe
    # temperature = 1  leaves the distribution unchanged
    t       = max(temperature, 1e-6)   # guard against division by zero
    scaled  = logits / t
    # Subtract the max for numerical stability (same trick as in attention).
    shifted = scaled - scaled.max()
    probs   = np.exp(shifted)
    probs   = probs / probs.sum()      # normalise so they sum to exactly 1
    return probs

def sample_token(probs):
    # numpy.random.choice picks an index according to the given probability
    # distribution.  Higher-probability tokens are chosen more often, but
    # every token keeps at least a small chance of being selected.
    vocab_size = len(probs)
    return np.random.choice(vocab_size, p=probs)

# --- simulated generation loop ---

# Pretend vocabulary (in a real LLM this has 50 000+ entries).
VOCAB = ["pizza", "sushi", "pasta", "tacos", "rocks", "velocity"]

# Logits produced by the final linear layer for the prompt
# "My favorite food is ___".
# Higher logit -> model thinks this token is more likely to come next.
raw_logits = np.array([3.1, 2.6, 2.2, 1.8, -0.5, -1.2])

np.random.seed(7)

for temperature in [0.2, 0.8, 1.5]:
    # Convert logits to a probability distribution at this temperature.
    probs = softmax_with_temperature(raw_logits, temperature)

    # Sample 5 completions so we can see the variance in outputs.
    samples = [VOCAB[sample_token(probs)] for _ in range(5)]

    print(f"temperature={temperature:.1f} | probs: {np.round(probs, 3)}")
    print(f"  5 samples: {samples}")
    print()

# temperature=0.2 -> almost always "pizza"  (sharp, greedy-like)
# temperature=0.8 -> usually "pizza"/"sushi", occasional surprises
# temperature=1.5 -> "rocks" and "velocity" start appearing — creative but risky`}
      />
    </div>
  );
}
