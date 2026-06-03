'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

// A self-contained illustration of one neuron with two real inputs (humidity,
// temperature) and a bias. The bias behaves like a weight whose input is permanently
// fixed at 1. Drag the blame and watch each correction = blame × (lever arm). The ONLY
// thing that differs between a weight and the bias is that lever arm: a weight's is its
// input, the bias's is always 1.
const HUMIDITY = 0.9;
const TEMPERATURE = 0.2;

const f2 = (x: number) => (x < 0 ? '−' : '') + Math.abs(x).toFixed(2).replace(/^0\./, '.');

function BiasVsWeight() {
  const [blame, setBlame] = useState(-0.3);

  const rows = [
    { label: 'Humidity weight', arm: HUMIDITY, kind: 'weight' as const, note: 'its input' },
    { label: 'Temperature weight', arm: TEMPERATURE, kind: 'weight' as const, note: 'its input' },
    { label: 'Bias', arm: 1, kind: 'bias' as const, note: 'fixed input' },
  ];

  return (
    <div className="bw-box">
      <div className="bw-control">
        <label htmlFor="blame">
          Neuron&apos;s blame: <strong>{f2(blame)}</strong>
        </label>
        <input
          id="blame"
          type="range"
          min={-1}
          max={1}
          step={0.05}
          value={blame}
          onChange={e => setBlame(parseFloat(e.target.value))}
        />
        <span className="bw-hint">
          Drag to change how wrong the neuron was. This one number is shared by everything
          attached to the neuron — every weight and the bias.
        </span>
      </div>

      <div className="bw-rows">
        {rows.map(r => {
          const correction = blame * r.arm;
          return (
            <div key={r.label} className={`bw-row ${r.kind}`}>
              <span className="bw-name">{r.label}</span>
              <span className="bw-calc">
                <span className="bw-blame">{f2(blame)}</span>
                <span className="bw-op">×</span>
                <span className="bw-arm">
                  {r.arm === 1 ? '1' : f2(r.arm)}
                  <small>{r.note}</small>
                </span>
                <span className="bw-op">=</span>
                <span className="bw-result">{f2(correction)}</span>
              </span>
            </div>
          );
        })}
      </div>

      <p className="bw-takeaway">
        Same blame, same direction — only the <strong>lever arm</strong> changes. The bias
        always multiplies by <strong>1</strong>, so it pockets the full blame. Each weight
        multiplies by its own input, so a stronger signal earns a bigger correction — and an
        input of zero earns none at all.
      </p>

      <style jsx>{`
        .bw-box {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }
        .bw-control {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .bw-control label {
          font-size: 15px;
          color: #333;
        }
        .bw-control label strong {
          color: #c2410c;
          font-variant-numeric: tabular-nums;
        }
        .bw-control input[type='range'] {
          width: 100%;
          accent-color: #ea580c;
        }
        .bw-hint {
          font-size: 12px;
          color: #94a3b8;
          font-style: italic;
        }
        .bw-rows {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .bw-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.7rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .bw-row.bias {
          border-color: #fdba74;
          background: #fff7ed;
        }
        .bw-name {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }
        .bw-row.bias .bw-name {
          color: #c2410c;
        }
        .bw-calc {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-variant-numeric: tabular-nums;
          font-size: 14px;
        }
        .bw-blame {
          color: #64748b;
        }
        .bw-op {
          color: #94a3b8;
        }
        .bw-arm {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.1;
          color: #334155;
          font-weight: 600;
        }
        .bw-arm small {
          font-size: 9px;
          font-weight: 400;
          color: #94a3b8;
        }
        .bw-result {
          min-width: 3.2rem;
          text-align: right;
          font-weight: 700;
          color: #c2410c;
        }
        .bw-takeaway {
          margin: 1.1rem 0 0;
          font-size: 14px;
          line-height: 1.6;
          color: #555;
        }
      `}</style>
    </div>
  );
}

// A real single-neuron training loop. Same neuron (humidity, temperature, bias), target
// "it rained" = 100%. Each step runs the actual update: param -= learning rate × (blame ×
// lever arm). The bias's lever arm is 1, so it takes the biggest step every time; the
// temperature weight's is 0.2, so it crawls. Nothing jumps to a target — it all creeps.
const SIM_INIT = { wh: -0.5, wt: 0.3, b: -1.0, step: 0 };

function TrainingSim() {
  const [lr, setLr] = useState(1.5);
  const [running, setRunning] = useState(false);
  const [st, setSt] = useState(SIM_INIT);

  const z = st.wh * HUMIDITY + st.wt * TEMPERATURE + st.b;
  const out = 1 / (1 + Math.exp(-z));
  const blame = (out - 1) * out * (1 - out); // negative while we under-predict
  const grad = { wh: blame * HUMIDITY, wt: blame * TEMPERATURE, b: blame * 1 };
  const converged = Math.abs(blame) < 0.0008;

  const stepOnce = useCallback(() => {
    setSt(prev => {
      const zz = prev.wh * HUMIDITY + prev.wt * TEMPERATURE + prev.b;
      const o = 1 / (1 + Math.exp(-zz));
      const bl = (o - 1) * o * (1 - o);
      return {
        wh: prev.wh - lr * bl * HUMIDITY,
        wt: prev.wt - lr * bl * TEMPERATURE,
        b: prev.b - lr * bl,
        step: prev.step + 1,
      };
    });
  }, [lr]);

  // keep the latest state reachable inside the interval without re-arming it each tick
  const stRef = useRef(st);
  useEffect(() => { stRef.current = st; }, [st]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const s = stRef.current;
      const zz = s.wh * HUMIDITY + s.wt * TEMPERATURE + s.b;
      const o = 1 / (1 + Math.exp(-zz));
      const bl = (o - 1) * o * (1 - o);
      if (Math.abs(bl) < 0.0008 || s.step >= 400) {
        setRunning(false); // stop from the timer callback, not synchronously in the effect
        return;
      }
      stepOnce();
    }, 110);
    return () => clearInterval(id);
  }, [running, stepOnce]);

  const rows = [
    { key: 'wh', label: 'Humidity weight', value: st.wh, delta: -lr * grad.wh, kind: 'weight' as const },
    { key: 'wt', label: 'Temperature weight', value: st.wt, delta: -lr * grad.wt, kind: 'weight' as const },
    { key: 'b', label: 'Bias', value: st.b, delta: -lr * grad.b, kind: 'bias' as const },
  ];

  const LO = -2, HI = 6;
  const pos = (v: number) => Math.max(0, Math.min(100, ((v - LO) / (HI - LO)) * 100));
  const pred = Math.round(out * 100);

  return (
    <div className="sim-box">
      <div className="sim-pred">
        <div className="sim-pred-head">
          <span>Prediction: <strong>{pred}%</strong></span>
          <span className="sim-target">target 100%</span>
        </div>
        <div className="sim-gauge">
          <div className="sim-gauge-fill" style={{ width: `${pred}%` }} />
          <div className="sim-gauge-target" />
        </div>
      </div>

      <div className="sim-rows">
        {rows.map(r => (
          <div key={r.key} className={`sim-row ${r.kind}`}>
            <div className="sim-row-head">
              <span className="sim-name">{r.label}</span>
              <span className="sim-value">{f2(r.value)}</span>
            </div>
            <div className="sim-track">
              <div className="sim-zero" style={{ left: `${pos(0)}%` }} />
              <div className="sim-dot" style={{ left: `${pos(r.value)}%` }} />
            </div>
            <div className="sim-delta">
              next step: {converged ? <em>settled</em> : <span>{r.delta >= 0 ? '↑ +' : '↓ −'}{f2(Math.abs(r.delta))}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="sim-controls">
        <button onClick={stepOnce} disabled={running || converged}>Step once</button>
        <button className="sim-run" onClick={() => setRunning(v => !v)} disabled={converged && !running}>
          {running ? 'Pause' : 'Run'}
        </button>
        <button onClick={() => { setRunning(false); setSt(SIM_INIT); }}>Reset</button>
        <span className="sim-step">step {st.step}</span>
      </div>

      <div className="sim-lr">
        <label htmlFor="lr">Learning rate: <strong>{lr.toFixed(1)}</strong></label>
        <input id="lr" type="range" min={0.2} max={8} step={0.1} value={lr}
          onChange={e => setLr(parseFloat(e.target.value))} />
      </div>

      <p className="sim-caption">
        {converged
          ? `Settled after ${st.step} steps — the prediction reached the target, the blame faded to nothing, and every correction shrank to zero. Notice the bias travelled farthest: its lever arm of 1 gave it the biggest nudge every single step, while the temperature weight (input 0.2) barely crawled.`
          : 'Each press is one training step. Watch all three creep — they never jump to a target value, they just take a small step downhill, and the steps shrink as the prediction nears 100%. The bias moves most (lever arm 1); the temperature weight least (input 0.2). Crank the learning rate up and the steps get bigger — too big and it overshoots instead of settling.'}
      </p>

      <style jsx>{`
        .sim-box {
          margin: 1.5rem 0;
          padding: 1.5rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }
        .sim-pred {
          margin-bottom: 1.25rem;
        }
        .sim-pred-head {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #334155;
          margin-bottom: 0.4rem;
        }
        .sim-pred-head strong {
          color: #c2410c;
          font-variant-numeric: tabular-nums;
        }
        .sim-target {
          color: #94a3b8;
          font-size: 12px;
        }
        .sim-gauge {
          position: relative;
          height: 12px;
          background: #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }
        .sim-gauge-fill {
          height: 100%;
          background: linear-gradient(90deg, #fb923c, #ea580c);
          border-radius: 6px;
          transition: width 0.1s linear;
        }
        .sim-gauge-target {
          position: absolute;
          top: -2px;
          right: 0;
          width: 2px;
          height: 16px;
          background: #16a34a;
        }
        .sim-rows {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
        .sim-row {
          padding: 0.7rem 0.9rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }
        .sim-row.bias {
          border-color: #fdba74;
          background: #fff7ed;
        }
        .sim-row-head {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
        }
        .sim-row.bias .sim-row-head {
          color: #c2410c;
        }
        .sim-value {
          font-variant-numeric: tabular-nums;
          color: #c2410c;
        }
        .sim-track {
          position: relative;
          height: 6px;
          background: #eef2f7;
          border-radius: 3px;
        }
        .sim-zero {
          position: absolute;
          top: -3px;
          width: 1px;
          height: 12px;
          background: #cbd5e1;
        }
        .sim-dot {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          margin-left: -6px;
          border-radius: 50%;
          background: #ea580c;
          transform: translateY(-50%);
          transition: left 0.1s linear;
        }
        .sim-row.weight .sim-dot {
          background: #2563eb;
        }
        .sim-delta {
          margin-top: 0.45rem;
          font-size: 11px;
          color: #64748b;
          font-variant-numeric: tabular-nums;
        }
        .sim-delta em {
          color: #16a34a;
          font-style: normal;
          font-weight: 600;
        }
        .sim-controls {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 1.25rem;
          flex-wrap: wrap;
        }
        .sim-controls button {
          padding: 0.45rem 0.9rem;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid #cbd5e1;
          border-radius: 7px;
          background: white;
          color: #334155;
          cursor: pointer;
        }
        .sim-controls button:hover:not(:disabled) {
          border-color: #94a3b8;
        }
        .sim-controls button:disabled {
          opacity: 0.45;
          cursor: default;
        }
        .sim-controls .sim-run {
          background: #ea580c;
          border-color: #ea580c;
          color: white;
        }
        .sim-step {
          margin-left: auto;
          font-size: 12px;
          color: #94a3b8;
          font-variant-numeric: tabular-nums;
        }
        .sim-lr {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-top: 1rem;
        }
        .sim-lr label {
          font-size: 13px;
          color: #334155;
        }
        .sim-lr label strong {
          color: #c2410c;
          font-variant-numeric: tabular-nums;
        }
        .sim-lr input[type='range'] {
          width: 100%;
          accent-color: #ea580c;
        }
        .sim-caption {
          margin: 1.1rem 0 0;
          font-size: 13px;
          line-height: 1.6;
          color: #555;
        }
      `}</style>
    </div>
  );
}

export default function Step16() {
  return (
    <div>
      <ExplanationBox title="Quick Recap: What Just Happened">
        <p>
          On the last step you didn&apos;t just watch the blame flow backward — you{' '}
          <strong>trained the network</strong>. Each time you pressed “Train one step,” three
          things happened in order, and then the whole thing repeated:
        </p>
        <ol style={{ margin: '0.5rem 0 0', paddingLeft: '1.2rem', fontSize: '14px', color: '#555', lineHeight: 1.7 }}>
          <li><strong>Forward:</strong> the inputs ran through the network and it made a guess.</li>
          <li><strong>Backward:</strong> the gap between the guess and the truth was pushed back through every neuron, giving each one its blame.</li>
          <li><strong>Update:</strong> every weight was nudged a tiny step in the direction that shrinks the loss.</li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          That&apos;s the whole loop. No single step fixed the answer — the prediction crept from{' '}
          ~70% toward 100% because you ran that loop over and over, each pass shaving a little more
          off the error. The dot sliding along each node&apos;s curve was the neuron&apos;s slope
          changing as its weights moved. <strong>This is what &quot;learning&quot; actually is:</strong>{' '}
          repeat forward → backward → nudge until the guesses stop being wrong.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          One loose end remains. Backprop handed a correction to every <em>weight</em> — but each
          neuron also has a <strong>bias</strong>. Does that get trained too, and if so, how? That&apos;s
          what this step settles.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Bias vs Weight: Two Knobs, One Rule">
        <p>
          Back in the bias step we promised that the network would learn each neuron&apos;s
          bias the same way it learns its weights — and that the &quot;how&quot; lived here, in
          training. Here it is. Backpropagation just handed every knob in the network a
          correction. The question now is: does the bias get adjusted by some special,
          separate procedure, or the same one the weights use?
        </p>
        <p>
          The answer is the same one — almost exactly. The trick is to notice that the bias is
          just <strong>one more term in the weighted sum</strong>: it behaves exactly like a
          weight whose input is permanently fixed at <strong>1</strong>. That single fact is
          what lets the network treat it identically to a weight, with one tiny twist.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Part That's Shared">
        <p>
          Every correction starts from the neuron&apos;s <strong>blame</strong> — how wrong it
          was, funneled back through its own sigmoid slope. That blame is the <em>same number</em>{' '}
          for everything attached to the neuron. So the <strong>direction</strong> of the move —
          push up or push down — is shared by the bias and all the neuron&apos;s weights. When the
          prediction is too low, every one of them is told to move the output up.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The One Difference: the Lever Arm">
        <p>
          A correction is the blame multiplied by a <strong>lever arm</strong> — how much that
          particular knob actually moved the weighted sum. For a real weight, the lever arm is
          its <strong>input</strong>: humidity&apos;s 0.9, temperature&apos;s 0.2. For the bias,
          the input is always <strong>1</strong>, so its lever arm is just 1.
        </p>
        <p>
          Drag the blame below. Notice the bias correction always equals the blame exactly,
          while the weight corrections get scaled down by their inputs.
        </p>
        <BiasVsWeight />
      </ExplanationBox>

      <ExplanationBox title="The Update Rule Is Identical">
        <p>
          When gradient descent (the next step) applies these corrections, it uses the very same
          rule for both — subtract the learning rate times the correction:
        </p>
        <MathFormula label="Weight update">
          weight ← weight − learning rate × (blame × input)
        </MathFormula>
        <MathFormula label="Bias update">
          bias ← bias − learning rate × (blame × 1)
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          Same equation, top and bottom. The only character that changes is the lever arm: a
          weight&apos;s input on top, a fixed 1 on the bottom. Because multiplying by 1 changes
          nothing, the bias collects the neuron&apos;s full, undiluted blame.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Watch It Creep, Not Jump">
        <p>
          The network never sets a weight or bias straight to some target value — it only nudges
          each one a small step every round. Run the real training loop below and watch all three
          knobs correct together, step by step, until the prediction reaches the target and the
          corrections fade to nothing.
        </p>
        <TrainingSim />
        <p style={{ marginTop: '0.75rem' }}>
          The bias starts at <strong>−1</strong> and climbs on its own — not in one leap, but as
          the running total of many tiny downhill steps. It travels farthest because its lever arm
          is 1; the temperature weight barely moves because its input is only 0.2. No knob is ever
          aimed at a number — they just keep stepping wherever the loss gets smaller, and coast to
          a stop once the blame runs out.
        </p>
      </ExplanationBox>

      <ExplanationBox title="So How Does the Network &quot;Tell Them Apart&quot;?">
        <p>
          It doesn&apos;t — and that&apos;s the elegant part. There is no <code>if bias … else
          weight …</code> branch anywhere. The bias is simply wired into the neuron as an extra
          connection whose input is permanently 1. When the backward pass does its &quot;multiply
          the blame by the input&quot; step, that step automatically produces{' '}
          <strong>blame × 1</strong> for the bias and <strong>blame × signal</strong> for every
          real weight. The distinction isn&apos;t a decision the network makes — it falls straight
          out of the arithmetic.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why the Difference Matters">
        <p>
          The two knobs do different jobs, and the lever arm is exactly why. <strong>Weights
          re-weigh the evidence</strong> — how much each input should count — so it makes sense
          that a weight&apos;s correction is tied to how strong its input was. A weight fed by a
          dead, zero-valued input had no say in the mistake this round, so it gets no nudge.
        </p>
        <p>
          The <strong>bias re-sets the starting line</strong> — how eager the neuron is to fire
          before any input arrives. It has no input to tie it to, so it always takes the
          neuron&apos;s full share of the blame: when predictions run low, the bias drifts up so
          the neuron fires more readily next time; when they run high, it drifts down. Weights and
          bias are tuned in the same pass, by the same rule, separated only by that fixed input
          of 1.
        </p>
      </ExplanationBox>
    </div>
  );
}
