'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Two Phases per Iteration">
        <p>
          GAN training alternates between two phases every iteration. It is crucial that the
          two networks have <em>separate</em> optimisers and that only one set of weights is
          updated at a time — otherwise the gradients from both objectives would interfere.
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Phase 1 — Train D.</strong> Freeze G&apos;s weights. Sample a mini-batch of
            real images and a mini-batch of fakes from G. Compute D&apos;s binary cross-entropy
            loss across both batches and take a gradient step to maximise it (or equivalently,
            minimise the negative).
          </li>
          <li>
            <strong>Phase 2 — Train G.</strong> Freeze D&apos;s weights. Sample a new batch of
            noise vectors, pass them through G to get fakes, pass those fakes through the frozen
            D, and compute G&apos;s loss. Take a gradient step to minimise it.
          </li>
        </ul>
        <p>
          In practice many implementations run Phase 1 once and Phase 2 once per iteration,
          but the ratio can be tuned (e.g. train D for k steps for every 1 step of G).
        </p>
      </ExplanationBox>

      <MathFormula label="Discriminator loss (binary cross-entropy, to minimise)">
        L_D = −[log D(x_real) + log(1 − D(G(z)))]
      </MathFormula>

      <MathFormula label="Generator loss (non-saturating form, to minimise)">
        L_G = −log D(G(z))
      </MathFormula>

      <ExplanationBox title="Why the Non-Saturating Form for G?">
        <p>
          The original minimax objective for G is to minimise log(1 − D(G(z))). Early in
          training, when G produces obvious garbage, D(G(z)) ≈ 0, so log(1 − 0) ≈ 0 and the
          gradient is nearly flat — G learns very slowly. Goodfellow&apos;s practical fix:
          instead have G <em>maximise</em> log D(G(z)), equivalently minimise −log D(G(z)).
          When D(G(z)) is small the gradient is steep, giving G a strong learning signal
          right when it needs it most.
        </p>
      </ExplanationBox>

      <WorkedExample title="Loss Calculation for One Real and One Fake Sample">
        <p>
          Suppose D outputs the following for two samples in a mini-batch:
        </p>
        <CalcStep number={1}>
          Real image x_real: D(x_real) = 0.85 (D thinks it&apos;s probably real — correct)
        </CalcStep>
        <CalcStep number={2}>
          Fake image G(z): D(G(z)) = 0.40 (D thinks it might be real — partially fooled)
        </CalcStep>
        <CalcStep number={3}>
          D&apos;s loss contribution from the real image: −log(0.85) ≈ −(−0.163) = 0.163
        </CalcStep>
        <CalcStep number={4}>
          D&apos;s loss contribution from the fake image: −log(1 − 0.40) = −log(0.60) ≈ 0.511
        </CalcStep>
        <CalcStep number={5}>
          Total L_D = 0.163 + 0.511 = 0.674 — D will update its weights to push this lower by
          becoming more confident: D(x_real) → 1 and D(G(z)) → 0.
        </CalcStep>
        <CalcStep number={6}>
          G&apos;s loss for the same fake: −log(D(G(z))) = −log(0.40) ≈ 0.916 — G will update
          its weights to push D(G(z)) higher, toward 1, making the fake harder to detect.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice the tension: D wants to drive D(G(z)) toward 0, which would make G&apos;s loss
          explode. G wants to drive D(G(z)) toward 1, which would make D&apos;s loss explode.
          Training is a tug-of-war between these two opposing gradients.
        </p>
      </WorkedExample>

      <ExplanationBox title="What Gradients Flow Where">
        <p>
          During Phase 1 (training D), the error signal flows backward through D only.
          G&apos;s weights are frozen so no gradient reaches them — G does not change.
        </p>
        <p>
          During Phase 2 (training G), the fake image G(z) is passed through D to get a score.
          The gradient then flows backward through D (to compute how the score changes with the
          image pixels) and continues through G (to compute how the image pixels change with G&apos;s
          weights). D&apos;s weights are frozen during this phase — only G updates.
        </p>
        <p>
          This chain of differentiation through two networks is standard backpropagation;
          frameworks like PyTorch handle it automatically as long as you freeze the right
          parameters at the right time.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The alternating training loop in PyTorch. This is illustrative code — simplified
          to make the two-phase structure as clear as possible.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="gan.py"
        caption="The alternating GAN training loop: train D on real and fake, then train G to fool D."
        code={`import torch
import torch.nn as nn

# --------------------------------------------------------------------------
# SETUP — optimisers and loss (building on the networks from Step 2)
# --------------------------------------------------------------------------

LATENT_DIM = 100
LR = 0.0002          # learning rate — classic GAN default from the DCGAN paper
BETA1 = 0.5          # Adam beta1: 0.5 is recommended for GANs (less momentum than default 0.9)
BETA2 = 0.999        # Adam beta2: standard

# Each network gets its own optimiser so they update independently.
# Passing only D.parameters() to opt_D means G's weights are invisible to it, and vice versa.
opt_D = torch.optim.Adam(D.parameters(), lr=LR, betas=(BETA1, BETA2))
opt_G = torch.optim.Adam(G.parameters(), lr=LR, betas=(BETA1, BETA2))

criterion = nn.BCELoss()  # Binary Cross-Entropy loss — used by both phases


# --------------------------------------------------------------------------
# TRAINING LOOP
# dataloader yields batches of real images from the training set.
# Each iteration = one "round" of the minimax game.
# --------------------------------------------------------------------------

NUM_EPOCHS = 50

for epoch in range(NUM_EPOCHS):
    for real_images in dataloader:               # real_images shape: (batch, C, H, W)

        batch_size = real_images.size(0)

        # ==================================================================
        # PHASE 1 — TRAIN THE DISCRIMINATOR
        # Goal: D should output 1 for real images and 0 for fakes.
        # We update D's weights; G's weights do NOT change here.
        # ==================================================================

        opt_D.zero_grad()   # clear D's gradients from the previous iteration

        # --- Score real images (target label = 1) ---
        real_labels = torch.ones(batch_size)     # we want D(x_real) -> 1
        real_scores = D(real_images)
        loss_D_real = criterion(real_scores, real_labels)

        # --- Generate fake images, score them (target label = 0) ---
        noise = torch.randn(batch_size, LATENT_DIM)  # sample fresh noise every iteration
        fake_images = G(noise)                         # G produces fakes — no grad for G yet
        fake_labels = torch.zeros(batch_size)          # we want D(G(z)) -> 0
        # .detach() is critical: stops gradients from flowing back into G during Phase 1.
        # Without it, PyTorch would accumulate G's gradients now and confuse Phase 2.
        fake_scores = D(fake_images.detach())
        loss_D_fake = criterion(fake_scores, fake_labels)

        loss_D = loss_D_real + loss_D_fake       # total discriminator loss
        loss_D.backward()                         # compute gradients for D only
        opt_D.step()                              # update D's weights

        # ==================================================================
        # PHASE 2 — TRAIN THE GENERATOR
        # Goal: G should produce fakes that D scores close to 1 (D is fooled).
        # We update G's weights; D's weights do NOT change here.
        # ==================================================================

        opt_G.zero_grad()   # clear G's gradients — keep them separate from Phase 1

        # We reuse the same fake_images from above (no need to re-generate).
        # This time we do NOT detach — the gradient must flow all the way back through
        # D and then through G so that G's weights can improve.
        real_labels = torch.ones(batch_size)     # G wants D to say "real" for its fakes
        fake_scores_for_G = D(fake_images)       # re-score without detach
        loss_G = criterion(fake_scores_for_G, real_labels)
        # non-saturating form: BCE(D(G(z)), 1) == -log D(G(z))
        # Gradient is steep when D(G(z)) is small, giving G a strong learning signal early on.

        loss_G.backward()   # compute gradients for G (flows through D then through G)
        opt_G.step()        # update only G's weights (D's optimiser was not called)

        # ==================================================================
        # LOGGING — watch these numbers to gauge training health
        # Healthy signs: loss_D ~ 1.0 (log2), loss_G oscillating but not exploding
        # Warning: loss_D near 0 means D dominates; loss_G near 0 means G dominates
        # ==================================================================

    print(
        f"Epoch {epoch+1}/{NUM_EPOCHS} | "
        f"loss_D: {loss_D.item():.4f} | "
        f"loss_G: {loss_G.item():.4f} | "
        f"D(real): {real_scores.mean().item():.3f} | "
        f"D(fake): {fake_scores.mean().item():.3f}"
    )`}
      />
    </div>
  );
}
