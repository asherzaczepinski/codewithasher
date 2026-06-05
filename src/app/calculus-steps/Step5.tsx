'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Functions Inside Functions">
        <p>
          Real ML models stack operations on top of each other. You compute a weighted
          sum, feed it into an activation function, compute an error from that output —
          each step wraps around the previous one. Mathematically this is called
          <strong> function composition</strong>: <em>f(g(x))</em>, where g runs first and
          f acts on g&apos;s output.
        </p>
        <p>
          To differentiate a composed function we need one more rule: the
          <strong> chain rule</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="The Chain Rule">
        d/dx [ f(g(x)) ] = f&apos;(g(x)) · g&apos;(x)
      </MathFormula>

      <ExplanationBox title="The Outer × Inner Intuition">
        <p>
          Read the chain rule as: <em>differentiate the outer function (leaving the inner
          function unchanged inside it), then multiply by the derivative of the inner
          function</em>.
        </p>
        <p>
          Think of it with units. If g converts meters to seconds and f converts seconds
          to kilograms, then f(g(x)) converts meters to kilograms. The rate of that
          conversion is the product of the two individual rates. The chain rule is just
          that unit-conversion intuition written in calculus notation.
        </p>
        <p>
          In ML, the chain rule handles the whole cascade: the error depends on the
          activation, the activation depends on the pre-activation, the pre-activation
          depends on the weight. To find how the error changes with the weight, you
          multiply the rates at each link in the chain.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Backpropagation Is Just the Chain Rule">
        <p>
          Backpropagation — the algorithm that trains every neural network — is nothing
          more than the chain rule applied layer by layer, walking backward through the
          network. Each layer computes &quot;how much did my output affect the final
          error?&quot; by multiplying its own local derivative by the derivative that came
          from the layer ahead of it. Without the chain rule there is no backpropagation,
          and without backpropagation there is no modern deep learning.
        </p>
      </ExplanationBox>

      <WorkedExample title="Chain Rule on the Error Curve">
        <p>
          Our model computes a pre-activation <em>z&nbsp;=&nbsp;3w</em>, then feeds it
          into an error term <em>E&nbsp;=&nbsp;z²</em>. So the full error as a function
          of w is <em>E(w)&nbsp;=&nbsp;(3w)²</em>. Find dE/dw using the chain rule.
        </p>
        <CalcStep number={1}>
          Identify the inner function: g(w) = 3w. Its derivative is g&apos;(w) = 3.
        </CalcStep>
        <CalcStep number={2}>
          Identify the outer function: f(z) = z². Its derivative is f&apos;(z) = 2z.
        </CalcStep>
        <CalcStep number={3}>
          Apply the chain rule: dE/dw = f&apos;(g(w)) · g&apos;(w) = 2(3w) · 3 = 18w.
        </CalcStep>
        <CalcStep number={4}>
          Verify by expanding directly: (3w)² = 9w², and d/dw[9w²] = 18w. ✓
        </CalcStep>
        <CalcStep number={5}>
          Evaluate at w = 2: dE/dw = 18 × 2 = 36. The error is rising fast —
          step left with learning rate 0.01: new w = 2 − 0.01 × 36 = 1.64.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The chain rule gave us a gradient of 36, which is the combined rate from both
          the pre-activation step (factor of 3) and the squaring step (factor of 2z).
          This is exactly the calculation a neural network layer performs during
          backpropagation.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We add the composed function to calculus.py and compute its derivative two
          ways — analytically via the chain rule and numerically via finite differences
          — then confirm they agree.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="calculus.py"
        caption="Chain rule computed two ways; both methods agree to six decimal places."
        code={`# --- continued from Step 4 ---
# numerical_derivative(f, x, h=1e-6) is already defined above.

# Inner function:  g(w) = 3w   (pre-activation: scale the weight)
def g(w):
    return 3 * w

# Outer function:  f(z) = z^2  (error: square the pre-activation)
def f(z):
    return z ** 2

# Composed function: E(w) = f(g(w)) = (3w)^2
# This is how a one-layer network computes its error.
def composed_error(w):
    return f(g(w))   # g runs first, then f acts on g's output

# --- Method 1: chain rule by hand ---
# f'(z) = 2z   (outer derivative, leaving g(w) inside)
# g'(w) = 3    (inner derivative)
# chain rule:  dE/dw = f'(g(w)) * g'(w) = 2*(3w) * 3 = 18w
def chain_rule_derivative(w):
    outer_deriv = 2 * g(w)   # f'(g(w)) — evaluate outer derivative at g(w)
    inner_deriv = 3           # g'(w) — constant because g is linear
    return outer_deriv * inner_deriv   # multiply the two rates

# --- Method 2: numerical finite differences ---
# (no algebra needed — just perturb w and measure the ratio)
def numerical_chain(w):
    return numerical_derivative(composed_error, w)

# Compare at w = 2
w_test = 2.0
cr  = chain_rule_derivative(w_test)    # 18 * 2 = 36  (exact)
num = numerical_chain(w_test)          # ~36.000018   (tiny h error)
print(f"Chain rule:  dE/dw at w={w_test} = {cr:.6f}")
print(f"Numerical:   dE/dw at w={w_test} = {num:.6f}")
# Both methods agree — the chain rule is just the limit definition done symbolically.`}
      />
    </div>
  );
}
