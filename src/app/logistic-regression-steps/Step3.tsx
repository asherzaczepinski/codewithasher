'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Sigmoid Function">
        <p>
          The sigmoid (also called the <strong>logistic function</strong>) is a mathematical curve
          that takes any real number and squashes it into the open interval (0, 1). No matter how
          large or small the input, the output is always a valid probability.
        </p>
      </ExplanationBox>

      <MathFormula label="Sigmoid formula">
        σ(z) = 1 / (1 + e^(−z))
      </MathFormula>

      <ExplanationBox title="Understanding the Shape">
        <p>
          Think of the sigmoid as an S-shaped ramp:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>When z is a <strong>very large positive number</strong> (e.g., +10), e^(−z) ≈ 0,
            so σ(z) ≈ 1/(1+0) = <strong>1</strong>. High confidence of spam.</li>
          <li>When z = <strong>0</strong>, e^0 = 1, so σ(0) = 1/(1+1) = <strong>0.5</strong>.
            Maximum uncertainty — the model has no idea.</li>
          <li>When z is a <strong>very large negative number</strong> (e.g., −10), e^(−z) is enormous,
            so σ(z) ≈ <strong>0</strong>. High confidence of not spam.</li>
        </ul>
        <p>
          The curve is smooth and differentiable everywhere, which is exactly what gradient
          descent needs. It never quite reaches 0 or 1 — it approaches them asymptotically —
          so the model always maintains a sliver of uncertainty rather than claiming perfect certainty.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why e?">
        <p>
          The number e ≈ 2.718 is the natural base for exponential growth and decay.
          One key property: the derivative of e^z is simply e^z itself. That self-referential
          derivative makes the math of training logistic regression unusually clean — the gradient
          formulas simplify to something almost elegant, as we&apos;ll see in the Training module.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing σ for Our Spam Emails">
        <p>
          Recall from the last module: with weights w₁ = 0.4, w₂ = 0.3, b = −1.0 we got
          three raw scores. Let&apos;s apply σ to each.
        </p>
        <CalcStep number={1}>
          Legitimate email: z = −0.6 → σ(−0.6) = 1 / (1 + e^0.6) = 1 / (1 + 1.822) ≈ <strong>0.354</strong>
        </CalcStep>
        <CalcStep number={2}>
          The model outputs 35.4% probability of spam — it leans toward &quot;not spam,&quot; which is correct.
        </CalcStep>
        <CalcStep number={3}>
          Borderline email: z = 1.0 → σ(1.0) = 1 / (1 + e^(−1)) = 1 / (1 + 0.368) ≈ <strong>0.731</strong>
        </CalcStep>
        <CalcStep number={4}>
          73.1% probability of spam — the model is fairly confident this is spam.
        </CalcStep>
        <CalcStep number={5}>
          Heavy spam: z = 10.0 → σ(10.0) = 1 / (1 + e^(−10)) ≈ 1 / (1 + 0.0000454) ≈ <strong>0.9999546</strong>
        </CalcStep>
        <CalcStep number={6}>
          99.995% probability of spam — near-certain. And crucially, still a valid probability, not 1000%.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          All three outputs are now meaningful, bounded, and comparable. The sigmoid transformed
          an arbitrary score into something we can interpret and train on.
        </p>
      </WorkedExample>

    </div>
  );
}
