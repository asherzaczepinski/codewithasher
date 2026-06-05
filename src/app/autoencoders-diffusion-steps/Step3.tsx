'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Key Idea: Learn by Cleaning Up Mess">
        <p>
          A standard autoencoder is trained on clean inputs. Give it a perfect digit image, ask
          it to reconstruct that same perfect digit image. The problem is subtle: if the
          bottleneck is not tight enough, the network can find lazy shortcuts — memorising small
          quirks of the training set rather than learning general structure.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A <strong>denoising autoencoder</strong> fixes this by deliberately corrupting the
          input before feeding it in, while keeping the training target as the clean original.
          The network is forced to learn what &quot;a digit&quot; really looks like — not just to
          copy pixels — because the copy of the input it receives is broken.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How Corruption Works">
        <p>
          Two common corruption strategies:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Gaussian noise</strong> — add small random values drawn from a normal
            distribution to each pixel. A pixel that was 0.8 might become 0.8 + 0.15 = 0.95.
          </li>
          <li>
            <strong>Masking noise</strong> — randomly zero out a fraction (say, 30%) of the
            pixels entirely. The network must infer what those pixels should have been.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The loss is still reconstruction loss against the <em>clean</em> image, not the
          corrupted one:
        </p>
      </ExplanationBox>

      <MathFormula label="Denoising Loss">
        L = (1/n) * sum over i of (x(i) - decoder(encoder(x&#x0303;(i))))^2
      </MathFormula>

      <ExplanationBox title="Why This Learns More Robust Features">
        <p>
          To recover a masked pixel the encoder must look at its neighbours and use global
          structure — &quot;this region is part of the curved top of a 9, so the missing pixel
          is probably dark.&quot; To do that reliably the encoder cannot ignore any part of the
          image. Every neuron in the encoder is forced to develop sensitivity to meaningful,
          widespread patterns rather than individual pixel values. The resulting latent code
          is said to capture <strong>robust features</strong>.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Think of it like studying for an exam by practising with smudged flashcards. You
          cannot rely on memorising a specific ink mark — you have to understand the underlying
          concept.
        </p>
      </ExplanationBox>

      <WorkedExample title="Denoising a 4-Pixel Image">
        <CalcStep number={1}>Clean input: x = (0.9, 0.1, 0.8, 0.2)</CalcStep>
        <CalcStep number={2}>Add Gaussian noise (sigma = 0.2): x&#x0303; = (1.0, 0.25, 0.65, 0.35) (clamped to 0–1)</CalcStep>
        <CalcStep number={3}>Encoder compresses x&#x0303; to latent code z = (0.55, 0.30)</CalcStep>
        <CalcStep number={4}>Decoder reconstructs: x&#x0302; = (0.88, 0.12, 0.79, 0.21)</CalcStep>
        <CalcStep number={5}>Loss = MSE(x, x&#x0302;) against the CLEAN image:</CalcStep>
        <CalcStep number={6}>(0.9-0.88)^2 + (0.1-0.12)^2 + (0.8-0.79)^2 + (0.2-0.21)^2 = 0.0004 + 0.0004 + 0.0001 + 0.0001 = 0.001</CalcStep>
        <CalcStep number={7}>MSE = 0.001 / 4 = 0.00025 — a very good reconstruction despite noisy input.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice the target is always the clean x. The network receives broken data and must
          produce clean output — the gradient signal teaches it to understand the true
          distribution of digits, not the distribution of corrupted digits.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows how to corrupt a batch of images with Gaussian noise and
          train the same <code>Autoencoder</code> class from Step 2 as a denoising autoencoder.
          The only change from a standard autoencoder is <em>where the noise is introduced</em>
          and <em>what the loss target is</em> — comments highlight both. This is
          <strong> illustrative</strong> PyTorch code.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="denoising_autoencoder.py"
        caption="Add Gaussian noise before the encoder, then compute reconstruction loss against the clean original."
        code={`import torch
import torch.nn as nn

# ------------------------------------------------------------------ #
# Illustrative PyTorch code — read alongside the lesson.              #
# Assumes the Autoencoder class from autoencoder.py is imported.      #
# ------------------------------------------------------------------ #

def add_gaussian_noise(x_clean, sigma=0.2):
    # Draw noise from a standard normal, scale it by sigma, and add.
    # torch.randn_like creates a tensor of the same shape and device as x_clean.
    noise = torch.randn_like(x_clean) * sigma

    # torch.clamp keeps every pixel value within the valid [0, 1] range.
    # Without clamping, noisy pixels can exceed 1.0 or go below 0.0,
    # which does not correspond to any real pixel intensity.
    x_noisy = torch.clamp(x_clean + noise, 0.0, 1.0)
    return x_noisy


def train_denoising_epoch(model, dataloader, optimizer, sigma=0.2):
    # MSE loss is identical to the plain autoencoder — the difference is
    # that the INPUT to the model is corrupted but the TARGET is still clean.
    loss_fn = nn.MSELoss()

    for x_batch, _ in dataloader:
        # Flatten 28x28 MNIST images to 784-dim vectors.
        x_clean = x_batch.view(x_batch.size(0), -1)  # shape: (B, 784)

        # KEY DIFFERENCE 1 — corrupt the input before the encoder sees it.
        # The model receives a broken version of the image.
        x_noisy = add_gaussian_noise(x_clean, sigma=sigma)

        # Forward pass: noisy image goes in, reconstruction comes out.
        x_hat, z = model(x_noisy)

        # KEY DIFFERENCE 2 — compute the loss against the CLEAN original.
        # If we used x_noisy as the target the model would just learn to
        # copy noise, which is useless. Using x_clean forces it to
        # understand what a real digit looks like underneath the noise.
        loss = loss_fn(x_hat, x_clean)

        optimizer.zero_grad()
        loss.backward()  # gradients flow back through decoder and encoder
        optimizer.step()

    return loss.item()


# ------------------------------------------------------------------ #
# Masking noise variant — zero out a random 30% of pixels instead.   #
# ------------------------------------------------------------------ #

def add_masking_noise(x_clean, mask_fraction=0.3):
    # Create a random binary mask: 0 means "this pixel is zeroed out".
    # torch.rand_like draws uniform values in [0, 1); values below
    # mask_fraction become False (masked), the rest become True (kept).
    keep_mask = (torch.rand_like(x_clean) > mask_fraction).float()

    # Multiply elementwise: masked pixels become exactly 0.
    x_masked = x_clean * keep_mask
    return x_masked


# Quick smoke test with random data.
if __name__ == "__main__":
    from autoencoder import Autoencoder  # reuse the class from Step 2

    model = Autoencoder(input_dim=784, latent_dim=8)
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    fake_batch = [(torch.rand(32, 1, 28, 28), None)]
    loss_val = train_denoising_epoch(model, fake_batch, optimizer, sigma=0.2)
    print(f"Denoising loss after one batch: {loss_val:.4f}")
`}
      />

      <ExplanationBox title="Other Autoencoder Variants">
        <p>
          <strong>Sparse autoencoders</strong> add a penalty term to the loss that pushes most
          latent dimensions toward zero at any given time. Only a few neurons activate for any
          one input, which encourages each neuron to specialise in a single interpretable
          feature.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Contractive autoencoders</strong> penalise the sensitivity of the encoder to
          small changes in the input (technically, the Frobenius norm of the Jacobian). This
          makes the learned representation robust to tiny perturbations — similar in spirit to
          denoising, but enforced analytically rather than through data augmentation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Applications Worth Knowing">
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Anomaly detection</strong> — train a denoising autoencoder on clean
            manufacturing images. At test time, a defective part will have high reconstruction
            error because the network has never learned how to reconstruct that kind of defect.
          </li>
          <li>
            <strong>Self-supervised pre-training</strong> — the BERT language model is
            essentially a denoising autoencoder for text (randomly masking tokens). The
            idea transfers directly from pixels to words.
          </li>
          <li>
            <strong>Image inpainting</strong> — given an image with a region blacked out, a
            denoising autoencoder can hallucinate plausible content for the missing area.
          </li>
        </ul>
      </ExplanationBox>
    </div>
  );
}
