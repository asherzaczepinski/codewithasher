'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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

    </div>
  );
}
