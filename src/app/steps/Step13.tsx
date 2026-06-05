'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step13() {
  return (
    <div>
<ExplanationBox title="Assembling the Complete Neuron">
        <p>
          We&apos;ve now seen all the individual pieces. Putting them together gives us a complete
          neuron — this single recipe captures everything we&apos;ve learned about how a neuron
          processes information.
        </p>
        <p>
          A complete neuron does three things in sequence:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Computes the weighted sum</strong> — dot product of inputs and weights</li>
          <li><strong>Adds the bias</strong> — shifts the decision threshold</li>
          <li><strong>Applies the activation</strong> — sigmoid converts to probability</li>
        </ol>
      </ExplanationBox>

      <MathFormula label="The Complete Neuron">
        output = sigmoid( (inputs · weights) + bias )
      </MathFormula>

      <ExplanationBox title="Three Steps, Stacked">
        <p>
          Notice how the neuron is really just three small steps, each feeding the next — one
          step&apos;s output becomes the next step&apos;s input. That nesting is exactly how neural
          networks are structured at every scale:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>the weighted sum</strong> — combine the inputs</li>
          <li><strong>add the bias</strong> — shift the threshold</li>
          <li><strong>the activation</strong> — squish the total into a confidence</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Stack those three and you get a <strong>neuron</strong>. Later, neurons stack into{' '}
          <strong>layers</strong>, and layers stack into <strong>networks</strong>. Each level builds
          on the one below it.
        </p>
      </ExplanationBox>

      <WorkedExample title="Complete Neuron Calculation">
        <p>Let&apos;s trace through the Cool Moisture neuron([0.7, 0.8], [−4, +4], −1):</p>

        <CalcStep number={1}>
          <strong>Inputs:</strong> [temperature=0.7, humidity=0.8]
        </CalcStep>
        <CalcStep number={2}>
          <strong>Weights:</strong> [−4, +4]
        </CalcStep>
        <CalcStep number={3}>
          <strong>Bias:</strong> −1
        </CalcStep>
        <CalcStep number={4}>
          <strong>Dot product:</strong> (0.7 × −4) + (0.8 × 4) = −2.8 + 3.2 = 0.4
        </CalcStep>
        <CalcStep number={5}>
          <strong>Add bias:</strong> z = 0.4 + (−1) = −0.6
        </CalcStep>
        <CalcStep number={6}>
          <strong>Sigmoid:</strong> sigmoid(−0.6) ≈ 1/(1 + e^0.6) ≈ 0.354
        </CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Final output: 0.354 (≈35% confidence — correctly quiet on a warm humid day)
        </p>
      </WorkedExample>

      <ExplanationBox title="From Neuron to Network">
        <p>
          Nice — you&apos;ve now seen a complete artificial neuron from scratch, the fundamental
          unit of all neural networks. A single neuron can learn simple patterns: &quot;humid = rain.&quot;
        </p>
        <p>
          But real weather prediction (and most interesting problems) requires more complexity.
          In the next steps, we&apos;ll:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li>See how neurons form <strong>layers</strong> — many working in parallel</li>
          <li>Watch layers connect into <strong>networks</strong></li>
          <li>Follow <strong>forward propagation</strong> — data flowing through the network</li>
          <li>Meet <strong>loss functions</strong> — measuring how wrong a prediction is</li>
          <li>Trace <strong>backpropagation</strong> — how the network improves</li>
        </ol>
      </ExplanationBox>

    </div>
  );
}
