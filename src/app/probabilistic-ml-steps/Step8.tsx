'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Inference as Optimization">
        <p>
          MCMC is powerful but slow — producing high-quality samples from a complex posterior can
          take hours or days. <strong>Variational inference (VI)</strong> offers an alternative:
          turn the inference problem into an optimization problem.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The idea: instead of sampling from the true posterior p(&theta; | D), find the member
          of a tractable family of distributions q(&theta;; &lambda;) that is as close as possible
          to p. We optimize the parameters &lambda; of q until q approximates p well. Optimization
          is typically much faster than sampling.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Does &quot;Close&quot; Mean? KL Divergence">
        <p>
          We measure closeness with the <strong>KL divergence</strong> (Kullback-Leibler divergence)
          from q to p. KL(q || p) is zero when q = p and positive otherwise:
        </p>
      </ExplanationBox>

      <MathFormula label="KL Divergence">
        KL(q || p) = &int; q(&theta;) &times; log(q(&theta;) / p(&theta; | D)) d&theta;
      </MathFormula>

      <ExplanationBox title="The ELBO: What We Actually Optimize">
        <p>
          We cannot minimize KL(q || p) directly because it involves log p(&theta; | D), which
          contains the intractable normalizer P(D). Instead, we maximize a lower bound on log P(D)
          called the <strong>Evidence Lower Bound (ELBO)</strong>:
        </p>
      </ExplanationBox>

      <MathFormula label="Evidence Lower Bound (ELBO)">
        ELBO(&lambda;) = E(q)[log P(D | &theta;)] &minus; KL(q(&theta;; &lambda;) || p(&theta;))
      </MathFormula>

      <ExplanationBox title="Reading the ELBO">
        <p>
          The ELBO has a beautiful interpretation as two competing forces:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>E(q)[log P(D | &theta;)]</strong> — the expected log-likelihood under q.
            Maximizing this pushes q toward parameter values that explain the data well.
          </li>
          <li>
            <strong>KL(q || p(&theta;))</strong> — the divergence from q to the prior. Minimizing
            this keeps q close to the prior, preventing overfitting. This term acts as a regularizer.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Maximizing the ELBO is equivalent to minimizing KL(q || p(&theta; | D)).
          The math works out to: log P(D) = ELBO + KL(q || p(&theta; | D)), so the ELBO is always
          a lower bound on log P(D), with equality when q exactly equals the posterior.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Mean-Field Variational Inference">
        <p>
          The most common choice of family q is the <strong>mean-field</strong> approximation:
          assume all variables are independent under q, so q factorizes completely:
        </p>
      </ExplanationBox>

      <MathFormula label="Mean-Field Factorization">
        q(&theta;1, &theta;2, ..., &theta;n; &lambda;) = &prod;(i) q(i)(&theta;i; &lambda;i)
      </MathFormula>

      <ExplanationBox title="MCMC vs Variational Inference: The Tradeoffs">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Accuracy:</strong> MCMC is asymptotically exact — given enough samples,
            it converges to the true posterior. VI introduces a bias from the approximating
            family; the posterior is at best as accurate as the family allows.
          </li>
          <li>
            <strong>Speed:</strong> VI is typically orders of magnitude faster. For large datasets,
            stochastic variational inference (SVI) scales VI with mini-batch gradient descent.
          </li>
          <li>
            <strong>Underestimating uncertainty:</strong> mean-field VI systematically
            underestimates posterior variance because it cannot capture correlations between
            variables. This is a known, structural bias.
          </li>
          <li>
            <strong>Scalability:</strong> modern deep generative models (VAEs, diffusion models)
            use VI at the core — the encoder network parameterizes q and is trained end-to-end
            by maximizing the ELBO.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Two Types of Uncertainty">
        <p>
          A critical distinction in any deployed ML system:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Aleatoric uncertainty</strong> — irreducible uncertainty inherent in the data.
            Even with infinite training data, some predictions are fundamentally noisy. Example:
            even knowing all the atmospheric variables perfectly, the weather two weeks out is
            chaotic. No amount of data or model complexity eliminates this.
          </li>
          <li>
            <strong>Epistemic uncertainty</strong> — reducible uncertainty due to limited knowledge
            or data. If our model has never seen examples from a certain region of input space, it
            should be uncertain there. More data or a better model can reduce epistemic uncertainty.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          A well-calibrated Bayesian model captures both. A point-estimate model (maximum likelihood
          only) captures neither — it gives one answer and no sense of confidence.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Uncertainty Estimation Matters">
        <p>
          In safety-critical applications — medical diagnosis, autonomous vehicles, loan decisions —
          knowing that a model is uncertain is just as important as knowing its best guess. A model
          that says &quot;70% cancer, but I am very uncertain&quot; should trigger a follow-up test.
          A model that says &quot;70% cancer&quot; with false confidence is dangerous.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Probabilistic ML, in its entirety, is the discipline of building models that are honest
          about what they do and do not know. Variational inference and MCMC give us tools to
          tractably compute those honest uncertainty estimates, and the graphical model framework
          gives us the language to express rich structured beliefs — from individual coin flips all
          the way to complex sequential processes observed through noisy sensors.
        </p>
      </ExplanationBox>

      <WorkedExample title="ELBO Decomposition for a Gaussian Approximation">
        <p>
          Suppose the true posterior over a single scalar parameter &theta; is approximately
          Normal(0.65, 0.04) (mean 0.65, variance 0.04). We approximate with q = Normal(&mu;, &sigma;^2).
          We compute the ELBO at two candidate approximations and compare.
        </p>

        <CalcStep number={1}>
          Candidate A: q_A = Normal(0.65, 0.04). This exactly matches the posterior.
          KL(q_A || p) = 0. ELBO_A = log P(D) — the maximum possible value.
        </CalcStep>
        <CalcStep number={2}>
          Candidate B: q_B = Normal(0.65, 0.01) — same mean, but four times narrower.
          KL between two Gaussians N(&mu;1, &sigma;1^2) and N(&mu;2, &sigma;2^2) is:
          (1/2) &times; [(&sigma;1/&sigma;2)^2 + (&mu;1-&mu;2)^2/&sigma;2^2 - 1 + 2 log(&sigma;2/&sigma;1)]
        </CalcStep>
        <CalcStep number={3}>
          Plug in: &mu;1 = &mu;2 = 0.65, &sigma;1^2 = 0.01, &sigma;2^2 = 0.04.
          KL = (1/2) &times; [0.01/0.04 + 0 - 1 + 2 log(0.2/0.1)]
        </CalcStep>
        <CalcStep number={4}>
          = (1/2) &times; [0.25 - 1 + 2 log(2)]
          = (1/2) &times; [0.25 - 1 + 1.386]
          = (1/2) &times; 0.636 &approx; 0.318
        </CalcStep>
        <CalcStep number={5}>
          So ELBO_B = log P(D) - 0.318 &lt; ELBO_A. The narrower approximation achieves a lower
          ELBO, correctly penalizing its failure to capture the true posterior&apos;s spread.
          The optimizer would prefer candidate A.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          This is variational inference in miniature: we search over the family of Gaussian
          approximations, and the ELBO objective steers us toward the member closest to the true
          posterior. In practice, we optimize &mu; and &sigma; jointly using gradient ascent on
          the ELBO — often computed with the reparameterization trick to get low-variance gradients.
        </p>
      </WorkedExample>
    </div>
  );
}
