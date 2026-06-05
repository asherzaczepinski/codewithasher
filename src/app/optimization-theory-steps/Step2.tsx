'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What Plain SGD Gets Wrong">
        <p>
          Mini-batch SGD is the workhorse of deep learning, but it has two well-known failure
          modes that show up on almost every real loss surface.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Ravines</strong> &mdash; imagine a long, narrow valley. The gradient
            perpendicular to the valley floor is large (steep walls), while the gradient along
            the valley toward the minimum is small. Plain SGD takes huge sideways steps that
            bounce between the walls and tiny forward steps. Progress toward the true minimum
            is agonizingly slow.
          </li>
          <li>
            <strong>Noisy gradients</strong> &mdash; mini-batches are random subsets. One
            batch might point slightly left, the next slightly right. The resulting path
            zigzags rather than heading straight for the minimum, wasting many update steps.
          </li>
        </ul>
        <p>
          Both problems share a root cause: the optimizer has no memory. Each step is taken
          completely independently of every previous step. Momentum gives the optimizer memory.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Momentum: Accumulating Velocity">
        <p>
          Instead of stepping directly along the current gradient, momentum maintains a
          <strong> velocity vector v</strong> that is a running weighted average of all past
          gradients. Each new gradient contributes a little to the velocity, and the velocity
          carries the optimizer forward.
        </p>
        <p>
          The hyperparameter <strong>&beta;</strong> (beta, typically 0.9) controls how much
          of the old velocity to retain. A value of 0.9 means &quot;90% old momentum, 10% new
          gradient signal.&quot; The velocity therefore smooths out the noisy mini-batch
          gradients by averaging over roughly 1/(1&minus;&beta;) = 10 recent steps.
        </p>
      </ExplanationBox>

      <MathFormula label="Momentum update (classical form)">
        v_new = &beta; &times; v_old + (1&minus;&beta;) &times; &nabla;L(w){'\n'}
        w_new = w_old &minus; &alpha; &times; v_new
      </MathFormula>

      <ExplanationBox title="Nesterov Accelerated Gradient">
        <p>
          Momentum is great, but it has a subtle problem: the velocity can carry you past a
          minimum before you realize you should be slowing down. Imagine a ball rolling fast
          toward the bottom of a bowl — it overshoots, then has to correct.
        </p>
        <p>
          <strong>Nesterov Accelerated Gradient (NAG)</strong>, proposed by Yurii Nesterov in
          1983, fixes this with a simple idea: evaluate the gradient not at the current
          position, but at the position you will be at <em>after applying the current
          velocity</em>. This is a &quot;look ahead&quot; correction &mdash; the optimizer
          sees where it is heading and adjusts before it gets there.
        </p>
      </ExplanationBox>

      <MathFormula label="Nesterov update">
        w_lookahead = w_old &minus; &alpha; &times; &beta; &times; v_old{'\n'}
        v_new = &beta; &times; v_old + (1&minus;&beta;) &times; &nabla;L(w_lookahead){'\n'}
        w_new = w_old &minus; &alpha; &times; v_new
      </MathFormula>

      <ExplanationBox title="Nesterov vs. Plain Momentum: The Key Difference">
        <p>
          With plain momentum the gradient is computed at w_old and the full momentum term is
          applied afterwards &mdash; the correction comes too late. With Nesterov, the gradient
          is computed at the projected future position w_lookahead. When the optimizer is
          approaching a minimum, the lookahead position is closer to the minimum, the gradient
          there is smaller (or points back toward the minimum), and the resulting velocity is
          naturally damped. This produces faster convergence in theory and often in practice,
          especially on well-behaved convex problems.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Momentum Update, Step by Step">
        <p>
          Suppose we are training a single parameter w with &alpha; = 0.1 and &beta; = 0.9.
          We start at w = 3.0 with velocity v = 0. The loss gradient at w = 3.0 is
          &nabla;L = 2.0.
        </p>
        <CalcStep number={1}>
          Initial state: w = 3.000, v = 0.000, gradient = 2.000
        </CalcStep>
        <CalcStep number={2}>
          Update velocity: v_new = 0.9 &times; 0 + 0.1 &times; 2.0 = 0.200
        </CalcStep>
        <CalcStep number={3}>
          Update parameter: w_new = 3.0 &minus; 0.1 &times; 0.200 = 3.0 &minus; 0.020 = 2.980
        </CalcStep>
        <CalcStep number={4}>
          Next step &mdash; gradient at 2.980 is approximately 1.987. New v = 0.9 &times; 0.200 + 0.1 &times; 1.987 = 0.180 + 0.199 = 0.379
        </CalcStep>
        <CalcStep number={5}>
          w after step 2: 2.980 &minus; 0.1 &times; 0.379 = 2.980 &minus; 0.038 = 2.942
        </CalcStep>
        <CalcStep number={6}>
          Equivalent plain GD steps would be: 3.0 &minus; 0.1&times;2.0 = 2.800, then 2.800 &minus; 0.1&times;1.600 = 2.640. Plain GD moves faster per step but zigzags on 2-D surfaces; momentum is slower to start but builds speed and smooths direction.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice that v grows over successive steps with consistent gradients. After many
          steps in the same direction, the effective step size approaches
          &alpha; / (1&minus;&beta;) = 0.1 / 0.1 = 1.0 &mdash; ten times larger than plain
          SGD. That is momentum&apos;s superpower on long, consistent descents.
        </p>
      </WorkedExample>

      <ExplanationBox title="When to Use Momentum vs. Nesterov">
        <p>
          In practice, both outperform plain SGD. Nesterov has a theoretical advantage (it
          achieves the optimal convergence rate on convex problems) and often converges
          slightly faster in practice. PyTorch&apos;s SGD optimizer supports both via the
          <em> nesterov=True</em> flag. For deep learning, Adam (covered next) has largely
          superseded both for first-use, but momentum and Nesterov SGD remain competitive
          when carefully tuned, especially for vision tasks.
        </p>
      </ExplanationBox>

    </div>
  );
}
