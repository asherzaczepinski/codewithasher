'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Core Problem: Repeated Multiplication">
        <p>
          In the previous module we saw that the gradient of the loss with respect to a
          weight in layer 1 is the product of many intermediate derivatives — one per
          layer between layer 1 and the output. In a network with L layers, the gradient
          involves roughly L multiplications.
        </p>
        <p>
          If each of those factors is consistently less than 1, the product shrinks
          exponentially with depth. If each factor is consistently greater than 1, the
          product grows exponentially. Neither is good. This is the <strong>vanishing
          gradient</strong> and <strong>exploding gradient</strong> problem respectively.
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient of weight in layer 1 (simplified, L layers)">
        dL/dW1 = (dL/dz_L) * prod_( l=2 to L )( da_(l-1)/dz_(l-1) * W_l )
      </MathFormula>

      <ExplanationBox title="Saturating Activations Make Vanishing Worse">
        <p>
          Sigmoid and tanh both have a derivative that approaches zero when their input
          is far from zero. When a neuron&apos;s pre-activation is large in magnitude,
          its derivative is nearly zero and it contributes a near-zero factor to every
          gradient that flows through it. In a deep network, passing through even a few
          saturated neurons can reduce the gradient to effectively nothing.
        </p>
      </ExplanationBox>

      <MathFormula label="Sigmoid derivative (saturates to 0 at extremes)">
        d/dz sigmoid(z) = sigmoid(z) * (1 - sigmoid(z))     [max value = 0.25 at z=0]
      </MathFormula>

      <WorkedExample title="Vanishing Gradient Through Four Saturated Sigmoid Layers">
        <p>
          Suppose each layer has a sigmoid neuron that is moderately saturated, with a
          derivative of 0.1 per layer. After four layers, the gradient is:
        </p>

        <CalcStep number={1}>Initial gradient at output: dL/d(output) = 1.0</CalcStep>
        <CalcStep number={2}>After layer 4 (derivative 0.1): gradient = 1.0 * 0.1 = 0.1</CalcStep>
        <CalcStep number={3}>After layer 3 (derivative 0.1): gradient = 0.1 * 0.1 = 0.01</CalcStep>
        <CalcStep number={4}>After layer 2 (derivative 0.1): gradient = 0.01 * 0.1 = 0.001</CalcStep>
        <CalcStep number={5}>After layer 1 (derivative 0.1): gradient = 0.001 * 0.1 = 0.0001</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The gradient reaching the first layer is 10,000 times smaller than the gradient
          at the output. The first layer barely updates — it effectively stops learning.
          In a 20-layer network the situation is catastrophic.
        </p>
      </WorkedExample>

      <WorkedExample title="Exploding Gradient Through Four Layers">
        <p>
          Now suppose weights are poorly initialized and each layer multiplies the
          gradient by a factor of 3.
        </p>

        <CalcStep number={1}>Initial gradient at output: 1.0</CalcStep>
        <CalcStep number={2}>After passing through layer 4: 1.0 * 3 = 3.0</CalcStep>
        <CalcStep number={3}>After passing through layer 3: 3.0 * 3 = 9.0</CalcStep>
        <CalcStep number={4}>After passing through layer 2: 9.0 * 3 = 27.0</CalcStep>
        <CalcStep number={5}>After passing through layer 1: 27.0 * 3 = 81.0</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          A weight update proportional to 81 will overshoot massively. After just a few
          steps the loss becomes NaN. This is the exploding gradient symptom you see when
          training crashes.
        </p>
      </WorkedExample>

      <ExplanationBox title="Symptoms to Watch For">
        <p>
          <strong>Vanishing gradients:</strong> Loss decreases very slowly or not at all.
          Earlier layers change almost nothing between epochs. Activations in early layers
          are all near zero or all near the same value.
        </p>
        <p>
          <strong>Exploding gradients:</strong> Loss jumps wildly or immediately becomes
          NaN. Weights become very large very quickly. Training is numerically unstable.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fixes">
        <p>
          Each fix targets one of the multiplication factors that makes the product explode
          or vanish:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Use ReLU activations</strong> — ReLU has a derivative of exactly 1
            for positive inputs, not a fraction. This prevents the derivative factor from
            being less than 1 in the forward direction.
          </li>
          <li>
            <strong>Good weight initialization</strong> — Xavier and He initialization
            (Module 4) keep weight matrices scaled so the product of weight factors stays
            near 1.
          </li>
          <li>
            <strong>Gradient clipping</strong> — cap the gradient norm at a threshold
            (e.g., 1.0) before applying the update. This is the standard fix for
            exploding gradients in recurrent networks.
          </li>
          <li>
            <strong>Normalization</strong> — batch norm and layer norm (Module 8) keep
            pre-activations in a well-behaved range, preventing saturation.
          </li>
          <li>
            <strong>Residual connections</strong> — skip connections (Module 6) add a
            direct gradient highway that bypasses the problematic multiplications entirely.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Gradient clipping (clip by global norm)">
        g_clipped = g * min(1, threshold / norm(g))
      </MathFormula>
    </div>
  );
}
