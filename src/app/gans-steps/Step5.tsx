'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Training a GAN Is Notoriously Hard">
        <p>
          Unlike a standard supervised network where loss steadily falls toward a clear minimum,
          a GAN is optimising a <em>dynamic</em> target — each network&apos;s goal shifts as the
          other improves. This makes the landscape treacherous. Three failure modes crop up so
          reliably they have names.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Failure Mode 1: Mode Collapse">
        <p>
          <strong>Mode collapse</strong> happens when G discovers a single output — or a
          small handful — that reliably fools D, and simply repeats it for every noise vector.
          In the face example this looks like G producing hundreds of nearly identical portraits:
          same lighting, same expression, same bone structure, just slightly shuffled pixels.
        </p>
        <p>
          Why does it happen? G is rewarded whenever D(G(z)) is high. If a particular
          &quot;template&quot; face currently fools D, the gradient keeps reinforcing that
          template. G has no incentive to explore the rest of the space — diversity is not in
          its loss function. D eventually learns to reject the repeated template, but by then G
          may have collapsed onto a new template, and the cycle continues without progress.
        </p>
        <p>
          <strong>Fixes:</strong> mini-batch discrimination (letting D compare samples in a batch
          to detect lack of variety), unrolled GANs, or switching to the Wasserstein objective
          described below.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Failure Mode 2: Non-Convergence and Oscillation">
        <p>
          Because G and D are coupled, their losses do not necessarily converge to a stable
          equilibrium. Instead they may <strong>oscillate</strong>: G gets better, D improves in
          response, G adapts, D regresses, and so on indefinitely without either settling.
          Loss curves that should plateau instead cycle up and down.
        </p>
        <p>
          This can also manifest as <strong>instability</strong> — sudden catastrophic drops
          in quality mid-training where previously good outputs become incoherent. The landscape
          a GAN optimises over is non-convex for both players simultaneously, making saddle
          points and local cycles common.
        </p>
        <p>
          <strong>Fixes:</strong> careful learning-rate tuning, using Adam with conservative
          beta values (β₁ = 0.5 is a classic recommendation for GANs), gradient penalty
          regularisation, and spectral normalisation of D&apos;s weights.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Failure Mode 3: Vanishing Gradient from a Too-Strong Discriminator">
        <p>
          If D becomes much better than G early in training, it classifies every fake with near
          certainty: D(G(z)) ≈ 0. Recall G&apos;s original loss is log(1 − D(G(z))). When
          D(G(z)) → 0, that loss is log(1) = 0 — perfectly flat. No gradient, no learning.
          G is stuck.
        </p>
        <p>
          The non-saturating loss −log D(G(z)) partially addresses this (the gradient is steep
          when D(G(z)) is small), but the deeper problem is that an overwhelmingly strong D
          gives G almost no useful directional signal: it only knows its output was bad, not
          <em>how</em> to make it less bad.
        </p>
      </ExplanationBox>

      <MathFormula label="Label smoothing: soften the targets for D">
        real label → 0.9 instead of 1.0   (reduces overconfidence)
      </MathFormula>

      <ExplanationBox title="The Wasserstein Fix (WGAN)">
        <p>
          The Wasserstein GAN (WGAN) replaces the binary cross-entropy objective with the
          <strong> Wasserstein distance</strong> — also called Earth Mover&apos;s Distance —
          between the real and generated distributions. Instead of D outputting a probability,
          it outputs an unconstrained real number (it is technically called a &quot;critic&quot;).
          The critic is trained with weight clipping or gradient penalty to satisfy a Lipschitz
          constraint.
        </p>
        <p>
          The practical benefit is dramatic: the WGAN loss provides a meaningful, continuous
          gradient signal even when the generated distribution is far from the real one.
          Loss values correlate with visual quality, mode collapse is less frequent, and
          training is substantially more stable. WGAN and its improved variant WGAN-GP are now
          standard baselines in the GAN literature.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Balanced Training">
        <p>
          A well-trained GAN keeps D and G at roughly equal strength throughout training.
          Common heuristics: if D&apos;s accuracy on real/fake discrimination exceeds ~80%,
          run an extra G update before the next D update. Monitor both loss values — they
          should oscillate in a narrow band, not diverge. Label smoothing (targets of 0.9 and
          0.1 instead of 1 and 0) prevents D from becoming overconfident and sharpens gradients
          for G.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Two practical stabilisation techniques as code: label smoothing to prevent D from
          becoming overconfident, and a note on detecting mode collapse at training time.
          Both slot directly into the training loop from Step 4.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="gan.py"
        caption="Label smoothing and mode-collapse detection — practical stabilisation techniques that plug into the Step 4 training loop."
        code={`import torch
import torch.nn as nn

# --------------------------------------------------------------------------
# TECHNIQUE 1: LABEL SMOOTHING
#
# Problem without it: D is trained with hard labels — real=1.0, fake=0.0.
# Hard labels push D toward extreme confidence (sigmoid -> 0 or 1), which
# makes its gradient almost zero for G. G gets stuck because D is too certain.
#
# Fix: soften the targets slightly so D is never rewarded for being 100% sure.
# Real images -> 0.9 (not 1.0). Optionally: fake images -> 0.1 (not 0.0).
# This keeps the gradient flowing even when D is winning the game.
# --------------------------------------------------------------------------

SMOOTH_REAL = 0.9   # soften the "real" label — D should be confident but not certain
SMOOTH_FAKE = 0.0   # fake label is usually kept at 0 (one-sided smoothing is common)

def discriminator_loss_smoothed(D, real_images, fake_images, criterion):
    batch_size = real_images.size(0)

    # Smooth real labels: 0.9 instead of 1.0
    # The effect: log(D(x_real)) target is log(0.9) not log(1.0), so D is penalised
    # even when it's highly confident — forcing it to keep producing gradients.
    real_labels = torch.full((batch_size,), SMOOTH_REAL)  # tensor of 0.9s
    real_scores = D(real_images)
    loss_real = criterion(real_scores, real_labels)

    # Fake labels stay at 0.0 (hard) — one-sided smoothing only on the real side
    fake_labels = torch.full((batch_size,), SMOOTH_FAKE)  # tensor of 0.0s
    fake_scores = D(fake_images.detach())
    loss_fake = criterion(fake_scores, fake_labels)

    return loss_real + loss_fake  # drop into Phase 1 exactly as before


# --------------------------------------------------------------------------
# TECHNIQUE 2: DETECTING MODE COLLAPSE AT TRAINING TIME
#
# Mode collapse: G produces nearly identical outputs for all noise vectors.
# You cannot see this by watching loss alone — loss can look fine while G
# outputs the same face for every z.
#
# Cheap detection: measure the standard deviation of G's outputs across a batch.
# A high-diversity batch has large per-pixel variance. A collapsed batch has
# near-zero variance — all images are the same.
# --------------------------------------------------------------------------

def check_mode_collapse(G, latent_dim, batch_size=64, threshold=0.05):
    G.eval()  # turn off dropout / batchnorm noise so we get a clean signal
    with torch.no_grad():  # no gradient needed — this is just a diagnostic
        noise = torch.randn(batch_size, latent_dim)
        fakes = G(noise)          # shape: (batch_size, C, H, W)

        # Average standard deviation across the spatial and channel dimensions.
        # If all images are identical, std will be ~0 on the batch dimension.
        per_pixel_std = fakes.std(dim=0)    # std across the batch for each pixel
        mean_std = per_pixel_std.mean().item()

    G.train()  # restore training mode before returning
    return mean_std  # small value = collapse warning

    # Plug this into the training loop:
    #   if epoch % 5 == 0:
    #       diversity = check_mode_collapse(G, LATENT_DIM)
    #       print(f"Diversity score: {diversity:.4f}")
    #       if diversity < threshold:
    #           print("WARNING: possible mode collapse — G outputs lack variety.")


# --------------------------------------------------------------------------
# TECHNIQUE 3: ADAPTIVE TRAINING RATIO (balancing D and G strength)
#
# If D(real) >> 0.8, it is dominating — give G an extra update step.
# This is a simple heuristic; more principled methods use Wasserstein distance.
# --------------------------------------------------------------------------

def maybe_extra_G_step(D_real_score, G, D, opt_G, criterion, latent_dim, batch_size):
    # D_real_score: the mean D score on real images from the current iteration
    if D_real_score > 0.8:
        # D is too strong — run one bonus G update to let G catch up
        opt_G.zero_grad()
        noise = torch.randn(batch_size, latent_dim)
        fake_images = G(noise)
        real_labels = torch.ones(batch_size)   # G wants D to say "real"
        scores = D(fake_images)
        loss_G = criterion(scores, real_labels)
        loss_G.backward()
        opt_G.step()
        # No corresponding D step here — we are deliberately shifting the balance.`}
      />
    </div>
  );
}
