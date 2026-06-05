'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="A Game With Two Players">
        <p>
          The interaction between G and D is formally a <strong>two-player minimax game</strong>.
          In game theory, a minimax game is one where one player tries to maximise a value
          function while the other tries to minimise it — they have perfectly opposite interests
          over the same score.
        </p>
        <p>
          D wants to <em>maximise</em> the value function V: it wants high scores for real images
          and low scores for fakes. G wants to <em>minimise</em> the same V: it wants its fakes
          to score high (fooling D), which reduces V from D&apos;s perspective.
        </p>
      </ExplanationBox>

      <MathFormula label="GAN minimax objective">
        {`V(G, D) = E[log D(x)] + E[log(1 − D(G(z)))]`}
      </MathFormula>

      <ExplanationBox title="Reading the Objective Term by Term">
        <p>
          The value function has two expectations (averages over many samples):
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>E[log D(x)]</strong> — average log-probability that D assigns &quot;real&quot;
            to actual real images x from the training set. When D is perfect on real data this
            term equals 0 (log 1 = 0). When D is confused it becomes very negative (log of a
            small number). D wants this term large → close to 0.
          </li>
          <li>
            <strong>E[log(1 − D(G(z)))]</strong> — average log-probability that D assigns
            &quot;fake&quot; to G&apos;s outputs. When D correctly calls every fake a fake,
            D(G(z)) ≈ 0 so log(1 − 0) = log 1 = 0 again. When G fools D perfectly,
            D(G(z)) ≈ 1 so log(1 − 1) → −∞. D wants this term large (close to 0); G wants
            it as small (as negative) as possible.
          </li>
        </ul>
        <p>
          Put together: <strong>D maximises V, G minimises V</strong>. Both are using gradient
          steps on the same equation but pulling in opposite directions.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Equilibrium: When Fakes Are Indistinguishable">
        <p>
          Goodfellow proved that the theoretical equilibrium of this game — the point where
          neither player can improve — is reached when the Generator has learned the true
          data distribution exactly. At that point every fake is statistically identical to a
          real image, so the best D can possibly do is guess randomly.
        </p>
        <p>
          At equilibrium: <strong>D(x) = 0.5 for every image x</strong>, real or fake.
          The detective can do no better than flipping a coin. When you train a GAN and see D
          hovering near 0.5, that is a sign that G has learned something meaningful — D has
          genuinely been fooled, not just confused by a poorly trained network.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Intuition: The Counterfeiter Gets Feedback">
        <p>
          Think about what gradient descent looks like for each player in our face example:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            G produces a blurry, smeared face. D easily scores it near 0. The gradient flowing
            back into G says: &quot;everything about this output screamed fake — change it.&quot;
            G adjusts its weights to produce sharper edges and more coherent structure.
          </li>
          <li>
            D sees G&apos;s improved output and is sometimes tricked. Its gradient says:
            &quot;you missed some subtle tells — pay attention to skin texture and eye symmetry.&quot;
            D adjusts to catch those patterns.
          </li>
        </ul>
        <p>
          Over thousands of iterations, this back-and-forth pushes G toward images that are
          realistic along every dimension D has learned to inspect — which, ideally, is every
          dimension that matters.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Here we define the loss functions for D and G using binary cross-entropy.
          This is illustrative PyTorch — read the comments to understand the minimax goal.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="gan.py"
        caption="Discriminator and Generator loss functions implementing the minimax objective with binary cross-entropy."
        code={`import torch
import torch.nn as nn

# --------------------------------------------------------------------------
# LOSS FUNCTIONS
# Both losses are built from the same primitive: Binary Cross-Entropy (BCE).
# BCE(p, y) = -[ y*log(p) + (1-y)*log(1-p) ]
# where p is the predicted probability and y is the true label (0 or 1).
# --------------------------------------------------------------------------

criterion = nn.BCELoss()  # PyTorch's Binary Cross-Entropy — averages over the batch

# Labels we'll reuse. Using .fill_() lets us resize to any batch on the fly.
REAL_LABEL = 1.0  # D should output ~1 for real images
FAKE_LABEL = 0.0  # D should output ~0 for fake images


def discriminator_loss(D, real_images, fake_images):
    # ------------------------------------------------------------------
    # D's goal (from the minimax objective):
    #   MAXIMISE  E[log D(x_real)] + E[log(1 - D(G(z)))]
    # Equivalently:
    #   MINIMISE  -E[log D(x_real)] - E[log(1 - D(G(z)))]
    # which is exactly BCE with label=1 on real and label=0 on fake.
    # ------------------------------------------------------------------

    batch_size = real_images.size(0)

    # --- Part 1: real images should score close to 1 ---
    real_labels = torch.ones(batch_size)          # target = 1 (real)
    real_scores = D(real_images)                  # D's prediction on real data
    loss_real = criterion(real_scores, real_labels)
    # When D is right, real_scores ~ 1 and BCE ~ 0.
    # When D is wrong, real_scores ~ 0 and BCE is large (bad for D).

    # --- Part 2: fake images should score close to 0 ---
    fake_labels = torch.zeros(batch_size)         # target = 0 (fake)
    fake_scores = D(fake_images.detach())         # .detach() stops gradients flowing into G
    # We detach because we are training D here, not G — G's weights must not change.
    loss_fake = criterion(fake_scores, fake_labels)
    # When D is right, fake_scores ~ 0 and BCE ~ 0.
    # When D is fooled, fake_scores ~ 1 and BCE is large (bad for D).

    # Total D loss: sum of both terms — D minimises this
    loss_D = loss_real + loss_fake
    return loss_D


def generator_loss(D, fake_images):
    # ------------------------------------------------------------------
    # G's goal: fool D into calling its fakes real.
    # Minimax form: MINIMISE  E[log(1 - D(G(z)))]   -- saturates early!
    # Non-saturating form (used in practice):
    #   MINIMISE  -E[log D(G(z))]
    # which is BCE with label=1 on fake images (G wants D to say "real").
    # ------------------------------------------------------------------

    batch_size = fake_images.size(0)

    # G wants D to output 1 for its fakes, so we use REAL labels here.
    # This is intentional and is NOT a bug — it is the non-saturating trick.
    real_labels = torch.ones(batch_size)          # G's desired outcome: D says "real"
    fake_scores = D(fake_images)                  # no detach — gradient must flow back through G
    loss_G = criterion(fake_scores, real_labels)
    # When G fools D, fake_scores ~ 1 and BCE ~ 0 (G is happy).
    # When D catches G, fake_scores ~ 0 and BCE is large (G must improve).

    return loss_G


# --------------------------------------------------------------------------
# Why does G use REAL labels on fake images?
# It is the mathematical equivalent of maximising log D(G(z)).
# BCE(D(G(z)), 1) = -log D(G(z))   <-- exactly G's non-saturating loss
# This gradient is steep when D(G(z)) is small, giving G a strong signal
# right at the start of training when it needs it most.
# --------------------------------------------------------------------------`}
      />
    </div>
  );
}
