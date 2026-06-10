'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Why Plain Autoencoders Cannot Generate Well">
        <p>
          Suppose you train a plain autoencoder on MNIST digits, then try to generate a new
          digit by picking a random point in latent space and running the decoder. The result
          will often be garbage — blurry nonsense that looks like nothing.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The reason is that a plain autoencoder learns a <em>scattered</em> latent space. Each
          training image gets encoded to some specific point, but the regions <em>between</em>{' '}
          those points are unexplored territory. The decoder has never seen those latent codes
          during training and has no idea what to produce. The latent space has holes everywhere.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The VAE Solution: Learn a Distribution, Not a Point">
        <p>
          A <strong>Variational Autoencoder (VAE)</strong> changes the encoder&apos;s output.
          Instead of producing a single latent vector z, the encoder produces two vectors:
          a <strong>mean vector (mu)</strong> and a <strong>log-variance vector (log sigma^2)</strong>.
          Together these define a Gaussian distribution over z for that input.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          At training time, the network samples an actual z from that distribution before passing
          it to the decoder. This forces the encoder to spread each image&apos;s representation
          over a small region rather than pinning it to a single point — which means nearby
          points in latent space also decode to something meaningful.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Reparameterization Trick">
        <p>
          Sampling is not differentiable — you cannot backpropagate through a random draw. The
          VAE sidesteps this with a clever reformulation. Instead of sampling z directly from
          N(mu, sigma^2), we sample epsilon from N(0, 1) and compute:
        </p>
      </ExplanationBox>

      <MathFormula label="Reparameterization Trick">
        z = mu + sigma * epsilon, where epsilon ~ N(0, 1)
      </MathFormula>

      <ExplanationBox title="Why This Works">
        <p>
          Now the randomness lives entirely in epsilon, which is a fixed sample — not a
          learnable parameter. The gradient can flow through the multiplication (mu + sigma *
          epsilon) and reach both mu and sigma. We have made a stochastic operation
          differentiable by pulling the randomness outside the computation graph.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The ELBO: Two Terms That Fight Each Other">
        <p>
          The VAE loss is called the <strong>Evidence Lower BOund (ELBO)</strong>. It has two
          terms that pull in opposite directions, and the right balance between them is what
          makes the latent space useful:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Reconstruction loss</strong> — same as before: how well does the decoder
            recover the original image from the sampled z? Lower is better.
          </li>
          <li>
            <strong>KL divergence</strong> — how far is the encoder&apos;s distribution
            N(mu, sigma^2) from the standard normal N(0, 1)? This term penalises the encoder
            for straying too far from the origin. Lower is better.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="VAE Loss (ELBO, to minimise)">
        L = Reconstruction Loss + KL(N(mu, sigma^2) || N(0, 1))
      </MathFormula>

      <ExplanationBox title="Closed-Form KL for Gaussians">
        <p>
          For a single latent dimension with mean mu and variance sigma^2, the KL term has a
          clean closed form (no integration needed):
        </p>
      </ExplanationBox>

      <MathFormula label="KL Divergence (single dimension)">
        KL = -0.5 * (1 + log(sigma^2) - mu^2 - sigma^2)
      </MathFormula>

      <ExplanationBox title="What Each Term Does to the Latent Space">
        <p>
          The reconstruction loss pushes mu toward wherever best describes the image — it
          wants each image to have a unique, precise latent code. The KL term pushes all
          (mu, sigma) pairs toward (0, 1) — it wants everything to overlap near the origin.
          The tension between them produces a <em>compact, continuous, gap-free</em> latent
          space where interpolating between two codes produces sensible in-between images.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing the VAE Loss for One Image">
        <p>
          Imagine a single-dimensional latent space for simplicity. The encoder outputs
          mu = 1.2 and log(sigma^2) = -0.5, so sigma^2 = e^(-0.5) ≈ 0.607, sigma ≈ 0.779.
        </p>
        <CalcStep number={1}>Sample epsilon ~ N(0, 1): epsilon = 0.4 (a single draw)</CalcStep>
        <CalcStep number={2}>Compute z: z = 1.2 + 0.779 * 0.4 = 1.2 + 0.312 = 1.512</CalcStep>
        <CalcStep number={3}>Decoder produces reconstruction x&#x0302; from z = 1.512</CalcStep>
        <CalcStep number={4}>Reconstruction MSE against original x (say, from our 4-pixel example): 0.04</CalcStep>
        <CalcStep number={5}>KL = -0.5 * (1 + (-0.5) - 1.2^2 - 0.607)</CalcStep>
        <CalcStep number={6}>KL = -0.5 * (1 - 0.5 - 1.44 - 0.607) = -0.5 * (-1.547) = 0.774</CalcStep>
        <CalcStep number={7}>Total ELBO loss = 0.04 + 0.774 = 0.814</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The KL term dominates here because mu = 1.2 is far from 0. Backpropagation will
          push mu toward 0 while also reducing reconstruction error — a tug of war that
          produces a well-structured latent space after many training steps.
        </p>
      </WorkedExample>

      <ExplanationBox title="Generating New Images">
        <p>
          Once trained, generating is simple: sample z from N(0, 1) and pass it through the
          decoder. Because the KL term forced the encoder to keep its distributions close to
          N(0, 1), the decoder has seen latent codes from across the entire standard normal
          during training and can produce a coherent image for any random z you sample.
          VAEs thus bridge representation learning and generation in a single model.
        </p>
      </ExplanationBox>
    </div>
  );
}
