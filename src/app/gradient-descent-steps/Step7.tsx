'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Limits of Plain Gradient Descent">
        <p>
          Plain gradient descent with a fixed learning rate has two serious weaknesses that
          appear in real neural network training:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Flat regions</strong> — areas where the gradient is nearly zero. The
            hiker barely moves even though they&apos;re not at the minimum yet.
          </li>
          <li>
            <strong>Noisy gradients</strong> — mini-batch SGD gradients bounce around.
            Progress zigzags instead of going straight toward the minimum.
          </li>
        </ul>
        <p>
          Modern optimizers fix both problems. We&apos;ll look at two of the most important:{' '}
          <strong>Momentum</strong> and <strong>Adam</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Momentum — Giving the Hiker a Backpack Full of Speed">
        <p>
          Imagine our hiker rolling a snowball down the hill. On steep slopes the snowball
          accelerates and builds up speed. On flat or slightly uphill patches it doesn&apos;t
          stop immediately — it keeps rolling for a while, powered by accumulated momentum.
        </p>
        <p>
          Momentum does the same for gradient descent. Instead of taking a step purely based
          on the current gradient, we maintain a <strong>velocity</strong> vector v that
          accumulates a weighted history of past gradients. Each new gradient nudges the
          velocity slightly; the velocity then determines the actual step.
        </p>
      </ExplanationBox>

      <MathFormula label="Momentum update equations">
        v_new = β × v_old + (1 − β) × gradient{'\n'}
        x_new = x_old − α × v_new
      </MathFormula>

      <ExplanationBox title="Reading the Momentum Equations">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>β (beta)</strong> — the momentum coefficient, typically 0.9. It controls
            how much of the old velocity to keep. β = 0.9 means &quot;90% old velocity,
            10% new gradient signal.&quot;
          </li>
          <li>
            <strong>Effect on flat regions:</strong> if many past gradients pointed in the
            same direction, v is large even when the current gradient is small. The hiker
            coasts through the flat patch.
          </li>
          <li>
            <strong>Effect on noise:</strong> oscillating gradients average out in v because
            positive and negative signals partially cancel. The effective step direction is
            much smoother than raw SGD.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Momentum vs. Plain GD Through a Flat Region">
        <p>
          Suppose gradients in a flat region are consistently 0.02 (tiny). With α = 0.1
          and β = 0.9, starting with v = 0:
        </p>
        <CalcStep number={1}>
          Plain GD step size: 0.1 × 0.02 = 0.002 per step — barely moving.
        </CalcStep>
        <CalcStep number={2}>
          Momentum step 1: v = 0.9×0 + 0.1×0.02 = 0.002 &nbsp;|&nbsp; step = 0.1×0.002 = 0.0002
        </CalcStep>
        <CalcStep number={3}>
          Momentum step 5: v ≈ 0.9⁴×0.002 + ... ≈ 0.0164 &nbsp;|&nbsp; step = 0.1×0.0164 = 0.00164
        </CalcStep>
        <CalcStep number={4}>
          Momentum step 20: v approaches 0.02 (steady-state) &nbsp;|&nbsp; step = 0.002 — same as plain GD at steady state, but got there faster by accumulating speed.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Momentum is most valuable in the <em>transient</em> phase: it builds up speed
          early and carries the optimizer through obstacles that would slow vanilla GD.
        </p>
      </WorkedExample>

      <ExplanationBox title="Adaptive Learning Rates — Different Speeds for Different Parameters">
        <p>
          Another insight: not all parameters deserve the same learning rate. Some weights
          receive large, frequent gradients and should take small, careful steps. Others
          receive tiny, infrequent gradients and need larger steps just to move at all.
        </p>
        <p>
          <strong>Adaptive optimizers</strong> track gradient history per parameter and
          automatically scale α up or down for each one. The key idea: divide the learning
          rate by the square root of the accumulated squared gradients. Parameters with
          historically large gradients get a smaller effective α; parameters with small
          gradients get a larger one.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Adam — Combining Momentum and Adaptive Rates">
        <p>
          <strong>Adam</strong> (Adaptive Moment Estimation, Kingma &amp; Ba, 2015) is the
          default optimizer in most modern deep learning. It combines both ideas:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>First moment (m)</strong> — an exponential moving average of gradients.
            This is momentum: it smooths out the step direction.
          </li>
          <li>
            <strong>Second moment (v)</strong> — an exponential moving average of{' '}
            <em>squared</em> gradients. This tracks per-parameter gradient magnitude for
            adaptive scaling.
          </li>
          <li>
            <strong>Bias correction</strong> — at the start of training both m and v are
            initialized to zero. Adam divides by (1 − β^t) at step t to correct for this
            cold-start bias, preventing artificially small steps early in training.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Adam update (simplified, per parameter)">
        m = β₁×m + (1−β₁)×gradient{'\n'}
        v = β₂×v + (1−β₂)×gradient²{'\n'}
        m̂ = m/(1−β₁ᵗ) &nbsp; v̂ = v/(1−β₂ᵗ){'\n'}
        x_new = x_old − α × m̂ / (√v̂ + ε)
      </MathFormula>

      <ExplanationBox title="Adam Default Hyperparameters">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>α = 0.001</strong> — the starting learning rate.</li>
          <li><strong>β₁ = 0.9</strong> — momentum decay for the first moment.</li>
          <li><strong>β₂ = 0.999</strong> — decay for the second moment (slower — we want a long history of squared gradients).</li>
          <li><strong>ε = 1e−8</strong> — a tiny constant added to prevent division by zero.</li>
        </ul>
        <p>
          These defaults work remarkably well across a huge variety of tasks, which is
          exactly why Adam is so widely used — you often get good results without tuning
          anything beyond the learning rate.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Putting It All Together">
        <p>
          You&apos;ve now covered the complete gradient descent story: the cost function
          defines what we&apos;re minimizing; the derivative tells us which way is downhill;
          the update rule takes one controlled step; the learning rate governs step size;
          mini-batch SGD makes the process feasible on large datasets; and momentum + Adam
          make it fast and robust.
        </p>
        <p>
          Every major model you&apos;ve heard of — GPT, ResNet, BERT — was trained by
          repeating some variant of these same steps millions or billions of times. The
          math you&apos;ve learned here is the real engine underneath all of it.
        </p>
      </ExplanationBox>

    </div>
  );
}
