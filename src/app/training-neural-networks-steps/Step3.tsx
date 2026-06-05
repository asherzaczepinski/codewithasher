'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Big Picture: Two Passes">
        <p>
          Every training step involves two passes through the network. The
          <strong> forward pass</strong> computes the network&apos;s prediction from
          input to output. The <strong>backward pass</strong> computes how much each
          weight contributed to the error, so we can nudge weights in the right direction.
        </p>
        <p>
          You&apos;ve seen this before. Here we go one level deeper: we will track the
          gradient of the loss with respect to every weight in every layer, and see
          exactly how the chain rule connects them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Chain Rule Is the Whole Story">
        <p>
          The loss L is a function of the output, which is a function of the last
          layer&apos;s pre-activation, which is a function of the previous layer&apos;s
          output, and so on all the way back to the first layer&apos;s weights. To find
          how L changes with respect to any weight deep in the network, we multiply
          derivatives along the path:
        </p>
      </ExplanationBox>

      <MathFormula label="Chain rule through two layers">
        dL/dW(1) = (dL/da(2)) * (da(2)/dz(2)) * (dz(2)/da(1)) * (da(1)/dz(1)) * (dz(1)/dW(1))
      </MathFormula>

      <ExplanationBox title="Notation for the Worked Example">
        <p>
          We have a two-layer MLP (one hidden layer, one output layer). Here is the setup:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Input x = 0.5</li>
          <li>Hidden layer weight W1 = 0.8, bias b1 = 0.0, activation = ReLU</li>
          <li>Output layer weight W2 = 1.2, bias b2 = 0.0, activation = none (linear)</li>
          <li>Target y = 1.0, loss = MSE = (output - y)^2</li>
        </ul>
        <p>
          We will run a full forward pass, compute the loss, then compute every gradient
          in the backward pass using the chain rule.
        </p>
      </ExplanationBox>

      <WorkedExample title="Forward Pass">
        <CalcStep number={1}>Pre-activation of hidden layer: z1 = W1 * x + b1 = 0.8 * 0.5 + 0 = 0.40</CalcStep>
        <CalcStep number={2}>Hidden activation (ReLU): a1 = ReLU(0.40) = 0.40</CalcStep>
        <CalcStep number={3}>Pre-activation of output: z2 = W2 * a1 + b2 = 1.2 * 0.40 + 0 = 0.48</CalcStep>
        <CalcStep number={4}>Output (linear): output = 0.48</CalcStep>
        <CalcStep number={5}>Loss (MSE): L = (0.48 - 1.0)^2 = (-0.52)^2 = 0.2704</CalcStep>
      </WorkedExample>

      <WorkedExample title="Backward Pass — Gradient Through Each Layer">
        <p>
          We apply the chain rule starting at the loss and working backward.
          Each step is one application of the chain rule.
        </p>

        <CalcStep number={1}>dL/d(output): derivative of MSE = 2*(output - y) = 2*(0.48 - 1.0) = -1.04</CalcStep>
        <CalcStep number={2}>d(output)/dz2: output layer is linear, so derivative = 1</CalcStep>
        <CalcStep number={3}>dL/dz2 = dL/d(output) * d(output)/dz2 = -1.04 * 1 = -1.04</CalcStep>
        <CalcStep number={4}>dL/dW2 = dL/dz2 * dz2/dW2 = -1.04 * a1 = -1.04 * 0.40 = -0.416</CalcStep>
        <CalcStep number={5}>dL/da1 = dL/dz2 * dz2/da1 = -1.04 * W2 = -1.04 * 1.2 = -1.248</CalcStep>
        <CalcStep number={6}>da1/dz1: ReLU derivative = 1 if z1 &gt; 0 else 0; z1 = 0.40 &gt; 0, so = 1</CalcStep>
        <CalcStep number={7}>dL/dz1 = dL/da1 * da1/dz1 = -1.248 * 1 = -1.248</CalcStep>
        <CalcStep number={8}>dL/dW1 = dL/dz1 * dz1/dW1 = -1.248 * x = -1.248 * 0.5 = -0.624</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          So to reduce the loss we should increase W1 (gradient is negative, so gradient
          descent subtracts a negative number, i.e., adds to W1) and increase W2. That
          makes sense: both weights are too small to produce an output of 1.0.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below reproduces every number from both worked examples above.
          The forward pass stores intermediate values we will need during backprop,
          and the backward pass applies the chain rule one step at a time.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="backprop_two_layer.py"
        caption="Complete forward pass and manual backprop for a 2-layer MLP — every gradient matches the worked example above."
        code={`import numpy as np

# ── Network parameters (scalar example: one input, one hidden, one output) ───
x  = 0.5    # input
W1 = 0.8    # weight connecting input to hidden neuron
b1 = 0.0    # hidden neuron bias
W2 = 1.2    # weight connecting hidden neuron to output
b2 = 0.0    # output neuron bias
y  = 1.0    # ground-truth target

# ── Forward pass ──────────────────────────────────────────────────────────────
# Each intermediate value is saved because backprop will need it.

z1 = W1 * x + b1           # pre-activation of hidden neuron: 0.8 * 0.5 = 0.40
a1 = np.maximum(0.0, z1)   # ReLU activation: positive, so a1 = z1 = 0.40

z2 = W2 * a1 + b2          # pre-activation of output: 1.2 * 0.40 = 0.48
output = z2                 # linear output layer (no activation)

loss = (output - y) ** 2   # MSE loss: (0.48 - 1.0)^2 = 0.2704
print(f"Forward  — output: {output:.4f}, loss: {loss:.4f}")

# ── Backward pass (chain rule, one link at a time) ────────────────────────────
# We work from the output back toward the input, accumulating the product
# of all derivatives seen so far (that product IS the chain rule).

dL_doutput = 2 * (output - y)   # d(MSE)/d(output) = 2*(pred - target) = -1.04

# Output layer is linear, so d(output)/d(z2) = 1.
# Chain rule: dL/dz2 = dL/d(output) * d(output)/dz2
dL_dz2 = dL_doutput * 1.0       # = -1.04

# dz2/dW2 = a1 (the input to the output neuron).
# Chain rule: dL/dW2 = dL/dz2 * dz2/dW2
dL_dW2 = dL_dz2 * a1            # = -1.04 * 0.40 = -0.416

# Now push the gradient back through W2 to reach a1.
# dz2/da1 = W2 (W2 is the multiplier of a1 in z2 = W2*a1 + b2).
dL_da1 = dL_dz2 * W2            # = -1.04 * 1.2 = -1.248

# ReLU derivative: 1 if the pre-activation was positive, 0 otherwise.
# Since z1 = 0.40 > 0, the gate was open — gradient flows through unchanged.
relu_grad = 1.0 if z1 > 0 else 0.0   # = 1.0
dL_dz1   = dL_da1 * relu_grad         # = -1.248 * 1.0 = -1.248

# dz1/dW1 = x (the input that was multiplied by W1 to form z1).
dL_dW1 = dL_dz1 * x             # = -1.248 * 0.5 = -0.624

print(f"Backward — dL/dW2: {dL_dW2:.4f}, dL/dW1: {dL_dW1:.4f}")
# Both gradients are negative, so gradient descent will ADD to both weights —
# which makes sense: the output (0.48) is too low and both weights need to grow.
`}
      />

      <ExplanationBox title="The Key Insight: Gradients Multiply Across Layers">
        <p>
          Notice that the gradient of the loss with respect to W1 involved multiplying
          together three intermediate quantities: the output gradient, W2, and the ReLU
          derivative. In a 10-layer network, the gradient of W1 involves multiplying ten
          such quantities together.
        </p>
        <p>
          If each of those quantities is slightly less than 1 — say, 0.8 — then by layer 10
          the gradient is 0.8^10 = 0.107, less than one eighth its original size. If
          each is slightly greater than 1 — say, 1.2 — it is 1.2^10 = 6.19, more than six
          times larger. This is the seed of the vanishing and exploding gradient problems
          we will study in depth in Module 5.
        </p>
      </ExplanationBox>
    </div>
  );
}
