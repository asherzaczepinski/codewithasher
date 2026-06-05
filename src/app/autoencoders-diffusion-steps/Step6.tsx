'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Reversing the Noise: The Core Training Objective">
        <p>
          We know how to add noise to an image step by step. Now the question is: can a neural
          network learn to go backwards? Given a noisy image at step t, can it predict what the
          noise was so we can subtract it and recover a slightly cleaner image at step t - 1?
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          It turns out the cleanest training objective is to train a network called
          <strong> epsilon-theta</strong> (written epsilon with a subscript theta) to predict the
          noise epsilon that was added to x(0) to produce x(t). We feed in x(t) and t, and the
          network outputs its best guess of the original noise vector.
        </p>
      </ExplanationBox>

      <MathFormula label="Diffusion Training Loss (simplified)">
        L = E[ ||epsilon - epsilon-theta(x(t), t)||^2 ]
      </MathFormula>

      <ExplanationBox title="Why Predict Noise Instead of the Clean Image?">
        <p>
          Predicting the noise and predicting the clean image are mathematically equivalent —
          knowing one gives you the other via the jump-to-step-t formula. But in practice,
          predicting noise is numerically easier. At high noise levels the clean image signal is
          tiny and hard to regress directly, whereas the noise is large and structured. At low
          noise levels the noise is small — but so is the error, so the loss is naturally
          well-behaved.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Denoising Network Architecture">
        <p>
          The network epsilon-theta must accept an image (usually as a 2D spatial grid) and a
          timestep t, and output an image-shaped noise prediction. The dominant architecture
          is a <strong>U-Net</strong>: an encoder-decoder with skip connections that let
          fine-grained spatial detail flow directly from encoder to decoder layers. The timestep
          t is typically embedded as a learned vector and injected into every layer via
          addition or cross-attention.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This U-Net is the single model trained across all 1000 timesteps simultaneously.
          At step t = 999 (near-pure noise) it learns coarse, global denoising. At step t = 1
          (almost clean) it learns fine detail refinement.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Generating a New Image: The Reverse Process">
        <p>
          Once trained, generation works by running the reverse process:
        </p>
        <ol style={{ lineHeight: '2' }}>
          <li>Sample a random noise image x(T) ~ N(0, 1).</li>
          <li>For t = T down to 1: predict epsilon-theta(x(t), t), subtract the predicted noise (with appropriate scaling), optionally add a small amount of noise to keep diversity.</li>
          <li>The result after T steps is x(0) — a new image sampled from the data distribution.</li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          Each denoising step is one forward pass of the U-Net, which is why generation from
          a diffusion model takes longer than from a GAN or VAE — you need 50 to 1000 steps
          rather than a single pass. Research on fewer-step samplers (DDIM, DPM-Solver) has
          reduced this to as few as 10–25 steps with little quality loss.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Denoising Step: Single Pixel">
        <p>
          We have a noisy pixel x(5) = 1.1 at timestep t = 5. Use beta(5) = 0.12, so
          alpha(5) = 0.88 and alpha-bar(5) = 0.60 (product of all alphas up to step 5).
          The trained network predicts the noise as epsilon-theta = 0.55.
        </p>
        <CalcStep number={1}>
          The DDPM reverse step formula (simplified for one dimension):
          x(4) = (1 / sqrt(alpha(5))) * (x(5) - beta(5) / sqrt(1 - alpha-bar(5)) * epsilon-theta) + small noise
        </CalcStep>
        <CalcStep number={2}>
          Plug in values:
          x(4) = (1 / sqrt(0.88)) * (1.1 - 0.12 / sqrt(1 - 0.60) * 0.55)
        </CalcStep>
        <CalcStep number={3}>
          sqrt(1 - 0.60) = sqrt(0.40) = 0.632
          Noise coefficient: 0.12 / 0.632 = 0.190
          Noise correction: 0.190 * 0.55 = 0.104
        </CalcStep>
        <CalcStep number={4}>
          Inside the brackets: 1.1 - 0.104 = 0.996
          1 / sqrt(0.88) = 1 / 0.938 = 1.066
          x(4) = 1.066 * 0.996 = 1.062 (before adding small random noise)
        </CalcStep>
        <CalcStep number={5}>
          Add tiny noise: sigma(5) * z where z ~ N(0,1). With sigma(5) = 0.05 and z = -0.3:
          x(4) = 1.062 + 0.05 * (-0.3) = 1.062 - 0.015 = 1.047
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          One step moved x from 1.1 to 1.047 — a tiny nudge toward the clean value 0.8.
          After 1000 such steps the pixel converges to something close to the real data
          distribution. The key is that each step is guided by the network&apos;s prediction
          of the originally added noise.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows the full DDPM reverse loop: start from pure noise, then
          repeatedly call a noise-predicting model and apply the DDPM update rule to move one
          step closer to a clean image. The noise-predicting model is a stand-in (a tiny linear
          network) — in a real system it would be a U-Net. This is <strong>illustrative</strong>
          PyTorch code.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="diffusion_reverse.py"
        caption="DDPM reverse (denoising) loop: from pure noise to a generated image by repeatedly predicting and subtracting noise."
        code={`import torch
import torch.nn as nn

# ------------------------------------------------------------------ #
# Illustrative PyTorch code — read alongside the lesson.              #
# The real noise-predicting model would be a U-Net; here we use a     #
# tiny linear net as a placeholder so the loop logic stays clear.     #
# ------------------------------------------------------------------ #

class TinyNoisePredictor(nn.Module):
    # Stand-in for a full U-Net.
    # Accepts a flattened image and a scalar timestep embedding;
    # returns a predicted noise vector of the same shape as the image.

    def __init__(self, img_dim=784, time_emb_dim=64):
        super().__init__()

        # A simple learned embedding maps the integer timestep t to a vector.
        # In real diffusion models this is a sinusoidal + MLP embedding,
        # but a learnable embedding table is easier to read.
        self.time_embed = nn.Embedding(1000, time_emb_dim)

        self.net = nn.Sequential(
            nn.Linear(img_dim + time_emb_dim, 512),
            nn.ReLU(),
            nn.Linear(512, img_dim),  # output must match the image dimension
        )

    def forward(self, x_t, t):
        # x_t shape: (B, img_dim)  — the noisy image at step t
        # t   shape: (B,)          — integer timestep index per image in the batch

        t_emb = self.time_embed(t)            # shape: (B, time_emb_dim)
        x_input = torch.cat([x_t, t_emb], dim=-1)  # concatenate along feature axis
        eps_pred = self.net(x_input)          # shape: (B, img_dim)
        return eps_pred


def ddpm_reverse_loop(model, betas, alphas, alpha_bar, T=1000, img_dim=784, device="cpu"):
    # ---- Generation: run the reverse process from t=T down to t=0 ----
    model.eval()  # disable dropout / batchnorm updates during generation

    with torch.no_grad():  # no gradients needed — we are not training here

        # Step 0: start from pure Gaussian noise at t = T.
        # The forward process guaranteed that x(T) ~ N(0, 1) for any x(0),
        # so we can begin generation by sampling from the standard normal.
        x = torch.randn(1, img_dim, device=device)  # shape: (1, 784)

        # Step through all T timesteps in reverse order.
        for t_val in reversed(range(T)):

            # Package the current timestep as a tensor on the correct device.
            t_tensor = torch.tensor([t_val], dtype=torch.long, device=device)

            # Ask the model: "given this noisy image at time t, what noise
            # did the forward process add to reach this state?"
            eps_pred = model(x, t_tensor)  # shape: (1, 784)

            # ---- DDPM update rule (the reverse step) ----
            # Retrieve the schedule values for this specific timestep.
            beta_t     = betas[t_val]           # scalar
            alpha_t    = alphas[t_val]          # scalar = 1 - beta_t
            alpha_bar_t = alpha_bar[t_val]      # scalar = product of all alphas up to t

            # Denominator for the noise coefficient.
            sqrt_one_minus_ab = (1.0 - alpha_bar_t).sqrt()

            # The mean of the reverse posterior (the denoised estimate of x_{t-1}).
            # This is equation (11) from the DDPM paper, simplified to one line.
            # 1/sqrt(alpha_t) * (x_t - beta_t / sqrt(1 - alpha_bar_t) * eps_pred)
            coeff = 1.0 / alpha_t.sqrt()
            noise_coeff = beta_t / sqrt_one_minus_ab
            x_mean = coeff * (x - noise_coeff * eps_pred)

            if t_val > 0:
                # Add a small amount of stochastic noise at every step except the last.
                # This keeps sample diversity — without it all samples would converge
                # to the same deterministic output (like DDIM sampling).
                # sigma_t^2 = beta_t in the simplest variance schedule.
                sigma_t = beta_t.sqrt()
                z = torch.randn_like(x)  # fresh noise draw, independent each step
                x = x_mean + sigma_t * z
            else:
                # At the very last step (t = 0) do NOT add noise —
                # we want the final clean image, not a noisy one.
                x = x_mean

        # After T steps x holds the generated image.
        return x  # shape: (1, 784) — reshape to (1, 1, 28, 28) for display


# ------------------------------------------------------------------ #
# Training loop — for completeness, shows how the model is trained.   #
# ------------------------------------------------------------------ #

def train_diffusion_step(model, x0, betas, alphas, alpha_bar, optimizer):
    loss_fn = nn.MSELoss()

    B = x0.size(0)

    # Sample a random timestep uniformly for each image in the batch.
    # The model must learn to denoise at EVERY noise level simultaneously.
    t = torch.randint(0, len(betas), (B,), device=x0.device)  # shape: (B,)

    # Sample the noise that the forward process would have added.
    eps = torch.randn_like(x0)

    # Create x_t directly from x0 using the jump formula (same as Step 5).
    ab_t = alpha_bar[t].view(B, 1)
    x_t = ab_t.sqrt() * x0 + (1.0 - ab_t).sqrt() * eps

    # Ask the model to predict the noise from the noisy image.
    eps_pred = model(x_t, t)

    # The training loss: MSE between the ACTUAL noise added and the PREDICTED noise.
    # If the model predicts the noise perfectly it can exactly invert the forward step.
    loss = loss_fn(eps_pred, eps)
    return loss


# Smoke test.
if __name__ == "__main__":
    from diffusion_forward import make_linear_beta_schedule

    T = 1000
    betas, alphas, alpha_bar = make_linear_beta_schedule(T=T)

    model = TinyNoisePredictor(img_dim=784)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)

    x0_fake = torch.rand(4, 784)  # batch of 4 fake images
    loss = train_diffusion_step(model, x0_fake, betas, alphas, alpha_bar, optimizer)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    print(f"Training loss: {loss.item():.4f}")

    # Generate a sample from the trained (random-weight) model.
    generated = ddpm_reverse_loop(model, betas, alphas, alpha_bar, T=T)
    print(f"Generated shape: {generated.shape}")  # expect (1, 784)
`}
      />

      <ExplanationBox title="Why Diffusion Models Produce Such High Quality and Diversity">
        <p>
          Unlike GANs, diffusion models do not have a discriminator that the generator can
          &quot;fool&quot; with mode collapse. The training signal at every step is a simple MSE
          on noise prediction — stable and well-conditioned. The model sees the data from
          every noise level simultaneously, giving it a comprehensive understanding of the
          image distribution at every scale.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The result is better coverage of the true data distribution (more diverse outputs)
          and fewer artefacts than GANs. The trade-off is slower generation speed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Conditioning: Text-to-Image">
        <p>
          To steer generation toward a specific concept — like &quot;a red panda on a surfboard&quot;
          — we condition the U-Net on a text embedding at every layer. The text prompt is encoded
          by a language model (e.g. CLIP or T5), and the resulting vector is injected into the
          U-Net via <strong>cross-attention</strong>: at each layer the image features attend to
          the text tokens, pulling the denoising direction toward the described content. This is
          the mechanism inside Stable Diffusion, DALL·E, and Imagen.
        </p>
      </ExplanationBox>
    </div>
  );
}
