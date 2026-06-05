'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Problem Momentum Does Not Solve">
        <p>
          Momentum smooths gradient noise and accelerates through flat regions, but it still
          uses the <em>same</em> learning rate for every parameter. In a neural network with
          millions of weights, different parameters live in very different gradient regimes:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            A weight connected to a common feature might receive large, frequent gradient
            signals. A fixed &alpha; of 0.01 causes it to overshoot.
          </li>
          <li>
            A weight connected to a rare feature might see gradients near zero on most batches.
            The same &alpha; of 0.01 is far too small to move it meaningfully.
          </li>
        </ul>
        <p>
          The solution is <strong>per-parameter adaptive learning rates</strong>: let the
          optimizer track each parameter&apos;s gradient history and automatically scale its
          step size accordingly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="AdaGrad: Accumulate All Squared Gradients">
        <p>
          <strong>AdaGrad</strong> (Duchi et al., 2011) keeps a running sum G of squared
          gradients for each parameter and divides the learning rate by the square root of G.
          Parameters that have received large gradients get a smaller effective step; parameters
          with historically small gradients get a larger one.
        </p>
      </ExplanationBox>

      <MathFormula label="AdaGrad update (per parameter)">
        G = G + (&nabla;L)&sup2;{'\n'}
        w_new = w_old &minus; (&alpha; / &radic;(G + &epsilon;)) &times; &nabla;L
      </MathFormula>

      <ExplanationBox title="AdaGrad&apos;s Fatal Flaw">
        <p>
          Because G only ever grows (we are summing squares, which are always positive), the
          effective learning rate shrinks monotonically and eventually reaches essentially zero.
          AdaGrad&apos;s steps become infinitesimally small long before the model converges.
          This makes it unsuitable for deep networks trained over many epochs, though it works
          well for sparse, shallow problems like text models where parameters naturally stop
          receiving gradients once they&apos;ve been updated.
        </p>
      </ExplanationBox>

      <ExplanationBox title="RMSProp: Replace the Sum With a Decaying Average">
        <p>
          <strong>RMSProp</strong> (Hinton, unpublished lecture notes, 2012) fixes AdaGrad by
          replacing the cumulative sum with an <strong>exponential moving average</strong> of
          squared gradients. Old gradients fade away, so the denominator reflects recent
          gradient magnitude rather than all-time history.
        </p>
      </ExplanationBox>

      <MathFormula label="RMSProp update (per parameter)">
        v = &beta; &times; v + (1&minus;&beta;) &times; (&nabla;L)&sup2;{'\n'}
        w_new = w_old &minus; (&alpha; / &radic;(v + &epsilon;)) &times; &nabla;L
      </MathFormula>

      <ExplanationBox title="Adam: Marry Momentum and RMSProp">
        <p>
          <strong>Adam</strong> (Adaptive Moment Estimation, Kingma &amp; Ba, 2015) combines
          both ideas simultaneously. It maintains two exponential moving averages:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>m (first moment)</strong> &mdash; a moving average of the gradients
            themselves. This is exactly momentum: it smooths the step direction.
          </li>
          <li>
            <strong>v (second moment)</strong> &mdash; a moving average of the <em>squared</em>
            gradients. This is the RMSProp denominator: it scales each parameter&apos;s step
            size by recent gradient magnitude.
          </li>
        </ul>
        <p>
          Because both m and v are initialized to zero, they are biased toward zero in the
          early steps of training. Adam corrects for this with <strong>bias-correction
          terms</strong> that divide by (1&minus;&beta;&sup1;) and (1&minus;&beta;&sup2;),
          growing toward 1 as training progresses and the estimates warm up.
        </p>
      </ExplanationBox>

      <MathFormula label="Adam full update (per parameter, step t)">
        m = &beta;1 &times; m + (1&minus;&beta;1) &times; &nabla;L{'\n'}
        v = &beta;2 &times; v + (1&minus;&beta;2) &times; (&nabla;L)&sup2;{'\n'}
        m_hat = m / (1&minus;&beta;1^t){'\n'}
        v_hat = v / (1&minus;&beta;2^t){'\n'}
        w_new = w_old &minus; &alpha; &times; m_hat / (&radic;v_hat + &epsilon;)
      </MathFormula>

      <ExplanationBox title="Adam Default Hyperparameters">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>&alpha; = 0.001</strong> &mdash; the global learning rate. Often the only value practitioners tune.</li>
          <li><strong>&beta;1 = 0.9</strong> &mdash; momentum decay. Retains ~10 steps of gradient history.</li>
          <li><strong>&beta;2 = 0.999</strong> &mdash; second-moment decay. Retains ~1000 steps of squared-gradient history for stable scaling.</li>
          <li><strong>&epsilon; = 1e&minus;8</strong> &mdash; prevents division by zero when v_hat is tiny.</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Adam: First Two Steps on a Single Parameter">
        <p>
          Let w = 1.0, &alpha; = 0.001, &beta;1 = 0.9, &beta;2 = 0.999, &epsilon; = 1e&minus;8.
          Suppose the gradient is consistently 0.5.
        </p>
        <CalcStep number={1}>
          Step t=1: m = 0.9&times;0 + 0.1&times;0.5 = 0.050 &nbsp;|&nbsp; v = 0.999&times;0 + 0.001&times;0.25 = 0.000250
        </CalcStep>
        <CalcStep number={2}>
          Bias-correct: m_hat = 0.050 / (1&minus;0.9) = 0.500 &nbsp;|&nbsp; v_hat = 0.000250 / (1&minus;0.999) = 0.250
        </CalcStep>
        <CalcStep number={3}>
          Step size: 0.001 &times; 0.500 / (&radic;0.250 + 1e&minus;8) = 0.001 &times; 0.500 / 0.500 = 0.001
        </CalcStep>
        <CalcStep number={4}>
          w after step 1: 1.000 &minus; 0.001 = 0.999
        </CalcStep>
        <CalcStep number={5}>
          Step t=2: m = 0.9&times;0.050 + 0.1&times;0.5 = 0.095 &nbsp;|&nbsp; v = 0.999&times;0.000250 + 0.001&times;0.25 = 0.000500
        </CalcStep>
        <CalcStep number={6}>
          Bias-correct: m_hat = 0.095 / (1&minus;0.81) = 0.500 &nbsp;|&nbsp; v_hat = 0.000500 / (1&minus;0.998) = 0.250
        </CalcStep>
        <CalcStep number={7}>
          Step size: 0.001 &times; 0.500 / 0.500 = 0.001 again. w = 0.999 &minus; 0.001 = 0.998
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice that for a consistent gradient the effective step size equals exactly &alpha; = 0.001.
          The magic of Adam appears when different parameters have different gradient magnitudes:
          the parameter with gradient 10.0 gets a step size of roughly 0.001&times;1 = 0.001,
          and the parameter with gradient 0.001 also gets roughly 0.001&times;1 = 0.001 &mdash; both
          get comparable steps regardless of raw gradient scale.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Adam Is the Default">
        <p>
          Adam requires almost no tuning: the defaults &beta;1=0.9, &beta;2=0.999, &epsilon;=1e&minus;8
          work well across image classification, language modeling, reinforcement learning, and
          generative models. The bias correction prevents the cold-start instability that would
          otherwise cause large steps in the first few iterations. And because each parameter
          has its own adaptive rate, Adam handles heterogeneous gradient scales that would
          cause a fixed-rate optimizer to diverge on some parameters and stagnate on others.
        </p>
        <p>
          Variants like <strong>AdamW</strong> (Adam with decoupled weight decay) are now
          standard in transformers and large language models &mdash; the core update is identical
          but the regularization term is applied directly to the weights rather than through the
          gradient, which corrects an interaction that causes Adam to underregularize.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          A complete Adam optimizer written from scratch. Every line maps directly to the
          equations above &mdash; reading the comments shows exactly how bias correction
          rescues the first few steps from being too small.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="adam_optimizer.py"
        caption="Full Adam update loop from scratch — m is the momentum term, v is the per-parameter scale, and bias-correction ensures step 1 is not near-zero."
        code={`import numpy as np

def adam_optimizer(grad_fn, w_init, n_steps=20,
                   lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):
    # Run Adam for n_steps starting from w_init.
    #
    # grad_fn  -- callable that returns the gradient at a given w
    # w_init   -- starting parameter vector (numpy array)
    # lr       -- global learning rate (alpha); usually the only thing you tune
    # beta1    -- exponential decay for the 1st moment (gradient mean / momentum)
    # beta2    -- exponential decay for the 2nd moment (gradient variance / RMSProp)
    # eps      -- small constant preventing division by zero when v_hat is tiny
    w  = w_init.copy()      # current parameter vector
    m  = np.zeros_like(w)   # 1st moment: running mean of gradients (starts at 0)
    v  = np.zeros_like(w)   # 2nd moment: running mean of squared gradients (starts at 0)

    history = []

    for t in range(1, n_steps + 1):  # t starts at 1 (used in bias-correction exponents)

        g = grad_fn(w)  # gradient of the loss w.r.t. w at the current point

        # ── 1st moment update (momentum) ───────────────────────────────────────
        # Smoothed gradient direction -- like a running average of past gradients.
        # beta1=0.9 means "carry 90% of last estimate, blend in 10% of new gradient."
        m = beta1 * m + (1.0 - beta1) * g

        # ── 2nd moment update (per-parameter scaling) ──────────────────────────
        # Smoothed squared gradient -- tracks how large gradients have been recently.
        # Large v_hat -> small effective step (parameter has been updating a lot).
        # Small v_hat -> large effective step (parameter has been starved of signal).
        v = beta2 * v + (1.0 - beta2) * (g ** 2)

        # ── Bias correction ────────────────────────────────────────────────────
        # At t=1: m is very close to 0 because we multiplied by (1-beta1)=0.1.
        # Dividing by (1 - beta1^t) rescales it back toward the true gradient mean.
        # This correction fades away as t grows (beta1^t -> 0 for large t).
        m_hat = m / (1.0 - beta1 ** t)   # corrected 1st moment
        v_hat = v / (1.0 - beta2 ** t)   # corrected 2nd moment

        # ── Parameter update ───────────────────────────────────────────────────
        # Divide the momentum direction by the sqrt of recent gradient magnitudes.
        # Effect: parameters that have seen large gradients get smaller steps,
        # parameters that have seen tiny gradients get comparably sized steps.
        w = w - lr * m_hat / (np.sqrt(v_hat) + eps)

        history.append((t, w.copy(), float(np.linalg.norm(g))))

    return w, history


# ── Example: minimize f(w) = w^2 + 2w, gradient = 2w + 2 ─────────────────────
def grad_quadratic(w):
    return 2.0 * w + 2.0  # minimum is at w = -1

w0 = np.array([3.0])
w_final, hist = adam_optimizer(grad_quadratic, w0, n_steps=20)

for t, wt, gnorm in hist:
    print(f"step {t:2d}  w = {wt[0]: .5f}  |g| = {gnorm:.5f}")

# w converges smoothly toward -1.0 within ~20 steps despite a large initial gradient.`}
      />
    </div>
  );
}
