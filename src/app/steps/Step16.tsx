'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';


export default function Step16() {
  return (
    <div>
      <p>
        <strong>Where we are:</strong> Our rain network outputs confidence levels, but with random weights
        they&apos;re wrong — maybe 65% when it should be 95%. We need a way to measure <em>how wrong</em> the
        network is. That&apos;s what the loss function does — it gives us a single number representing the error.
      </p>

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
        <p>
          <strong>3. Smooth derivative:</strong> The derivative of x² is 2x, which is simple and
          smooth. This makes gradient computation easy.
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain example:</strong> Say our network predicts 0.65 rain confidence but it actually rained
        (target = 1.0). Loss = (0.65 - 1.0)² = 0.1225. If it predicted 0.95 instead, loss = (0.95 - 1.0)² = 0.0025
        — almost 50x smaller! The squaring makes the network really want to close that gap.
      </p>

      <WorkedExample title="Computing Loss">
        <CalcStep number={1}>prediction = 0.7, target = 1.0</CalcStep>
        <CalcStep number={2}>error = 0.7 - 1.0 = -0.3</CalcStep>
        <CalcStep number={3}>loss = (-0.3)² = 0.09</CalcStep>

        <p style={{ marginTop: '1rem' }}>Compare to a better prediction:</p>

        <CalcStep number={4}>prediction = 0.9, target = 1.0</CalcStep>
        <CalcStep number={5}>error = 0.9 - 1.0 = -0.1</CalcStep>
        <CalcStep number={6}>loss = (-0.1)² = 0.01</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The second prediction (0.9) has 1/9th the loss of the first (0.7), even though
          the raw error only decreased by a factor of 3. Squaring emphasizes improvement.
        </p>
      </WorkedExample>

      <ExplanationBox title="Loss Over the Whole Dataset">
        <p>
          For XOR, we have 4 training examples. We compute loss for each one and typically
          average them:
        </p>
        <pre style={{
          background: 'var(--bg-code)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
{`total_loss = 0
for each (input, target) in training_data:
    prediction = forward(input)
    total_loss += mse_loss(prediction, target)
average_loss = total_loss / 4`}
        </pre>
        <p style={{ marginTop: '1rem' }}>
          This average loss tells us how well the network is doing overall. Training aims
          to minimize this average.
        </p>
      </ExplanationBox>

      <WorkedExample title="XOR Loss with Random Weights">
        <p>With untrained network outputting ~0.65 for everything:</p>

        <CalcStep number={1}>[0,0]: pred=0.65, target=0, loss=(0.65-0)²=0.4225</CalcStep>
        <CalcStep number={2}>[0,1]: pred=0.65, target=1, loss=(0.65-1)²=0.1225</CalcStep>
        <CalcStep number={3}>[1,0]: pred=0.65, target=1, loss=(0.65-1)²=0.1225</CalcStep>
        <CalcStep number={4}>[1,1]: pred=0.65, target=0, loss=(0.65-0)²=0.4225</CalcStep>
        <CalcStep number={5}>Total: 0.4225+0.1225+0.1225+0.4225=1.09</CalcStep>
        <CalcStep number={6}>Average: 1.09/4 = 0.2725</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          After training, we want average loss near 0. Getting from 0.27 to ~0.01 is what
          training accomplishes!
        </p>
      </WorkedExample>

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

      <p>
        <strong>Progress check:</strong> We can now measure how wrong our rain network&apos;s confidence is. A loss
        near 0 means the network&apos;s confidence matches reality. A high loss means the confidence levels
        are way off. Next, we need to figure out <em>which direction</em> to adjust each weight to make the
        confidence more accurate — that&apos;s what derivatives tell us.
      </p>
    </div>
  );
}
