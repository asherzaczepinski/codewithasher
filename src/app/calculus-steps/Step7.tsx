'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Collecting All the Partial Derivatives">
        <p>
          In the previous module we computed a separate partial derivative for each
          parameter. Now we bundle them into one object: the <strong>gradient</strong>.
          The gradient of a function is simply the vector that lists every partial
          derivative — one entry per parameter.
        </p>
        <p>
          If your model has parameters w₁ and w₂, the gradient of the error E is
          written ∇E (the nabla symbol ∇ is read &quot;grad&quot;) and contains
          both partials side by side.
        </p>
      </ExplanationBox>

      <MathFormula label="The Gradient">
        ∇E(w₁, w₂) = [ ∂E/∂w₁,  ∂E/∂w₂ ]
      </MathFormula>

      <ExplanationBox title="The Gradient Points Uphill">
        <p>
          This is the most important geometric fact about the gradient: it points in
          the direction of <strong>steepest increase</strong> of the function. If you
          were standing on the error surface and you stepped in the direction the
          gradient points, you would climb as steeply as possible.
        </p>
        <p>
          For minimizing error we want to go <em>downhill</em>, so we step in the
          <em> opposite</em> direction — we <strong>subtract</strong> a fraction of the
          gradient from the current parameters. This is <strong>gradient descent</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient Descent Update Rule">
        w ← w − η · ∇E(w)
      </MathFormula>

      <ExplanationBox title="What η (Eta) Is">
        <p>
          The symbol η (Greek letter eta, also written α and called the
          <strong> learning rate</strong>) controls how large a step we take. Too large
          and we overshoot the bottom of the bowl and bounce around; too small and
          training takes forever. Choosing a good learning rate is one of the central
          engineering challenges of training neural networks.
        </p>
        <p>
          But the mathematical direction is always the same: subtract the gradient.
          Calculus — specifically partial derivatives collected into a gradient — is
          what makes that direction computable.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Full Gradient Descent Step">
        <p>
          Using the same error surface from the previous module:
          <em> E(w₁, w₂)&nbsp;=&nbsp;w₁²&nbsp;+&nbsp;3w₁w₂&nbsp;+&nbsp;2w₂²</em>.
          Start at (w₁, w₂)&nbsp;=&nbsp;(1, 1) and take one gradient-descent step
          with learning rate η&nbsp;=&nbsp;0.1.
        </p>
        <CalcStep number={1}>
          Recall the partial derivatives: ∂E/∂w₁ = 2w₁ + 3w₂ and ∂E/∂w₂ = 3w₁ + 4w₂.
        </CalcStep>
        <CalcStep number={2}>
          Evaluate at (1, 1): ∂E/∂w₁ = 2(1) + 3(1) = 5. ∂E/∂w₂ = 3(1) + 4(1) = 7.
        </CalcStep>
        <CalcStep number={3}>
          Assemble the gradient vector: ∇E = [5, 7].
        </CalcStep>
        <CalcStep number={4}>
          Apply gradient descent: w₁ ← 1 − 0.1 × 5 = 1 − 0.5 = 0.5.
        </CalcStep>
        <CalcStep number={5}>
          Apply gradient descent: w₂ ← 1 − 0.1 × 7 = 1 − 0.7 = 0.3.
        </CalcStep>
        <CalcStep number={6}>
          Compute error before: E(1,1) = 1 + 3 + 2 = 6.
        </CalcStep>
        <CalcStep number={7}>
          Compute error after: E(0.5, 0.3) = (0.5)² + 3(0.5)(0.3) + 2(0.3)²
          = 0.25 + 0.45 + 0.18 = 0.88.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          In a single step guided by the gradient, the error dropped from
          <strong> 6 to 0.88</strong> — an 85% reduction. Repeat this process
          thousands of times and the model converges to the bottom of the bowl.
          That is gradient descent, and it is built entirely on the calculus you
          have learned in this course: derivatives, the chain rule, and partial
          derivatives assembled into a gradient.
        </p>
      </WorkedExample>

      <ExplanationBox title="You Now Understand the Math Behind Learning">
        <p>
          Every time a neural network trains — on images, language, audio, anything —
          it is running this exact loop: compute the error, compute the gradient
          (via backpropagation and the chain rule), subtract a fraction of the gradient
          from every parameter, repeat. The mathematics you have studied here is the
          complete foundation for all of it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          We complete calculus.py with a general gradient function and one full
          gradient-descent step — the same update rule the worked example computed
          by hand, now running as reusable code.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="calculus.py"
        caption="gradient() assembles all partial derivatives into a vector; one descent step shows the error drop from 6 to 0.88."
        code={`# --- continued from Step 6 ---
# partial_w1 and partial_w2 are defined above; two_var_error is defined above.

import numpy as np   # only for array arithmetic — the math is still pure calculus

# gradient() computes the full gradient vector of f at a given point.
# point is a list/array of parameter values, one per dimension.
# We perturb each coordinate independently (finite differences again),
# which generalises the partial_w1 / partial_w2 helpers to any number of params.
def gradient(f, point, h=1e-6):
    point = np.array(point, dtype=float)   # make a mutable copy
    grad  = np.zeros_like(point)           # one slot per parameter
    for i in range(len(point)):
        # Nudge only dimension i; all other dimensions stay fixed.
        step        = np.zeros_like(point)
        step[i]     = h
        # Rise over run in the i-th direction
        grad[i]     = (f(*(point + step)) - f(*point)) / h
    return grad   # a vector: [dE/dw1, dE/dw2, ...]

# Starting point: (w1=1, w2=1)
params = np.array([1.0, 1.0])

# Compute the gradient at the starting point
grad = gradient(two_var_error, params)
print(f"Gradient at {params}: {grad}")   # [5. 7.] — matches our hand calculation

# One gradient-descent step:  w <- w - eta * gradient
eta    = 0.1
params_new = params - eta * grad
print(f"New params after one step: {params_new}")   # [0.5, 0.3]

# Compare error before and after
error_before = two_var_error(*params)
error_after  = two_var_error(*params_new)
print(f"Error before: {error_before:.4f}")   # 6.0000
print(f"Error after:  {error_after:.4f}")    # 0.8800  — 85% drop in one step!

# In a real neural network this loop runs thousands of times,
# shrinking the error a little with each gradient step until convergence.`}
      />
    </div>
  );
}
