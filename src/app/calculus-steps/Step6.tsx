'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="More Than One Input">
        <p>
          So far our error has depended on a single weight <em>w</em>. Real models have
          many parameters — maybe millions. The error is a function of all of them at once:
          <em> E(w₁, w₂, w₃, …)</em>. We can no longer draw the error as a simple
          bowl-shaped curve; it&apos;s a high-dimensional surface.
        </p>
        <p>
          To handle this, we need to differentiate with respect to each parameter
          <em> separately</em>, treating every other parameter as a constant. This is
          called a <strong>partial derivative</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Idea: Hold Everything Else Constant">
        <p>
          Imagine you are standing on a hilly terrain and you want to know how steep it is
          in the east-west direction. You face east and measure the slope — completely
          ignoring north-south changes. That is a partial derivative with respect to the
          east-west axis.
        </p>
        <p>
          Computationally, you differentiate using all the same rules (power rule, sum
          rule, chain rule) but treat every variable except the one you&apos;re targeting
          as a plain constant. Constants vanish or simplify just as they always do.
        </p>
      </ExplanationBox>

      <MathFormula label="Partial Derivative Notation">
        ∂f/∂x — &quot;partial f with respect to x&quot;
      </MathFormula>

      <ExplanationBox title="The ∂ Symbol">
        <p>
          The curly-d symbol ∂ (read &quot;partial&quot;) signals that the function has
          multiple variables and you are differentiating with respect to just one.
          Everything else is treated as a constant — that is the only difference from an
          ordinary derivative.
        </p>
      </ExplanationBox>

      <WorkedExample title="Partial Derivatives of a Two-Variable Error Function">
        <p>
          Suppose the error surface is <em>E(w₁, w₂)&nbsp;=&nbsp;w₁²&nbsp;+&nbsp;3w₁w₂&nbsp;+&nbsp;2w₂²</em>.
          Compute ∂E/∂w₁ and ∂E/∂w₂.
        </p>

        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Finding ∂E/∂w₁ (treat w₂ as a constant):</p>
        <CalcStep number={1}>
          Differentiate w₁²: power rule → 2w₁.
        </CalcStep>
        <CalcStep number={2}>
          Differentiate 3w₁w₂: w₂ is a constant, so this is (3w₂)·w₁.
          Derivative with respect to w₁ is 3w₂.
        </CalcStep>
        <CalcStep number={3}>
          Differentiate 2w₂²: entirely in w₂, no w₁ — treats as a constant → 0.
        </CalcStep>
        <CalcStep number={4}>
          Sum: ∂E/∂w₁ = 2w₁ + 3w₂.
        </CalcStep>

        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>Finding ∂E/∂w₂ (treat w₁ as a constant):</p>
        <CalcStep number={5}>
          Differentiate w₁²: entirely in w₁ → 0.
        </CalcStep>
        <CalcStep number={6}>
          Differentiate 3w₁w₂: w₁ is a constant, so derivative w.r.t. w₂ is 3w₁.
        </CalcStep>
        <CalcStep number={7}>
          Differentiate 2w₂²: power rule → 2·2w₂ = 4w₂.
        </CalcStep>
        <CalcStep number={8}>
          Sum: ∂E/∂w₂ = 3w₁ + 4w₂.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          At the point (w₁&nbsp;=&nbsp;1, w₂&nbsp;=&nbsp;1): ∂E/∂w₁&nbsp;=&nbsp;5 and
          ∂E/∂w₂&nbsp;=&nbsp;7. The error is rising faster in the w₂ direction, so a
          gradient-descent step should push w₂ down more aggressively than w₁.
          Next module, we package these two partial derivatives into a single
          object — the gradient.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Partial derivatives are computed numerically by perturbing one variable at a
          time and leaving all others fixed — exactly the &quot;hold everything else
          constant&quot; idea from the explanation above.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="calculus.py"
        caption="Partial derivatives computed by nudging each variable independently while freezing the other."
        code={`# --- continued from Step 5 ---

# Two-variable error surface from the worked example:
# E(w1, w2) = w1^2 + 3*w1*w2 + 2*w2^2
def two_var_error(w1, w2):
    return w1**2 + 3 * w1 * w2 + 2 * w2**2

# Partial derivative w.r.t. w1 — perturb w1 by h, hold w2 fixed.
# This is the finite-difference formula applied to one variable at a time.
def partial_w1(f, w1, w2, h=1e-6):
    # Only w1 moves; w2 stays constant — that is the definition of a partial.
    return (f(w1 + h, w2) - f(w1, w2)) / h

# Partial derivative w.r.t. w2 — perturb w2 by h, hold w1 fixed.
def partial_w2(f, w1, w2, h=1e-6):
    return (f(w1, w2 + h) - f(w1, w2)) / h

# Evaluate the partials at the point (w1=1, w2=1)
pt_w1, pt_w2 = 1.0, 1.0

dE_dw1 = partial_w1(two_var_error, pt_w1, pt_w2)
dE_dw2 = partial_w2(two_var_error, pt_w1, pt_w2)

print(f"dE/dw1 at (1,1) = {dE_dw1:.6f}")   # ~5.0  (matches: 2*1 + 3*1 = 5)
print(f"dE/dw2 at (1,1) = {dE_dw2:.6f}")   # ~7.0  (matches: 3*1 + 4*1 = 7)

# dE/dw2 > dE/dw1: the error climbs faster in the w2 direction.
# Gradient descent will therefore take a larger step in the -w2 direction.`}
      />
    </div>
  );
}
