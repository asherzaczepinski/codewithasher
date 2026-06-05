'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Derivative Is Just a Slope">
        <p>
          The <strong>derivative</strong> of a function at a particular point is the slope
          of that function right at that point. That&apos;s it. Forget the formal definition
          for now — slope is the key idea.
        </p>
        <p>
          Remember slope from algebra? Rise over run. If you move one step to the right,
          the slope tells you how much the function goes up or down. A slope of +3 means
          for every step right, the value rises by 3. A slope of −2 means it falls by 2.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Slope Tells You Which Way Is Downhill">
        <p>
          Back to our hiker on a foggy hill. The ground under their feet has a slope.
          There are only two logical behaviors:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Slope is positive (ground rises to the right)</strong> — to go downhill,
            step <em>left</em> (in the negative direction).
          </li>
          <li>
            <strong>Slope is negative (ground falls to the right)</strong> — to go downhill,
            step <em>right</em> (in the positive direction).
          </li>
          <li>
            <strong>Slope is zero</strong> — the ground is flat right here. You may be at
            the minimum — stop and check.
          </li>
        </ul>
        <p>
          In every case, moving <em>opposite</em> to the slope takes you downhill.
          This is the entire core logic of gradient descent: <strong>subtract the slope
          from your current position</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="Derivative of f(x) = x²">
        f(x) = x²  →  f&apos;(x) = 2x
      </MathFormula>

      <ExplanationBox title="Why f(x) = x²?">
        <p>
          Throughout this course our running example is the simplest possible cost function:
          <strong> f(x) = x²</strong>. It&apos;s a perfect bowl (parabola) with its minimum
          at x = 0. The derivative is <strong>f&apos;(x) = 2x</strong>, which you can verify
          with the power rule: bring the exponent down and reduce it by 1.
        </p>
        <p>
          This derivative tells us the slope everywhere on the bowl. At x = 4, the slope
          is 2×4 = 8 (steep, pointing upward to the right — so go left). At x = −3, the
          slope is 2×(−3) = −6 (pointing downward to the right — so go right). At x = 0,
          the slope is 0 — we&apos;re at the bottom.
        </p>
      </ExplanationBox>

      <WorkedExample title="Reading the Slope at Several Points">
        <p>
          Let&apos;s evaluate the slope of f(x) = x² at a few positions and decide which
          direction to move:
        </p>
        <CalcStep number={1}>At x = 4: slope = 2 × 4 = +8. Positive → move left (decrease x).</CalcStep>
        <CalcStep number={2}>At x = 1: slope = 2 × 1 = +2. Still positive → still move left.</CalcStep>
        <CalcStep number={3}>At x = 0: slope = 2 × 0 = 0. Flat → we&apos;re at the minimum!</CalcStep>
        <CalcStep number={4}>At x = −3: slope = 2 × (−3) = −6. Negative → move right (increase x).</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          No matter where we start on the bowl, the slope reliably points <em>away</em> from
          the minimum. Moving opposite to the slope always gets us closer to x = 0.
          Next, we&apos;ll turn this insight into a precise update formula.
        </p>
      </WorkedExample>
    </div>
  );
}
