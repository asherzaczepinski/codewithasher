'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Core Intuition: Slowly Destroy, Then Learn to Rebuild">
        <p>
          Diffusion models take a completely different approach to generation. Instead of
          learning a compact bottleneck, they ask: <em>what if we gradually turn any image into
          pure random noise, one tiny step at a time, and then train a network to reverse that
          process?</em>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The destruction process — called the <strong>forward process</strong> — is fixed and
          mathematical. We do not learn it. At step t = 0 we have a clean face image. By step
          t = 1000 we have a tensor of pure Gaussian noise that looks nothing like the original.
          In between, the image is progressively blurrier and noisier.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Forward Process: Adding Noise Step by Step">
        <p>
          At each timestep t, we add a small amount of Gaussian noise to the image from the
          previous step. The amount of noise is controlled by a schedule of values beta(1),
          beta(2), ..., beta(T) — typically small numbers like 0.0001 to 0.02 that increase
          slowly over time.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The one-step update is:
        </p>
      </ExplanationBox>

      <MathFormula label="Forward Step: x(t) from x(t-1)">
        x(t) = sqrt(1 - beta(t)) * x(t-1) + sqrt(beta(t)) * epsilon,
        where epsilon ~ N(0, 1)
      </MathFormula>

      <ExplanationBox title="Why That Formula?">
        <p>
          The factor sqrt(1 - beta(t)) shrinks the signal slightly. The term sqrt(beta(t)) *
          epsilon adds a small amount of fresh Gaussian noise. As t increases, the signal
          contribution shrinks and the noise accumulates. After enough steps the distribution
          of x(T) is indistinguishable from pure N(0, 1) regardless of what x(0) was.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A beautiful property: you can jump directly to any step t without simulating all
          intermediate steps. Define alpha(t) = 1 - beta(t) and alpha-bar(t) as the product
          of all alpha values from 1 to t. Then:
        </p>
      </ExplanationBox>

      <MathFormula label="Jump-to-Step-t Formula">
        x(t) = sqrt(alpha-bar(t)) * x(0) + sqrt(1 - alpha-bar(t)) * epsilon,
        where epsilon ~ N(0, 1)
      </MathFormula>

      <ExplanationBox title="Why the Jump Formula Matters">
        <p>
          This means during training we do not need to run 1000 sequential steps for each
          training image. We pick a random t, sample a random epsilon, and directly compute the
          noisy image at step t in one shot. This makes training practical — it&apos;s just
          one matrix multiplication plus a noise draw per sample.
        </p>
      </ExplanationBox>

      <WorkedExample title="Numeric Illustration: Three Forward Steps">
        <p>
          Take a single pixel with value x(0) = 0.8. Use a simple schedule:
          beta(1) = 0.1, beta(2) = 0.15, beta(3) = 0.20. The noise draws are fixed at
          epsilon = 0.5 for all steps so we can follow the arithmetic exactly.
        </p>
        <CalcStep number={1}>
          Step 1: x(1) = sqrt(1 - 0.1) * 0.8 + sqrt(0.1) * 0.5
          = sqrt(0.9) * 0.8 + sqrt(0.1) * 0.5
          = 0.9487 * 0.8 + 0.3162 * 0.5
          = 0.759 + 0.158 = 0.917
        </CalcStep>
        <CalcStep number={2}>
          Step 2: x(2) = sqrt(1 - 0.15) * 0.917 + sqrt(0.15) * 0.5
          = sqrt(0.85) * 0.917 + sqrt(0.15) * 0.5
          = 0.9220 * 0.917 + 0.3873 * 0.5
          = 0.845 + 0.194 = 1.039 (clamped to 1.0 in practice)
        </CalcStep>
        <CalcStep number={3}>
          Step 3: x(3) = sqrt(1 - 0.20) * 1.0 + sqrt(0.20) * 0.5
          = 0.8944 * 1.0 + 0.4472 * 0.5
          = 0.894 + 0.224 = 1.118 (clamped to 1.0)
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Even in just three steps the original signal 0.8 has been overwhelmed by accumulated
          noise. After 1000 steps with a real schedule the image is pure noise — the starting
          value is completely unrecoverable without running the reverse process.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below builds a linear beta schedule, pre-computes the cumulative product
          alpha-bar, and implements the &quot;jump to step t&quot; formula that lets training
          sample any noisy image in one shot. This is <strong>illustrative</strong> PyTorch code
          — no training happens here, only the fixed forward process.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="diffusion_forward.py"
        caption="Beta schedule, cumulative alpha-bar, and the closed-form jump-to-step-t noising function."
        code={`import torch
import numpy as np

# ------------------------------------------------------------------ #
# Illustrative PyTorch / NumPy code — read alongside the lesson.      #
# This file covers ONLY the forward (noising) process, which is fixed #
# and contains no learnable parameters.                               #
# ------------------------------------------------------------------ #

def make_linear_beta_schedule(T=1000, beta_start=1e-4, beta_end=0.02):
    # A linear schedule means beta increases uniformly from beta_start
    # to beta_end over T timesteps.
    # torch.linspace(a, b, n) returns n evenly spaced values from a to b.
    betas = torch.linspace(beta_start, beta_end, T)  # shape: (T,)

    # alpha(t) = 1 - beta(t)
    # At early steps alpha is close to 1 (tiny noise).
    # At late steps alpha shrinks (more noise per step).
    alphas = 1.0 - betas  # shape: (T,)

    # alpha-bar(t) = product of alpha(1) * alpha(2) * ... * alpha(t)
    # torch.cumprod computes the running product along a dimension.
    # alpha_bar[t] tells us: "after t steps, how much SIGNAL is left?"
    alpha_bar = torch.cumprod(alphas, dim=0)  # shape: (T,)

    return betas, alphas, alpha_bar


def q_sample(x0, t, alpha_bar, noise=None):
    # Compute x(t) directly from x(0) using the jump formula:
    #   x(t) = sqrt(alpha_bar(t)) * x(0) + sqrt(1 - alpha_bar(t)) * eps
    #
    # This avoids running t sequential steps — crucial for training speed,
    # because we can corrupt any image to any noise level in one operation.

    if noise is None:
        # Sample fresh Gaussian noise if none was provided.
        noise = torch.randn_like(x0)  # same shape and device as x0

    # Gather the alpha_bar values for the requested timestep t.
    # t is a batch of integer indices, one per image in the batch.
    # We reshape to (B, 1, 1, 1) so it broadcasts across (C, H, W).
    ab_t = alpha_bar[t].view(-1, 1, 1, 1)  # shape: (B, 1, 1, 1)

    # signal coefficient: sqrt(alpha_bar(t))
    # As t grows, this shrinks toward 0 — the original image fades out.
    signal_coeff = ab_t.sqrt()

    # noise coefficient: sqrt(1 - alpha_bar(t))
    # As t grows, this approaches 1 — pure noise takes over.
    noise_coeff = (1.0 - ab_t).sqrt()

    # Mix original signal with fresh noise according to the schedule.
    x_t = signal_coeff * x0 + noise_coeff * noise
    return x_t, noise  # also return noise so the model can predict it later


# ------------------------------------------------------------------ #
# Demo: corrupt a single random image at several timesteps.           #
# ------------------------------------------------------------------ #

if __name__ == "__main__":
    T = 1000
    betas, alphas, alpha_bar = make_linear_beta_schedule(T=T)

    # A single random "image" in the shape (B=1, C=1, H=28, W=28).
    x0 = torch.rand(1, 1, 28, 28)

    for t_val in [0, 100, 500, 999]:
        t_tensor = torch.tensor([t_val])        # batch of one timestep index
        x_t, eps = q_sample(x0, t_tensor, alpha_bar)

        # alpha_bar close to 1.0 means mostly clean; close to 0.0 means pure noise.
        ab = alpha_bar[t_val].item()
        print(f"t={t_val:4d}  alpha_bar={ab:.4f}  "
              f"x_t mean={x_t.mean().item():.3f}  std={x_t.std().item():.3f}")
`}
      />

      <ExplanationBox title="Key Point: The Forward Process Is Fixed">
        <p>
          We do not train anything in the forward process. It is a deterministic mathematical
          schedule — we choose the betas in advance and they never change. All the learning
          happens in the reverse (denoising) direction, which is the subject of the next module.
        </p>
      </ExplanationBox>
    </div>
  );
}
