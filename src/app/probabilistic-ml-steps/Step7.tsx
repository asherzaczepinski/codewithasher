'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
    </div>
  );
}
