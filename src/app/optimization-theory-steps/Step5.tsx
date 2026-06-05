'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Convex Functions: The Dream Scenario">
        <p>
          A function f is <strong>convex</strong> if, for any two points in its domain, the
          line segment between them lies on or above the graph of f. Geometrically this means
          the function looks like a bowl: no bumps, no valleys, no false floors.
        </p>
        <p>
          The formal condition uses the <strong>second derivative</strong>. For a function of
          a single variable, f is convex if its second derivative is non-negative everywhere.
          For a function of many variables (like a neural network loss as a function of all
          weights), convexity requires the <strong>Hessian matrix</strong> &mdash; the matrix
          of all second partial derivatives &mdash; to be positive semi-definite everywhere.
        </p>
      </ExplanationBox>

      <MathFormula label="Convexity condition (single variable)">
        f is convex &hArr; f&apos;&apos;(x) &ge; 0 for all x
      </MathFormula>

      <MathFormula label="Convexity condition (multivariate)">
        f is convex &hArr; &nabla;&sup2;f(w) is positive semi-definite for all w
      </MathFormula>

      <ExplanationBox title="Why Convexity Makes Optimization Easy">
        <p>
          On a convex function every local minimum is also the <strong>global minimum</strong>.
          There is only one lowest point. This has two enormous practical consequences:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Gradient descent always converges.</strong> No matter where you start, if
            you follow the gradient downhill you will reach the global minimum (given an
            appropriate learning rate).
          </li>
          <li>
            <strong>Convergence rates are provable.</strong> For strongly convex functions
            (where f&apos;&apos;(x) &ge; m &gt; 0), gradient descent converges at a linear
            rate &mdash; the gap to the minimum shrinks by a constant factor each step.
            Nesterov&apos;s accelerated gradient achieves the theoretically optimal rate.
          </li>
        </ul>
        <p>
          Classic examples of convex ML losses: linear regression with MSE, logistic
          regression with cross-entropy, support vector machines. These problems have
          mathematically guaranteed solutions.
        </p>
      </ExplanationBox>

      <WorkedExample title="Verifying Convexity: f(x) = x&sup2; + 2x + 3">
        <CalcStep number={1}>Compute the first derivative: f&apos;(x) = 2x + 2</CalcStep>
        <CalcStep number={2}>Compute the second derivative: f&apos;&apos;(x) = 2</CalcStep>
        <CalcStep number={3}>Since f&apos;&apos;(x) = 2 &gt; 0 for all x, the function is convex (in fact, strongly convex).</CalcStep>
        <CalcStep number={4}>The global minimum is where f&apos;(x) = 0: 2x + 2 = 0 &rArr; x = &minus;1.</CalcStep>
        <CalcStep number={5}>f(&minus;1) = 1 &minus; 2 + 3 = 2. Any gradient descent run from any starting point will converge to (x=&minus;1, f=2).</CalcStep>
      </WorkedExample>

      <ExplanationBox title="Nonconvex Functions: The Reality of Deep Learning">
        <p>
          Neural network loss surfaces are almost never convex. Stack more than one layer and
          introduce nonlinear activations (ReLU, sigmoid, etc.) and the loss surface develops:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Many local minima</strong> &mdash; regions where the loss is lower than
            all nearby points, but not the lowest possible value globally.
          </li>
          <li>
            <strong>Saddle points</strong> &mdash; points where the gradient is zero but which
            are neither local minima nor maxima. In high dimensions, saddle points are far
            more common than local minima. The gradient is zero so plain gradient descent
            stalls, but there are directions to escape.
          </li>
          <li>
            <strong>Plateaus</strong> &mdash; broad flat regions with near-zero gradient
            everywhere. The optimizer barely moves.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Why Deep Nets Train Anyway">
        <p>
          Given this terrifying loss landscape, why does training work? The theoretical
          understanding has evolved:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Most local minima are equally good.</strong> Research (Goodfellow et al.,
            Choromanska et al.) suggests that in very high-dimensional parameter spaces, local
            minima tend to have similar loss values. The &quot;bad&quot; local minima with high
            loss are exponentially rare compared to the &quot;good&quot; ones with loss close
            to the global minimum.
          </li>
          <li>
            <strong>Saddle points, not local minima, are the real obstacle.</strong> Gradient
            descent and its variants (especially with noise from mini-batches) naturally escape
            saddle points because the noise provides a small kick in the escape direction.
          </li>
          <li>
            <strong>Flat minima generalize better.</strong> Sharp minima (narrow bowls) are
            brittle &mdash; a tiny shift in the loss surface (e.g., from a different dataset)
            throws you out of the minimum. Flat minima (broad bowls) are robust. Mini-batch
            noise during training naturally biases the optimizer toward flatter, more
            generalizable solutions.
          </li>
        </ul>
        <p>
          The bottom line: deep networks are nonconvex in theory, but in practice the loss
          surface is well-behaved enough that modern optimizers find excellent solutions
          reliably. The key insight is that <em>reaching the exact global minimum is not
          necessary</em> &mdash; reaching a flat, low-loss region is sufficient for
          generalization.
        </p>
      </ExplanationBox>
    </div>
  );
}
