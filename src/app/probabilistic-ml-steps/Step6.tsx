'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Parameters Are Uncertain Too">
        <p>
          So far we have treated model parameters — transition probabilities, emission probabilities,
          weights — as fixed known quantities. But in reality, we estimate them from data, and data
          is finite. Our estimates are uncertain.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Bayesian inference</strong> treats parameters as random variables and places a
          probability distribution over them. Before seeing any data, we have a <strong>prior</strong>
          belief P(&theta;). After seeing data D, we update to the <strong>posterior</strong>
          P(&theta; | D) via Bayes&apos; rule:
        </p>
      </ExplanationBox>

      <MathFormula label="Bayesian Parameter Inference">
        P(&theta; | D) = P(D | &theta;) &times; P(&theta;) / P(D)
      </MathFormula>

      <ExplanationBox title="Reading the Terms">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>P(&theta;)</strong> — prior: encodes what we believed about &theta; before
            seeing data. Could be broad (vague prior) or narrow (strong prior from domain knowledge).
          </li>
          <li>
            <strong>P(D | &theta;)</strong> — likelihood: how probable is the data we actually
            observed, if &theta; were the true parameter value?
          </li>
          <li>
            <strong>P(D)</strong> — marginal likelihood / evidence: a constant that normalizes the
            posterior. Often intractable to compute exactly for complex models.
          </li>
          <li>
            <strong>P(&theta; | D)</strong> — posterior: a full distribution over &theta; after
            observing data. It captures both the best estimate and our remaining uncertainty.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Conjugate Priors: When the Math Stays Clean">
        <p>
          For certain prior-likelihood pairs, the posterior has the same functional form as the
          prior. These are called <strong>conjugate pairs</strong>. Conjugacy means the update
          is analytic — no numerical integration required.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The most useful conjugate pair in practice is the <strong>Beta-Binomial</strong> model.
          We are trying to estimate a coin&apos;s bias &theta; (probability of heads). The data is
          a sequence of coin flips.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Prior:</strong> &theta; ~ Beta(&alpha;, &beta;). The Beta distribution is
            defined on [0, 1] and controlled by two shape parameters. Beta(1, 1) is uniform
            (complete ignorance). Beta(10, 10) is concentrated near 0.5 (strong belief the coin is fair).
          </li>
          <li>
            <strong>Likelihood:</strong> Binomial — if we observe H heads and T tails, the
            likelihood is proportional to &theta;^H &times; (1 &minus; &theta;)^T.
          </li>
          <li>
            <strong>Posterior:</strong> Beta(&alpha; + H, &beta; + T). We simply add the observed
            counts to the prior pseudo-counts. The prior acts as if we had already seen &alpha;
            heads and &beta; tails.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Beta-Binomial Posterior Update">
        Beta(&alpha;, &beta;) + (H heads, T tails) &rarr; Beta(&alpha; + H, &beta; + T)
      </MathFormula>

      <ExplanationBox title="Point Estimates vs Full Posteriors">
        <p>
          Once we have the posterior Beta(&alpha;&apos;, &beta;&apos;) with &alpha;&apos; = &alpha; + H
          and &beta;&apos; = &beta; + T, we have several choices:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Posterior mean</strong>: &alpha;&apos; / (&alpha;&apos; + &beta;&apos;). The
            expected value of &theta; under the posterior.
          </li>
          <li>
            <strong>Maximum a posteriori (MAP)</strong>: the mode of the posterior, (&alpha;&apos; &minus; 1)
            / (&alpha;&apos; + &beta;&apos; &minus; 2) for &alpha;&apos;, &beta;&apos; &gt; 1.
          </li>
          <li>
            <strong>Credible interval</strong>: the range [a, b] such that
            P(a &le; &theta; &le; b | D) = 0.95. Unlike a frequentist confidence interval,
            a Bayesian credible interval makes a direct probability statement about &theta;.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The full posterior is always more informative than any point estimate. It tells you not
          just the best guess but how confident you should be in it.
        </p>
      </ExplanationBox>

      <WorkedExample title="Updating a Coin-Bias Prior">
        <p>
          We suspect a coin is roughly fair. We encode this as a Beta(5, 5) prior (equivalent to
          having seen 5 heads and 5 tails in the past). We then flip the coin 10 times and observe
          8 heads and 2 tails.
        </p>

        <CalcStep number={1}>
          Prior: Beta(&alpha;=5, &beta;=5). Prior mean = 5/(5+5) = 0.50.
        </CalcStep>
        <CalcStep number={2}>
          Observed data: H = 8 heads, T = 2 tails.
        </CalcStep>
        <CalcStep number={3}>
          Posterior parameters: &alpha;&apos; = 5 + 8 = 13, &beta;&apos; = 5 + 2 = 7.
        </CalcStep>
        <CalcStep number={4}>
          Posterior mean = 13 / (13 + 7) = 13/20 = 0.65.
        </CalcStep>
        <CalcStep number={5}>
          Compare: frequentist MLE = 8/10 = 0.80. The posterior mean is pulled toward
          0.50 by the prior — this is called shrinkage or regularization. With only 10 flips,
          the prior&apos;s pseudo-count of 10 has significant weight.
        </CalcStep>
        <CalcStep number={6}>
          If we instead observe 80 heads and 20 tails (100 flips), &alpha;&apos; = 85, &beta;&apos; = 25,
          posterior mean = 85/110 &approx; 0.773, very close to MLE = 0.80. More data drowns
          out the prior.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The Bayesian update is automatic and principled. With little data, the prior dominates
          and protects against overfitting to noise. With abundant data, the likelihood dominates
          and the posterior concentrates near the true value. The full posterior Beta(13, 7) also
          gives us an honest 95% credible interval, something a point estimate cannot provide.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          scipy.stats.beta gives us the Beta distribution directly. The update rule is just
          addition — no integration needed. We can also draw a 95% credible interval from
          the posterior object in one line.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="beta_binomial.py"
        caption="Beta-Binomial conjugate update: prior Beta(a,b) + coin-flip data -> posterior Beta(a+heads, b+tails), with posterior mean and credible interval."
        code={`from scipy import stats

# ── Define the prior ──────────────────────────────────────────────────────────
# Beta(alpha, beta) is the conjugate prior for a Binomial likelihood.
# Interpretation: we believe we have already seen alpha heads and beta tails
# in imaginary past flips. Beta(1,1) = Uniform (complete ignorance).
alpha_prior = 5   # pseudo-count of heads -- encodes belief coin is roughly fair
beta_prior  = 5   # pseudo-count of tails

prior = stats.beta(alpha_prior, beta_prior)
print(f"Prior mean  = {prior.mean():.3f}")   # 5/(5+5) = 0.500

# ── Observe real data ─────────────────────────────────────────────────────────
heads = 8   # actual heads observed in 10 flips
tails = 2   # actual tails observed in 10 flips

# ── Conjugate update -- this is the entire Bayesian inference step ─────────────
# Posterior is also Beta, with counts simply added.
# This works because Beta is the conjugate prior for the Binomial likelihood:
# Beta(a,b) * Binomial(H,T) proportional to Beta(a+H, b+T)
alpha_post = alpha_prior + heads   # 5 + 8 = 13
beta_post  = beta_prior  + tails   # 5 + 2 = 7

posterior = stats.beta(alpha_post, beta_post)

# ── Read off posterior summaries ──────────────────────────────────────────────
post_mean = posterior.mean()          # alpha / (alpha + beta) -- analytic formula
post_mode = (alpha_post - 1) / (alpha_post + beta_post - 2)  # MAP estimate
ci_low, ci_high = posterior.interval(0.95)  # 95 % credible interval

print(f"Posterior mean  = {post_mean:.3f}")   # 13/20 = 0.650
print(f"Posterior MAP   = {post_mode:.3f}")   # (13-1)/(20-2) = 0.667
print(f"95% credible interval: [{ci_low:.3f}, {ci_high:.3f}]")

# ── Compare with frequentist MLE ──────────────────────────────────────────────
mle = heads / (heads + tails)
print(f"Frequentist MLE = {mle:.3f}")    # 8/10 = 0.800  -- no prior shrinkage

# ── Shrinkage: add more data and watch the prior fade ─────────────────────────
# With 10x more data the posterior mean moves toward the MLE.
alpha_lots = alpha_prior + 80   # 5 + 80 heads
beta_lots  = beta_prior  + 20   # 5 + 20 tails
print(f"Mean with 100 flips = {stats.beta(alpha_lots, beta_lots).mean():.3f}")
# ~0.773 -- much closer to MLE 0.80; prior has little influence now.
`}
      />
    </div>
  );
}
