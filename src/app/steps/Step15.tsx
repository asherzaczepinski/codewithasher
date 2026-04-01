'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step15() {
  return (
    <div>
      <ExplanationBox title="The Problem: We Have Loss, But Now What?">
        <p>
          We computed the loss — a single number like 0.27 that tells us how wrong the network is.
          But that alone doesn&apos;t tell us how to fix anything. Our network has dozens of weights.
          Should each one go up or down? By how much?
        </p>
        <p>
          That&apos;s the question a <strong>gradient</strong> answers. For each weight, the gradient
          is just: <em>&quot;if I increase this weight by a tiny amount, does the loss go up or down — and by how much?&quot;</em>
        </p>
        <p>
          If increasing a weight makes the loss go down, the gradient is negative — so we should increase it.
          If increasing a weight makes the loss go up, the gradient is positive — so we should decrease it.
          The gradient is our compass.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Chain of Events Inside a Neuron">
        <p>
          Here&apos;s why figuring this out isn&apos;t trivial. A weight doesn&apos;t directly control the loss.
          It controls a chain of things:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2.2' }}>
          <li><strong>weight</strong> controls the <strong>weighted sum</strong> (add up inputs × weights + bias)</li>
          <li><strong>weighted sum</strong> controls the <strong>neuron output</strong> (sigmoid squashes it to 0–1)</li>
          <li><strong>neuron output</strong> controls the <strong>loss</strong> (how far off we are)</li>
        </ol>
        <p style={{ marginTop: '1rem' }}>
          To find how much a weight affects the loss, we need to trace that chain. Each link in the
          chain has its own rate of change, and we multiply them all together to get the total effect.
          That&apos;s the chain rule — and it&apos;s the only math trick we need here.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 1: How Does Loss Change When the Output Changes?">
        <p>
          Our loss formula is: <strong>loss = (prediction - target)²</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          If we nudge the prediction up by a tiny amount, the loss changes by: <strong>2 × (prediction - target)</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Call that the <strong>loss gradient</strong>. It&apos;s just the error, doubled.
        </p>
        <ul style={{ marginTop: '0.75rem', lineHeight: '1.8' }}>
          <li>Prediction = 0.7, target = 1.0 → error = −0.3 → loss gradient = 2 × (−0.3) = <strong>−0.6</strong></li>
          <li>Negative means: increasing the prediction would reduce the loss. Good — prediction is too low.</li>
        </ul>
        <ul style={{ marginTop: '0.5rem', lineHeight: '1.8' }}>
          <li>Prediction = 1.3, target = 1.0 → error = +0.3 → loss gradient = 2 × (0.3) = <strong>+0.6</strong></li>
          <li>Positive means: increasing the prediction would increase the loss. Bad — prediction is too high.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Step 2: How Does the Output Change When the Weighted Sum Changes?">
        <p>
          The neuron&apos;s output = sigmoid(weighted sum). If we nudge the weighted sum up a tiny amount,
          how much does the output change?
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The answer: <strong>output × (1 − output)</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That&apos;s it. Multiply the output by one minus the output. Call this the <strong>sigmoid gradient</strong>.
        </p>
        <ul style={{ marginTop: '0.75rem', lineHeight: '1.8' }}>
          <li>Output = 0.7 → sigmoid gradient = 0.7 × (1 − 0.7) = 0.7 × 0.3 = <strong>0.21</strong></li>
          <li>Output = 0.354 → sigmoid gradient = 0.354 × (1 − 0.354) = 0.354 × 0.646 = <strong>0.229</strong></li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Notice: the closer the output is to 0.5, the larger this number gets (max is 0.25 at output = 0.5).
          The closer it is to 0 or 1, the smaller it gets — sigmoid is nearly flat at the extremes,
          so nudging the weighted sum barely moves the output.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Combining the Two: Total Effect on Loss">
        <p>
          Now we multiply the two gradients together. This gives us how much the loss changes
          when we nudge the <em>weighted sum</em> up:
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>total gradient = loss gradient × sigmoid gradient</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Why multiply? Because the effects chain: nudging the weighted sum by 1 moves the output
          by (sigmoid gradient), and moving the output by 1 moves the loss by (loss gradient).
          So nudging the weighted sum by 1 moves the loss by both multiplied together.
        </p>
      </ExplanationBox>

      <WorkedExample title="Full Example: Rain Network Output Neuron">
        <p>Prediction = 0.7, target = 1.0 (it rained but we said 70%)</p>

        <p style={{ marginTop: '1rem' }}><strong>Step 1: Loss gradient</strong></p>
        <CalcStep number={1}>error = prediction - target = 0.7 - 1.0 = -0.3</CalcStep>
        <CalcStep number={2}>loss_gradient = 2 × error = 2 × (-0.3) = -0.6</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step 2: Sigmoid gradient</strong></p>
        <CalcStep number={3}>sigmoid_gradient = output × (1 - output)</CalcStep>
        <CalcStep number={4}>sigmoid_gradient = 0.7 × (1 - 0.7) = 0.7 × 0.3 = 0.21</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step 3: Total gradient on the weighted sum</strong></p>
        <CalcStep number={5}>total_gradient = loss_gradient × sigmoid_gradient</CalcStep>
        <CalcStep number={6}>total_gradient = -0.6 × 0.21 = -0.126</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          <strong>What this tells us:</strong> if we increase the weighted sum, the loss goes down
          (negative gradient). The network needs its weighted sum to be higher to push prediction above 0.7.
        </p>
      </WorkedExample>

      <ExplanationBox title="One More Step: From Weighted Sum to Actual Weights">
        <p>
          We know how the loss changes with the <em>weighted sum</em>. But we need to know how it
          changes with each individual <em>weight</em>.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The weighted sum = (input₁ × weight₁) + (input₂ × weight₂) + bias
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          If we increase weight₁ by a tiny amount, the weighted sum increases by input₁ × that amount.
          So the weight&apos;s gradient is just:
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>weight gradient = total_gradient × the input that weight connects to</strong>
        </p>
        <ul style={{ marginTop: '0.75rem', lineHeight: '1.8' }}>
          <li>total_gradient = −0.126, input to that weight = 0.589</li>
          <li>weight_gradient = −0.126 × 0.589 = <strong>−0.074</strong></li>
          <li>Negative → increase this weight → output goes up → loss goes down.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="This Works for Every Weight in the Network">
        <p>
          We just figured out the gradient for one weight in the output neuron. The network has
          many more weights — in hidden layer 2, hidden layer 1. For those, the chain is longer
          (the error has to travel back through more layers), but the math is exactly the same:
          multiply the gradients at each step.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That backward-traveling process is <strong>backpropagation</strong>. It&apos;s just this
          same chain rule applied layer by layer, starting at the output and working back to the
          first hidden layer. Next step covers that in full.
        </p>
      </ExplanationBox>
    </div>
  );
}
