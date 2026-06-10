'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
          It turns out the cleanest training objective is to train a network called{' '}
          <strong>epsilon-theta</strong> (written epsilon with a subscript theta) to predict the
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
