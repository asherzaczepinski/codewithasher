'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="More Than One Input">
        <p>
          So far our error has depended on a single weight <em>w</em>. Real models have
          many parameters — maybe millions. The error is a function of all of them at once:{' '}
          <em>E(w₁, w₂, w₃, …)</em>. We can no longer draw the error as a simple
          bowl-shaped curve; it&apos;s a high-dimensional surface.
        </p>
        <p>
          To handle this, we need to differentiate with respect to each parameter{' '}
          <em>separately</em>, treating every other parameter as a constant. This is
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

    </div>
  );
}
