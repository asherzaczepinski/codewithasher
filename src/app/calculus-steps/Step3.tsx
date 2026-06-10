'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Problem With Curves">
        <p>
          Rise over run works perfectly for straight lines, but the error surface in machine
          learning is almost never a straight line — it&apos;s a <strong>curve</strong>. On a
          curve, the slope is different at every single point. A fixed &quot;rise over
          run&quot; between two distant points tells you the average slope, not the slope
          right where you are standing.
        </p>
        <p>
          To navigate a curved error surface, we need the <strong>instantaneous slope</strong>
          — the slope at one exact point. That is what the derivative gives us.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Limit Idea (Gently)">
        <p>
          Here&apos;s the key insight: pick your point and a second point nearby, separated
          by a tiny horizontal gap called <em>h</em>. Compute rise over run between them.
          Now imagine shrinking <em>h</em> — make the gap smaller and smaller. As <em>h</em>{' '}
          approaches zero the two points get closer and closer together, and the rise-over-run
          value homes in on a single number. That number is the derivative.
        </p>
        <p>
          We never actually set h&nbsp;=&nbsp;0 (that would create a division-by-zero), but
          we ask: <em>what value does the ratio approach?</em> This is what mathematicians
          call a <strong>limit</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="Definition of the Derivative">
        f&apos;(x) = lim(h→0) [ f(x + h) − f(x) ] / h
      </MathFormula>

      <ExplanationBox title="Derivative of x² Is 2x — Shown Intuitively">
        <p>
          Let <em>f(x)&nbsp;=&nbsp;x²</em>. This is a bowl-shaped parabola — exactly the
          shape of a simple error surface.
        </p>
        <p>
          Plug into the definition:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '8px 0' }}>
          [ (x+h)² − x² ] / h<br />
          = [ x² + 2xh + h² − x² ] / h<br />
          = [ 2xh + h² ] / h<br />
          = 2x + h
        </p>
        <p>
          As h shrinks to zero, the <em>h</em> term vanishes, leaving exactly <strong>2x</strong>.
          So the derivative of x² is 2x. At any point x on the bowl, the slope of the bowl is
          twice that x-value.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What the Derivative Tells You in ML">
        <p>
          If your error function is <em>E(w)&nbsp;=&nbsp;w²</em> (a perfect bowl), then{' '}
          <em>E&apos;(w)&nbsp;=&nbsp;2w</em>. At weight w&nbsp;=&nbsp;3, the slope is 6 —
          the error is climbing steeply as w increases. At w&nbsp;=&nbsp;0.5, the slope is 1
          — nearly flat, close to the bottom. At w&nbsp;=&nbsp;0, the slope is 0 — you are
          at the minimum.
        </p>
        <p>
          The derivative is the compass that tells the model: <em>here is how steep the hill
          is right now, and here is the direction it rises.</em> Step the opposite way to go
          downhill.
        </p>
      </ExplanationBox>

      <WorkedExample title="Evaluating the Derivative at a Point">
        <p>
          Our error bowl is <em>E(w)&nbsp;=&nbsp;w²</em>. The model is currently at
          w&nbsp;=&nbsp;3. What does the derivative tell us?
        </p>
        <CalcStep number={1}>Write the derivative formula: E&apos;(w) = 2w</CalcStep>
        <CalcStep number={2}>Substitute w = 3: E&apos;(3) = 2 × 3 = 6</CalcStep>
        <CalcStep number={3}>
          Interpretation: slope is +6, meaning error is rising steeply as w increases.
          To reduce error, we must decrease w (step in the negative direction).
        </CalcStep>
        <CalcStep number={4}>
          How far? A typical training step subtracts a fraction of the derivative.
          With learning rate 0.1: new w = 3 − 0.1 × 6 = 3 − 0.6 = 2.4
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          We moved from w&nbsp;=&nbsp;3 to w&nbsp;=&nbsp;2.4. Error dropped from 9 to
          5.76 — a real improvement, guided entirely by the derivative.
        </p>
      </WorkedExample>

    </div>
  );
}
