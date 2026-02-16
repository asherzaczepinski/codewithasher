'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';


export default function Step16() {
  return (
    <div>
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem', marginBottom: '20px' }}>
        <strong>Where we are:</strong> We&apos;ve learned each piece separately — normalization, weights, bias,
        and sigmoid. Now we&apos;ll combine them all into one reusable neuron function. For our rain neuron:
        inputs (0.7, 0.8) × weights (-0.3, 2.0) + bias (0.1) → z = 1.49 → sigmoid → ≈82% rain confidence.
      </div>

      <ExplanationBox title="Assembling the Complete Neuron">
        <p>
          We&apos;ve built all the individual pieces. Now it&apos;s time to assemble them into a complete,
          reusable neuron function. This is a milestone — this single function captures everything
          we&apos;ve learned about how a neuron processes information.
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
        <p>Let&apos;s trace through neuron([0.7, 0.8], [-0.3, 2.0], 0.1):</p>

        <CalcStep number={1}>
          <strong>Inputs:</strong> [temperature=0.7, humidity=0.8]
        </CalcStep>
        <CalcStep number={2}>
          <strong>Weights:</strong> [-0.3, 2.0]
        </CalcStep>
        <CalcStep number={3}>
          <strong>Bias:</strong> 0.1
        </CalcStep>
        <CalcStep number={4}>
          <strong>Dot product:</strong> (0.7 × -0.3) + (0.8 × 2.0) = -0.21 + 1.6 = 1.39
        </CalcStep>
        <CalcStep number={5}>
          <strong>Add bias:</strong> z = 1.39 + 0.1 = 1.49
        </CalcStep>
        <CalcStep number={6}>
          <strong>Sigmoid:</strong> sigmoid(1.49) ≈ 1/(1 + e^(-1.49)) ≈ 0.816
        </CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
          Final output: 0.816 (≈82% chance of rain)
        </p>
      </WorkedExample>

      <ExplanationBox title="What Each Parameter Does">
        <p>
          <strong>inputs</strong> — The weather data. For rain prediction: [temperature, humidity].
          Could be any measurements the neuron should consider.
        </p>
        <p>
          <strong>weights</strong> — How important each input is. Learned during training.
          [-0.3, 2.0] means humidity matters much more than temperature.
        </p>
        <p>
          <strong>bias</strong> — The baseline tendency. 0.1 means there&apos;s a slight tendency
          toward predicting rain even with neutral inputs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Trying Different Weights">
        <p>
          By changing weights, the same neuron can learn different patterns:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>weights = [0, 1]</strong> → Only humidity matters</li>
          <li><strong>weights = [1, 0]</strong> → Only temperature matters</li>
          <li><strong>weights = [-1, 0]</strong> → Cold temperatures predict rain</li>
          <li><strong>weights = [0.5, 0.5]</strong> → Both matter equally</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Training a neural network means finding the weights and biases that produce accurate
          predictions. We&apos;ll learn how to do this in later steps!
        </p>
      </ExplanationBox>

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

      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.75rem' }}>
        <strong>Rain check:</strong> Our complete rain neuron takes temperature (0.7) and humidity (0.8),
        weights them (-0.3 and 2.0), adds bias (0.1), and runs sigmoid to output ≈82% rain confidence.
        But one neuron can only detect simple patterns. Next, we&apos;ll connect many neurons into a network
        that can detect complex weather patterns.
      </div>
    </div>
  );
}
