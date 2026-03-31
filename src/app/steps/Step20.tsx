'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step20() {
  return (
    <div>
      <p>
        <strong>Where we are:</strong> Backpropagation told us which direction to nudge each weight to improve
        our rain network&apos;s confidence. Now we actually apply those nudges — this is gradient descent.
        After many rounds of predict → measure error → compute gradients → update weights, the network
        learns to output accurate rain confidence levels.
      </p>

      <ExplanationBox title="Gradient Descent: The Learning Algorithm">
        <p>
          We now know the gradient (direction of steepest increase in loss) for each weight.
          <strong>Gradient descent</strong> is the algorithm that uses this information to
          update weights: we step in the <em>opposite</em> direction of the gradient to reduce loss.
        </p>
        <p>
          Think of it like rolling a ball downhill. The gradient tells us which way is &quot;up&quot;
          (increasing loss), so we go the opposite way (decreasing loss).
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient Descent Update">
        w_new = w_old - learning_rate × gradient
      </MathFormula>

      <ExplanationBox title="Why Subtract?">
        <p>
          The gradient points in the direction that <em>increases</em> the loss. But we want
          to <em>decrease</em> the loss, so we go the opposite direction - that&apos;s why we subtract.
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>Positive gradient → weight too high → subtract to decrease</li>
          <li>Negative gradient → weight too low → subtracting negative = add to increase</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          The math works out perfectly: subtracting the gradient always moves toward lower loss.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Learning Rate">
        <p>
          The <strong>learning rate</strong> controls how big each step is:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li><strong>Too small (0.001)</strong>: Very slow learning, might get stuck</li>
          <li><strong>Too large (10.0)</strong>: Steps overshoot, loss oscillates wildly</li>
          <li><strong>Just right (0.1-1.0)</strong>: Smooth, steady improvement</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          Finding a good learning rate is part art, part science. Common values range from
          0.0001 to 1.0 depending on the problem.
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain example:</strong> If the learning rate is too high, our rain neuron&apos;s confidence might
        jump from 65% to 120% (impossible!) and then back to 30% — bouncing wildly and never settling.
        If it&apos;s too small, it might creep from 65% to 65.01% to 65.02% — taking forever to reach the
        correct 95%. A good learning rate gets us there smoothly: 65% → 72% → 80% → 88% → 93% → 95%.
      </p>

      <WorkedExample title="Single Weight Update">
        <p>Weight = 0.8, gradient = -0.088, learning_rate = 0.5:</p>

        <CalcStep number={1}>Current weight: w = 0.8</CalcStep>
        <CalcStep number={2}>Gradient: ∂L/∂w = -0.088 (negative = weight too low)</CalcStep>
        <CalcStep number={3}>Learning rate: lr = 0.5</CalcStep>
        <CalcStep number={4}>Update: w = 0.8 - (0.5 × -0.088)</CalcStep>
        <CalcStep number={5}>w = 0.8 - (-0.044) = 0.8 + 0.044 = 0.844</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The weight increased from 0.8 to 0.844. Since the gradient was negative (weight too low),
          subtracting the negative value increased the weight. Perfect!
        </p>
      </WorkedExample>

      <ExplanationBox title="The Training Loop">
        <p>
          Training repeats this process many times:
        </p>
        <pre style={{
          background: 'var(--bg-code)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
{`for epoch in range(num_epochs):
    for (input, target) in training_data:
        # Forward pass
        output = forward(input)

        # Backward pass
        gradients = backward(...)

        # Update weights
        for each weight, gradient:
            weight = weight - learning_rate * gradient

    print(f"Epoch {epoch}, Loss: {total_loss}")`}
        </pre>
        <p style={{ marginTop: '1rem' }}>
          One pass through all training data is called an &quot;epoch.&quot; Training typically
          runs for hundreds or thousands of epochs until the loss stops improving.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You've Built All the Pieces!">
        <p>
          You now have everything needed to train a neural network:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>✓ Forward propagation (compute predictions)</li>
          <li>✓ Loss function (measure error)</li>
          <li>✓ Backpropagation (compute gradients)</li>
          <li>✓ Gradient descent (update weights)</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Congratulations!">
        <p>
          You&apos;ve completed this neural network tutorial! You now understand:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>How neural networks represent and process data</li>
          <li>What weights and biases do</li>
          <li>Why we need activation functions like sigmoid</li>
          <li>How loss functions measure error</li>
          <li>How backpropagation computes gradients</li>
          <li>How gradient descent updates weights to learn</li>
        </ul>
        <p style={{ marginTop: '1rem' }}>
          These same principles power everything from image recognition to language models.
          The networks get bigger and the math gets more complex, but the core ideas remain
          exactly what you&apos;ve learned here.
        </p>
      </ExplanationBox>

      <p>
        <strong>The full journey:</strong> We started with raw weather data and built everything from scratch —
        normalization (28°C → 0.7), weights (−4 on temp, +4 on humidity), bias (starting lean), sigmoid (z = −0.6 → ≈35%
        confidence), networks (many neurons, many layers), loss (measuring how wrong), backpropagation
        (tracing the error backward), and gradient descent (fixing the weights). Every neuron in every layer
        outputs a confidence level, and training adjusts all the weights until those confidences are accurate.
        That&apos;s neural networks — from a single rain neuron to the same principles powering modern AI.
      </p>
    </div>
  );
}
