'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="When Exact Inference Breaks Down">
        <p>
          Bayesian inference requires computing the posterior P(&theta; | D) = P(D | &theta;) P(&theta;) / P(D).
          The denominator P(D) — the marginal likelihood — requires integrating over all possible
          parameter values:
        </p>
      </ExplanationBox>

      <MathFormula label="Marginal Likelihood (intractable in general)">
        P(D) = &int; P(D | &theta;) P(&theta;) d&theta;
      </MathFormula>

      <ExplanationBox title="Why the Integral Is Hard">
        <p>
          For conjugate models like Beta-Binomial, this integral has a closed form. For almost
          everything else — deep neural networks, latent variable models, large Bayesian networks
          — the integral is over a high-dimensional space with no analytic solution.
          We need approximate methods.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          There are two main strategies: <strong>sampling methods</strong> (this module) and
          <strong>variational inference</strong> (next module). Sampling methods are exact in the
          limit of infinite samples; variational methods trade exactness for speed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Monte Carlo Estimation">
        <p>
          The core idea of <strong>Monte Carlo estimation</strong> is strikingly simple: to compute
          an expectation E[f(&theta;)] under some distribution p(&theta;), draw N samples from
          p and average the function values:
        </p>
      </ExplanationBox>

      <MathFormula label="Monte Carlo Estimator">
        E[f(&theta;)] &approx; (1/N) &times; &sum;(i=1 to N) f(&theta;(i)), &nbsp; &theta;(i) ~ p(&theta;)
      </MathFormula>

      <ExplanationBox title="The Law of Large Numbers Guarantees Convergence">
        <p>
          By the law of large numbers, the Monte Carlo estimator converges to the true expectation
          as N &rarr; &infin;. The estimation error shrinks at rate 1/&radic;N regardless of the
          dimensionality of &theta; — a remarkable property that makes Monte Carlo competitive
          even in hundreds of dimensions.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The catch: to draw samples from p(&theta;), we need a sampler. For the posterior
          P(&theta; | D) &propto; P(D | &theta;) P(&theta;), we can evaluate the numerator but
          cannot directly sample from it. This is where MCMC comes in.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Markov Chain Monte Carlo (MCMC)">
        <p>
          <strong>MCMC</strong> constructs a Markov chain whose stationary distribution is
          exactly our target posterior p(&theta;). By simulating the chain long enough, the
          samples it produces are (approximately) draws from p. We then use those samples in
          the Monte Carlo estimator.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The two most important algorithms:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Metropolis-Hastings:</strong> propose a new parameter value &theta;&apos; from
            a proposal distribution q(&theta;&apos; | &theta;). Accept with probability
            min(1, [p(&theta;&apos;) q(&theta; | &theta;&apos;)] / [p(&theta;) q(&theta;&apos; | &theta;)]).
            Notice p only appears as a ratio, so the normalizing constant Z cancels — we never
            need to compute it.
          </li>
          <li>
            <strong>Gibbs sampling:</strong> when the posterior has multiple variables, cycle
            through each variable and sample it from its conditional distribution given all the
            others. Each conditional is often tractable even when the joint is not.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Practical Considerations">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Burn-in:</strong> early samples before the chain reaches stationarity are
            discarded. Typical burn-in is hundreds to thousands of iterations.
          </li>
          <li>
            <strong>Mixing:</strong> a chain mixes slowly if proposals are too small (random walk
            takes forever to explore) or too large (nearly all proposals are rejected).
          </li>
          <li>
            <strong>Autocorrelation:</strong> consecutive MCMC samples are correlated, reducing
            effective sample size. Thinning (keeping every k-th sample) reduces this.
          </li>
          <li>
            <strong>Modern MCMC:</strong> Hamiltonian Monte Carlo (HMC) and the No-U-Turn Sampler
            (NUTS) use gradient information to make large, high-acceptance proposals — dramatically
            improving mixing in high dimensions. These power probabilistic programming systems like
            Stan and PyMC.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Monte Carlo Estimation of a Posterior Mean">
        <p>
          We have a posterior Beta(13, 7) from the previous module. The true mean is 13/20 = 0.65.
          Suppose we approximate it with N = 5 samples (illustrative; real use needs thousands).
          Imagine the sampler returned: 0.58, 0.71, 0.63, 0.69, 0.64.
        </p>

        <CalcStep number={1}>
          Samples: s1 = 0.58, s2 = 0.71, s3 = 0.63, s4 = 0.69, s5 = 0.64.
        </CalcStep>
        <CalcStep number={2}>
          Monte Carlo estimate of E[&theta;] = (0.58 + 0.71 + 0.63 + 0.69 + 0.64) / 5
        </CalcStep>
        <CalcStep number={3}>
          Sum = 3.25. Estimate = 3.25 / 5 = 0.650.
        </CalcStep>
        <CalcStep number={4}>
          True mean = 0.650. In this case exact, but with only 5 samples we got lucky;
          error shrinks as 1/&radic;N &approx; 0.45 / &radic;N per standard deviation.
        </CalcStep>
        <CalcStep number={5}>
          We can also estimate any other posterior quantity: P(&theta; &gt; 0.7) = 1/5 = 0.20
          (one sample exceeded 0.7). With more samples this approximation improves.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The power of MCMC is that once we have samples from the posterior, we can estimate
          any quantity — means, variances, quantiles, tail probabilities — without additional
          integration. It is a general-purpose posterior characterization tool, at the cost of
          computational time for generating the samples.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Below is a minimal Metropolis sampler targeting the Beta(13,7) posterior from the
          previous step. The key insight: we only ever evaluate the ratio of unnormalized
          densities, so the intractable normalizing constant Z cancels out completely.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="metropolis_sampler.py"
        caption="Metropolis MCMC sampler for Beta(13,7): the normalizing constant cancels in the acceptance ratio, making sampling tractable."
        code={`import numpy as np

# ── Target distribution: Beta(13, 7) posterior from Step 6 ───────────────────
# We need to evaluate the UNNORMALIZED density only.
# Beta(a,b) density proportional to: theta^(a-1) * (1-theta)^(b-1)
# The normalizing constant (B(a,b)) is never computed -- it cancels in the ratio.
alpha_post = 13
beta_post  = 7

def log_target(theta):
    # Log of the unnormalized Beta density.
    # Using log space prevents underflow for extreme theta values.
    if theta <= 0 or theta >= 1:
        return -np.inf  # log(0) -- outside the support [0,1]
    return (alpha_post - 1) * np.log(theta) + (beta_post - 1) * np.log(1 - theta)

# ── Metropolis algorithm ──────────────────────────────────────────────────────
rng      = np.random.default_rng(seed=42)  # reproducible results
n_iter   = 10_000     # total iterations (including burn-in)
n_burn   = 1_000      # discard the first 1000 samples while chain warms up
step_std = 0.05       # proposal standard deviation -- controls how far we jump

current      = 0.5    # start at the center of [0,1]
samples      = []
n_accepted   = 0

for i in range(n_iter):
    # Propose a new value by adding Gaussian noise (symmetric proposal).
    # Symmetric proposal: q(theta'|theta) = q(theta|theta'), so it cancels too.
    proposal = current + rng.normal(0, step_std)

    # Acceptance ratio: exp(log p(theta') - log p(theta))
    # Because the proposal is symmetric, only the target density ratio matters.
    log_ratio = log_target(proposal) - log_target(current)

    # Accept with probability min(1, ratio) -- compare to Uniform(0,1).
    if np.log(rng.uniform()) < log_ratio:
        current = proposal   # move to proposed point
        n_accepted += 1

    if i >= n_burn:          # only keep post-burn-in samples
        samples.append(current)

samples = np.array(samples)

# ── Summarise the samples ─────────────────────────────────────────────────────
mc_mean = samples.mean()            # Monte Carlo estimate of E[theta]
mc_std  = samples.std()             # estimate of posterior standard deviation
mc_p_gt_07 = (samples > 0.7).mean()  # P(theta > 0.7 | data)

print(f"Samples collected:  {len(samples)}")
print(f"Acceptance rate:    {n_accepted / n_iter:.2%}")   # healthy range: 20-50 %
print(f"MC mean of theta:   {mc_mean:.4f}")  # should be close to 13/20 = 0.65
print(f"MC std of theta:    {mc_std:.4f}")
print(f"P(theta > 0.7):     {mc_p_gt_07:.4f}")

# ── True analytical values for comparison ────────────────────────────────────
# Beta(13,7) mean = 13/(13+7) = 0.65
# Beta(13,7) std  = sqrt(13*7 / (20^2 * 21)) ~ 0.1015
true_mean = alpha_post / (alpha_post + beta_post)
print(f"True mean:          {true_mean:.4f}")  # 0.6500
# MC mean and true mean should be very close with 9000 samples.
`}
      />
    </div>
  );
}
