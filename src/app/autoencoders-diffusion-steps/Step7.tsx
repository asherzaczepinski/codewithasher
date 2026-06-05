'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Four Families, Four Philosophies">
        <p>
          Every generative model answers the same question — how do we learn to produce new data
          that looks like our training distribution? — but each does it with a different
          mathematical strategy. Understanding what each optimises tells you immediately when to
          use it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Autoencoders">
        <p>
          <strong>What it optimises:</strong> Reconstruction loss only. Minimise MSE(x, decoder(encoder(x))).
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Latent space:</strong> Scattered — each image gets an arbitrary code. Regions
          between codes decode to noise.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Best for:</strong> Representation learning, dimensionality reduction, anomaly
          detection, feature extraction. <em>Not for generation.</em>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Speed:</strong> Fast — one encoder pass, one decoder pass.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Variational Autoencoders (VAEs)">
        <p>
          <strong>What it optimises:</strong> ELBO = Reconstruction loss + KL divergence. The KL
          term regularises the latent space toward N(0, 1).
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Latent space:</strong> Continuous and compact — interpolating between two codes
          produces sensible images. Enables genuine sampling.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Best for:</strong> Controllable generation, latent space interpolation,
          semi-supervised learning, learning disentangled representations.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Weakness:</strong> Images are often slightly blurry because the MSE
          reconstruction loss treats pixel errors equally, averaging over uncertainty.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Speed:</strong> Fast — one encoder pass for sampling z, one decoder pass.
        </p>
      </ExplanationBox>

      <MathFormula label="VAE ELBO (to maximise, or equivalently minimise negative ELBO)">
        L_VAE = Reconstruction Loss + KL(q(z|x) || p(z))
      </MathFormula>

      <ExplanationBox title="GANs (Generative Adversarial Networks)">
        <p>
          <strong>What it optimises:</strong> A minimax game. The generator G minimises how well
          the discriminator D can distinguish generated images from real ones; D maximises it.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Image quality:</strong> Historically the sharpest output — no pixel-averaging
          because the discriminator directly penalises blurry fakes.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Weakness:</strong> Training instability and mode collapse (generating only a
          subset of the data distribution). Requires careful hyperparameter tuning and
          architectural tricks. Covered in depth in the GANs course.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Speed:</strong> Very fast — single generator forward pass at inference.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Diffusion Models">
        <p>
          <strong>What it optimises:</strong> MSE on noise prediction at every timestep. Stable,
          simple, no adversarial training.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Image quality and diversity:</strong> State-of-the-art on both dimensions.
          Better mode coverage than GANs; sharper than VAEs.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Weakness:</strong> Slow generation — requires 50–1000 sequential denoising
          steps. Mitigated by fast samplers (DDIM, DPM-Solver) but still slower than GANs or
          VAEs.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Speed:</strong> Slow at inference relative to other methods.
        </p>
      </ExplanationBox>

      <MathFormula label="Diffusion Training Loss">
        L_diffusion = E[ ||epsilon - epsilon-theta(x(t), t)||^2 ]
      </MathFormula>

      <ExplanationBox title="Side-by-Side Summary">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Model</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Optimises</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Image Quality</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Diversity</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Speed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Autoencoder</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Reconstruction MSE</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>N/A (not generative)</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>N/A</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Very fast</td>
            </tr>
            <tr style={{ background: '#fafafa' }}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>VAE</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>ELBO (recon + KL)</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Moderate (blurry)</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>High</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Very fast</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>GAN</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Minimax game</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>High (sharp)</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Lower (mode collapse)</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Very fast</td>
            </tr>
            <tr style={{ background: '#fafafa' }}>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Diffusion</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Noise prediction MSE</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Very high</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Very high</td>
              <td style={{ padding: '8px', border: '1px solid #ddd' }}>Slow</td>
            </tr>
          </tbody>
        </table>
      </ExplanationBox>

      <ExplanationBox title="Where the Field Is Today">
        <p>
          As of the mid-2020s, diffusion models dominate image generation benchmarks and
          production systems. Stable Diffusion, DALL·E, Imagen, and Midjourney all use
          diffusion at their core. Latent diffusion models (like Stable Diffusion) reduce
          compute cost by running the diffusion process in a compressed VAE latent space rather
          than pixel space — combining the best of both architectures.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          VAEs remain essential as the &quot;latent encoder&quot; in those systems and for
          applications needing fast, controllable generation. Autoencoders (non-variational) are
          workhorses for anomaly detection and feature extraction in production ML pipelines.
          GANs still hold ground in specialised domains like face synthesis and video generation
          where speed is paramount.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Research frontiers include <strong>flow matching</strong> (a cleaner continuous-time
          generalisation of diffusion), <strong>consistency models</strong> (distilling diffusion
          into fewer steps), and <strong>rectified flows</strong> (straight-line trajectories
          through noise space). The core ideas you have learned in this course — latent spaces,
          the ELBO, noise schedules, and denoising networks — underpin all of them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Congratulations">
        <p>
          You have now traced the complete arc from a plain autoencoder compressing a 28x28
          digit down to 8 numbers, through variational autoencoders learning smooth generative
          distributions, to diffusion models reversing thousands of noise steps to produce
          photorealistic faces. The mathematics are different, but the underlying theme is the
          same: <em>learn the structure of data, then exploit that structure to create.</em>
        </p>
      </ExplanationBox>
    </div>
  );
}
