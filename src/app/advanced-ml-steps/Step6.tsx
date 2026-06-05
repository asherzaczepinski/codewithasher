'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Problem: Learning From Almost Nothing">
        <p>
          Standard supervised learning needs thousands or millions of labeled examples to
          reach good performance. But humans learn new concepts from very few examples.
          Show a child two images of a zebra and they can reliably identify zebras in new
          photos. A radiologist who trains for years on chest X-rays can often identify a
          rare condition after seeing just a handful of confirmed cases.
        </p>
        <p>
          <strong>Few-shot learning</strong> formalizes this challenge: given only k labeled
          examples of a new class (a k-shot problem), learn to classify new instances correctly.
          When k = 1, it is one-shot learning. When k = 0 — classify classes never seen during
          training using only semantic descriptions — it is zero-shot learning.
        </p>
        <p>
          The key insight is that these problems are not solved by better optimization on tiny
          datasets. They require <em>prior knowledge</em> — either a rich feature representation
          that generalizes well, or a learning procedure that has itself been optimized to
          learn quickly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Learning to Learn: The Meta-Learning Framing">
        <p>
          <strong>Meta-learning</strong> reframes the problem at a higher level of abstraction.
          Instead of training a model to solve one task, we train a <em>meta-learner</em> across
          many tasks so that it becomes good at <em>adapting to new tasks quickly</em>.
        </p>
        <p>
          The training data in meta-learning is a distribution of tasks, each with its own
          small support set (the few labeled examples the learner can use) and query set (the
          test examples to predict). The meta-learner sees thousands of these tasks and learns
          a procedure for rapid adaptation — so that when a genuinely new task arrives, it can
          adapt from just a handful of support examples.
        </p>
        <p>
          There are three broad families of meta-learning approaches:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Metric-based:</strong> Learn an embedding space where same-class points
          cluster tightly. Classify new examples by nearest-neighbor in that space (Prototypical
          Networks, Siamese Networks, Matching Networks).</li>
          <li><strong>Model-based:</strong> Train a model with fast internal state update —
          often an RNN — that can read in a support set and adapt its &quot;memory&quot; to it in one forward pass.</li>
          <li><strong>Optimization-based:</strong> Learn an initialization of model parameters
          that can be fine-tuned to a new task with very few gradient steps (MAML).</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="MAML: Model-Agnostic Meta-Learning">
        <p>
          MAML (Finn et al. 2017) is the most influential optimization-based meta-learning
          algorithm. The core idea: find model parameters theta such that a small number of
          gradient descent steps on any task&apos;s support set leads to good performance on that
          task&apos;s query set.
        </p>
        <p>
          Training has two nested loops. The <strong>inner loop</strong> adapts the model to
          each task: starting from theta, take k gradient steps on the task&apos;s support loss to
          get task-specific parameters theta&apos;. The <strong>outer loop</strong> updates theta
          by minimizing the query loss evaluated at theta&apos; — averaged across tasks.
          Crucially, the outer gradient flows <em>through</em> the inner gradient steps, so theta
          is shaped to be an initialization that produces good theta&apos; after few steps on any task.
        </p>
      </ExplanationBox>

      <MathFormula label="MAML Inner and Outer Updates">
        theta&apos;_i = theta - alpha * gradient_theta L_i(theta)   [inner, per task i]
        theta &larr; theta - beta * gradient_theta sum_i L_i(theta&apos;_i)   [outer, meta-update]
      </MathFormula>

      <ExplanationBox title="Connection to Transfer Learning">
        <p>
          Transfer learning and meta-learning both exploit knowledge from previous tasks, but
          they differ in mechanism. Transfer learning fine-tunes a pre-trained model — the
          pre-training instills useful representations, and fine-tuning adapts them. This works
          well when the new task is similar to the pre-training distribution and enough labeled
          data exists for fine-tuning.
        </p>
        <p>
          Meta-learning, by contrast, explicitly optimizes for rapid adaptation. The meta-trained
          initialization is not just a good starting point in general — it is specifically shaped
          by the training procedure to support fast task-specific adaptation from very few examples.
        </p>
        <p>
          In practice, large pre-trained models (foundation models) trained on internet-scale data
          have become so powerful that few-shot learning via prompting (providing examples in the
          input context) often outperforms explicit meta-learning methods. This does not make
          meta-learning obsolete — it matters greatly in specialized domains where pre-trained
          representations transfer poorly, such as robotics, drug discovery, and personalized medicine.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>The snippet below sketches the MAML training loop in NumPy-style pseudocode.
        A real implementation uses PyTorch autograd to differentiate through the inner update;
        here we make the two-level gradient flow explicit in plain arithmetic.</p>
      </ExplanationBox>

      <CodeBlock
        filename="maml.py"
        caption="MAML inner/outer loop: learn an initialization theta that adapts to any new task in just a few gradient steps."
        code={`import numpy as np

# -------------------------------------------------------------------
# Model-Agnostic Meta-Learning (MAML) — Finn et al. 2017
#
# We want to find parameters theta such that ONE gradient step on
# any task&apos;s support set produces task-specific params theta&apos; that
# perform well on that task&apos;s query set.
#
# Two nested loops:
#   Inner loop  : adapt theta -> theta&apos;_i  for each task i
#   Outer loop  : update theta using the QUERY loss evaluated at theta&apos;_i
# -------------------------------------------------------------------

# Hyper-parameters
alpha = 0.1   # inner loop learning rate (task adaptation step size)
beta  = 0.01  # outer loop learning rate (meta-update step size)
n_meta_iterations = 100  # how many outer-loop steps to run
n_tasks_per_batch  = 4   # tasks sampled per outer step (episode)

# --- Toy task definition --------------------------------------------
# Each task is a 1-D regression: predict sin(x + phase) from x.
# Support set = a few (x, y) pairs; query set = held-out (x, y) pairs.
# Model: f(x; w) = w[0] * x + w[1]  (linear — just to keep math visible).

def sample_task(rng):
    phase = rng.uniform(0, np.pi)  # random sine phase defines the task
    x_support = rng.uniform(-np.pi, np.pi, size=5)
    y_support = np.sin(x_support + phase)
    x_query   = rng.uniform(-np.pi, np.pi, size=10)
    y_query   = np.sin(x_query + phase)
    return x_support, y_support, x_query, y_query

def predict(x, w):
    return w[0] * x + w[1]  # linear model for simplicity

def mse_loss(x, y, w):
    residuals = predict(x, w) - y
    return (residuals ** 2).mean()

def mse_grad(x, y, w):
    # Gradient of MSE loss w.r.t. w (closed form for linear model).
    residuals = predict(x, w) - y      # shape (n,)
    dw0 = 2 * (residuals * x).mean()   # d Loss / d w[0]
    dw1 = 2 * residuals.mean()          # d Loss / d w[1]
    return np.array([dw0, dw1])

# --- Meta-training --------------------------------------------------
rng   = np.random.default_rng(0)
theta = rng.normal(size=2)  # meta-initialization; this is what we optimize

for meta_step in range(n_meta_iterations):
    meta_grad = np.zeros_like(theta)  # accumulate outer gradient here

    for _ in range(n_tasks_per_batch):
        x_sup, y_sup, x_qry, y_qry = sample_task(rng)

        # INNER LOOP — adapt theta to this task using the support set.
        # In practice you can do k > 1 inner steps; here k = 1 for clarity.
        grad_support = mse_grad(x_sup, y_sup, theta)
        theta_prime  = theta - alpha * grad_support
        # theta_prime is task-specific; it is NOT used to update theta directly.
        # The key insight: theta_prime depends on theta through the inner step,
        # so the outer gradient flows BACK THROUGH this subtraction (second-order).

        # OUTER LOOP — evaluate QUERY loss at theta_prime.
        # First-order MAML (FOMAML) approximation: treat theta_prime as a constant
        # when computing the outer gradient, ignoring the Hessian term.
        # This is cheaper and works almost as well in practice.
        grad_query = mse_grad(x_qry, y_qry, theta_prime)
        meta_grad += grad_query  # accumulate across tasks in this batch

    # Meta-update: move theta in the direction that reduces query losses.
    # After many iterations, theta becomes a &apos;universal initialization&apos;:
    # any task can reach low query loss after one inner step from theta.
    theta = theta - beta * meta_grad / n_tasks_per_batch

    if meta_step % 20 == 0:
        print(f"Meta-step {meta_step:3d}  theta={theta}")

# --- Deployment: adapt to a new, unseen task in one step ------------
x_sup_new, y_sup_new, x_qry_new, y_qry_new = sample_task(rng)
theta_adapted = theta - alpha * mse_grad(x_sup_new, y_sup_new, theta)
query_loss = mse_loss(x_qry_new, y_qry_new, theta_adapted)
print(f"New task query loss after one adaptation step: {query_loss:.4f}")`}
      />

      <WorkedExample title="MAML Adaptation: A Concrete Trace">
        <p>
          Suppose theta = (1.0, 0.5) are two model parameters. On task T1, the support loss
          gradient is (-0.8, 0.2). We use inner learning rate alpha = 0.1.
        </p>
        <CalcStep number={1}>Inner update: theta&apos; = (1.0, 0.5) - 0.1 * (-0.8, 0.2) = (1.0 + 0.08, 0.5 - 0.02) = (1.08, 0.48)</CalcStep>
        <CalcStep number={2}>
          Evaluate query loss at theta&apos;. Suppose gradient of query loss w.r.t. theta&apos; is (-0.4, 0.6).
          By chain rule, gradient w.r.t. original theta passes through the inner update.
        </CalcStep>
        <CalcStep number={3}>
          For a single inner step, gradient w.r.t. theta = (I - alpha * H) * (-0.4, 0.6) where H is
          the Hessian of the support loss. In the first-order MAML approximation, we ignore H:
          meta-gradient approximately equals (-0.4, 0.6).
        </CalcStep>
        <CalcStep number={4}>
          Meta-update with beta = 0.01: theta &larr; (1.08, 0.48) - 0.01 * (-0.4, 0.6) = (1.084, 0.474).
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          After processing many tasks this way, theta converges to a point where a single step
          in any task&apos;s direction reliably improves query performance. The outer loop has shaped
          theta into a &quot;universal starting point&quot; for fast adaptation — not the best parameters
          for any individual task, but the best initialization across all of them.
        </p>
      </WorkedExample>
    </div>
  );
}
