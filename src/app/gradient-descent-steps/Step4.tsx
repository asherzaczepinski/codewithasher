'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Update Rule">
        <p>
          We know the slope tells us which way is uphill. We want to go downhill. So we
          subtract the slope from our current position. But we don&apos;t want to take a
          giant leap — we want a controlled small step. That&apos;s what the{' '}
          <strong>learning rate α</strong> (alpha) controls: how large each step is.
        </p>
        <p>
          The result is the <strong>gradient descent update rule</strong> — the single
          equation that drives all of machine learning:
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient Descent Update Rule">
        x_new = x_old − α × f&apos;(x_old)
      </MathFormula>

      <ExplanationBox title="Breaking It Down">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>x_old</strong> — where we are right now on the cost landscape.</li>
          <li>
            <strong>f&apos;(x_old)</strong> — the slope (derivative) at that position.
            Positive slope means we&apos;re on the right side of the bowl; negative means
            the left side.
          </li>
          <li>
            <strong>α (alpha)</strong> — the learning rate. A small positive number, often
            something like 0.1 or 0.01, that controls the step size. We&apos;ll study its
            effect in depth in the next module.
          </li>
          <li>
            <strong>x_new</strong> — our position after one step. We subtract α × slope
            because subtracting a positive slope moves us left (downhill on the right side),
            and subtracting a negative slope moves us right (downhill on the left side).
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example: f(x) = x²">
        <p>
          We&apos;ll descend the bowl <strong>f(x) = x²</strong> starting from <strong>x = 4</strong>,
          using a learning rate of <strong>α = 0.1</strong>. The derivative is f&apos;(x) = 2x,
          so the update rule becomes:
        </p>
      </ExplanationBox>

      <MathFormula label="Update rule applied to f(x) = x²">
        x_new = x_old − 0.1 × (2 × x_old) = x_old × (1 − 0.2) = 0.8 × x_old
      </MathFormula>

      <WorkedExample title="Descending f(x) = x² from x = 4 (α = 0.1)">
        <p>
          We apply the update rule repeatedly. Watch x shrink toward 0 and the cost
          f(x) = x² shrink toward 0 along with it.
        </p>

        <CalcStep number={1}>
          Start: x = 4.000 &nbsp;|&nbsp; f(x) = 16.000 &nbsp;|&nbsp; slope = 2×4 = 8.000
        </CalcStep>
        <CalcStep number={2}>
          Step 1: x = 4 − 0.1×8 = 4 − 0.8 = 3.200 &nbsp;|&nbsp; f(x) = 10.240 &nbsp;|&nbsp; slope = 6.400
        </CalcStep>
        <CalcStep number={3}>
          Step 2: x = 3.2 − 0.1×6.4 = 3.2 − 0.64 = 2.560 &nbsp;|&nbsp; f(x) = 6.554 &nbsp;|&nbsp; slope = 5.120
        </CalcStep>
        <CalcStep number={4}>
          Step 3: x = 2.56 − 0.1×5.12 = 2.56 − 0.512 = 2.048 &nbsp;|&nbsp; f(x) = 4.194 &nbsp;|&nbsp; slope = 4.096
        </CalcStep>
        <CalcStep number={5}>
          Step 4: x = 2.048 − 0.1×4.096 = 2.048 − 0.410 = 1.638 &nbsp;|&nbsp; f(x) = 2.684 &nbsp;|&nbsp; slope = 3.277
        </CalcStep>
        <CalcStep number={6}>
          Step 5: x = 1.638 − 0.1×3.277 = 1.638 − 0.328 = 1.311 &nbsp;|&nbsp; f(x) = 1.718 &nbsp;|&nbsp; slope = 2.621
        </CalcStep>
        <CalcStep number={7}>
          After 10 steps: x ≈ 0.429 &nbsp;|&nbsp; f(x) ≈ 0.184
        </CalcStep>
        <CalcStep number={8}>
          After 20 steps: x ≈ 0.046 &nbsp;|&nbsp; f(x) ≈ 0.002
        </CalcStep>
        <CalcStep number={9}>
          After 30 steps: x ≈ 0.005 &nbsp;|&nbsp; f(x) ≈ 0.000025 — effectively at the minimum.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Each step, x is multiplied by 0.8, so it shrinks by 20% per iteration. The cost
          f(x) = x² shrinks even faster — by 36% per step. The hiker is converging on the
          valley floor. This geometric decay is a hallmark of gradient descent on smooth,
          bowl-shaped cost functions.
        </p>
      </WorkedExample>

      <ExplanationBox title="What This Means for Real Models">
        <p>
          In a real neural network there isn&apos;t a single parameter x — there are
          millions of weights and biases. But the update rule is applied to <em>every
          parameter independently</em>, using that parameter&apos;s own partial derivative.
          The principle is identical: subtract a fraction of the slope, repeat many times,
          converge to low cost. Gradient descent scales from one dimension to millions.
        </p>
      </ExplanationBox>

    </div>
  );
}
