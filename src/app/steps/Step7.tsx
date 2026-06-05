'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';


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

      <ExplanationBox title="In Python">
        <p>
          We can wrap the dot product plus bias into a single reusable function called <code>pre_activation</code> that any neuron in the network can call.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="neural_network.py"
        caption="pre_activation combines the dot product and bias into the raw signal z that the activation function will squash next."
        code={`# --- Step 4: Pre-activation function ---
# The pre-activation (also written z) is the neuron's raw vote before it is
# squeezed into a 0-1 confidence.  It is just: dot product + bias.
#
# We wrap it in a function so we can reuse it cleanly for every neuron.

def pre_activation(inputs, weights, bias):
    # np.dot(inputs, weights) multiplies every (input, weight) pair and sums them.
    # Adding the bias shifts the result up or down by a fixed amount.
    # The return value z can be ANY real number: negative, zero, or very large.
    return np.dot(inputs, weights) + bias

# Example: Cool Moisture neuron on today's weather
# x        = [0.917, 0.8]   (from Step 1 normalization)
# weights  = [-4.0,  4.0]   (from Step 2 -- strong negative on temp, positive on humidity)
# bias     = -1.0            (from Step 3 -- skeptical, needs clear cool+humid signal)

z = pre_activation(x, weights, bias)
# = np.dot([0.917, 0.8], [-4.0, 4.0]) + (-1.0)
# = (0.917 * -4.0 + 0.8 * 4.0) + (-1.0)
# = (-3.668 + 3.2) + (-1.0)
# = -0.468 + (-1.0) = -1.468
#
# A negative z means the neuron is leaning toward "no rain" right now.
# The next step (sigmoid) will convert this raw number into a probability.`}
      />

    </div>
  );
}
