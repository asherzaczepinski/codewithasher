'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Problem With Using All Your Data at Once">
        <p>
          The gradient descent we&apos;ve studied so far is called <strong>full-batch</strong>
          (or just &quot;batch&quot;) gradient descent. Before taking a single step, it looks
          at <em>every</em> training example, computes the cost for each one, averages them
          into the MSE, and then computes the gradient of that average.
        </p>
        <p>
          On a dataset with 100 examples that&apos;s fine. On a dataset with 100 million
          examples — common in industry — computing one gradient requires scanning all
          100 million rows just to take a single tiny step. That&apos;s painfully slow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Stochastic Gradient Descent (SGD) — One Example at a Time">
        <p>
          <strong>Stochastic Gradient Descent</strong> goes to the opposite extreme: for
          each step, pick <em>one</em> training example at random, compute the gradient
          using just that example, and update immediately.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Speed:</strong> each update is cheap — one forward pass, one gradient.</li>
          <li>
            <strong>Noise:</strong> a single example is a noisy estimate of the true
            gradient. The path toward the minimum is jagged, not smooth.
          </li>
          <li>
            <strong>Benefit of noise:</strong> the randomness can actually help escape
            shallow local minima that full-batch descent would get stuck in.
          </li>
          <li>
            <strong>Downside:</strong> because the path is so noisy, the cost never fully
            settles — it bounces around near the minimum even after the model has essentially
            converged.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="SGD update (single example i)">
        x_new = x_old − α × ∇L_i(x_old)
      </MathFormula>

      <ExplanationBox title="Mini-Batch GD — The Sweet Spot">
        <p>
          <strong>Mini-batch gradient descent</strong> splits the dataset into small chunks
          called <strong>batches</strong> (typically 32, 64, 128, or 256 examples). Each
          gradient step uses one mini-batch. This is the method used in virtually all
          modern deep learning.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Much faster than full-batch</strong> — you take many gradient steps
            before you&apos;ve even seen the whole dataset once.
          </li>
          <li>
            <strong>Less noisy than SGD</strong> — averaging over 64 examples gives a
            much more reliable gradient estimate than a single example.
          </li>
          <li>
            <strong>GPU-friendly</strong> — modern GPUs are designed to process exactly
            this kind of fixed-size batch in parallel.
          </li>
          <li>
            <strong>One pass through the entire dataset</strong> is called an
            <em> epoch</em>. With batch size 64 and 64 000 examples, you take 1 000 gradient
            steps per epoch.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Comparing the Three Variants on 1 000 Training Examples">
        <CalcStep number={1}>
          Full-batch: 1 gradient step costs 1 000 example evaluations. After 100 steps: 100 000 evaluations. Path is smooth.
        </CalcStep>
        <CalcStep number={2}>
          SGD (batch=1): 1 gradient step costs 1 example evaluation. After 100 steps: 100 evaluations — but 100× noisier gradients.
        </CalcStep>
        <CalcStep number={3}>
          Mini-batch (batch=32): 1 gradient step costs 32 evaluations. After 100 steps: 3 200 evaluations. Path is moderately smooth.
        </CalcStep>
        <CalcStep number={4}>
          In wall-clock time, mini-batch with batch=32 typically converges far faster than full-batch, with far lower variance than SGD.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          This is why &quot;SGD&quot; in library documentation almost always means
          <em> mini-batch SGD</em> with a configurable batch size — the stochastic-one-example
          variant is rarely used in isolation in modern practice.
        </p>
      </WorkedExample>

      <ExplanationBox title="Epoch vs. Iteration">
        <p>
          Two terms you&apos;ll see constantly in training logs:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Iteration (step)</strong> — one forward pass + one gradient update,
            using one mini-batch.
          </li>
          <li>
            <strong>Epoch</strong> — one complete pass through the entire training dataset.
            If your dataset has N examples and your batch size is B, one epoch = N/B iterations.
          </li>
        </ul>
        <p>
          Training is typically reported in epochs so you can compare runs with different
          batch sizes fairly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          We add mini-batch SGD to our file. The key new ideas are shuffling the dataset
          before each epoch (so every batch is different across epochs) and slicing it into
          chunks of size <code>batch_size</code>. Everything else — the gradient and update
          — is identical to what we wrote in Step 4.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="gradient_descent.py"
        caption="Mini-batch SGD with shuffling and epoch tracking — the pattern used in virtually all real deep-learning training loops."
        code={`# ─── (continuing gradient_descent.py) ────────────────────────────────────────
# We now train on a small dataset of (x, y) pairs using mini-batch SGD.
# The model: predict y = w * x  (a line through the origin, one weight w).
# The cost:  MSE between w*x and y.

import numpy as np

# ── Tiny dataset: 12 (input, target) pairs ────────────────────────────────────
# In a real project these come from files, databases, or data loaders.
np.random.seed(42)   # fix randomness so results are reproducible
X = np.array([1.0, 2.0, 3.0, 4.0, 5.0, 6.0,
               7.0, 8.0, 9.0, 10.0, 11.0, 12.0])
Y = X * 2.0 + np.random.randn(12) * 0.5   # true relationship is y ≈ 2x + noise

# ── Gradient of MSE w.r.t. weight w ──────────────────────────────────────────
# MSE = mean( (w*x - y)^2 )
# d(MSE)/dw = mean( 2*(w*x - y)*x )  <- derived by the chain rule
def mse_grad(w, x_batch, y_batch):
    predictions = w * x_batch          # model output for this mini-batch
    errors      = predictions - y_batch  # residuals (prediction minus truth)
    # Gradient: average of 2 * error * input over the batch
    return np.mean(2 * errors * x_batch)


def mini_batch_sgd(X, Y, lr, batch_size, epochs):
    w = 0.0   # start weight at zero; gradient descent will move it toward 2.0

    n = len(X)

    for epoch in range(epochs):
        # SHUFFLE the dataset at the start of every epoch.
        # Without shuffling, every epoch sees the same batch order, which can
        # introduce subtle bias and slow convergence.
        indices = np.random.permutation(n)
        X_shuffled = X[indices]
        Y_shuffled = Y[indices]

        epoch_loss = 0.0
        num_batches = 0

        # SLICE into mini-batches of size batch_size.
        # range(0, n, batch_size) gives starting indices: 0, batch_size, 2*batch_size, ...
        for start in range(0, n, batch_size):
            end = start + batch_size        # exclusive end of this slice
            x_batch = X_shuffled[start:end]
            y_batch = Y_shuffled[start:end]

            # Compute gradient using ONLY this mini-batch (fast, slightly noisy)
            grad = mse_grad(w, x_batch, y_batch)

            # Same update rule as always: step opposite to the gradient
            w = w - lr * grad

            # Track loss across batches so we can log it per epoch
            epoch_loss += np.mean((w * x_batch - y_batch) ** 2)
            num_batches += 1

        avg_loss = epoch_loss / num_batches
        if epoch % 10 == 0 or epoch == epochs - 1:
            print(f"epoch {epoch:3d}  w = {w:.4f}  avg_loss = {avg_loss:.4f}")

    return w   # should be close to 2.0 (the true slope)


# ── Run: 3 epochs, batch size 4 (so 3 batches per epoch) ─────────────────────
w_learned = mini_batch_sgd(X, Y, lr=0.01, batch_size=4, epochs=30)
print("Learned weight:", round(w_learned, 3), " (true weight is 2.0)")`}
      />
    </div>
  );
}
