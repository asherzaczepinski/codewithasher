'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Slope: The Idea Behind a Derivative">
        <p>
          The <strong>slope</strong> of a straight line is &quot;rise over run&quot;: how much the
          output changes per unit increase in the input. For a line f(x) = mx + b the slope is
          simply m — it is the same everywhere.
        </p>

        <MathFormula label="Slope of a line">
          slope = rise / run = (f(x₂) − f(x₁)) / (x₂ − x₁)
        </MathFormula>

        <p>
          For curved (nonlinear) functions the slope changes from point to point. The{' '}
          <strong>derivative</strong> f&apos;(x) — or df/dx — is the slope of the curve <em>at
          a specific point x</em>. Geometrically it is the slope of the tangent line drawn to the
          curve at that point.
        </p>
        <p>
          A positive derivative means the function is rising at that point. A negative derivative
          means it is falling. A derivative of zero means the function is momentarily flat — this
          is exactly how we locate minima and maxima.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Common Derivative Rules (Quick Reference)">
        <p>
          You do not need to derive these from scratch — but you do need to recognise them when
          they appear in ML derivations. The{' '}
          <strong>Calculus course</strong> on this platform covers each rule in full detail with
          proofs and examples.
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Power rule:</strong> d/dx [x^n] = n · x^(n−1)</li>
          <li><strong>Constant rule:</strong> d/dx [c] = 0</li>
          <li><strong>Sum rule:</strong> d/dx [f + g] = f&apos; + g&apos;</li>
          <li><strong>Chain rule:</strong> d/dx [g(f(x))] = g&apos;(f(x)) · f&apos;(x)</li>
          <li><strong>Natural exponential:</strong> d/dx [e^x] = e^x</li>
          <li><strong>Natural log:</strong> d/dx [ln(x)] = 1/x</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Partial Derivatives and the Gradient">
        <p>
          A model has thousands of parameters — not just one x. If the loss L depends on weights
          w₁, w₂, ..., w_n, we need to know how L changes as we nudge <em>each</em> weight
          individually while holding the others fixed. That is a <strong>partial derivative</strong>.
        </p>

        <MathFormula label="Partial derivative with respect to w₁">
          ∂L / ∂w₁ &nbsp;=&nbsp; rate of change of L as w₁ changes, all other weights fixed
        </MathFormula>

        <p>
          The <strong>gradient</strong> ∇L is the vector of all partial derivatives at once:
        </p>

        <MathFormula label="Gradient">
          ∇L = (∂L/∂w₁, ∂L/∂w₂, ..., ∂L/∂w_n)
        </MathFormula>

        <p>
          The gradient points in the direction of <em>steepest increase</em> of the loss. To
          reduce the loss, we move in the <em>opposite</em> direction — hence gradient
          <strong> descent</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Chain Rule and Backpropagation">
        <p>
          A neural network is a long composition of functions. To find how the loss depends on a
          weight in layer 1, we must differentiate through every subsequent layer. The chain rule
          makes this systematic:
        </p>

        <MathFormula label="Chain rule">
          dL/dw = (dL/da) · (da/dz) · (dz/dw)
        </MathFormula>

        <p>
          where a is the activation and z is the pre-activation. Backpropagation is nothing more
          than applying the chain rule layer by layer, from the output back to the inputs. The
          <strong> Calculus course</strong> builds this in full — here we just need to know it
          exists and why it is necessary.
        </p>
      </ExplanationBox>

      <WorkedExample title="Differentiating a Loss Function">
        <p>
          Suppose the loss on a single example is L(w) = (w − 3)². We want to find the derivative
          and use it to reduce the loss from the starting point w = 5.
        </p>
        <CalcStep number={1}>Expand: L(w) = w² − 6w + 9</CalcStep>
        <CalcStep number={2}>Differentiate using the power and sum rules: dL/dw = 2w − 6</CalcStep>
        <CalcStep number={3}>Evaluate at w = 5: dL/dw = 2(5) − 6 = 4</CalcStep>
        <CalcStep number={4}>The gradient is positive, so L is rising at w = 5. Step in the negative direction.</CalcStep>
        <CalcStep number={5}>
          With learning rate η = 0.1: w_new = 5 − 0.1 × 4 = 4.6
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The true minimum is w = 3 (where dL/dw = 0). Each gradient descent step moves us
          closer. This simple example captures exactly what happens during training — repeated,
          across millions of parameters.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We can approximate any derivative numerically using the <strong>finite difference</strong>
          formula: (f(x + h) − f(x)) / h for a tiny h. This is exactly how automatic
          differentiation frameworks double-check their analytical gradients, and it lets us
          compute gradients for functions that would be painful to differentiate by hand.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="derivatives_and_gradient_descent.py"
        caption="Numerical derivative and gradient descent on a simple loss — the core loop that trains every ML model."
        code={`# --- Numerical derivative (finite difference) ---
# The derivative f'(x) is defined as the limit of (f(x+h) - f(x)) / h as h -> 0.
# We approximate it by using a very small h (not zero, but tiny).
# This works for ANY differentiable function without needing algebra.

def numerical_derivative(f, x, h=1e-5):
    # Centred difference: average the slope from the left and the right.
    # More accurate than a one-sided difference for the same h.
    return (f(x + h) - f(x - h)) / (2 * h)

# Our loss function: L(w) = (w - 3)^2
# The analytical derivative is dL/dw = 2*(w - 3).
def loss(w):
    return (w - 3) ** 2   # minimum is at w=3 where loss=0

# Check at w=5: analytical says 2*(5-3) = 4
approx_grad = numerical_derivative(loss, w=5.0)
print("Numerical dL/dw at w=5:", round(approx_grad, 6))   # ~4.0 -- matches!

# --- Gradient descent on a 2-parameter loss ---
# L(w1, w2) = (w1 - 1)^2 + (w2 - 4)^2
# Each partial derivative is computed independently (all other params held fixed).
# The gradient is the vector of all partials: [dL/dw1, dL/dw2].

def loss_2d(w1, w2):
    return (w1 - 1) ** 2 + (w2 - 4) ** 2   # bowl shape; minimum at (1, 4)

def gradient_2d(w1, w2):
    # Compute each partial derivative numerically using finite differences.
    # dL/dw1: wiggle w1 while holding w2 fixed
    dl_dw1 = numerical_derivative(lambda w: loss_2d(w, w2), w1)
    # dL/dw2: wiggle w2 while holding w1 fixed
    dl_dw2 = numerical_derivative(lambda w: loss_2d(w1, w), w2)
    return dl_dw1, dl_dw2   # the gradient vector pointing uphill

# --- Run gradient descent ---
# Start far from the minimum and take small steps in the -gradient direction.
w1, w2 = 8.0, 9.0    # starting point, far from true minimum (1, 4)
lr = 0.1              # learning rate: how large each step is

for step in range(20):
    g1, g2 = gradient_2d(w1, w2)   # compute gradient at current position
    w1 = w1 - lr * g1              # step opposite to the gradient (downhill)
    w2 = w2 - lr * g2
    if step % 5 == 0:
        current_loss = loss_2d(w1, w2)
        print(f"Step {step:2d}  w1={w1:.3f}  w2={w2:.3f}  loss={current_loss:.4f}")

# After 20 steps, w1 should be near 1.0 and w2 near 4.0 -- the global minimum.
print("Final w1:", round(w1, 3), " (target: 1)")
print("Final w2:", round(w2, 3), " (target: 4)")`}
      />
    </div>
  );
}
