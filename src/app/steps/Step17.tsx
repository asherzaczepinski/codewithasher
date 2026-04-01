'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step18() {
  return (
    <div>

      <ExplanationBox title="The Chain Rule: Connecting Derivatives">
        <p>
          In our network, the loss depends on the output, which depends on z, which depends
          on weights. These are nested functions:
        </p>
        <pre style={{
          background: 'var(--bg-tertiary)',
          padding: '1rem',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          Loss(sigmoid(weighted_sum(inputs, weights) + bias))
        </pre>
        <p style={{ marginTop: '1rem' }}>
          The <strong>chain rule</strong> tells us how to find the derivative of such
          composed functions: multiply the derivatives of each step together.
        </p>
      </ExplanationBox>

      <MathFormula label="The Chain Rule">
        dL/dz = dL/da × da/dz
      </MathFormula>

      <ExplanationBox title="Understanding the Notation">
        <p>
          The notation <code>dL/dz</code> means &quot;derivative of L with respect to z&quot; or
          &quot;how much does L change when z changes.&quot;
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>L</strong> = Loss (what we want to minimize)</li>
          <li><strong>a</strong> = activation output (after sigmoid)</li>
          <li><strong>z</strong> = pre-activation (weighted sum + bias)</li>
          <li><strong>dL/da</strong> = how loss changes with activation (MSE derivative)</li>
          <li><strong>da/dz</strong> = how activation changes with z (sigmoid derivative)</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Chain Rule in Action">
        <p>Let&apos;s compute dL/dz for prediction = 0.7, target = 1.0, z = 0.847:</p>

        <p style={{ marginTop: '1rem' }}><strong>Step 1: Loss derivative w.r.t. activation</strong></p>
        <CalcStep number={1}>dL/da = 2 × (prediction - target)</CalcStep>
        <CalcStep number={2}>dL/da = 2 × (0.7 - 1.0) = -0.6</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step 2: Sigmoid derivative</strong></p>
        <CalcStep number={3}>da/dz = sigmoid(z) × (1 - sigmoid(z))</CalcStep>
        <CalcStep number={4}>da/dz = 0.7 × (1 - 0.7) = 0.7 × 0.3 = 0.21</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step 3: Chain rule</strong></p>
        <CalcStep number={5}>dL/dz = dL/da × da/dz</CalcStep>
        <CalcStep number={6}>dL/dz = -0.6 × 0.21 = -0.126</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          <strong>Result: dL/dz = -0.126</strong>
        </p>
        <p>
          The negative value tells us: if we increase z, the loss decreases!
          Since we want to minimize loss, we should increase z.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Multiply?">
        <p>
          The chain rule multiplication makes intuitive sense. Imagine a chain of cause and effect:
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          If z increases by 1 → a increases by 0.21 (da/dz = 0.21)
        </p>
        <p>
          If a increases by 1 → L decreases by 0.6 (dL/da = -0.6)
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          So if z increases by 1 → a increases by 0.21 → L changes by 0.21 × (-0.6) = -0.126
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          The effects multiply through the chain!
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain analogy:</strong> Imagine the humidity weight in layer 1 increases slightly. This makes
        layer 1&apos;s confidence go up a bit. That higher confidence flows into layer 2, making layer 2&apos;s
        confidence change. That change flows to the output, changing the final rain prediction. The chain rule
        multiplies all these small effects together to figure out the total impact on the loss.
      </p>

      <ExplanationBox title="The Delta (δ) Notation">
        <p>
          In backpropagation, we often call dL/dz the &quot;delta&quot; (δ) for a neuron.
          It represents the &quot;error signal&quot; that flows backward:
        </p>
        <div className="math-formula" style={{ margin: '1rem 0' }}>
          δ = (output error) × (local gradient)
        </div>
        <p>
          This delta gets propagated back to compute gradients for weights in earlier layers.
          That&apos;s why it&apos;s called <strong>backpropagation</strong> - the error flows backward!
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why e Matters Here">
        <p>
          Remember when we introduced sigmoid using e ≈ 2.71828? This is where it pays off.
          Notice how clean the sigmoid derivative is: <code>sigmoid(z) × (1 - sigmoid(z))</code>.
          We just multiply the output by (1 minus the output) — no messy constants anywhere.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          If sigmoid used base 2 instead of e, that derivative would have an extra ln(2) ≈ 0.693
          multiplied in. Every single chain rule calculation would carry this extra factor.
          Across millions of neurons and thousands of training steps, that adds up to slower
          training and messier code.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The number e is special because the derivative of e^x equals e^x itself — no extra
          constants. This mathematical elegance flows through the entire backpropagation algorithm,
          making everything cleaner and faster.
        </p>
      </ExplanationBox>

      <ExplanationBox title="From Delta to Weight Gradients">
        <p>
          Now we know how the loss changes with z. But we want to know how the loss
          changes with <em>weights</em> - those are what we can actually adjust!
        </p>
        <p>
          Since z = Σ(input × weight) + bias, one more chain rule step gives us:
        </p>
        <div className="math-formula" style={{ margin: '1rem 0' }}>
          dL/dw = dL/dz × dz/dw = δ × input
        </div>
        <p>
          The weight gradient is simply the delta multiplied by the input that weight connects to!
          In the next step, we&apos;ll put this all together into the full backpropagation algorithm.
        </p>
      </ExplanationBox>

    </div>
  );
}
