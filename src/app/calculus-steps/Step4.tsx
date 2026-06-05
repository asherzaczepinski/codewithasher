'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="You Don&apos;t Always Need the Limit Definition">
        <p>
          Computing derivatives from the limit definition every time would be exhausting.
          Fortunately, mathematicians worked out a handful of <strong>rules</strong> that let
          you differentiate almost any function instantly. These rules are derived once from
          the limit definition — you just apply the results.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Four Essential Rules">
        <p><strong>1. Constant Rule</strong></p>
        <p>
          The derivative of a constant is zero. A flat horizontal line has no slope.
          If <em>f(x)&nbsp;=&nbsp;5</em>, then <em>f&apos;(x)&nbsp;=&nbsp;0</em>.
          In ML terms: a parameter that never changes contributes no gradient.
        </p>

        <p style={{ marginTop: '1rem' }}><strong>2. Power Rule</strong></p>
        <p>
          For any power of x: bring the exponent down as a multiplier, then reduce the
          exponent by one. This is the rule you will use constantly.
        </p>

        <p style={{ marginTop: '1rem' }}><strong>3. Constant Multiple Rule</strong></p>
        <p>
          A constant factor in front of a function just rides along. Differentiate the
          function, keep the constant. If <em>f(x)&nbsp;=&nbsp;7x³</em>, the 7 stays put.
        </p>

        <p style={{ marginTop: '1rem' }}><strong>4. Sum Rule</strong></p>
        <p>
          The derivative of a sum is the sum of the derivatives. You can differentiate
          term by term. This is why polynomial error functions are easy to handle —
          each term is independent.
        </p>
      </ExplanationBox>

      <MathFormula label="Power Rule">
        d/dx [ xⁿ ] = n · x^(n−1)
      </MathFormula>

      <MathFormula label="Constant Multiple Rule">
        d/dx [ c · f(x) ] = c · f&apos;(x)
      </MathFormula>

      <MathFormula label="Sum Rule">
        d/dx [ f(x) + g(x) ] = f&apos;(x) + g&apos;(x)
      </MathFormula>

      <WorkedExample title="Applying the Rules to an Error Function">
        <p>
          Suppose our error function is <em>E(w)&nbsp;=&nbsp;3w²&nbsp;+&nbsp;2w&nbsp;+&nbsp;5</em>.
          Find <em>E&apos;(w)</em> using the rules above.
        </p>
        <CalcStep number={1}>
          Break into three terms: 3w², 2w, and 5.
        </CalcStep>
        <CalcStep number={2}>
          Differentiate 3w²: power rule gives 2w, constant multiple keeps 3.
          Result: 3 × 2w = 6w.
        </CalcStep>
        <CalcStep number={3}>
          Differentiate 2w: power rule — w = w¹, so derivative is 1·w⁰ = 1.
          Constant multiple keeps 2. Result: 2 × 1 = 2.
        </CalcStep>
        <CalcStep number={4}>
          Differentiate 5: constant rule gives 0.
        </CalcStep>
        <CalcStep number={5}>
          Sum rule — add the results: E&apos;(w) = 6w + 2 + 0 = 6w + 2.
        </CalcStep>
        <CalcStep number={6}>
          Evaluate at w = 1: E&apos;(1) = 6(1) + 2 = 8. Slope is +8, so we step left to
          reduce the error.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The minimum occurs where <em>E&apos;(w)&nbsp;=&nbsp;0</em>: solve 6w&nbsp;+&nbsp;2&nbsp;=&nbsp;0
          → w&nbsp;=&nbsp;−1/3. That is the exact bottom of the bowl, found using nothing
          but the rules above.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We add the polynomial error function to calculus.py and use our
          numerical_derivative tool to confirm the power-rule algebra — then solve
          for the minimum by finding where the derivative equals zero.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="calculus.py"
        caption="Power rule verified numerically; the minimum is found by solving E&apos;(w) = 0."
        code={`# --- continued from Step 3 ---
# numerical_derivative(f, x, h=1e-6) is already defined above.

# Our polynomial error function from the worked example
# E(w) = 3w^2 + 2w + 5
# By the power rule + sum rule:  E'(w) = 6w + 2
def poly_error(w):
    return 3 * w**2 + 2 * w + 5   # three terms, each differentiated independently

# The analytical derivative we derived by hand
def poly_error_derivative(w):
    # Power rule on 3w^2  -> 6w
    # Power rule on 2w    -> 2   (w^1, exponent drops to w^0 = 1, times coeff 2)
    # Constant rule on 5  -> 0
    return 6 * w + 2

# Verify at w = 1
w_check = 1.0
numerical  = numerical_derivative(poly_error, w_check)
analytical = poly_error_derivative(w_check)
print(f"Numerical  E'({w_check}): {numerical:.6f}")   # ~8.000006
print(f"Analytical E'({w_check}): {analytical:.6f}")  # 8.000000
# Tiny gap comes from h=1e-6 being finite, not truly zero

# Find the exact minimum: set E'(w) = 0 and solve algebraically
# 6w + 2 = 0  =>  w = -2/6 = -1/3
w_min = -2 / 6
print(f"Minimum at w = {w_min:.6f}")          # -0.333333
print(f"E at minimum = {poly_error(w_min):.6f}")  # the lowest possible error value`}
      />
    </div>
  );
}
