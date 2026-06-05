'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Learning Rate Is the Most Important Hyperparameter">
        <p>
          The learning rate α controls how large each step is as we descend the cost
          landscape. Choose it well and the model converges smoothly. Choose it badly
          and the model either crawls to a stop or bounces off the walls and never
          settles. Getting α right is often the first thing practitioners tune.
        </p>
      </ExplanationBox>

      <MathFormula label="The update rule (reminder)">
        x_new = x_old − α × f&apos;(x_old)
      </MathFormula>

      <ExplanationBox title="α Too Small — The Patient but Slow Hiker">
        <p>
          When α is tiny — say 0.001 — each step barely moves the hiker. The direction
          is always correct, but progress is glacially slow. In practice this means:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Training takes thousands of extra iterations to converge.</li>
          <li>Compute time and electricity costs balloon.</li>
          <li>
            The model may <em>appear</em> stuck because the cost barely changes between
            epochs, even though it is technically moving in the right direction.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="α = 0.001 — Very slow convergence on f(x) = x² from x = 4">
        <CalcStep number={1}>Step 1: x = 4 − 0.001×8 = 3.992 &nbsp;|&nbsp; f(x) = 15.936</CalcStep>
        <CalcStep number={2}>Step 5: x ≈ 3.961 &nbsp;|&nbsp; f(x) ≈ 15.690 — barely moved after 5 steps.</CalcStep>
        <CalcStep number={3}>Step 100: x ≈ 3.340 &nbsp;|&nbsp; f(x) ≈ 11.156 — still far from 0 after 100 steps.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          With α = 0.1 we were essentially at the bottom in 30 steps. With α = 0.001 we
          need roughly 3 000 steps for the same result.
        </p>
      </WorkedExample>

      <ExplanationBox title="α Too Large — The Overconfident Hiker">
        <p>
          When α is too large — say 1.2 for our bowl — each step <em>overshoots</em> the
          minimum and lands on the other side. If the next step overshoots again, the hiker
          oscillates back and forth, landing further from the bottom each time. This is
          called <strong>divergence</strong>.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Cost increases instead of decreasing — a clear warning sign.</li>
          <li>
            The model&apos;s weights blow up toward infinity (or NaN in floating-point).
          </li>
          <li>Training is effectively broken until α is reduced.</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="α = 1.2 — Divergence on f(x) = x² from x = 4">
        <CalcStep number={1}>
          Start: x = 4.000 &nbsp;|&nbsp; f(x) = 16.000 &nbsp;|&nbsp; slope = 8
        </CalcStep>
        <CalcStep number={2}>
          Step 1: x = 4 − 1.2×8 = 4 − 9.6 = −5.600 &nbsp;|&nbsp; f(x) = 31.360
        </CalcStep>
        <CalcStep number={3}>
          Step 2: x = −5.6 − 1.2×(−11.2) = −5.6 + 13.44 = 7.840 &nbsp;|&nbsp; f(x) = 61.466
        </CalcStep>
        <CalcStep number={4}>
          Step 3: x = 7.84 − 1.2×15.68 = 7.84 − 18.816 = −10.976 &nbsp;|&nbsp; f(x) = 120.47
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The cost is growing — 16 → 31 → 61 → 120. We are heading <em>away</em> from
          the minimum. This is divergence. If you see your training loss going up, cut α
          by a factor of 10 and try again.
        </p>
      </WorkedExample>

      <ExplanationBox title="α Just Right — The Goldilocks Zone">
        <p>
          A well-chosen α — 0.1 in our example — gets you to the minimum in a reasonable
          number of steps without ever overshooting far enough to reverse direction. In
          practice, practitioners typically start somewhere between 0.001 and 0.01 for
          neural networks and adjust from there using the following heuristics:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>If loss is decreasing but very slowly → try multiplying α by 3 or 10.</li>
          <li>If loss is oscillating or increasing → divide α by 3 or 10.</li>
          <li>
            Use a <strong>learning rate schedule</strong> — start large for fast early
            progress, then decrease α as training refines the solution.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Side-by-Side Comparison After 5 Steps from x = 4">
        <CalcStep number={1}>α = 0.001 → x ≈ 3.961 &nbsp;|&nbsp; f(x) ≈ 15.69 &nbsp; (barely moved)</CalcStep>
        <CalcStep number={2}>α = 0.100 → x ≈ 1.311 &nbsp;|&nbsp; f(x) ≈ 1.718 &nbsp; (converging nicely)</CalcStep>
        <CalcStep number={3}>α = 1.200 → x ≈ −10.976 &nbsp;|&nbsp; f(x) ≈ 120.5 &nbsp; (diverged!)</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Five identical gradient descent steps, three very different outcomes — all due
          to the choice of α. This is why learning rate selection is taken so seriously
          in practice.
        </p>
      </WorkedExample>
    </div>
  );
}
