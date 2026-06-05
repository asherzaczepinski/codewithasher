'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Problem With Using All Your Data at Once">
        <p>
          The gradient descent we&apos;ve studied so far is called <strong>full-batch</strong>
          (or just &quot;batch&quot;) gradient descent. Before taking a single step, it looks
          at <em>every</em> training example, computes the cost for each one, averages them
          into the MSE, and then computes the gradient of that average.
        </p>
        <p>
          On a dataset with 100 examples that&apos;s fine. On a dataset with 100 million
          examples — common in industry — computing one gradient requires scanning all
          100 million rows just to take a single tiny step. That&apos;s painfully slow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Stochastic Gradient Descent (SGD) — One Example at a Time">
        <p>
          <strong>Stochastic Gradient Descent</strong> goes to the opposite extreme: for
          each step, pick <em>one</em> training example at random, compute the gradient
          using just that example, and update immediately.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Speed:</strong> each update is cheap — one forward pass, one gradient.</li>
          <li>
            <strong>Noise:</strong> a single example is a noisy estimate of the true
            gradient. The path toward the minimum is jagged, not smooth.
          </li>
          <li>
            <strong>Benefit of noise:</strong> the randomness can actually help escape
            shallow local minima that full-batch descent would get stuck in.
          </li>
          <li>
            <strong>Downside:</strong> because the path is so noisy, the cost never fully
            settles — it bounces around near the minimum even after the model has essentially
            converged.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="SGD update (single example i)">
        x_new = x_old − α × ∇L_i(x_old)
      </MathFormula>

      <ExplanationBox title="Mini-Batch GD — The Sweet Spot">
        <p>
          <strong>Mini-batch gradient descent</strong> splits the dataset into small chunks
          called <strong>batches</strong> (typically 32, 64, 128, or 256 examples). Each
          gradient step uses one mini-batch. This is the method used in virtually all
          modern deep learning.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Much faster than full-batch</strong> — you take many gradient steps
            before you&apos;ve even seen the whole dataset once.
          </li>
          <li>
            <strong>Less noisy than SGD</strong> — averaging over 64 examples gives a
            much more reliable gradient estimate than a single example.
          </li>
          <li>
            <strong>GPU-friendly</strong> — modern GPUs are designed to process exactly
            this kind of fixed-size batch in parallel.
          </li>
          <li>
            <strong>One pass through the entire dataset</strong> is called an
            <em> epoch</em>. With batch size 64 and 64 000 examples, you take 1 000 gradient
            steps per epoch.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Comparing the Three Variants on 1 000 Training Examples">
        <CalcStep number={1}>
          Full-batch: 1 gradient step costs 1 000 example evaluations. After 100 steps: 100 000 evaluations. Path is smooth.
        </CalcStep>
        <CalcStep number={2}>
          SGD (batch=1): 1 gradient step costs 1 example evaluation. After 100 steps: 100 evaluations — but 100× noisier gradients.
        </CalcStep>
        <CalcStep number={3}>
          Mini-batch (batch=32): 1 gradient step costs 32 evaluations. After 100 steps: 3 200 evaluations. Path is moderately smooth.
        </CalcStep>
        <CalcStep number={4}>
          In wall-clock time, mini-batch with batch=32 typically converges far faster than full-batch, with far lower variance than SGD.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          This is why &quot;SGD&quot; in library documentation almost always means
          <em> mini-batch SGD</em> with a configurable batch size — the stochastic-one-example
          variant is rarely used in isolation in modern practice.
        </p>
      </WorkedExample>

      <ExplanationBox title="Epoch vs. Iteration">
        <p>
          Two terms you&apos;ll see constantly in training logs:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Iteration (step)</strong> — one forward pass + one gradient update,
            using one mini-batch.
          </li>
          <li>
            <strong>Epoch</strong> — one complete pass through the entire training dataset.
            If your dataset has N examples and your batch size is B, one epoch = N/B iterations.
          </li>
        </ul>
        <p>
          Training is typically reported in epochs so you can compare runs with different
          batch sizes fairly.
        </p>
      </ExplanationBox>
    </div>
  );
}
