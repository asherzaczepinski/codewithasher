'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Image Generation and Synthesis">
        <p>
          The most visible application of GANs is photorealistic image synthesis. NVIDIA&apos;s
          StyleGAN series produces 1024 × 1024 portraits of people who do not exist, with
          controllable attributes like age, hair colour, and lighting. These systems are not
          memorising training images — they are interpolating in latent space and producing
          genuinely novel outputs. The same architecture has been applied to cars, bedrooms,
          cats, and almost every image category with enough training data.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Super-Resolution">
        <p>
          <strong>SRGAN</strong> and its successors use the adversarial framework to recover
          fine detail when upscaling a low-resolution image. A traditional approach (bicubic
          interpolation) blurs the result because it averages plausible pixel values.
          A GAN-based approach trains G to hallucinate high-frequency textures that look
          realistic to D. The output is sharper and perceptually more convincing, even though
          the hallucinated pixels are not the &quot;true&quot; high-resolution pixels. This is
          used in streaming services, satellite imagery, and medical imaging.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Style Transfer and Image-to-Image Translation">
        <p>
          <strong>Pix2Pix</strong> (a conditional GAN) learns a mapping between two image
          domains: sketches to photographs, day to night, satellite views to maps.
          <strong> CycleGAN</strong> removes the need for paired examples — it can learn to
          convert horses to zebras or summer landscapes to winter scenes using only unpaired
          collections of each domain. These tools are used by artists, game developers,
          and filmmakers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Data Augmentation">
        <p>
          In domains where labelled data is scarce — medical scans, rare defects on manufacturing
          lines, low-resource languages — GANs generate synthetic training examples to augment
          real datasets. A GAN trained on genuine MRI scans can produce additional synthetic
          scans with known labels, improving downstream classifier performance without the cost
          and privacy risk of acquiring more patient data.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Deepfakes and Ethical Concerns">
        <p>
          The same technology that produces artistic face synthesis can be used maliciously.
          <strong> Deepfakes</strong> — GAN-generated video in which a person&apos;s face is
          replaced by someone else&apos;s — have been used to create non-consensual intimate
          imagery, political disinformation, and fraud. The barrier to entry is low: open-source
          tools exist that run on consumer hardware.
        </p>
        <p>
          This creates real societal harm: eroded trust in video evidence, reputational damage
          to individuals, and undermined democratic discourse. Detection research (training
          classifiers to spot GAN artefacts) is an ongoing arms race. Regulatory and platform
          responses are still catching up.
        </p>
        <p>
          As a practitioner, understanding the capabilities of generative models comes with
          responsibility. Deploying systems that can produce realistic synthetic media requires
          watermarking, consent frameworks, use-case restrictions, and active monitoring.
          The technology itself is neutral; the choices around deployment are not.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Where GANs Sit Today vs Diffusion Models">
        <p>
          Since roughly 2021, <strong>diffusion models</strong> (DALL·E 2, Stable Diffusion,
          Midjourney) have overtaken GANs as the dominant architecture for high-quality image
          generation. Diffusion models are easier to train (no adversarial instability),
          produce more diverse outputs, and scale more predictably with compute and data.
        </p>
        <p>
          However, GANs remain relevant: they are <em>faster at inference</em> (one forward
          pass through G vs hundreds of denoising steps), making them preferable for real-time
          applications like video synthesis and interactive editing. They also remain the
          standard in specialised domains — super-resolution, medical imaging augmentation —
          where the controlled, deterministic nature of the latent space is useful.
        </p>
        <p>
          Understanding GANs is not optional background — it is the foundation on which
          adversarial training, latent space manipulation, and conditional generation are built.
          Every modern generative AI researcher starts here.
        </p>
      </ExplanationBox>
    </div>
  );
}
