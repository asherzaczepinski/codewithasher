'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// Loss = −ln(p): how "surprised" the model was by the correct word.
function SurpriseDemo() {
  const [p, setP] = useState(0.62);
  const loss = -Math.log(p);
  const W = 480, H = 240, PADL = 46, PADR = 16, PADT = 18, PADB = 34;
  const LOSS_MAX = 5;
  const toX = (pv: number) => PADL + pv * (W - PADL - PADR);
  const toY = (l: number) => PADT + (Math.min(l, LOSS_MAX) / LOSS_MAX) * (H - PADT - PADB);
  const pts: string[] = [];
  for (let i = 1; i <= 100; i++) {
    const pv = i / 100;
    pts.push(`${toX(pv).toFixed(1)},${toY(-Math.log(pv)).toFixed(1)}`);
  }
  const verdict = p > 0.8 ? 'Barely surprised — tiny loss, tiny correction.'
    : p > 0.4 ? 'Mildly surprised — a moderate nudge to the weights.'
    : p > 0.1 ? 'Quite surprised — a strong correction.'
    : 'Shocked — the gradient hits like a hammer.';
  return (
    <div className="sp-box">
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block', margin: '0 auto', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <line x1={PADL} y1={H - PADB} x2={W - PADR} y2={H - PADB} stroke="#94a3b8" strokeWidth={1} />
        <line x1={PADL} y1={PADT} x2={PADL} y2={H - PADB} stroke="#94a3b8" strokeWidth={1} />
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <text key={t} x={toX(t)} y={H - PADB + 16} textAnchor="middle" fontSize={10} fill="#94a3b8">{Math.round(t * 100)}%</text>
        ))}
        {[0, 1, 2, 3, 4, 5].map(l => (
          <text key={l} x={PADL - 8} y={toY(l) + 3} textAnchor="end" fontSize={10} fill="#94a3b8">{l}</text>
        ))}
        <text x={(PADL + W - PADR) / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">probability the model gave the correct word</text>
        <text x={12} y={(PADT + H - PADB) / 2} textAnchor="middle" fontSize={10} fill="#64748b" transform={`rotate(-90 12 ${(PADT + H - PADB) / 2})`}>loss (surprise)</text>
        <polyline points={pts.join(' ')} fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={toX(p)} y1={H - PADB} x2={toX(p)} y2={toY(loss)} stroke="#c4b5fd" strokeWidth={1.5} strokeDasharray="4,4" />
        <circle cx={toX(p)} cy={toY(loss)} r={6} fill="#7c3aed" stroke="white" strokeWidth={2} />
      </svg>
      <div className="sp-controls">
        <label>
          Probability given to the correct word: <strong>{Math.round(p * 100)}%</strong>
          <input type="range" min={0.01} max={0.99} step={0.01} value={p} onChange={e => setP(parseFloat(e.target.value))} />
        </label>
        <div className="sp-read">
          loss = −ln({p.toFixed(2)}) = <strong>{loss.toFixed(2)}</strong>
          <span className="sp-verdict">{verdict}</span>
        </div>
        <div className="sp-marks">
          <button onClick={() => setP(0.62)}>blue, today (62%)</button>
          <button onClick={() => setP(0.08)}>falling (8%)</button>
          <button onClick={() => setP(0.67)}>blue, after one nudge (67%)</button>
        </div>
      </div>
      <style jsx>{`
        .sp-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .sp-controls { margin-top: 1rem; }
        .sp-controls label { display: block; font-size: 14px; color: #334155; }
        .sp-controls label strong { color: #7c3aed; font-variant-numeric: tabular-nums; }
        .sp-controls input { width: 100%; accent-color: #7c3aed; margin-top: 0.3rem; }
        .sp-read { margin-top: 0.6rem; font-size: 14px; color: #334155; font-variant-numeric: tabular-nums; }
        .sp-read strong { color: #1e293b; font-size: 16px; }
        .sp-verdict { display: block; font-size: 12.5px; color: #64748b; margin-top: 2px; }
        .sp-marks { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 0.8rem; }
        .sp-marks button { padding: 0.35rem 0.7rem; background: #fff; border: 1px solid #cbd5e1; border-radius: 999px; font-size: 12px; color: #475569; cursor: pointer; }
        .sp-marks button:hover { border-color: #a78bfa; color: #5b21b6; }
      `}</style>
    </div>
  );
}

export default function Step26() {
  return (
    <div>
      <ExplanationBox title="The Data Labels Itself">
        <p>
          We have spent the whole course assuming the model already knew the right numbers — that
          &ldquo;sky&rdquo; embeds to <code>[1.0, 0.7, 0.0]</code>, that &ldquo;blue&rdquo; scores
          highest. Where did those numbers come from? <strong>Training.</strong> And the genius of how
          LLMs train is hiding in plain sight.
        </p>
        <p>
          Training a network normally needs <em>labeled</em> data — someone has to mark the correct
          answer for every example, which is slow and expensive. Here is the insight that makes LLMs
          possible: for next-word prediction, <strong>text is its own answer key</strong>.
        </p>
        <p>
          Take any sentence from anywhere — say <strong>&ldquo;The sky is blue&rdquo;</strong> — and it
          instantly becomes training examples. Given &ldquo;The,&rdquo; the answer is &ldquo;sky.&rdquo;
          Given &ldquo;The sky,&rdquo; the answer is &ldquo;is.&rdquo; Given &ldquo;The sky is,&rdquo;
          the answer is &ldquo;blue.&rdquo; The label is always just the next word, sitting right there
          in the text. Four words, three free exercises, zero human labeling. Now apply that to a
          trillion words scraped from books, websites, and code, and you have more training examples
          than any hand-labeled dataset in history. (This is what <strong>self-supervised
          learning</strong> means — and it is why the causal mask mattered: every position in every
          sentence is simultaneously a quiz question, as long as it cannot peek at the answer ahead of
          itself.)
        </p>
      </ExplanationBox>

      <ExplanationBox title="Measuring the Error: Loss as Surprise">
        <p>
          In the neural-network course the rain network used squared error — prediction minus target,
          squared. For next-word prediction, the standard loss (called <strong>cross-entropy</strong>)
          is even more intuitive. After the softmax, the model has handed some probability to the word
          that <em>actually</em> came next. The loss simply measures{' '}
          <strong>how surprised the model was</strong>:
        </p>
        <MathFormula label="Cross-entropy loss (for one prediction)">
          loss = −ln( probability the model gave the correct next word )
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          Why <code>−ln</code>? The natural log of a probability is always negative (probabilities are
          below 1), so the minus sign flips it positive. And it has exactly the shape we want: give the
          right word 99% and the loss is nearly 0 — barely surprised, barely any correction. Give it 1%
          and the loss explodes — and the weight updates are correspondingly violent. Drag the slider,
          or jump to our actual numbers:
        </p>
        <SurpriseDemo />
      </ExplanationBox>

      <WorkedExample title="Scoring Our Prediction">
        <p>
          Back to the climax: context <strong>&ldquo;The sky is,&rdquo;</strong> and the model gave{' '}
          <strong>62%</strong> to &ldquo;blue.&rdquo; Suppose the real training sentence continued with
          &ldquo;blue.&rdquo; Let us score the model:
        </p>
        <CalcStep number={1}>The correct next word was &ldquo;blue.&rdquo; The model gave it p = 0.62</CalcStep>
        <CalcStep number={2}>loss = −ln(0.62) ≈ <strong>0.48</strong> — decent, but room to improve</CalcStep>
        <CalcStep number={3}>
          Contrast: if the sentence had been &ldquo;The sky is falling&rdquo; instead, the correct
          word would be &ldquo;falling,&rdquo; to which the model gave only p = 0.08:
          loss = −ln(0.08) ≈ <strong>2.53</strong> — five times the surprise, five times the correction
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The loss is the signal that drives the exact machinery from the last course:{' '}
          <strong>backpropagation</strong> traces blame backward — through the softmax, the logits, all
          the blocks of attention and feed-forward layers, down into the embeddings themselves — and
          every single weight gets nudged a tiny step in the direction that would have made the model a
          little less surprised. This is why everything had to be smooth and differentiable: sigmoid,
          softmax, the √d scaling that keeps gradients alive. The whole architecture is shaped by the
          need for blame to flow backward through it.
        </p>
      </WorkedExample>

      <WorkedExample title="One Nudge, in Numbers">
        <p>
          Here is &ldquo;rewarding and punishing the numbers&rdquo; made concrete. The loss says
          &ldquo;blue should have been more likely.&rdquo; The simplest way to raise blue&apos;s
          probability is to raise its logit — the raw score we computed back in the logits step. So
          backprop pushes it up a hair:
        </p>
        <CalcStep number={1}>
          Before: blue&apos;s logit was <strong>2.51</strong>, which softmax turned into p = 62%, loss = 0.48.
        </CalcStep>
        <CalcStep number={2}>
          The gradient nudges blue&apos;s logit up by about 0.20, to <strong>2.71</strong> (and gently
          pushes the wrong words&apos; logits down).
        </CalcStep>
        <CalcStep number={3}>
          Re-run softmax with the new logits: p_blue rises from 62% to about{' '}
          <strong>67%</strong>, and the loss drops from 0.48 to about <strong>0.41</strong>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          That is the entire training step, and it is the identical loop from the neural-network
          course: <strong>predict → measure the error → adjust the weights to shrink it</strong>. One
          example moved blue from 62% to 67%. Do that across trillions of next-word guesses and the
          weights settle into values where plausible words are consistently likely. Nudge by nudge,
          the model becomes good at the only game it plays.
        </p>
      </WorkedExample>

      <ExplanationBox title="Now Multiply by a Trillion">
        <p>
          That is one nudge for one prediction. Training a frontier LLM is that nudge repeated at a
          scale that is genuinely hard to picture:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Hundreds of billions of weights</strong> being adjusted (GPT-2 had 1.5 billion; GPT-3, 175 billion).</li>
          <li><strong>Trillions of tokens</strong> of training text — a meaningful fraction of all the text humanity has ever digitized.</li>
          <li><strong>Months of continuous training</strong> on thousands of GPUs running in parallel, at a cost in the tens or hundreds of millions of dollars.</li>
        </ul>
        <p>
          And here is the part worth sitting with: <strong>nothing else is going on</strong>. No
          grammar rules are programmed in, no facts database is loaded. Grammar, facts, reasoning
          patterns, the ability to write code — all of it condenses out of one objective, <em>be less
          surprised by the next word</em>, applied to enough text. The same way the rain
          network&apos;s neurons invented &ldquo;muggy conditions&rdquo; without being told to, the LLM
          invents everything it knows because knowing things turns out to be the best way to win the
          guessing game.
        </p>
        <p>
          Training happens once (it is the expensive part). After that the weights are{' '}
          <strong>frozen</strong> — when you chat with a model, nothing is learning; you are running
          the forward pass of a finished network, exactly the generation loop from the last step. But a
          freshly trained model is <em>not</em> yet a helpful assistant — it is something stranger.
          One step to go.
        </p>
      </ExplanationBox>
    </div>
  );
}
