'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Generator: Noise In, Image Out">
        <p>
          The Generator (G) is a neural network that accepts a <strong>noise vector</strong> — a
          list of random numbers sampled from a simple distribution like a standard normal — and
          outputs a full synthetic image. For our face example, the input might be 100 random
          numbers and the output a 64 × 64 colour image: 64 × 64 × 3 = 12,288 pixel values.
        </p>
        <p>
          Each dimension of the noise vector is called a <strong>latent dimension</strong>. The
          space of all possible noise vectors is the <strong>latent space</strong>. One vector
          → one face. Move slightly in latent space and the face changes slightly — perhaps the
          hair gets darker, or the smile widens. The Generator&apos;s job is to map this smooth
          latent space onto the jagged, high-dimensional space of realistic face images.
        </p>
      </ExplanationBox>

      <MathFormula label="Generator mapping">
        G(z) = x̃   where  z ~ N(0, I)  and  x̃ is a fake image
      </MathFormula>

      <ExplanationBox title="Architecture: Upsampling from Noise">
        <p>
          In practice, G typically starts with the latent vector z and progressively
          <strong> upsamples</strong> it through transposed convolution layers (sometimes called
          deconvolutions). The spatial dimensions grow at each layer — from 4×4 to 8×8 to
          16×16 and so on — while features become increasingly fine-grained: first broad
          structure (face shape, skin tone), then medium detail (eye placement, nose shape),
          then fine texture (pores, hair strands).
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Discriminator: Real or Fake?">
        <p>
          The Discriminator (D) is a standard binary classifier. It receives an image — either
          a real photograph pulled from the training set or a fake produced by G — and outputs
          a single number between 0 and 1: the probability it assigns to the image being real.
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>D(x) close to 1</strong> → &quot;I&apos;m confident this is a real photo.&quot;</li>
          <li><strong>D(x) close to 0</strong> → &quot;I&apos;m confident this is a fake.&quot;</li>
        </ul>
        <p>
          D is typically a convolutional network that downsamples its input — the mirror image
          of G — extracting features at finer and finer levels of abstraction before collapsing
          to a single sigmoid output.
        </p>
      </ExplanationBox>

      <MathFormula label="Discriminator output">
        D(x) ∈ (0, 1)   →   probability that image x is real
      </MathFormula>

      <ExplanationBox title="Opposite Goals, Shared Gradient">
        <p>
          Here is the key tension that makes a GAN work:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>G wants D(G(z)) → 1.</strong> It wants the Discriminator to call its fakes
            real. Success means the fake fooled the detective.
          </li>
          <li>
            <strong>D wants D(G(z)) → 0</strong> and <strong>D(x) → 1.</strong> It wants to
            correctly label fakes as fake and real images as real.
          </li>
        </ul>
        <p>
          Neither network has a fixed target — their loss functions are coupled. What counts as
          &quot;good&quot; for G depends entirely on how good D currently is, and vice versa.
          This mutual dependence is what makes GAN training both powerful and tricky.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Below is how the Generator and Discriminator look as PyTorch <code>nn.Module</code>
          classes. This is illustrative code — simplified for clarity, not production-ready.
          Read the comments: they carry the teaching.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="gan.py"
        caption="Generator and Discriminator as PyTorch nn.Module subclasses — the two players in the GAN game."
        code={`import torch
import torch.nn as nn

# --------------------------------------------------------------------------
# GENERATOR  (G)
# Role: turn a random noise vector z into a plausible fake image.
# Think of G as the counterfeiter — it never sees real images directly;
# it only gets feedback through the Discriminator's reactions.
# --------------------------------------------------------------------------

class Generator(nn.Module):
    def __init__(self, latent_dim=100, img_channels=1, feature_maps=64):
        super().__init__()

        # latent_dim: how many random numbers we feed in (the "latent vector")
        # A larger latent_dim gives G more capacity to encode variation.
        self.latent_dim = latent_dim

        # The network is a stack of transposed convolutions (aka "deconvolutions").
        # Each layer doubles the spatial size: 1x1 -> 4x4 -> 8x8 -> 16x16 -> 32x32
        # while halving the number of feature channels — broad shape first, then detail.
        self.net = nn.Sequential(
            # Input: (batch, latent_dim, 1, 1) — a column vector reshaped to a 1x1 "image"
            nn.ConvTranspose2d(latent_dim, feature_maps * 4, kernel_size=4, stride=1, padding=0),
            nn.BatchNorm2d(feature_maps * 4),  # keeps activations stable during training
            nn.ReLU(inplace=True),             # ReLU: G uses ReLU in hidden layers

            # Upsample: 4x4 -> 8x8
            nn.ConvTranspose2d(feature_maps * 4, feature_maps * 2, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(feature_maps * 2),
            nn.ReLU(inplace=True),

            # Upsample: 8x8 -> 16x16
            nn.ConvTranspose2d(feature_maps * 2, feature_maps, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(feature_maps),
            nn.ReLU(inplace=True),

            # Final layer: 16x16 -> 32x32, output has img_channels channels (e.g. 1 for grayscale)
            nn.ConvTranspose2d(feature_maps, img_channels, kernel_size=4, stride=2, padding=1),
            nn.Tanh(),  # Tanh squashes output to [-1, 1] — images are normalised to that range
        )

    def forward(self, z):
        # z shape: (batch_size, latent_dim, 1, 1)
        # Reshape lets us treat the latent vector as a tiny 1x1 spatial map.
        z = z.view(z.size(0), self.latent_dim, 1, 1)
        return self.net(z)  # returns fake images of shape (batch, img_channels, 32, 32)


# --------------------------------------------------------------------------
# DISCRIMINATOR  (D)
# Role: classify an image as real (label=1) or fake (label=0).
# Think of D as the detective — it sees both real training images and G's fakes.
# Its architecture mirrors G in reverse: downsampling instead of upsampling.
# --------------------------------------------------------------------------

class Discriminator(nn.Module):
    def __init__(self, img_channels=1, feature_maps=64):
        super().__init__()

        # Strided convolutions shrink the spatial dimensions at each layer,
        # extracting increasingly abstract features before the final verdict.
        self.net = nn.Sequential(
            # Input: (batch, img_channels, 32, 32)
            nn.Conv2d(img_channels, feature_maps, kernel_size=4, stride=2, padding=1),
            nn.LeakyReLU(0.2, inplace=True),  # LeakyReLU avoids dead neurons in D
            # Note: no BatchNorm in the first layer — recommended GAN practice

            # 32x32 -> 16x16
            nn.Conv2d(feature_maps, feature_maps * 2, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(feature_maps * 2),
            nn.LeakyReLU(0.2, inplace=True),

            # 16x16 -> 8x8
            nn.Conv2d(feature_maps * 2, feature_maps * 4, kernel_size=4, stride=2, padding=1),
            nn.BatchNorm2d(feature_maps * 4),
            nn.LeakyReLU(0.2, inplace=True),

            # 8x8 -> 1x1: collapse everything to a single number per image
            nn.Conv2d(feature_maps * 4, 1, kernel_size=4, stride=1, padding=0),
            nn.Sigmoid(),  # Sigmoid maps the score to (0, 1) — a probability of being real
        )

    def forward(self, x):
        # x shape: (batch, img_channels, 32, 32)
        out = self.net(x)           # shape: (batch, 1, 1, 1)
        return out.view(-1)         # flatten to (batch,) — one probability per image


# --------------------------------------------------------------------------
# Instantiate both networks
# --------------------------------------------------------------------------
LATENT_DIM = 100   # number of random dimensions in each noise vector z

G = Generator(latent_dim=LATENT_DIM)
D = Discriminator()

# Quick sanity check — verify the shapes are what we expect
noise = torch.randn(8, LATENT_DIM)          # batch of 8 random noise vectors
fake_images = G(noise)                       # G produces 8 fake images
scores = D(fake_images)                      # D scores each fake
print(fake_images.shape)                     # expect: torch.Size([8, 1, 32, 32])
print(scores.shape)                          # expect: torch.Size([8])
print(scores)                                # 8 probabilities in (0, 1)`}
      />
    </div>
  );
}
