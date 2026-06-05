'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Problem with Bad Initialization">
        <p>
          Before training even begins, you must choose starting values for every weight in
          the network. This choice has an enormous effect on whether training succeeds.
        </p>
        <p>
          Two obvious strategies both fail badly:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>All zeros:</strong> Every neuron in a layer computes exactly the
            same output. Their gradients are identical too. Every weight in the layer
            updates by exactly the same amount. The layer stays symmetric forever —
            it is as if the layer had only one neuron. This is called the
            <em> symmetry problem</em>.
          </li>
          <li>
            <strong>Large random values:</strong> Pre-activations explode — they are
            huge before the first forward pass even completes. Sigmoid and tanh
            saturate immediately. Gradients vanish before the first weight update.
          </li>
        </ul>
        <p>
          We need weights that are random (to break symmetry) but also carefully
          scaled (to keep activations and gradients in a reasonable range).
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Variance Idea">
        <p>
          Here is the key intuition. Consider one neuron receiving n inputs. Its
          pre-activation is the sum of n products (weight times input). If each weight
          is drawn independently with variance Var(w) and each input has variance
          Var(x), then the pre-activation has variance approximately:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', margin: '8px 0' }}>
          Var(z) = n * Var(w) * Var(x)
        </p>
        <p>
          For Var(z) to equal Var(x) — meaning the variance is preserved, not amplified
          or shrunk — we need Var(w) = 1/n. That is the core idea behind principled
          initialization: set the weight variance to be inversely proportional to the
          number of inputs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Xavier / Glorot Initialization">
        <p>
          Xavier Glorot and Yoshua Bengio (2010) derived an initialization that keeps
          the variance stable in both the forward and backward directions. They took
          the average of the fan-in (number of inputs to a layer) and fan-out (number
          of outputs), giving the formula below.
        </p>
        <p>
          <strong>Best used with:</strong> tanh and sigmoid activations, which are
          roughly linear near zero.
        </p>
      </ExplanationBox>

      <MathFormula label="Xavier (Glorot) Initialization — uniform draw">
        W ~ Uniform( -sqrt(6 / (fan_in + fan_out)),  +sqrt(6 / (fan_in + fan_out)) )
      </MathFormula>

      <MathFormula label="Xavier (Glorot) Initialization — normal draw">
        W ~ Normal( 0,  sqrt(2 / (fan_in + fan_out)) )
      </MathFormula>

      <ExplanationBox title="He Initialization">
        <p>
          Kaiming He et al. (2015) showed that for ReLU activations, Xavier is too
          small. ReLU zeros out half of its inputs on average, which effectively halves
          the variance at each layer. To compensate, we need to double the weight
          variance — using fan-in alone (not the average) and a factor of 2.
        </p>
        <p>
          <strong>Best used with:</strong> ReLU and Leaky ReLU activations.
        </p>
      </ExplanationBox>

      <MathFormula label="He Initialization — normal draw">
        W ~ Normal( 0,  sqrt(2 / fan_in) )
      </MathFormula>

      <WorkedExample title="Computing Init Scales for Our MLP">
        <p>
          Our MLP has these layer sizes: input(784) &rarr; hidden1(256) &rarr; hidden2(128) &rarr; output(10).
          Hidden layers use ReLU. Let&apos;s compute the He standard deviation for each weight matrix.
        </p>

        <CalcStep number={1}>W1 connects 784 inputs to 256 neurons. fan_in = 784</CalcStep>
        <CalcStep number={2}>He std for W1: sqrt(2 / 784) = sqrt(0.002551) = 0.0505</CalcStep>
        <CalcStep number={3}>W2 connects 256 inputs to 128 neurons. fan_in = 256</CalcStep>
        <CalcStep number={4}>He std for W2: sqrt(2 / 256) = sqrt(0.00781) = 0.0884</CalcStep>
        <CalcStep number={5}>W3 connects 128 inputs to 10 outputs (softmax). fan_in = 128, fan_out = 10</CalcStep>
        <CalcStep number={6}>Xavier std for W3 (output layer, no ReLU): sqrt(2 / (128 + 10)) = sqrt(0.01449) = 0.1204</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice how the initialization scale grows as layers get narrower — smaller layers need
          larger weights to maintain the same signal variance. Getting this right means the
          very first forward pass produces activations and gradients in a healthy range,
          giving training a solid foundation.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Both initialization schemes reduce to a single numpy call. The functions
          below compute and print the standard deviation so you can verify it matches
          the numbers in the worked example above.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="initialization.py"
        caption="Xavier and He initialization in numpy — the printed std values match the worked example above exactly."
        code={`import numpy as np

# ── Xavier (Glorot) initialization ───────────────────────────────────────────
# Designed for tanh / sigmoid activations.
# Keeps variance stable in BOTH directions (forward and backward).
# Formula: std = sqrt(2 / (fan_in + fan_out))
# The "2 / (fan_in + fan_out)" term is the mean of "1/fan_in" and "1/fan_out".
def xavier_init(fan_in, fan_out):
    std = np.sqrt(2.0 / (fan_in + fan_out))
    # Draw from a normal distribution centered at zero with the computed std.
    # Small weights break symmetry; the careful scale prevents vanishing/explosion.
    W = np.random.randn(fan_out, fan_in) * std
    return W, std   # return std so we can inspect it

# ── He (Kaiming) initialization ──────────────────────────────────────────────
# Designed for ReLU activations.
# ReLU zeros out ~half its inputs on average, which halves the variance.
# To compensate, we double the weight variance: std = sqrt(2 / fan_in).
# Only fan_in matters here — fan_out does not affect the forward-pass variance.
def he_init(fan_in, fan_out):
    std = np.sqrt(2.0 / fan_in)
    W = np.random.randn(fan_out, fan_in) * std
    return W, std

# ── Replicate the MLP from the worked example ─────────────────────────────────
# Architecture: input(784) -> hidden1(256) -> hidden2(128) -> output(10)
# Hidden layers use ReLU  -> He init.
# Output layer uses Softmax (no ReLU) -> Xavier init.

W1, std1 = he_init(fan_in=784, fan_out=256)
W2, std2 = he_init(fan_in=256, fan_out=128)
W3, std3 = xavier_init(fan_in=128, fan_out=10)

# Print the theoretical std and the empirical std of the sampled weights.
# With enough samples the two numbers should be very close.
print(f"W1 — theoretical std: {std1:.4f}, empirical std: {W1.std():.4f}")
# Expected: theoretical ~0.0505
print(f"W2 — theoretical std: {std2:.4f}, empirical std: {W2.std():.4f}")
# Expected: theoretical ~0.0884
print(f"W3 — theoretical std: {std3:.4f}, empirical std: {W3.std():.4f}")
# Expected: theoretical ~0.1204  (Xavier, because output has no ReLU)

# The empirical std will be close but not identical — we sampled randomly.
# Run this several times and you will see the empirical std fluctuate around
# the theoretical value, confirming the formula is correct on average.
`}
      />

      <ExplanationBox title="What Good Initialization Achieves">
        <p>
          With properly initialized weights, the activations in every layer have similar
          variance on the first forward pass. The gradients in every layer have similar
          magnitude on the first backward pass. Training can start making meaningful
          progress immediately, rather than spending the first many epochs climbing out of
          a pathological initial state.
        </p>
        <p>
          Initialization is not a magic fix — the network still needs the right activation
          functions, learning rate, and architecture. But bad initialization can doom
          training before it starts, while good initialization gives every other technique
          a fair chance to work.
        </p>
      </ExplanationBox>
    </div>
  );
}
