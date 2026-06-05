'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="A Function Is a Machine">
        <p>
          A <strong>function</strong> is a rule that takes an input and produces exactly one
          output. Write it as <em>f(x)</em> — read &quot;f of x.&quot; You feed in x, the
          machine does something to it, and out comes a number.
        </p>
        <p>
          In our running ML example, the function is the error: you feed in the model&apos;s
          weight <em>w</em>, and out comes a number measuring how wrong the model is. We want
          to find the <em>w</em> that makes that output as small as possible.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Slope of a Straight Line">
        <p>
          The simplest function is a straight line: <em>f(x) = mx + b</em>. Here <em>m</em> is
          the <strong>slope</strong> and <em>b</em> is the y-intercept (where the line crosses
          zero).
        </p>
        <p>
          Slope answers the question: <em>for every one unit I move to the right, how many
          units do I move up or down?</em> The formula is rise over run — the vertical change
          divided by the horizontal change between any two points on the line.
        </p>
      </ExplanationBox>

      <MathFormula label="Slope (rise over run)">
        slope = (y₂ − y₁) / (x₂ − x₁)
      </MathFormula>

      <ExplanationBox title="What Slope Tells You">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Positive slope</strong> — the function goes up as x increases. Moving right on the error curve means error is growing, so you should move left.</li>
          <li><strong>Negative slope</strong> — the function goes down as x increases. Moving right reduces error, so keep going right.</li>
          <li><strong>Zero slope</strong> — the function is flat at that point. You&apos;re at a peak, a valley, or a plateau. If it&apos;s a valley, you&apos;ve found the minimum — exactly what training is hunting for.</li>
        </ul>
        <p>
          This intuition carries directly into the world of curved functions and derivatives.
          The slope at a point on any curve tells you which direction error is increasing — and
          you simply step the opposite way.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Slope: Two Points on the Error Curve">
        <p>
          Suppose our error function is a straight line passing through the points
          (w&nbsp;=&nbsp;1, error&nbsp;=&nbsp;4) and (w&nbsp;=&nbsp;3, error&nbsp;=&nbsp;2).
          Let&apos;s find the slope.
        </p>
        <CalcStep number={1}>Label the points: (x₁, y₁) = (1, 4) and (x₂, y₂) = (3, 2)</CalcStep>
        <CalcStep number={2}>Rise = y₂ − y₁ = 2 − 4 = −2</CalcStep>
        <CalcStep number={3}>Run = x₂ − x₁ = 3 − 1 = 2</CalcStep>
        <CalcStep number={4}>Slope = rise / run = −2 / 2 = −1</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The slope is <strong>−1</strong>. That means as we increase the weight by 1, the
          error decreases by 1. So we should increase <em>w</em> to reduce error. The negative
          slope is the signal pointing us in the right direction.
        </p>
      </WorkedExample>
    </div>
  );
}
