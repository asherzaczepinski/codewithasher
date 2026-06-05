'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
