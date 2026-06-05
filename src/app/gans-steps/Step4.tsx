'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Two Phases per Iteration">
        <p>
          GAN training alternates between two phases every iteration. It is crucial that the
          two networks have <em>separate</em> optimisers and that only one set of weights is
          updated at a time — otherwise the gradients from both objectives would interfere.
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Phase 1 — Train D.</strong> Freeze G&apos;s weights. Sample a mini-batch of
            real images and a mini-batch of fakes from G. Compute D&apos;s binary cross-entropy
            loss across both batches and take a gradient step to maximise it (or equivalently,
            minimise the negative).
          </li>
          <li>
            <strong>Phase 2 — Train G.</strong> Freeze D&apos;s weights. Sample a new batch of
            noise vectors, pass them through G to get fakes, pass those fakes through the frozen
            D, and compute G&apos;s loss. Take a gradient step to minimise it.
          </li>
        </ul>
        <p>
          In practice many implementations run Phase 1 once and Phase 2 once per iteration,
          but the ratio can be tuned (e.g. train D for k steps for every 1 step of G).
        </p>
      </ExplanationBox>

      <MathFormula label="Discriminator loss (binary cross-entropy, to minimise)">
        L_D = −[log D(x_real) + log(1 − D(G(z)))]
      </MathFormula>

      <MathFormula label="Generator loss (non-saturating form, to minimise)">
        L_G = −log D(G(z))
      </MathFormula>

      <ExplanationBox title="Why the Non-Saturating Form for G?">
        <p>
          The original minimax objective for G is to minimise log(1 − D(G(z))). Early in
          training, when G produces obvious garbage, D(G(z)) ≈ 0, so log(1 − 0) ≈ 0 and the
          gradient is nearly flat — G learns very slowly. Goodfellow&apos;s practical fix:
          instead have G <em>maximise</em> log D(G(z)), equivalently minimise −log D(G(z)).
          When D(G(z)) is small the gradient is steep, giving G a strong learning signal
          right when it needs it most.
        </p>
      </ExplanationBox>

      <WorkedExample title="Loss Calculation for One Real and One Fake Sample">
        <p>
          Suppose D outputs the following for two samples in a mini-batch:
        </p>
        <CalcStep number={1}>
          Real image x_real: D(x_real) = 0.85 (D thinks it&apos;s probably real — correct)
        </CalcStep>
        <CalcStep number={2}>
          Fake image G(z): D(G(z)) = 0.40 (D thinks it might be real — partially fooled)
        </CalcStep>
        <CalcStep number={3}>
          D&apos;s loss contribution from the real image: −log(0.85) ≈ −(−0.163) = 0.163
        </CalcStep>
        <CalcStep number={4}>
          D&apos;s loss contribution from the fake image: −log(1 − 0.40) = −log(0.60) ≈ 0.511
        </CalcStep>
        <CalcStep number={5}>
          Total L_D = 0.163 + 0.511 = 0.674 — D will update its weights to push this lower by
          becoming more confident: D(x_real) → 1 and D(G(z)) → 0.
        </CalcStep>
        <CalcStep number={6}>
          G&apos;s loss for the same fake: −log(D(G(z))) = −log(0.40) ≈ 0.916 — G will update
          its weights to push D(G(z)) higher, toward 1, making the fake harder to detect.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice the tension: D wants to drive D(G(z)) toward 0, which would make G&apos;s loss
          explode. G wants to drive D(G(z)) toward 1, which would make D&apos;s loss explode.
          Training is a tug-of-war between these two opposing gradients.
        </p>
      </WorkedExample>

      <ExplanationBox title="What Gradients Flow Where">
        <p>
          During Phase 1 (training D), the error signal flows backward through D only.
          G&apos;s weights are frozen so no gradient reaches them — G does not change.
        </p>
        <p>
          During Phase 2 (training G), the fake image G(z) is passed through D to get a score.
          The gradient then flows backward through D (to compute how the score changes with the
          image pixels) and continues through G (to compute how the image pixels change with G&apos;s
          weights). D&apos;s weights are frozen during this phase — only G updates.
        </p>
        <p>
          This chain of differentiation through two networks is standard backpropagation;
          frameworks like PyTorch handle it automatically as long as you freeze the right
          parameters at the right time.
        </p>
      </ExplanationBox>

    </div>
  );
}
