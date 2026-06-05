'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Every image you have ever seen — a face, a handwritten digit, a sunset — is a grid of
          pixel values. A 28x28 grayscale image is 784 numbers. A 256x256 colour photo is
          196,608 numbers. Yet the things those images show — faces, digits, objects — live in a
          much smaller space of meaningful variation. This course is about teaching networks to
          find that smaller space, and then use it to generate brand-new images that have never
          existed before.
        </p>
        <p>
          Along the way you will understand two of the most important ideas in modern deep
          learning: <strong>compressed representations</strong> and
          <strong> generative modelling</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Family of Generative Models">
        <p>
          Several architectures solve the &quot;generate new data&quot; problem, each with a
          different strategy:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Autoencoders</strong> — compress data to a small latent code, then
            reconstruct it. Great for learning representations, not directly for generation.
          </li>
          <li>
            <strong>Variational Autoencoders (VAEs)</strong> — extend autoencoders so the
            latent space is a smooth probability distribution, enabling genuine sampling of
            new examples.
          </li>
          <li>
            <strong>GANs (Generative Adversarial Networks)</strong> — a generator and
            discriminator compete against each other. Covered in the separate GANs course;
            we&apos;ll compare trade-offs in the final module here.
          </li>
          <li>
            <strong>Diffusion Models</strong> — gradually corrupt data with noise, then train
            a network to reverse the process. The approach behind Stable Diffusion, DALL·E 2,
            and Imagen.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Running Example: MNIST Digits and Face Images">
        <p>
          Throughout this course we use two complementary examples. For autoencoders and VAEs we
          compress and reconstruct handwritten digits (28x28 pixels, 784 inputs). For diffusion
          models we think about generating face images. Both are concrete enough to follow the
          math exactly, and both reveal why each technique was invented.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Roadmap">
        <p>
          <strong>Part 1 — Autoencoders</strong> walks through the encoder &rarr; bottleneck
          &rarr; decoder structure, reconstruction loss, denoising autoencoders, and
          variational autoencoders (VAEs) with the full ELBO objective.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Part 2 — Diffusion Models</strong> covers the forward noising process, the
          reverse denoising network, why diffusion produces such high-quality images, and a
          final comparison of all four generative families.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          You should be comfortable with how neural networks are trained (forward pass, loss,
          backpropagation) before continuing. If you are not, the Neural Networks course on
          this platform covers exactly that.
        </p>
      </ExplanationBox>
    </div>
  );
}
