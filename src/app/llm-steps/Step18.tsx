'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// ─── The tiniest GPT: a bigram model over a 3-word candidate vocabulary ─────────
// Everything below is the REAL algorithm — softmax, cross-entropy, the p−y error
// signal, the chain rule into the embedding row, and plain gradient descent.
const CANDS = ['blue', 'grey', 'pizza'] as const;
const U: Record<string, [number, number, number]> = {
  blue:  [0.5, -0.6, 0.3],
  grey:  [0.4, 0.7, -0.2],
  pizza: [-0.3, 0.8, 0.5],
};
const E0: [number, number, number] = [0.32, 0.91, 0.15]; // "sky", freshly random
const LR = 0.5;
const TARGET = 'blue';

const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);

function forward(e: number[]) {
  const logits = CANDS.map(w => dot(e, U[w]));
  const exps = logits.map(x => Math.exp(x));
  const sum = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map(x => x / sum);
  const loss = -Math.log(probs[CANDS.indexOf(TARGET)]);
  return { logits, probs, loss };
}

function gradStep(e: number[]) {
  const { probs } = forward(e);
  const err = CANDS.map((w, i) => probs[i] - (w === TARGET ? 1 : 0));
  const grad = [0, 1, 2].map(d => CANDS.reduce((s, w, i) => s + err[i] * U[w][d], 0));
  const next = e.map((v, d) => v - LR * grad[d]);
  return { err, grad, next };
}

function GradientTrainer() {
  const [e, setE] = useState<number[]>(E0);
  const [steps, setSteps] = useState(0);
  const [lastGrad, setLastGrad] = useState<number[] | null>(null);
  const { probs, loss } = forward(e);

  const run = (n: number) => {
    let cur = e, g: number[] | null = null;
    for (let k = 0; k < n; k++) {
      const r = gradStep(cur);
      cur = r.next; g = r.grad;
    }
    setE(cur); setLastGrad(g); setSteps(steps + n);
  };
  const reset = () => { setE(E0); setSteps(0); setLastGrad(null); };

  const btn = (primary: boolean): React.CSSProperties => ({
    padding: '7px 14px', fontSize: 12.5, fontWeight: 700, borderRadius: 8, cursor: 'pointer',
    border: '1px solid ' + (primary ? '#7c3aed' : '#cbd5e1'),
    background: primary ? '#7c3aed' : '#fff', color: primary ? '#fff' : '#334155',
  });

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: '#1e293b' }}>
          sky = [{e.map(v => v.toFixed(2)).join(', ')}]
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>gradient steps: {steps}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CANDS.map((w, i) => (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 44, fontSize: 13, fontWeight: 600, color: w === TARGET ? '#5b21b6' : '#64748b' }}>{w}</span>
            <div style={{ flex: 1, height: 18, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${probs[i] * 100}%`, transition: 'width .2s', background: w === TARGET ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : '#cbd5e1' }} />
            </div>
            <span style={{ width: 42, textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{Math.round(probs[i] * 100)}%</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, margin: '12px 0 0', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ padding: '6px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}>
          loss = −ln(p<sub>blue</sub>) = <strong style={{ fontFamily: 'monospace' }}>{loss.toFixed(3)}</strong>
        </span>
        {lastGrad && (
          <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>
            last gradient = [{lastGrad.map(v => v.toFixed(2)).join(', ')}]
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button style={btn(true)} onClick={() => run(1)}>1 gradient step</button>
        <button style={btn(false)} onClick={() => run(5)}>5 steps</button>
        <button style={btn(false)} onClick={reset}>Reset to random</button>
      </div>
      <p style={{ margin: '10px 0 0', fontSize: 12, color: '#94a3b8' }}>
        Every click runs the full chain — forward pass, softmax, cross-entropy, p−truth, chain rule,
        update — with no shortcuts. (We hold the three output vectors fixed so the motion is easy to
        follow; real training nudges them too, by the exact same rule.)
      </p>
    </div>
  );
}

export default function Step18() {
  return (
    <div>
      <ExplanationBox title="The Embedding Table, For Real">
        <p>
          The generation loop ended on the one question left standing: the weights were frozen the whole
          time — so <em>where did all those numbers come from?</em> Back in Step 3, when the embedding
          table first appeared, we promised you would run its training yourself rather than take
          &ldquo;the numbers are learned&rdquo; on faith. Every piece that promise was waiting on is now
          built. Time to pay it: <strong>every algorithm</strong> a real GPT uses to learn its vectors —
          by hand, with nothing skipped.
        </p>
        <p>
          First, what the thing actually is. The model stores one giant grid of numbers called the{' '}
          <strong>embedding matrix</strong>: one row per token, one column per feature slot. GPT-2:{' '}
          <strong>50,257 rows × 768 columns ≈ 38.6 million numbers</strong>, every one of them a learnable
          weight. &ldquo;Embedding a token&rdquo; is nothing fancier than <strong>fetching row #6766</strong>{' '}
          when token 6766 comes in. (In matrix language: multiply a one-hot vector by the table — which
          just selects the row.)
        </p>
        <p>
          At birth, every entry is drawn from a bell curve centered on zero with spread{' '}
          <strong>0.02</strong> — that is GPT-2&apos;s literal initialization. Row 6766 (&ldquo;sky&rdquo;)
          starts as static like <code>[0.32, 0.91, 0.15]</code> (using our 3 slots; a real row has 768).
          Meaningless. Now we make it mean something.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Tiniest GPT That Can Learn">
        <p>
          You have now built the full pipeline — embedding, attention, blocks, logits, softmax. Run
          training on all of it at once, though, and the table&apos;s own learning drowns in everything
          else moving too. So to watch the <em>table</em> learn, strip the machine to the smallest version
          that still learns: predict the next token{' '}
          <strong>directly from the current token&apos;s embedding</strong> — no attention, no blocks,
          just lookup and score. (This is a real model — researchers call it a bigram model. A GPT is this
          exact loop with the smarter middle you already know.)
        </p>
        <p>
          The training data: one real snippet, <em>&ldquo;the sky is <strong>blue</strong>&rdquo;</em>. The
          model reads &ldquo;sky&rdquo;&apos;s row and must score every candidate for the next word. To
          keep the napkin small our vocabulary is three candidates — <strong>blue</strong>,{' '}
          <strong>grey</strong>, <strong>pizza</strong> — each with its own <em>output vector</em> (these
          are weights too; we give them small toy values and freeze them so we can watch one row move):
        </p>
        <MathFormula label="the output vectors (frozen for this demo)">
          u<sub>blue</sub> = [0.5, −0.6, 0.3]&nbsp;&nbsp;&nbsp;u<sub>grey</sub> = [0.4, 0.7, −0.2]&nbsp;&nbsp;&nbsp;u<sub>pizza</sub> = [−0.3, 0.8, 0.5]
        </MathFormula>
      </ExplanationBox>

      <WorkedExample title="Algorithm 1 — The Forward Pass: Score Every Candidate">
        <p>
          Each candidate&apos;s raw score is the <strong>dot product</strong> — the same workhorse as
          always — of sky&apos;s current row with that candidate&apos;s output vector, exactly like the
          logits step:
        </p>
        <CalcStep number={1}>
          blue: [0.32, 0.91, 0.15] &middot; [0.5, −0.6, 0.3] = 0.16 − 0.546 + 0.045 = <strong>−0.34</strong>
        </CalcStep>
        <CalcStep number={2}>
          grey: [0.32, 0.91, 0.15] &middot; [0.4, 0.7, −0.2] = 0.128 + 0.637 − 0.03 = <strong>0.74</strong>
        </CalcStep>
        <CalcStep number={3}>
          pizza: [0.32, 0.91, 0.15] &middot; [−0.3, 0.8, 0.5] = −0.096 + 0.728 + 0.075 = <strong>0.71</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The random row points <em>away</em> from blue and toward grey and pizza. Of course it does — it
          is noise. The scores are called <strong>logits</strong>, and they are not probabilities yet.
        </p>
      </WorkedExample>

      <WorkedExample title="Algorithm 2 — Scores → Probabilities">
        <p>
          To compare a guess against reality we need percentages — and you already own the tool:{' '}
          <strong>softmax</strong>, third appearance. It ran inside attention, it ran at the reveal, and it
          runs here: exponentiate every score, divide each by the total.
        </p>
        <CalcStep number={1}>
          e<sup>−0.34</sup> ≈ 0.71,&nbsp;&nbsp;e<sup>0.74</sup> ≈ 2.09,&nbsp;&nbsp;e<sup>0.71</sup> ≈ 2.03&nbsp;&nbsp;→&nbsp;&nbsp;total ≈ 4.83
        </CalcStep>
        <CalcStep number={2}>
          p(blue) = 0.71 / 4.83 ≈ <strong>15%</strong>&nbsp;&nbsp;&nbsp;p(grey) ≈ <strong>43%</strong>&nbsp;&nbsp;&nbsp;p(pizza) ≈ <strong>42%</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The untrained model believes &ldquo;the sky is pizza&rdquo; is nearly as likely as
          &ldquo;the sky is grey.&rdquo; Perfect — now we can punish it precisely.
        </p>
      </WorkedExample>

      <WorkedExample title="Algorithm 3 — The Loss: Measure the Surprise">
        <p>
          Training needs one number that says <em>how wrong</em>. The rule used by every GPT is{' '}
          <strong>cross-entropy</strong>: look up the probability the model gave the <em>true</em> next
          word, and take the negative natural log.
        </p>
        <MathFormula label="cross-entropy loss">
          loss = −ln( p(correct next token) )
        </MathFormula>
        <CalcStep number={1}>perfect confidence: −ln(1.00) = <strong>0</strong> — no surprise, no loss</CalcStep>
        <CalcStep number={2}>coin flip: −ln(0.50) ≈ <strong>0.69</strong></CalcStep>
        <CalcStep number={3}>our model: −ln(0.147) ≈ <strong>1.92</strong></CalcStep>
        <CalcStep number={4}>near-certain miss: −ln(0.001) ≈ <strong>6.9</strong> — surprise explodes</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Why the log? It makes confident wrongness catastrophically expensive: sliding from 0.01 to 0.001
          costs as much as sliding from 1.0 to 0.1. The model is billed for <em>surprise</em>, not just
          error — same spirit as the squared-error loss from the rain network, tuned for probabilities.
        </p>
      </WorkedExample>

      <ExplanationBox title="Algorithm 4 — Blame the Scores: probability − truth">
        <p>
          Now the move that makes all of deep learning tick. To shrink the loss we must know, for every
          number in the machine, <em>which direction to nudge it</em>. That is backpropagation — the same
          blame-tracing you did in the neural-network course — and for softmax + cross-entropy the blame
          on each logit collapses to something almost embarrassingly clean:
        </p>
        <MathFormula label="error signal on each candidate's score">
          error(word) = p(word) − truth(word)&nbsp;&nbsp;&nbsp;(truth = 1 for the real next word, else 0)
        </MathFormula>
        <p>
          Prediction minus reality. That&apos;s it. For us: blue <strong>0.15 − 1 = −0.85</strong>, grey{' '}
          <strong>0.43 − 0 = +0.43</strong>, pizza <strong>0.42 − 0 = +0.42</strong>. Negative error means
          &ldquo;your score was too low — push it up&rdquo;; positive means &ldquo;too high — push it
          down.&rdquo; (Check: the three errors sum to zero. They always do.)
        </p>
      </ExplanationBox>

      <WorkedExample title="Algorithm 5 — Blame the Embedding: the Chain Rule">
        <p>
          Each logit was <code>sky&apos;s row · that word&apos;s output vector</code> — so if a logit must
          move, the blame flows through that dot product back into sky&apos;s row. The chain rule turns
          out to be one line: <strong>the gradient on the embedding is each output vector, weighted by its
          word&apos;s error, summed.</strong>
        </p>
        <MathFormula label="gradient on sky's row">
          g = (−0.85)·u<sub>blue</sub> + (0.43)·u<sub>grey</sub> + (0.42)·u<sub>pizza</sub>
        </MathFormula>
        <CalcStep number={1}>
          blue&apos;s pull: −0.85 × [0.5, −0.6, 0.3] = [−0.43, +0.51, −0.26]
        </CalcStep>
        <CalcStep number={2}>
          grey&apos;s push: 0.43 × [0.4, 0.7, −0.2] = [+0.17, +0.30, −0.09]
        </CalcStep>
        <CalcStep number={3}>
          pizza&apos;s push: 0.42 × [−0.3, 0.8, 0.5] = [−0.13, +0.34, +0.21]
        </CalcStep>
        <CalcStep number={4}>
          add them: g = [−0.38, +1.15, −0.13]
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Read the meaning off the signs: the update will drag sky&apos;s row <strong>toward blue&apos;s
          output vector</strong> (its error was negative) and <strong>away from grey&apos;s and
          pizza&apos;s</strong>, each in proportion to how over-confident the model was about them. Pull
          toward the right answer, push off the wrong ones — not as a metaphor, as arithmetic.
        </p>
      </WorkedExample>

      <WorkedExample title="Algorithm 6 — The Nudge: Gradient Descent">
        <p>
          Last algorithm. Move every number a small step <em>against</em> its gradient — downhill on the
          loss. The step size is the <strong>learning rate</strong>; we&apos;ll use a chunky 0.5 so you can
          see the motion (real GPTs use ~0.0001, a trillion times over).
        </p>
        <MathFormula label="the update rule">
          row ← row − learning_rate × g
        </MathFormula>
        <CalcStep number={1}>
          sky = [0.32, 0.91, 0.15] − 0.5 × [−0.38, 1.15, −0.13] = <strong>[0.51, 0.33, 0.22]</strong>
        </CalcStep>
        <CalcStep number={2}>
          re-run the forward pass with the new row: p(blue) = <strong>29%</strong> (was 15%), loss = <strong>1.23</strong> (was 1.92)
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          One snippet, one nudge — and the probability of the truth nearly doubled. The row is no longer
          noise: it has begun to <em>mean</em> &ldquo;a thing that is blue.&rdquo;
        </p>
      </WorkedExample>

      <ExplanationBox title="Now Train It Yourself">
        <p>
          Here is that whole chain — forward pass, softmax, loss, p−truth, chain rule, nudge — wired to a
          button. Watch the row move and blue&apos;s bar climb:
        </p>
        <GradientTrainer />
      </ExplanationBox>

      <ExplanationBox title="From This Napkin to an Actual GPT">
        <p>
          Everything above is the real thing. What changes at scale is bookkeeping, not ideas:
        </p>
        <ul style={{ margin: '0.4rem 0 0.8rem', paddingLeft: '1.2rem', fontSize: 14.5, color: '#475569', lineHeight: 1.75 }}>
          <li>
            <strong>Only the rows that showed up get nudged.</strong> A training batch touches the rows of
            its own tokens; the other ~50,000 rows sit still that step. Common words get millions of
            nudges; rare words get few — which is partly why models handle rare words worse.
          </li>
          <li>
            <strong>Batches, not single snippets.</strong> Real training averages the gradient over
            hundreds of thousands of tokens at once, then takes one step. Trillions of tokens total.
          </li>
          <li>
            <strong>A smarter nudger.</strong> GPTs use <strong>Adam</strong>, a variant of gradient
            descent that keeps a running memory of past gradients and gives every single weight its own
            adaptive step size. Same downhill idea, better pacing.
          </li>
          <li>
            <strong>The blame chain is longer.</strong> In a full GPT the error doesn&apos;t hop straight
            from the logits to the embedding — it flows backward through the unembedding, the blocks, and
            attention, and <em>every token in the context window</em> gets its row nudged, not just the
            last word. Longer chain; identical rule at every link.
          </li>
          <li>
            <strong>Two jobs, one table.</strong> GPT-2 ties the output vectors to the embedding rows —
            they are literally the same matrix — so each row gets sculpted from both directions at once.
          </li>
        </ul>
        <p>
          And now the payoff you can finally justify: <strong>why do similar words end up with similar
          vectors?</strong> Because &ldquo;sky&rdquo; and &ldquo;ocean&rdquo; keep appearing before the
          same next words — blue, clear, deep, vast. Every &ldquo;…is blue&rdquo; snippet drags whichever
          row produced it toward the same output vectors. Two words that share contexts get hit by the
          same pulls, thousands of times, and drift together. Nobody declared a TOPIC axis — the geometry
          is just the fossil record of millions of identical nudges.
        </p>
        <p>
          So the table is learned, honestly and completely — and notice this also closes the loop on the
          fixed-vector problem from way back in Step 4: training sculpts each token <em>one</em> great
          all-purpose row, and attention (which you built) does the per-sentence reshaping from there.
        </p>
        <p>
          You just trained one row against three candidates. Next step: this exact loop unleashed on{' '}
          <strong>every weight in the machine at once</strong> — the attention matrices, the FFNs, all
          hundreds of billions of them — on trillions of tokens.
        </p>
      </ExplanationBox>
    </div>
  );
}
