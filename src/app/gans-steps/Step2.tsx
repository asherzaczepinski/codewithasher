'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

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
    </div>
  );
}
