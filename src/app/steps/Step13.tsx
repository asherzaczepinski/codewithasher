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
        output = sigmoid(dot_product(inputs, weights) + bias)
      </MathFormula>

      <ExplanationBox title="Function Composition">
        <p>
          Notice how we&apos;re composing (combining) smaller functions to build larger ones. This is
          a fundamental programming pattern called <strong>function composition</strong>, and it&apos;s
          exactly how neural networks are structured:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><code>dot_product</code> — a mathematical operation</li>
          <li><code>+ bias</code> — a simple addition</li>
          <li><code>sigmoid</code> — the activation function</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          By combining these, we get <code>neuron</code> — a higher-level abstraction. Later,
          we&apos;ll combine neurons into <code>layers</code>, and layers into <code>networks</code>.
          Each level builds on the previous one.
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
          Congratulations! You&apos;ve built a complete artificial neuron from scratch — the fundamental
          unit of all neural networks. A single neuron can learn simple patterns: &quot;humid = rain.&quot;
        </p>
        <p>
          But real weather prediction (and most interesting problems) requires more complexity.
          In the next steps, we&apos;ll:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li>Build <strong>layers</strong> — multiple neurons working in parallel</li>
          <li>Connect layers to form <strong>networks</strong></li>
          <li>Implement <strong>forward propagation</strong> — data flowing through the network</li>
          <li>Add <strong>loss functions</strong> — measuring prediction accuracy</li>
          <li>Learn <strong>backpropagation</strong> — teaching the network to improve</li>
        </ol>
      </ExplanationBox>

    </div>
  );
}
