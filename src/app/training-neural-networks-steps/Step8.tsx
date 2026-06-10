'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Internal Covariate Shift">
        <p>
          Even with good initialization, something subtle degrades training over time.
          As the weights in layer L update, the distribution of inputs seen by layer
          L+1 changes. Layer L+1 adapted to one distribution of inputs, but now it is
          receiving a different one — it must constantly re-adapt. This is called{' '}
          <strong>internal covariate shift</strong>.
        </p>
        <p>
          The practical effect: training is slow and sensitive. You must use small
          learning rates to avoid destabilizing early layers, and the network is hard to
          tune. Normalization techniques eliminate this problem by explicitly controlling
          the distribution of activations.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Normalization Idea">
        <p>
          The core operation is simple: given a set of values, subtract their mean and
          divide by their standard deviation. The result has mean 0 and standard
          deviation 1. Apply this to the pre-activations (or activations) of each layer,
          and the inputs to every subsequent layer are standardized — the distribution
          cannot shift far because we are actively correcting it on every forward pass.
        </p>
        <p>
          To preserve the network&apos;s capacity to represent any distribution (not just
          zero-mean, unit-variance), we then apply a learnable scale (gamma) and shift
          (beta) after normalizing. The network can learn to undo the normalization if
          that turns out to be optimal — but it starts from a well-conditioned place.
        </p>
      </ExplanationBox>

      <MathFormula label="Normalization formula (mu = mean, sigma = std, eps prevents division by zero)">
        x_hat = (x - mu) / sqrt(sigma^2 + eps),     y = gamma * x_hat + beta
      </MathFormula>

      <ExplanationBox title="Batch Normalization">
        <p>
          Batch normalization (Ioffe and Szegedy, 2015) computes the mean and variance
          across the <em>current mini-batch</em> of examples, separately for each feature
          (neuron). Concretely: for a batch of B examples and a layer with D neurons, we
          normalize each of the D neurons across the B examples.
        </p>
        <p>
          <strong>During training:</strong> use the batch mean and variance.
        </p>
        <p>
          <strong>During inference:</strong> use running averages of mean and variance
          accumulated during training (since at test time there may be only one example).
        </p>
        <p>
          <strong>Best used with:</strong> convolutional networks and fully connected
          networks with large batch sizes. Batch norm is less effective with small batches
          because the batch statistics become noisy.
        </p>
      </ExplanationBox>

      <MathFormula label="Batch norm: mean and variance over a batch of B examples for neuron j">
        mu_j = (1/B) * sum_i( x_(i,j) ),     sigma_j^2 = (1/B) * sum_i( (x_(i,j) - mu_j)^2 )
      </MathFormula>

      <ExplanationBox title="Layer Normalization">
        <p>
          Layer normalization (Ba et al., 2016) computes the mean and variance across
          the <em>features within a single example</em>, rather than across the batch.
          For one example with D features, we normalize all D features together.
        </p>
        <p>
          <strong>Key advantage:</strong> the statistics do not depend on batch size.
          Layer norm works identically whether batch size is 1 or 1000. This makes it
          the standard choice for sequence models and transformers, where examples have
          different lengths and batch sizes are often small.
        </p>
        <p>
          <strong>Best used with:</strong> transformers, RNNs, and any architecture where
          batch norm is impractical.
        </p>
      </ExplanationBox>

      <MathFormula label="Layer norm: mean and variance over D features for a single example i">
        mu_i = (1/D) * sum_j( x_(i,j) ),     sigma_i^2 = (1/D) * sum_j( (x_(i,j) - mu_i)^2 )
      </MathFormula>

      <WorkedExample title="Batch Normalization on a Mini-batch of Three Examples">
        <p>
          Our layer has one neuron. The pre-activations for three training examples in
          this batch are: [2.0, 4.0, 6.0]. We apply batch norm with gamma = 1 and
          beta = 0 (no learned scaling yet, for clarity).
        </p>

        <CalcStep number={1}>Batch mean: mu = (2.0 + 4.0 + 6.0) / 3 = 12.0 / 3 = 4.0</CalcStep>
        <CalcStep number={2}>Deviations from mean: [2.0-4.0, 4.0-4.0, 6.0-4.0] = [-2.0, 0.0, 2.0]</CalcStep>
        <CalcStep number={3}>Squared deviations: [4.0, 0.0, 4.0]</CalcStep>
        <CalcStep number={4}>Batch variance: sigma^2 = (4.0 + 0.0 + 4.0) / 3 = 2.667</CalcStep>
        <CalcStep number={5}>Batch std (with eps=0.001): sigma = sqrt(2.667 + 0.001) = sqrt(2.668) = 1.634</CalcStep>
        <CalcStep number={6}>Normalized: x_hat = [(-2.0)/1.634, 0.0/1.634, 2.0/1.634] = [-1.224, 0.000, 1.224]</CalcStep>
        <CalcStep number={7}>Apply gamma=1, beta=0: y = [1*(-1.224)+0, 1*0+0, 1*1.224+0] = [-1.224, 0.000, 1.224]</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The batch now has mean 0 and standard deviation 1. The next layer receives
          a stable, predictable distribution regardless of what the weights in this
          layer are doing. If gamma and beta are learned, the network can shift this
          distribution to whatever values are optimal — but training starts from a
          well-conditioned baseline.
        </p>
      </WorkedExample>

      <ExplanationBox title="What Normalization Achieves for Training">
        <p>
          With normalization in place, you can train with much larger learning rates
          without the loss diverging. The network becomes far less sensitive to weight
          initialization because each layer&apos;s output is re-centered and re-scaled
          before being passed forward. Layers train more independently — a big update
          to layer 2 does not throw layer 3 into an unfamiliar regime.
        </p>
        <p>
          Batch norm also acts as a mild regularizer because each example&apos;s
          normalization depends on other examples in the batch, adding a small amount
          of noise that slightly reduces overfitting.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Putting It All Together: The Reliable Training Recipe">
        <p>
          You now have a complete toolkit. Here is how our MLP went from failing to
          training reliably, one fix at a time:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>ReLU activations</strong> in hidden layers eliminated saturation and gradient shrinkage.</li>
          <li><strong>He initialization</strong> ensured healthy activation variance from the first forward pass.</li>
          <li><strong>Gradient clipping</strong> prevented occasional large gradient spikes from crashing training.</li>
          <li><strong>Residual connections</strong> gave gradients a direct path to early layers in the deeper version.</li>
          <li><strong>Dropout</strong> prevented co-adaptation and closed the gap between training and test accuracy.</li>
          <li><strong>Batch normalization</strong> stabilized activations across batches and allowed larger learning rates.</li>
        </ul>
        <p>
          None of these is optional in a serious deep learning project. Each addresses a
          real failure mode. Together they transform a network that cannot learn into one
          that trains reliably, generalizes well, and scales to many layers.
        </p>
      </ExplanationBox>
    </div>
  );
}
