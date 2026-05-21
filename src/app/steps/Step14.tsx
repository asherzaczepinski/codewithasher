'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';


export default function Step16() {
  return (
    <div>

      <ExplanationBox title="Measuring Error: The Loss Function">
        <p>
          To train a neural network, we need to know <strong>how wrong it is</strong>. This is
          what the loss function (also called cost function or error function) measures. It
          takes the network&apos;s prediction and the correct answer (target) and returns a single
          number representing how bad the prediction was.
        </p>
        <p>
          A good loss function has these properties:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>Returns 0 when prediction equals target (perfect)</li>
          <li>Returns larger values for worse predictions</li>
          <li>Is differentiable (we need to compute gradients)</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Mean Squared Error (MSE)">
        Loss = (prediction - target)²
      </MathFormula>

      <ExplanationBox title="Why Squared Error?">
        <p>
          We could just use <code>|prediction - target|</code> (absolute difference), but we
          square it instead. Here&apos;s why:
        </p>
        <p>
          <strong>1. Makes all errors positive:</strong> Whether we overshoot (prediction &gt; target)
          or undershoot (prediction &lt; target), squaring gives a positive number. We don&apos;t want
          errors to cancel out.
        </p>
        <p>
          <strong>2. Penalizes large errors more:</strong> An error of 0.1 gives loss 0.01, but an
          error of 0.5 gives loss 0.25 (25x worse, not 5x). This pushes the network hard to fix
          big mistakes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Loss Over the Whole Dataset">
        <p>
          We have many training days — each with weather inputs and a known rain outcome.
          We compute loss for each one and average them:
        </p>
        <pre style={{
          background: 'var(--bg-code)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
{`total_loss = 0
for each (inputs, target) in training_data:
    prediction = forward(inputs)
    total_loss += mse_loss(prediction, target)
average_loss = total_loss / len(training_data)`}
        </pre>
        <p style={{ marginTop: '1rem' }}>
          This average loss tells us how well the network is doing overall. Training aims
          to minimize this average.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Training Objective">
        <p>
          We now have:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>✓ Forward pass - compute predictions from inputs</li>
          <li>✓ Loss function - measure how wrong predictions are</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          What we need next:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>A way to know which direction to change weights (derivatives)</li>
          <li>A way to propagate error backward through layers (chain rule)</li>
          <li>A method to actually update the weights (gradient descent)</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          The next step introduces derivatives - the mathematical tool that tells us how
          changing a weight affects the loss.
        </p>
      </ExplanationBox>

    </div>
  );
}
