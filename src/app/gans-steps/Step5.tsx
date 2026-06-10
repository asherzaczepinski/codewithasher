'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Training a GAN Is Notoriously Hard">
        <p>
          Unlike a standard supervised network where loss steadily falls toward a clear minimum,
          a GAN is optimising a <em>dynamic</em> target — each network&apos;s goal shifts as the
          other improves. This makes the landscape treacherous. Three failure modes crop up so
          reliably they have names.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Failure Mode 1: Mode Collapse">
        <p>
          <strong>Mode collapse</strong> happens when G discovers a single output — or a
          small handful — that reliably fools D, and simply repeats it for every noise vector.
          In the face example this looks like G producing hundreds of nearly identical portraits:
          same lighting, same expression, same bone structure, just slightly shuffled pixels.
        </p>
        <p>
          Why does it happen? G is rewarded whenever D(G(z)) is high. If a particular
          &quot;template&quot; face currently fools D, the gradient keeps reinforcing that
          template. G has no incentive to explore the rest of the space — diversity is not in
          its loss function. D eventually learns to reject the repeated template, but by then G
          may have collapsed onto a new template, and the cycle continues without progress.
        </p>
        <p>
          <strong>Fixes:</strong> mini-batch discrimination (letting D compare samples in a batch
          to detect lack of variety), unrolled GANs, or switching to the Wasserstein objective
          described below.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Failure Mode 2: Non-Convergence and Oscillation">
        <p>
          Because G and D are coupled, their losses do not necessarily converge to a stable
          equilibrium. Instead they may <strong>oscillate</strong>: G gets better, D improves in
          response, G adapts, D regresses, and so on indefinitely without either settling.
          Loss curves that should plateau instead cycle up and down.
        </p>
        <p>
          This can also manifest as <strong>instability</strong> — sudden catastrophic drops
          in quality mid-training where previously good outputs become incoherent. The landscape
          a GAN optimises over is non-convex for both players simultaneously, making saddle
          points and local cycles common.
        </p>
        <p>
          <strong>Fixes:</strong> careful learning-rate tuning, using Adam with conservative
          beta values (β₁ = 0.5 is a classic recommendation for GANs), gradient penalty
          regularisation, and spectral normalisation of D&apos;s weights.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Failure Mode 3: Vanishing Gradient from a Too-Strong Discriminator">
        <p>
          If D becomes much better than G early in training, it classifies every fake with near
          certainty: D(G(z)) ≈ 0. Recall G&apos;s original loss is log(1 − D(G(z))). When
          D(G(z)) → 0, that loss is log(1) = 0 — perfectly flat. No gradient, no learning.
          G is stuck.
        </p>
        <p>
          The non-saturating loss −log D(G(z)) partially addresses this (the gradient is steep
          when D(G(z)) is small), but the deeper problem is that an overwhelmingly strong D
          gives G almost no useful directional signal: it only knows its output was bad, not{' '}
          <em>how</em> to make it less bad.
        </p>
      </ExplanationBox>

      <MathFormula label="Label smoothing: soften the targets for D">
        real label → 0.9 instead of 1.0   (reduces overconfidence)
      </MathFormula>

      <ExplanationBox title="The Wasserstein Fix (WGAN)">
        <p>
          The Wasserstein GAN (WGAN) replaces the binary cross-entropy objective with the{' '}
          <strong>Wasserstein distance</strong> — also called Earth Mover&apos;s Distance —
          between the real and generated distributions. Instead of D outputting a probability,
          it outputs an unconstrained real number (it is technically called a &quot;critic&quot;).
          The critic is trained with weight clipping or gradient penalty to satisfy a Lipschitz
          constraint.
        </p>
        <p>
          The practical benefit is dramatic: the WGAN loss provides a meaningful, continuous
          gradient signal even when the generated distribution is far from the real one.
          Loss values correlate with visual quality, mode collapse is less frequent, and
          training is substantially more stable. WGAN and its improved variant WGAN-GP are now
          standard baselines in the GAN literature.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Balanced Training">
        <p>
          A well-trained GAN keeps D and G at roughly equal strength throughout training.
          Common heuristics: if D&apos;s accuracy on real/fake discrimination exceeds ~80%,
          run an extra G update before the next D update. Monitor both loss values — they
          should oscillate in a narrow band, not diverge. Label smoothing (targets of 0.9 and
          0.1 instead of 1 and 0) prevents D from becoming overconfident and sharpens gradients
          for G.
        </p>
      </ExplanationBox>

    </div>
  );
}
