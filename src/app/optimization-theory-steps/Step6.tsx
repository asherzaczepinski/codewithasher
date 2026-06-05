'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Overfitting: When the Model Learns Noise">
        <p>
          A model <strong>overfits</strong> when it learns the training data so precisely that
          it picks up random noise rather than the true underlying pattern. The training loss
          falls beautifully, but the test loss diverges upward because the noise the model
          memorized is different in the test set.
        </p>
        <p>
          The root cause is usually <em>too much model capacity relative to the amount of
          data</em>. A model with millions of parameters and only a thousand training examples
          has the freedom to perfectly fit every quirk in the training set. Regularization
          penalizes complexity and pushes back against this freedom.
        </p>
      </ExplanationBox>

      <ExplanationBox title="L2 Regularization (Ridge): Shrink Weights Toward Zero">
        <p>
          <strong>L2 regularization</strong> adds a penalty equal to the sum of squared
          weights, scaled by a hyperparameter &lambda;. This penalty is added directly to
          the loss function. A larger &lambda; imposes a stronger preference for small weights.
        </p>
        <p>
          The intuition: large weights are dangerous because they make the model&apos;s output
          swing wildly in response to small input changes. Penalizing large weights keeps the
          model smooth and stable. Geometrically, L2 shrinks every weight toward zero by a
          constant fraction each step &mdash; which is why it is also called
          <strong> weight decay</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="L2 regularized loss">
        L_total = L_data + &lambda; &times; &Sigma; w_i&sup2;
      </MathFormula>

      <MathFormula label="L2 gradient update (weight decay)">
        w_new = w_old &minus; &alpha; &times; (&nabla;L_data + 2&lambda; &times; w_old){'\n'}
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = w_old &times; (1 &minus; 2&alpha;&lambda;) &minus; &alpha; &times; &nabla;L_data
      </MathFormula>

      <ExplanationBox title="L1 Regularization (Lasso): Push Weights to Exactly Zero">
        <p>
          <strong>L1 regularization</strong> adds a penalty equal to the sum of <em>absolute
          values</em> of weights. This subtle change from squared to absolute value has a
          dramatic effect: L1 drives many weights to <strong>exactly zero</strong>, producing
          a sparse model.
        </p>
        <p>
          Why does L1 create sparsity but L2 does not? Geometrically, L1&apos;s constraint
          region is a diamond (in 2D) with sharp corners that sit exactly on the coordinate
          axes. The optimal solution tends to land on a corner, forcing some weights to zero.
          L2&apos;s constraint region is a smooth sphere with no corners, so solutions land
          on the surface but rarely exactly on an axis.
        </p>
        <p>
          L1 is the engine behind <strong>feature selection</strong>: in a linear model it
          automatically identifies which input features matter and sets the rest to zero.
        </p>
      </ExplanationBox>

      <MathFormula label="L1 regularized loss">
        L_total = L_data + &lambda; &times; &Sigma; |w_i|
      </MathFormula>

      <ExplanationBox title="Elastic Net: Combine L1 and L2">
        <p>
          <strong>Elastic Net</strong> (Zou &amp; Hastie, 2005) interpolates between L1 and
          L2 using a mixing ratio &rho;. When &rho; = 1 it is pure L1; when &rho; = 0 it is
          pure L2. In practice it often outperforms either alone because it gets sparsity from
          L1 and stability from L2 when features are correlated.
        </p>
      </ExplanationBox>

      <MathFormula label="Elastic Net penalty">
        L_total = L_data + &lambda; &times; [&rho; &times; &Sigma;|w_i| + (1&minus;&rho;) &times; &Sigma;w_i&sup2;]
      </MathFormula>

      <WorkedExample title="L2 Penalty Effect: One Parameter Update">
        <p>
          Suppose a model has a single weight w = 5.0. The data gradient is &nabla;L_data = 1.0.
          We use &alpha; = 0.1 and &lambda; = 0.5. Let&apos;s compare unregularized vs. L2
          regularized updates.
        </p>
        <CalcStep number={1}>
          Without regularization: w_new = 5.0 &minus; 0.1 &times; 1.0 = 4.900
        </CalcStep>
        <CalcStep number={2}>
          L2 gradient term: 2 &times; &lambda; &times; w = 2 &times; 0.5 &times; 5.0 = 5.0
        </CalcStep>
        <CalcStep number={3}>
          Total gradient with L2: 1.0 + 5.0 = 6.0
        </CalcStep>
        <CalcStep number={4}>
          With L2: w_new = 5.0 &minus; 0.1 &times; 6.0 = 5.0 &minus; 0.6 = 4.400
        </CalcStep>
        <CalcStep number={5}>
          Difference: L2 caused an extra pull of 0.5 toward zero on top of the 0.1 data step.
        </CalcStep>
        <CalcStep number={6}>
          Equivalently using the weight-decay form: w_new = 5.0 &times; (1 &minus; 2&times;0.1&times;0.5) &minus; 0.1&times;1.0 = 5.0&times;0.9 &minus; 0.1 = 4.5 &minus; 0.1 = 4.400. Same answer.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The larger the weight, the stronger the pull toward zero. A weight of 0.1 would
          only see an extra gradient of 2&times;0.5&times;0.1 = 0.1, far smaller. L2
          automatically imposes a proportional correction, keeping large weights from growing
          unchecked while barely touching small weights.
        </p>
      </WorkedExample>

      <ExplanationBox title="Choosing &lambda;: Bias-Variance Trade-Off">
        <p>
          The regularization strength &lambda; controls the trade-off between fitting the
          training data and keeping weights small:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>&lambda; too small</strong> &mdash; essentially no regularization,
            overfitting returns. The model memorizes training noise.
          </li>
          <li>
            <strong>&lambda; too large</strong> &mdash; weights are crushed to near zero
            regardless of the data. The model becomes too simple to fit any real pattern
            (underfitting, high bias).
          </li>
          <li>
            <strong>&lambda; just right</strong> &mdash; found by cross-validation. Train with
            several candidate values and pick the one with the lowest validation loss.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          A side-by-side comparison of an unregularized gradient step, an L2-penalized step,
          and an L1-penalized step. Pay attention to how the sign of the penalty gradient
          changes with the sign of each weight for L1 &mdash; that is what drives weights to
          exactly zero.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="regularization.py"
        caption="L2 pulls each weight proportionally to its magnitude; L1 pulls with a fixed force regardless of magnitude — that asymmetry is why L1 zeroes weights out while L2 merely shrinks them."
        code={`import numpy as np

# ── Setup ──────────────────────────────────────────────────────────────────────
# A small weight vector with intentionally varied magnitudes to show the
# difference in how L1 and L2 treat large vs small weights.
w = np.array([ 5.0,  0.3, -2.1,  0.01, -0.5])

# Gradient of the data loss at the current w (pretend these came from backprop).
grad_data = np.array([ 1.0, -0.5,  0.8,  0.2,  0.3])

lr     = 0.1   # learning rate
lam    = 0.5   # regularization strength lambda


# ── Baseline: no regularization ────────────────────────────────────────────────
w_unregularized = w - lr * grad_data
# Each weight moves purely in the direction that reduces the data loss.
# No preference about weight size at all.


# ── L2 regularization (Ridge / weight decay) ───────────────────────────────────
# The L2 penalty term in the loss is: lambda * sum(w_i^2)
# Its gradient w.r.t. w_i is: 2 * lambda * w_i
# So the full gradient is: grad_data + 2*lambda*w  (element-wise)

grad_l2_penalty = 2.0 * lam * w
# Key insight: this penalty is PROPORTIONAL to w.
#   w=5.0  -> penalty gradient = 5.0  (big extra pull toward zero)
#   w=0.01 -> penalty gradient = 0.01 (tiny extra pull, almost no effect)
# L2 is hardest on large weights and gentle on small ones.

w_l2 = w - lr * (grad_data + grad_l2_penalty)


# ── L1 regularization (Lasso) ─────────────────────────────────────────────────
# The L1 penalty term in the loss is: lambda * sum(|w_i|)
# Its gradient w.r.t. w_i is: lambda * sign(w_i)
# (sign is +1 if w>0, -1 if w<0, 0 if w=0)

grad_l1_penalty = lam * np.sign(w)
# Key insight: the penalty gradient has CONSTANT magnitude (lambda) regardless of |w|.
#   w=5.0  -> penalty gradient = +0.5  (pulls toward zero, same force as for w=0.01)
#   w=0.01 -> penalty gradient = +0.5  (same force! so a tiny weight can be zeroed)
# This equal-force property is exactly why L1 drives small weights to exactly 0.

w_l1 = w - lr * (grad_data + grad_l1_penalty)


# ── Print comparison ───────────────────────────────────────────────────────────
print(f"{'weight':>8}  {'unregul':>9}  {'L2':>9}  {'L1':>9}")
for i in range(len(w)):
    print(f"{w[i]:>8.3f}  {w_unregularized[i]:>9.4f}  {w_l2[i]:>9.4f}  {w_l1[i]:>9.4f}")

# Notice:
#  - w=5.0:  L2 shrinks it aggressively (large proportional pull); L1 equal pull
#  - w=0.01: L2 barely changes it; L1 yanks it hard -- likely to cross zero and be clipped
#  In production you clip weights at 0 after an L1 step (or use proximal gradient methods).`}
      />
    </div>
  );
}
