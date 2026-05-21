'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import TangentExplorer from '@/components/TangentExplorer';
import GradientDescentDemo from '@/components/GradientDescentDemo';
import LossSurface3D from '@/components/LossSurface3D';

export default function Step16() {
  return (
    <div>

      <ExplanationBox title="The derivative is just the slope at a point">
        <p>
          Last step we said a <strong>derivative</strong> tells us how the loss changes when we
          nudge a weight. Here&apos;s the picture behind that: the derivative is the{' '}
          <strong>slope of the curve at a single point</strong> — the steepness of the line that
          just touches the curve there (its <em>tangent</em>).
        </p>
        <p>
          You can&apos;t measure the slope of a curve the way you measure the slope of a straight
          line, because it keeps bending. So we zoom in on one point until the tiny piece looks
          straight, and measure <em>that</em>. That&apos;s the &quot;estimated slope at any point.&quot;
        </p>
      </ExplanationBox>

      <MathFormula label="Our example curve and its derivative">
        y = x²    →    slope = 2x
      </MathFormula>

      <p style={{ marginTop: '1rem' }}>
        <strong>Try it:</strong> drag the point along <code>y = x²</code>. The orange line is the
        tangent — the slope right at that spot. Watch the readout: the slope always equals{' '}
        <strong>2x</strong>. That formula <em>is</em> the derivative of x².
      </p>

      <TangentExplorer />

      <ExplanationBox title="So what? It tells us which way is downhill">
        <p>
          Remember the loss is just a number telling us how wrong the network is, and we want it as
          small as possible. If we plot loss against one weight, we get a bowl-shaped curve — and the
          lowest point is the weight we want.
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Positive slope</strong> → loss goes up if we increase the weight → so we should <em>decrease</em> it.</li>
          <li><strong>Negative slope</strong> → loss goes down if we increase the weight → so we should <em>increase</em> it.</li>
          <li><strong>Slope near zero</strong> → we&apos;re at the bottom → stop, this weight is good.</li>
        </ul>
        <p style={{ marginTop: '0.6rem' }}>
          In every case we step in the <strong>opposite direction of the slope</strong>. The size of
          the slope even tells us how big a step to take — far from the bottom the slope is steep
          (big correction), near the bottom it&apos;s shallow (small correction). Closer is better, and
          the derivative quietly measures how close we are.
        </p>
      </ExplanationBox>

      <MathFormula label="The update rule (gradient descent)">
        weight ← weight − learning_rate × slope
      </MathFormula>

      <p style={{ marginTop: '1rem' }}>
        <strong>Watch one weight learn:</strong> press <em>Take one step</em> (or <em>Auto-run</em>)
        and watch the weight roll downhill. Each step reads the slope at the current point and
        nudges the weight against it. The dots trace the path it takes to the bottom.
      </p>

      <GradientDescentDemo />

      <ExplanationBox title="Why the learning rate matters">
        <p>
          The <strong>learning rate</strong> scales how far we move each step. Too small and training
          crawls; too big and the steps overshoot the bottom and bounce back and forth (try sliding it
          near the top). Picking a good learning rate is one of the most important knobs in training.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The whole network at once: the loss landscape">
        <p>
          A single neuron has many weights, and the full network has thousands. Each weight is its own
          dimension, so the real loss landscape is impossible to draw. But the idea is identical: every
          weight has a slope (its derivative), and we step each one downhill at the same time.
        </p>
        <p>
          Below is a taste with <strong>two</strong> of the rain network&apos;s weights. The surface
          height is the loss; the red ball uses the slope in both directions to roll to the lowest
          point — the weights that predict rain best. Hit <em>Roll downhill</em> and spin it around.
        </p>
      </ExplanationBox>

      <LossSurface3D />

      <ExplanationBox title="What we just saw">
        <ul style={{ marginTop: '0.25rem', lineHeight: '1.8' }}>
          <li>The derivative = the slope of the curve at a point (tangent line).</li>
          <li>For <code>y = x²</code> that slope is <code>2x</code> — exactly what the explorer shows.</li>
          <li>The slope tells the network <strong>which way</strong> to change a weight and <strong>how much</strong>.</li>
          <li>Stepping every weight downhill, over and over, is <strong>gradient descent</strong> — how the network actually learns.</li>
        </ul>
        <p style={{ marginTop: '0.6rem' }}>
          One question remains: in a multi-layer network, how do we get the slope for a weight buried
          deep inside? That&apos;s the <strong>chain rule</strong> — next.
        </p>
      </ExplanationBox>

    </div>
  );
}
