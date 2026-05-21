'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step19() {
  return (
    <div>

      <ExplanationBox title="Backpropagation: The Complete Algorithm">
        <p>
          <strong>Backpropagation</strong> is the algorithm that makes neural network training
          possible. It efficiently computes how each weight in the network affects the final
          loss, allowing us to update all weights to improve performance.
        </p>
        <p>
          The key insight: we compute derivatives in reverse order, from output back to input.
          Each layer&apos;s delta is computed using the delta from the layer ahead of it.
        </p>
      </ExplanationBox>

      <MathFormula label="Backpropagation Flow">
        Loss → Output Delta → Hidden Deltas → Weight Gradients
      </MathFormula>

      <ExplanationBox title="The Algorithm Step by Step">
        <p>For our 2-hidden-layer network (input → hidden1 → hidden2 → output):</p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2.2' }}>
          <li>
            <strong>Forward pass</strong>: Compute all activations, storing z and a for each layer
          </li>
          <li>
            <strong>Output delta</strong>: δ_out = (prediction - target) × sigmoid&apos;(z_out)
          </li>
          <li>
            <strong>Hidden2 deltas</strong>: δ_h2[i] = (δ_out × w₃[i]) × sigmoid&apos;(z_h2[i])
          </li>
          <li>
            <strong>Hidden1 deltas</strong>: δ_h1[i] = (Σ δ_h2[j] × w₂[j][i]) × sigmoid&apos;(z_h1[i])
          </li>
          <li>
            <strong>Compute gradients</strong>: Each layer&apos;s gradient = delta × previous activation
          </li>
        </ol>
      </ExplanationBox>

      <WorkedExample title="Full Backprop Example">
        <p>Network: 2 inputs → 3 hidden → 3 hidden → 1 output. Input [0.5, 0.8], target = 1.0</p>

        <p style={{ marginTop: '1rem' }}><strong>Forward pass (stored values):</strong></p>
        <CalcStep number={1}>z_h1 = [0.78, -0.30, 0.79], a_h1 = [0.686, 0.426, 0.688]</CalcStep>
        <CalcStep number={2}>z_h2 = [0.36, 0.18, 0.91], a_h2 = [0.589, 0.545, 0.713]</CalcStep>
        <CalcStep number={3}>z_out = 0.856, a_out = 0.702</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Output layer backward:</strong></p>
        <CalcStep number={4}>error = 0.702 - 1.0 = -0.298</CalcStep>
        <CalcStep number={5}>δ_out = -0.298 × sigmoid&apos;(0.856) = -0.298 × 0.209 = -0.062</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Hidden layer 2 backward:</strong></p>
        <CalcStep number={6}>δ_h2[0] = δ_out × w₃[0] × sigmoid&apos;(z_h2[0]) = -0.062 × 0.4 × 0.242 = -0.006</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Hidden layer 1 backward:</strong></p>
        <CalcStep number={7}>δ_h1[0] = (Σ δ_h2[j] × w₂[j][0]) × sigmoid&apos;(z_h1[0])</CalcStep>
        <CalcStep number={8}>Each δ propagates back through all connections to the previous layer</CalcStep>
      </WorkedExample>

      <ExplanationBox title="Why Backward?">
        <p>
          We compute backwards because of efficiency. To find how a weight in hidden layer 1
          affects the loss, we need to know how hidden layer 2&apos;s output affects the loss first,
          which requires knowing how the output layer affects loss. The chain rule naturally
          flows backward: each delta depends on the deltas ahead of it.
        </p>
        <p style={{ marginTop: '1rem' }}>
          This backward flow is why it&apos;s called &quot;back&quot;-propagation! The error signal
          propagates from the output back through hidden layer 2, then hidden layer 1.
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain analogy:</strong> Our network predicted 70% rain confidence but it actually rained
        (target = 100%). Backprop asks: &quot;Who&apos;s responsible for being 30% off?&quot; It starts at the
        output neuron, figures out how much the output layer&apos;s weights contributed, then traces back to
        hidden layer 2 (&quot;how much did your confidence levels contribute?&quot;), then hidden layer 1.
        Each neuron gets an &quot;error signal&quot; proportional to how much it was responsible.
      </p>

      <ExplanationBox title="Storing Values During Forward Pass">
        <p>
          Notice that backprop needs values from the forward pass (z values and activations).
          In practice, we store these during forward pass so they&apos;re available for backward.
          This is why neural networks use significant memory during training.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You've Implemented Backpropagation!">
        <p>
          Congratulations! You just implemented the core algorithm that trains all neural networks.
          Every time you use ChatGPT, image recognition, or any ML model - this same algorithm
          (with optimizations) computed all the weight updates during training.
        </p>
        <p>
          The gradients tell us which direction to adjust each weight. Now we need to actually
          <em> apply</em> these updates. That&apos;s gradient descent - the final piece!
        </p>
      </ExplanationBox>

    </div>
  );
}
