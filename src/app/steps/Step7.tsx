'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
<ExplanationBox title="Putting It All Together">
        <p>
          The <strong>pre-activation</strong> (also called <strong>z</strong>) is simply the result of
          combining inputs, weights, and bias — multiply each input by its weight, add them up,
          then add the bias.
        </p>
        <p>
          This value z tells us the neuron&apos;s &quot;raw signal&quot; before we convert it to a confidence
          level. A big positive z means the neuron is leaning toward &quot;yes, rain&quot; — a big negative
          z means it&apos;s leaning toward &quot;no rain.&quot;
        </p>
      </ExplanationBox>

      <MathFormula label="Pre-activation (z)">
        z = (input₁ × weight₁) + (input₂ × weight₂) + bias
      </MathFormula>

      <ExplanationBox title="The Dot Product">
        <p>
          The &quot;multiply each pair and add them up&quot; part of this formula has a name:
          the <strong>dot product</strong>. It takes two lists — inputs and weights — and turns
          them into a single number.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So pre-activation is really just: <em>dot product of inputs and weights, plus bias</em>.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The dot product shows up everywhere in neural networks — every neuron uses it to combine
          inputs and weights into a single number that determines the neuron&apos;s confidence.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing z Step by Step">
        <p>Let&apos;s calculate z for our Cool Moisture neuron:</p>

        <CalcStep number={1}>Inputs: temperature = 0.7, humidity = 0.8</CalcStep>
        <CalcStep number={2}>Weights: w_temp = −4, w_humid = +4</CalcStep>
        <CalcStep number={3}>Bias: −1</CalcStep>
        <CalcStep number={4}>Temperature contribution: 0.7 × −4 = −2.8</CalcStep>
        <CalcStep number={5}>Humidity contribution: 0.8 × 4 = 3.2</CalcStep>
        <CalcStep number={6}>Weighted sum (dot product): −2.8 + 3.2 = 0.4</CalcStep>
        <CalcStep number={7}>Add bias: z = 0.4 + (−1) = −0.6</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Our pre-activation is <strong>z = −0.6</strong>. This slightly negative number means the Cool Moisture
          neuron is leaning away from firing on this warm, humid day — which makes sense, since it&apos;s looking
          for cool conditions. But what does −0.6 actually mean as a confidence? That&apos;s why we need an activation function next.
        </p>
      </WorkedExample>

    </div>
  );
}
