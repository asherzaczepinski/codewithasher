'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Overfitting Problem">
        <p>
          Our MLP is training well now — loss is falling, gradients are healthy. But
          there is a new symptom: training accuracy reaches 98% while test accuracy
          stalls at 72%. The network has memorized the training data rather than
          learning general patterns. This is overfitting.
        </p>
        <p>
          Overfitting happens because a large network has enough parameters to assign a
          unique internal representation to every training example. Neurons begin to
          co-adapt: neuron A always fires together with neuron B to detect a specific
          artifact of the training data, and neither is useful on its own.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Dropout: Randomly Removing Neurons">
        <p>
          Dropout (Srivastava et al., 2014) is a simple but powerful technique: during
          each forward pass in training, randomly zero out each neuron with probability
          p (the <em>dropout rate</em>). Different neurons are zeroed on each pass.
        </p>
        <p>
          Because a neuron can be absent at any time, neurons cannot co-adapt. Each
          neuron must learn to be useful on its own, without relying on specific
          partners. The result is that the network learns more robust, redundant
          representations — exactly what generalization requires.
        </p>
        <p>
          You can think of dropout as training an exponentially large ensemble of
          different thinned networks and averaging their predictions at test time.
        </p>
      </ExplanationBox>

      <MathFormula label="Dropout mask during training (for each neuron j)">
        mask_j ~ Bernoulli(1 - p),   output_j = (activation_j * mask_j) / (1 - p)
      </MathFormula>

      <ExplanationBox title="Train vs. Test Behavior">
        <p>
          <strong>During training:</strong> each neuron is kept with probability (1 - p)
          and its output is scaled up by 1/(1-p). This scaling is the
          &quot;inverted dropout&quot; trick — it ensures the expected value of each
          neuron&apos;s output is the same whether or not dropout is applied.
        </p>
        <p>
          <strong>During inference (test time):</strong> dropout is turned off entirely.
          All neurons are active. Because we used inverted dropout during training, no
          scaling adjustment is needed at test time — the network simply runs as normal.
        </p>
        <p>
          Forgetting to turn dropout off at test time is a common bug that produces
          noisy, inconsistent predictions.
        </p>
      </ExplanationBox>

      <WorkedExample title="Dropout Applied to a Layer of Five Neurons">
        <p>
          Our hidden layer has 5 neurons with activations [0.8, 1.2, 0.3, 0.9, 0.5].
          We apply dropout with p = 0.4 (40% chance of zeroing each neuron).
          One particular random mask is [1, 0, 1, 0, 1].
        </p>

        <CalcStep number={1}>Raw activations: [0.8, 1.2, 0.3, 0.9, 0.5]</CalcStep>
        <CalcStep number={2}>Dropout mask (1 = keep, 0 = drop): [1, 0, 1, 0, 1]</CalcStep>
        <CalcStep number={3}>After masking: [0.8 * 1, 1.2 * 0, 0.3 * 1, 0.9 * 0, 0.5 * 1] = [0.8, 0.0, 0.3, 0.0, 0.5]</CalcStep>
        <CalcStep number={4}>Scale factor (inverted dropout): 1 / (1 - 0.4) = 1 / 0.6 = 1.667</CalcStep>
        <CalcStep number={5}>Final output: [0.8*1.667, 0, 0.3*1.667, 0, 0.5*1.667] = [1.333, 0, 0.500, 0, 0.833]</CalcStep>
        <CalcStep number={6}>At test time: mask = [1,1,1,1,1], no scaling needed: [0.8, 1.2, 0.3, 0.9, 0.5]</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The scaling in step 5 ensures that the expected activation of each kept neuron
          is the same as it would be without dropout. Neuron 1&apos;s expected output
          with p=0.4: (1-0.4) * (original) * 1.667 = 0.6 * 0.8 * 1.667 = 0.8. Correct.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below implements inverted dropout with a single numpy call and
          shows the training / test mode switch. Every number matches the worked
          example — the random mask is fixed with a seed so you can reproduce it.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="dropout.py"
        caption="Inverted dropout with numpy — training scales activations up by 1/keep_prob; at test time the mask is simply removed."
        code={`import numpy as np

# ── Inverted dropout ──────────────────────────────────────────────────────────
# p          = probability of DROPPING a neuron (the "dropout rate")
# keep_prob  = 1 - p = probability of KEEPING a neuron
#
# "Inverted" means we divide by keep_prob at training time so the
# expected value of each neuron's output equals its undropped value.
# That way we do NOT need any scaling adjustment at test/inference time.

def dropout_forward(activations, p_drop, training=True):
    keep_prob = 1.0 - p_drop    # fraction of neurons we will keep active

    if training:
        # Draw a binary mask: each entry is 1 (keep) with prob keep_prob,
        #                                   0 (drop) with prob p_drop.
        # np.random.rand returns uniform [0, 1); values < keep_prob become 1.
        mask = (np.random.rand(*activations.shape) < keep_prob).astype(float)

        # Apply the mask and immediately scale up by 1/keep_prob.
        # This preserves the expected magnitude, so the next layer sees roughly
        # the same scale whether or not dropout is applied.
        out = activations * mask / keep_prob
        return out, mask          # return mask so backward pass can reuse it

    else:
        # At inference time: ALL neurons are active, no scaling needed.
        # Because training already compensated with 1/keep_prob, the network
        # produces correctly-scaled outputs without any test-time arithmetic.
        return activations, None  # mask is None — we never drop at test time

# ── Reproduce the worked example exactly ─────────────────────────────────────
np.random.seed(42)   # fix the seed so results match the written example

activations = np.array([0.8, 1.2, 0.3, 0.9, 0.5])
p_drop      = 0.4    # 40% dropout rate  ->  keep_prob = 0.6

out_train, mask = dropout_forward(activations, p_drop, training=True)
print("Mask (1=keep, 0=drop):", mask)
print("Training output      :", out_train.round(3))
# Non-zero values are scaled up by 1/0.6 = 1.667

out_test, _ = dropout_forward(activations, p_drop, training=False)
print("Test output          :", out_test)
# Exactly the original activations — no mask, no scaling
`}
      />

      <ExplanationBox title="Choosing the Dropout Rate">
        <p>
          Typical values are p = 0.5 for fully connected layers and p = 0.2 for
          convolutional layers (which have much more parameter sharing and are less
          prone to co-adaptation). Do not apply dropout to the output layer.
        </p>
        <p>
          Higher dropout rates provide more regularization but slow training. If your
          network is still overfitting with p = 0.5, consider a smaller model or more
          data rather than increasing p further.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Weight Decay: The Other Standard Regularizer">
        <p>
          Dropout is not the only tool. <strong>Weight decay</strong> (L2 regularization)
          adds a penalty to the loss that is proportional to the sum of squared weights.
          This pushes the network toward smaller weights, which tend to produce smoother,
          more generalizable functions.
        </p>
        <p>
          In practice, weight decay is implemented by subtracting a small fraction of
          each weight from itself every update step (hence the name &quot;decay&quot;).
          A typical weight decay coefficient is 1e-4 to 1e-2.
        </p>
      </ExplanationBox>

      <MathFormula label="Loss with L2 weight decay (lambda is the decay coefficient)">
        L_total = L_task + lambda * sum( w_i^2 )
      </MathFormula>

      <ExplanationBox title="Dropout and Weight Decay Together">
        <p>
          Both techniques are complementary. Dropout disrupts co-adaptation between
          neurons. Weight decay prevents any single weight from becoming dominant.
          Most modern training recipes use both: weight decay throughout training, and
          dropout in fully connected layers of larger models.
        </p>
      </ExplanationBox>
    </div>
  );
}
