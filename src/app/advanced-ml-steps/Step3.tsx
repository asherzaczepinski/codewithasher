'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="What Is an Adversarial Example?">
        <p>
          In 2013, researchers discovered something unsettling: you could take an image a neural
          network classifies correctly with high confidence, add a tiny amount of carefully
          crafted noise — imperceptible to a human — and the network would confidently output
          a completely wrong label. A panda becomes a gibbon. A stop sign becomes a speed limit sign.
        </p>
        <p>
          These are <strong>adversarial examples</strong>. The perturbation is not random noise;
          it is constructed to maximally exploit the model&apos;s sensitivities. The model has learned
          to rely on high-frequency texture patterns that are invisible to us but easy to manipulate.
        </p>
        <p>
          Adversarial examples expose the gap between a model&apos;s learned decision boundary and
          human perception. Two inputs that look identical to us can sit on opposite sides of the
          model&apos;s boundary. That gap is a vulnerability.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fast Gradient Sign Method (FGSM)">
        <p>
          The simplest and most influential adversarial attack is the <strong>Fast Gradient Sign
          Method</strong>, introduced by Goodfellow et al. in 2014. The idea is elegant: instead
          of optimizing weights to reduce the loss (as in training), we optimize the <em>input</em>
          to increase the loss, while keeping the perturbation small.
        </p>
        <p>
          We compute the gradient of the loss with respect to the input pixels, then take a small
          step in the direction that increases the loss most. Taking the <em>sign</em> of the
          gradient (rather than the gradient itself) keeps the perturbation bounded in the
          infinity-norm sense — every pixel changes by at most epsilon.
        </p>
      </ExplanationBox>

      <MathFormula label="FGSM Perturbation">
        x_adv = x + epsilon &middot; sign( gradient_x L(theta, x, y) )
      </MathFormula>

      <ExplanationBox title="Unpacking the Formula">
        <p>
          <strong>x</strong> is the original input. <strong>y</strong> is the true label.
          <strong>L(theta, x, y)</strong> is the loss (e.g. cross-entropy) evaluated at
          parameters theta. <strong>gradient_x L</strong> is the gradient of the loss
          with respect to every input dimension — computed by backpropagation through the
          network all the way to the input.
        </p>
        <p>
          <strong>sign(...)</strong> returns +1 or -1 for each dimension. Multiplying by epsilon
          gives a perturbation where every pixel moves by exactly epsilon in the direction that
          hurts the model most. The result x_adv looks identical to x to a human viewer
          (for small epsilon like 0.01 in normalized pixel space) but reliably fools the model.
        </p>
        <p>
          Stronger attacks like PGD (Projected Gradient Descent) iterate this step multiple times,
          projecting back into the allowed perturbation ball after each step, producing much
          stronger adversarial examples.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Adversarial Training">
        <p>
          The most effective known defense is <strong>adversarial training</strong>: augment
          the training set with adversarial examples generated on-the-fly, and minimize the
          loss on both clean and adversarial inputs simultaneously.
        </p>
        <p>
          Formally, adversarial training solves a min-max problem: the outer minimization over
          model parameters tries to minimize the worst-case loss, while the inner maximization
          over perturbations tries to find the most damaging input within the allowed budget.
          This is the Madry et al. formulation that underlies most certified defense methods.
        </p>
      </ExplanationBox>

      <MathFormula label="Adversarial Training Objective (Madry et al.)">
        min_theta E[(x,y)] [ max_(delta: ||delta|| &lt;= epsilon) L(theta, x + delta, y) ]
      </MathFormula>

      <ExplanationBox title="Why Robustness Matters for Safety">
        <p>
          In a research benchmark, a 1% accuracy drop from an attack is an annoyance. In a
          deployed safety-critical system, it can be catastrophic. Autonomous vehicles must
          recognize traffic signs under adversarial stickers placed by an attacker. Medical
          imaging classifiers must be robust to small corruptions introduced by equipment
          variation. Fraud detection models face adversaries who actively probe and evade them.
        </p>
        <p>
          There is a fundamental <strong>robustness-accuracy trade-off</strong>: adversarially
          trained models are typically a few percentage points less accurate on clean data than
          standard models, because they sacrifice reliance on brittle high-frequency features.
          Closing this gap is an active research area. Certified defenses use formal verification
          to guarantee that no perturbation within a given bound can change the prediction —
          but these guarantees currently only scale to small networks and small epsilon.
        </p>
        <p>
          Robustness is not optional for real-world ML. It is a prerequisite for trust.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>The snippet below shows FGSM in NumPy-style pseudocode. In a real PyTorch workflow
        you would call <code>loss.backward()</code> to populate <code>x.grad</code>, but the
        arithmetic is identical — the comments are the lesson.</p>
      </ExplanationBox>

      <CodeBlock
        filename="fgsm.py"
        caption="FGSM: craft an adversarial example by stepping the input in the sign direction of the loss gradient."
        code={`import numpy as np

# -------------------------------------------------------------------
# Fast Gradient Sign Method (FGSM) — Goodfellow et al. 2014
# Goal: find x_adv near x such that the model mis-classifies it.
# We move x in the direction that INCREASES the loss, not decreases it.
# -------------------------------------------------------------------

def fgsm(x, grad_x_loss, epsilon=0.01):
    # x            : original input, shape (n_features,)
    # grad_x_loss  : gradient of cross-entropy loss w.r.t. x
    #                (same shape as x; obtained via backprop in PyTorch)
    # epsilon      : perturbation budget (infinity-norm constraint)
    # Returns      : adversarial example x_adv

    # sign() maps each gradient component to +1 or -1.
    # This ensures every feature moves by EXACTLY epsilon —
    # no gradient magnitude information is used, only direction.
    perturbation = epsilon * np.sign(grad_x_loss)

    # Add the perturbation to the original input.
    # The result is indistinguishable to a human for small epsilon,
    # but reliably increases the model loss (and often flips the label).
    x_adv = x + perturbation

    # Optional: clip to valid pixel range so the image stays realistic.
    # For normalized inputs this is typically [0.0, 1.0].
    x_adv = np.clip(x_adv, 0.0, 1.0)

    return x_adv


# --- Toy example ---------------------------------------------------
# Two-dimensional input: think of each dimension as one pixel value.
x = np.array([0.5, 0.8])

# Gradient of loss w.r.t. x, as if backprop gave us this.
# Positive gradient on dim-0 means increasing dim-0 raises the loss.
grad = np.array([3.0, -1.5])

x_adv = fgsm(x, grad, epsilon=0.1)
# sign(3.0) = +1  -> dim-0 increases by 0.1  (pushes loss up)
# sign(-1.5) = -1 -> dim-1 decreases by 0.1  (pushes loss up)
# x_adv = [0.6, 0.7]  — visually identical, potentially model-fooling.
print("original:", x)      # [0.5, 0.8]
print("adversarial:", x_adv)  # [0.6, 0.7]
print("perturbation inf-norm:", np.max(np.abs(x_adv - x)))  # 0.1 = epsilon`}
      />

      <WorkedExample title="FGSM Step by Step">
        <p>
          Suppose a simple model assigns loss L = 0.2 to a clean input x = (0.5, 0.8).
          After backpropagation to the input, the gradient is gradient_x L = (3.0, -1.5).
          We attack with epsilon = 0.1.
        </p>
        <CalcStep number={1}>Compute sign of gradient: sign(3.0, -1.5) = (+1, -1)</CalcStep>
        <CalcStep number={2}>Scale by epsilon: 0.1 * (+1, -1) = (+0.1, -0.1)</CalcStep>
        <CalcStep number={3}>Add to original input: x_adv = (0.5 + 0.1, 0.8 - 0.1) = (0.6, 0.7)</CalcStep>
        <CalcStep number={4}>
          The perturbation (0.1, -0.1) has infinity-norm 0.1 = epsilon. It moved both inputs
          by the maximum allowed amount in their most damaging direction.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Re-evaluating the model on x_adv now yields a much higher loss — often enough to flip
          the prediction entirely — despite the input changing by only 0.1 in each dimension.
          If the input were a normalized image, this corresponds to an average pixel shift of
          about 25 out of 255, which is barely perceptible.
        </p>
      </WorkedExample>
    </div>
  );
}
