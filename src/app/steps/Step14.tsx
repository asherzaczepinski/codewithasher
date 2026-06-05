'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';


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

      <ExplanationBox title="A quick example: the rain forecast">
        <p>
          Say the network predicts a <strong>0.7</strong> chance of rain, and it actually
          rained that day, so the target is <strong>1.0</strong>. Plug it in:
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          error = 0.7 − 1.0 = <strong>−0.3</strong><br />
          loss = (−0.3)² = <strong>0.09</strong>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          That <strong>0.09</strong> is the final answer — one number telling us how wrong the
          network was. If it had predicted <strong>0.9</strong> instead, the loss would be
          (−0.1)² = <strong>0.01</strong>, nine times smaller. The closer the guess, the smaller
          the loss.
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
          <li>A way to assign blame to every weight in the network — the slope that says which direction to move it (backpropagation)</li>
          <li>A method to actually update the weights (gradient descent)</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          The next step is backpropagation — it works out, for every weight, the slope that tells us
          whether to turn it up or down to shrink the loss.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The loss function is a single arithmetic expression. Writing it as a function makes it easy to call from the training loop and from tests.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="neural_network.py"
        caption="loss() returns a single positive number measuring how wrong the network was on one prediction."
        code={`# --- Step 7: Loss function ---
# The loss tells us how wrong a prediction is.  We want this number to be
# as small as possible -- ideally zero (perfect prediction).
#
# We use the "half squared error" form: 0.5 * (pred - target)^2
# The 0.5 is just a convenience factor -- it cancels a 2 that appears when
# we compute the gradient later, keeping the math clean.  It does NOT change
# which direction the weights need to move.

def loss(pred, target):
    error = pred - target       # positive if we over-predicted, negative if under
    return 0.5 * error ** 2     # always non-negative; larger = worse prediction

# Example: network predicted 0.7 but it actually rained (target = 1.0)
pred   = 0.7
target = 1.0

current_loss = loss(pred, target)
# = 0.5 * (0.7 - 1.0)^2
# = 0.5 * (-0.3)^2
# = 0.5 * 0.09 = 0.045

# If instead we had predicted 0.9:
# loss(0.9, 1.0) = 0.5 * 0.01 = 0.005  -- nine times smaller, much better!

# The gradient of this loss with respect to the output is simply (pred - target).
# That single number is where backpropagation starts in the next step.`}
      />

    </div>
  );
}
