'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Why Nonlinearity Matters">
        <p>
          Without an activation function, stacking layers accomplishes nothing. A linear
          transformation of a linear transformation is still just a linear transformation —
          no matter how many layers you add, the whole network collapses to a single weight
          matrix. You could not learn XOR, let alone recognize images.
        </p>
        <p>
          Activation functions introduce nonlinearity at every neuron, which is what allows
          deep networks to learn complex, curved decision boundaries in high-dimensional space.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Sigmoid">
        <p>
          The sigmoid maps any real number to the range (0, 1), making it natural for
          binary classification outputs.
        </p>
        <p><strong>Range:</strong> (0, 1)</p>
        <p>
          <strong>Pros:</strong> smooth gradient, output is interpretable as a probability.
        </p>
        <p>
          <strong>Cons:</strong> saturates near 0 and 1 — gradients become nearly zero there,
          causing vanishing gradients in deep networks. Output is not zero-centered, which
          slows gradient descent.
        </p>
      </ExplanationBox>

      <MathFormula label="Sigmoid">
        sigmoid(z) = 1 / (1 + e^(-z))
      </MathFormula>

      <ExplanationBox title="Tanh">
        <p>
          Tanh is a rescaled sigmoid. It maps to (-1, 1) and is zero-centered, which is
          better for hidden layers because positive and negative activations cancel
          naturally.
        </p>
        <p><strong>Range:</strong> (-1, 1)</p>
        <p>
          <strong>Pros:</strong> zero-centered, stronger gradients near zero than sigmoid.
        </p>
        <p>
          <strong>Cons:</strong> still saturates at the extremes, still causes vanishing
          gradients in very deep networks.
        </p>
      </ExplanationBox>

      <MathFormula label="Tanh">
        tanh(z) = (e^z - e^(-z)) / (e^z + e^(-z))
      </MathFormula>

      <ExplanationBox title="ReLU — Rectified Linear Unit">
        <p>
          ReLU is the default choice for hidden layers in modern networks. It is
          computationally trivial and, crucially, does not saturate for positive inputs —
          so gradients flow freely when the neuron is active.
        </p>
        <p><strong>Range:</strong> [0, infinity)</p>
        <p>
          <strong>Pros:</strong> fast to compute, no vanishing gradient for positive inputs,
          sparse activations (many neurons output exactly zero, which acts as implicit
          regularization).
        </p>
        <p>
          <strong>Cons:</strong> &quot;Dying ReLU&quot; — if a neuron&apos;s input is always
          negative, it always outputs zero and its gradient is always zero. That neuron
          never recovers.
        </p>
      </ExplanationBox>

      <MathFormula label="ReLU">
        ReLU(z) = max(0, z)
      </MathFormula>

      <ExplanationBox title="Leaky ReLU">
        <p>
          Leaky ReLU fixes the dying ReLU problem by allowing a small negative slope
          (typically 0.01) instead of clamping to zero. Neurons that receive negative
          inputs still produce a tiny signal and still receive a tiny gradient, so they
          can recover.
        </p>
        <p><strong>Range:</strong> (-infinity, infinity)</p>
        <p>
          <strong>Pros:</strong> no dying neurons, otherwise same benefits as ReLU.
        </p>
        <p>
          <strong>Cons:</strong> the leak slope is a hyperparameter; the small negative
          outputs can occasionally cause unexpected behavior in outputs.
        </p>
      </ExplanationBox>

      <MathFormula label="Leaky ReLU (alpha is typically 0.01)">
        LeakyReLU(z) = z if z &gt; 0, else alpha * z
      </MathFormula>

      <ExplanationBox title="Softmax — For Output Layers">
        <p>
          Softmax converts a vector of raw scores into a probability distribution.
          Every output is in (0, 1) and all outputs sum to exactly 1, making it
          perfect for multi-class classification.
        </p>
        <p><strong>Range:</strong> (0, 1) per element, sum = 1</p>
        <p>
          <strong>Pros:</strong> gives interpretable class probabilities, pairs naturally
          with cross-entropy loss.
        </p>
        <p>
          <strong>Cons:</strong> only meaningful at the output layer; the exponentials
          can overflow for very large inputs (fixed in practice by subtracting the max
          before exponentiating).
        </p>
      </ExplanationBox>

      <MathFormula label="Softmax (for class k out of K classes)">
        softmax(z)_k = e^(z_k) / sum_j( e^(z_j) )
      </MathFormula>

      <WorkedExample title="Evaluating Activations on Two Neurons">
        <p>
          Our MLP has two neurons in a hidden layer with pre-activations z = 2.0 and
          z = -1.5. Let&apos;s evaluate each activation function on both values.
        </p>

        <CalcStep number={1}>Sigmoid at z = 2.0: 1 / (1 + e^(-2.0)) = 1 / (1 + 0.135) = 0.880</CalcStep>
        <CalcStep number={2}>Sigmoid at z = -1.5: 1 / (1 + e^(1.5)) = 1 / (1 + 4.482) = 0.182</CalcStep>
        <CalcStep number={3}>ReLU at z = 2.0: max(0, 2.0) = 2.0</CalcStep>
        <CalcStep number={4}>ReLU at z = -1.5: max(0, -1.5) = 0.0 (neuron is dead for this input)</CalcStep>
        <CalcStep number={5}>Leaky ReLU at z = -1.5 (alpha = 0.01): 0.01 * (-1.5) = -0.015 (small but nonzero)</CalcStep>
        <CalcStep number={6}>Tanh at z = 2.0: (e^2 - e^(-2)) / (e^2 + e^(-2)) = (7.389 - 0.135) / (7.389 + 0.135) = 0.964</CalcStep>
        <CalcStep number={7}>Tanh at z = -1.5: (e^(-1.5) - e^(1.5)) / (e^(-1.5) + e^(1.5)) = (0.223 - 4.482) / (0.223 + 4.482) = -0.905</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice that at z = -1.5, ReLU outputs exactly zero and will pass zero gradient
          backward. Sigmoid outputs 0.182 — small but nonzero. This is the core tradeoff
          between the two families.
        </p>
      </WorkedExample>

      <ExplanationBox title="Which Activation to Use Where">
        <p>
          <strong>Hidden layers:</strong> ReLU is the default. Use Leaky ReLU if you
          observe many dead neurons (weights stuck, loss not moving for some neurons).
          Avoid sigmoid and tanh in deep hidden layers.
        </p>
        <p>
          <strong>Binary classification output:</strong> Sigmoid gives a probability
          for the positive class.
        </p>
        <p>
          <strong>Multi-class classification output:</strong> Softmax gives a
          probability distribution over all classes.
        </p>
        <p>
          <strong>Regression output:</strong> No activation (linear output) — the
          network should be free to predict any real number.
        </p>
      </ExplanationBox>
    </div>
  );
}
