'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';


export default function Step7() {
  return (
    <div>
      <p>
        <strong>Where we are:</strong> Our rain neuron has inputs (temp = 0.7, humidity = 0.8), weights
        (temp = -0.3, humidity = 2.0), and bias (0.1). Now we combine them into one number — the neuron&apos;s
        raw signal before it becomes a confidence level.
      </p>

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
          In code, you&apos;d write it as:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          import numpy as np<br/>
          z = np.dot(inputs, weights) + bias
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The dot product shows up everywhere in neural networks — every neuron uses it to combine
          inputs and weights into a single number that determines the neuron&apos;s confidence.
        </p>
      </ExplanationBox>


      <WorkedExample title="Computing z Step by Step">
        <p>Let&apos;s calculate z with our weather data:</p>

        <CalcStep number={1}>Inputs: temperature = 0.7, humidity = 0.8</CalcStep>
        <CalcStep number={2}>Weights: w_temp = -0.3, w_humid = 2.0</CalcStep>
        <CalcStep number={3}>Bias: 0.1</CalcStep>
        <CalcStep number={4}>Temperature contribution: 0.7 × -0.3 = -0.21</CalcStep>
        <CalcStep number={5}>Humidity contribution: 0.8 × 2.0 = 1.6</CalcStep>
        <CalcStep number={6}>Weighted sum (dot product): -0.21 + 1.6 = 1.39</CalcStep>
        <CalcStep number={7}>Add bias: z = 1.39 + 0.1 = 1.49</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Our pre-activation is <strong>z = 1.49</strong>. This positive number means the neuron is
          leaning toward predicting rain — its confidence will be pulled upward. But what does 1.49
          actually mean? Is that 80% confident? 90%? That&apos;s why we need an activation function next.
        </p>
      </WorkedExample>

      <p>
        <strong>Rain check:</strong> Our rain neuron computed z = 1.49. The positive value tells us
        humidity&apos;s strong signal (1.6) outweighed temperature&apos;s slight pushback (-0.21). But z = 1.49
        isn&apos;t a confidence level yet — we need to squash it into a 0-to-1 range. That&apos;s what the
        <strong> sigmoid function</strong> does next.
      </p>
    </div>
  );
}
