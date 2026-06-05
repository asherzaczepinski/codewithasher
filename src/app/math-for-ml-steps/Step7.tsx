'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="What Makes a Function Convex?">
        <p>
          Imagine a bowl sitting on a table. No matter where you place a marble on the inside,
          it always rolls to the same lowest point. That&apos;s the essential property of a{' '}
          <strong>convex function</strong>: it has exactly one valley, and gradient descent finds
          it reliably.
        </p>
        <p>
          Formally, a function f is convex if the line segment connecting any two points on its
          graph lies <em>above or on</em> the graph. The mathematical condition is:
        </p>

        <MathFormula label="Convexity condition">
          f(λa + (1−λ)b) ≤ λ·f(a) + (1−λ)·f(b) &nbsp;&nbsp;for all λ in [0, 1]
        </MathFormula>

        <p>
          In plain English: the function value at any weighted average of two inputs is at most
          the weighted average of the function values at those inputs. The function curves upward.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Convex vs. Nonconvex: Why It Matters">
        <p>
          <strong>Convex functions</strong> — a parabola f(x) = x², mean squared error, logistic
          loss — have a single global minimum. Gradient descent is guaranteed to find it,
          regardless of where you start. This makes optimisation theoretically clean and
          practically reliable.
        </p>
        <p>
          <strong>Nonconvex functions</strong> have multiple valleys (local minima), peaks, saddle
          points, and plateaus. The loss surface of a deep neural network is famously nonconvex.
          Gradient descent is not guaranteed to find the global minimum — it will find <em>some</em>{' '}
          minimum, but which one depends on where you started and how you stepped.
        </p>
        <p>
          A useful way to visualise the difference: convex looks like a bowl; nonconvex looks
          like a mountain range with many valleys at different depths.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How to Detect Convexity">
        <p>
          For single-variable functions, the second derivative test is the easiest check:
        </p>

        <MathFormula label="Second derivative test">
          f is convex on an interval if f&apos;&apos;(x) ≥ 0 everywhere on that interval
        </MathFormula>

        <p>
          The second derivative f&apos;&apos;(x) measures how fast the slope is changing. If the
          slope is always increasing (the function curves upward), the function is convex. If
          f&apos;&apos;(x) &gt; 0 everywhere, f is <em>strictly</em> convex with a unique minimum.
        </p>
        <p>
          For multi-variable functions (which is almost always the case in ML), convexity is
          checked via the Hessian matrix — the matrix of all second partial derivatives. The
          function is convex if this matrix is positive semi-definite everywhere. Logistic
          regression&apos;s cross-entropy loss satisfies this, which is why it always trains to
          the same solution.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Guaranteed Minimum: Why Convexity Is Powerful">
        <p>
          At a local minimum of a differentiable function, the gradient is zero — the function
          is momentarily flat. For a convex function, there is only one such point: the{' '}
          <strong>global minimum</strong>. So the condition ∇L = 0 uniquely identifies the best
          possible set of parameters.
        </p>

        <MathFormula label="Optimality condition">
          Minimum at w* &nbsp;&nbsp;if and only if&nbsp;&nbsp; ∇L(w*) = 0 &nbsp;and&nbsp; f is convex
        </MathFormula>

        <p>
          Gradient descent provably converges to w* for convex losses given a small enough
          learning rate. This is why linear regression and logistic regression are so reliable:
          their loss functions are convex, so training always reaches the same answer.
        </p>
        <p>
          Deep networks sacrifice convexity for expressive power. The trade-off: they can model
          far richer patterns, but training requires careful initialisation, regularisation, and
          tuning to avoid getting stuck in poor local minima.
        </p>
      </ExplanationBox>

      <WorkedExample title="Verifying Convexity with the Second Derivative">
        <p>
          Show that f(x) = x² is convex, and find its minimum.
        </p>
        <CalcStep number={1}>First derivative: f&apos;(x) = 2x</CalcStep>
        <CalcStep number={2}>Second derivative: f&apos;&apos;(x) = 2</CalcStep>
        <CalcStep number={3}>f&apos;&apos;(x) = 2 &gt; 0 everywhere, so f is strictly convex.</CalcStep>
        <CalcStep number={4}>Set f&apos;(x) = 0: 2x = 0, so x* = 0</CalcStep>
        <CalcStep number={5}>f(0) = 0 — this is the unique global minimum.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Gradient descent starting from any x — say x = 10 — will step repeatedly toward x = 0
          and arrive there (within numerical precision). There is no local minimum to get stuck in.
        </p>
      </WorkedExample>

      <ExplanationBox title="Pulling It All Together">
        <p>
          You have now seen the complete mathematical arc that powers machine learning:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Functions</strong> describe the model — a mapping from inputs (features) to
            outputs (predictions).
          </li>
          <li>
            <strong>Exponentials &amp; logs</strong> shape the activations (sigmoid, softmax) and
            the loss (cross-entropy, log-likelihood).
          </li>
          <li>
            <strong>Derivatives &amp; gradients</strong> measure which direction reduces the loss,
            making training possible via gradient descent.
          </li>
          <li>
            <strong>Integrals</strong> underpin probability theory — every density, expectation,
            and normalising constant is an integral.
          </li>
          <li>
            <strong>Convexity</strong> tells us when we can trust gradient descent to find the
            true best parameters, and explains why some models are harder to train than others.
          </li>
        </ul>
        <p>
          None of this math was invented for ML — it predates it by centuries. But ML is the
          application that makes every piece of it feel necessary and alive. You now have the
          foundation to read papers, understand derivations, and go much deeper with the companion
          Linear Algebra, Calculus, and Probability courses.
        </p>
      </ExplanationBox>
    </div>
  );
}
