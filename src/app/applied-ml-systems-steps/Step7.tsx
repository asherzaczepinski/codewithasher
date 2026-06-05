'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Why Models Degrade Over Time">
        <p>
          A model trained today will, in most cases, become less accurate over the coming months —
          not because anyone changed the code, but because the world changed. The statistical
          relationship between inputs and outputs that the model learned from historical data
          is no longer the same relationship that exists in the live data it receives today.
          This is called <strong>drift</strong>, and it is the central reason that deploying a model
          is not the end of the ML project — it&apos;s closer to the beginning.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Types of Drift">
        <p>
          <strong>Data drift (covariate shift)</strong> — the distribution of input features
          changes, but the true relationship between inputs and outputs stays the same. Example:
          your fraud model was trained on web traffic; now half your transactions come from a
          mobile app with a different device fingerprint distribution. The model has never seen
          these feature distributions and its predictions become unreliable.
        </p>
        <p>
          <strong>Concept drift</strong> — the true relationship between inputs and outputs changes.
          Example: fraudsters adapt their tactics. Transaction patterns that used to be reliable
          fraud signals (multiple small transactions at odd hours) become normal as legitimate
          users adopt buy-now-pay-later services. Even if the input distribution is stable, the
          meaning of those inputs has changed.
        </p>
        <p>
          <strong>Label drift</strong> — the distribution of output labels changes. In a
          sentiment classifier, if product quality genuinely improves over time, the true rate
          of positive reviews increases. A model calibrated on older data will underpredict
          positive sentiment.
        </p>
        <p>
          <strong>Detecting drift:</strong> monitor input feature distributions over time using
          statistical tests. The Population Stability Index (PSI) and Kolmogorov-Smirnov test
          are common for continuous features; chi-squared tests for categorical ones. Alert when
          drift exceeds a threshold, then investigate whether retraining is warranted.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Production Monitoring">
        <p>
          Monitoring a production ML system requires tracking at least three levels:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>System health</strong> — latency (p50, p95, p99), error rate, CPU/GPU
            utilization, request queue depth. These are the same metrics you&apos;d track for any
            service. Alerts here mean the serving infrastructure is degraded.
          </li>
          <li>
            <strong>Prediction health</strong> — the distribution of model outputs over time.
            If your fraud model suddenly predicts fraud for 40% of transactions (up from the
            usual 0.5%), something has gone wrong — either upstream data, or the model itself.
            Monitor prediction distributions even when you don&apos;t have ground truth labels yet.
          </li>
          <li>
            <strong>Business metrics</strong> — the downstream outcome the model is supposed to
            improve: fraud loss rate, user click-through rate, revenue attributed to
            recommendations. These lag behind model changes (fraud losses are counted after
            chargebacks, which take weeks), but they are the ultimate measure of whether the
            model is working.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="A/B Testing in Production">
        <p>
          An A/B test (also called a randomized controlled experiment or split test) is the
          rigorous way to measure the causal effect of a model change on a business metric.
          You randomly assign traffic to the old model (control, group A) and the new model
          (treatment, group B), run both simultaneously, and compare the outcomes.
        </p>
        <p>
          The key word is <em>causal</em>. Because assignment is random, any difference in
          outcomes between A and B can be attributed to the model change — not to differences
          in the users who happened to receive each version.
        </p>
        <p>
          <strong>Common mistake:</strong> comparing the new model&apos;s offline AUC to the old
          model&apos;s offline AUC and concluding the new model is better. Offline metrics do not
          always translate to online business improvement. A recommendation model with higher
          offline precision may actually produce worse user engagement because it reduces
          diversity.
        </p>
      </ExplanationBox>

      <MathFormula label="Two-proportion z-test for conversion rate">
        z = (p_B - p_A) / sqrt(p(1-p)(1/n_A + 1/n_B)), where p = (x_A + x_B) / (n_A + n_B)
      </MathFormula>

      <WorkedExample title="A/B Test: Is the New Model Better?">
        <p>
          Our fraud team deploys a new gradient-boosted model to 10% of traffic alongside the
          old logistic regression model on the remaining 90%. After one week they compare
          false-negative rates (missed frauds, which cause chargebacks).
        </p>
        <CalcStep number={1}>
          Old model (A): 18,000 transactions, 54 missed frauds. False-negative rate p_A = 54 / 18000 = 0.003 (0.3%)
        </CalcStep>
        <CalcStep number={2}>
          New model (B): 2,000 transactions, 4 missed frauds. False-negative rate p_B = 4 / 2000 = 0.002 (0.2%)
        </CalcStep>
        <CalcStep number={3}>
          Pooled rate: p = (54 + 4) / (18000 + 2000) = 58 / 20000 = 0.0029
        </CalcStep>
        <CalcStep number={4}>
          Standard error: sqrt(0.0029 x 0.9971 x (1/18000 + 1/2000)) = sqrt(0.0029 x 0.9971 x 0.000611) = 0.00133
        </CalcStep>
        <CalcStep number={5}>
          z = (0.002 - 0.003) / 0.00133 = -0.001 / 0.00133 = -0.75
        </CalcStep>
        <CalcStep number={6}>
          A z of -0.75 corresponds to a p-value of about 0.45, far above the 0.05 threshold.
          The result is not statistically significant — we cannot conclude the new model is better.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The right response: run the test longer (more power) or with a larger traffic split.
          With n_B = 2,000, we simply don&apos;t have enough observations of the rare fraud event to
          detect a difference reliably. This is the sample size problem with rare-event metrics.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The first snippet computes the <strong>Population Stability Index (PSI)</strong> to
          quantify feature drift between training data and live data. The second uses
          <strong> scipy</strong> to run the two-proportion z-test from the worked example above,
          making the significance test reproducible and automatable inside a CI pipeline.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="drift_check.py"
        caption="Compute PSI to detect feature drift, then run a two-proportion z-test to evaluate A/B test significance."
        code={`import numpy as np
from scipy import stats

# ============================================================
# PART 1 — Population Stability Index (PSI) for feature drift
# ============================================================
# PSI measures how much a feature distribution has shifted between
# a reference period (training) and a monitoring period (live traffic).
# Industry rule of thumb:
#   PSI < 0.10  -> negligible shift, no action needed
#   PSI 0.10-0.25 -> moderate shift, investigate
#   PSI > 0.25  -> significant shift, consider retraining

def compute_psi(reference: np.ndarray, current: np.ndarray, n_bins: int = 10) -> float:
    # Build bin edges from the reference distribution only.
    # Using reference edges ensures we measure shift relative to what the model saw
    # during training, not relative to today's data.
    _, bin_edges = np.histogram(reference, bins=n_bins)
    bin_edges[0] = -np.inf      # open left edge: capture any values below training min
    bin_edges[-1] = np.inf      # open right edge: capture any values above training max

    ref_counts, _ = np.histogram(reference, bins=bin_edges)
    cur_counts, _ = np.histogram(current, bins=bin_edges)

    # Convert counts to proportions; clip to avoid log(0) which is undefined.
    ref_pct = np.clip(ref_counts / len(reference), 1e-6, None)
    cur_pct = np.clip(cur_counts / len(current),  1e-6, None)

    # PSI formula: sum over bins of (actual - expected) * ln(actual / expected)
    psi = np.sum((cur_pct - ref_pct) * np.log(cur_pct / ref_pct))
    return float(psi)

# Simulate: training feature vs. live feature that has drifted
rng = np.random.default_rng(42)
train_amount = rng.lognormal(mean=4.5, sigma=1.2, size=50_000)   # reference distribution
live_amount  = rng.lognormal(mean=5.1, sigma=1.4, size=10_000)   # shifted distribution

psi_score = compute_psi(train_amount, live_amount)
print(f"PSI for transaction_amount: {psi_score:.4f}")

# Alert threshold: raise an issue in the monitoring system if PSI exceeds 0.25.
if psi_score > 0.25:
    print("ALERT: significant feature drift detected — review for retraining")


# ============================================================
# PART 2 — Two-proportion z-test for A/B test significance
# ============================================================
# This is the exact test from the worked example; here it runs as code
# so the CI pipeline can assert significance automatically after each experiment.

def ab_test_ztest(successes_a: int, n_a: int, successes_b: int, n_b: int):
    # scipy.stats.proportions_ztest handles the pooled-proportion formula.
    # The null hypothesis is that both groups have the same underlying rate.
    z_stat, p_value = stats.proportions_ztest(
        count=[successes_b, successes_a],   # treatment first is conventional
        nobs=[n_b, n_a],
        alternative="smaller",              # H1: new model has a LOWER false-negative rate
    )
    return z_stat, p_value

# Numbers from the worked example:
# Old model (A): 18 000 transactions, 54 missed frauds
# New model (B):  2 000 transactions,  4 missed frauds
z, p = ab_test_ztest(successes_a=54, n_a=18_000, successes_b=4, n_b=2_000)
print(f"z = {z:.3f}, p-value = {p:.4f}")

ALPHA = 0.05    # significance threshold agreed before the experiment started
if p < ALPHA:
    print("Result is significant — new model is better, promote to 100pct traffic")
else:
    print("Result is NOT significant — continue the test or increase traffic split")
`}
      />

      <ExplanationBox title="CI/CD for ML">
        <p>
          Continuous Integration and Continuous Delivery (CI/CD) for ML extends the software
          engineering concept: every change to model code, training configuration, or feature
          definitions triggers an automated pipeline that validates correctness and, if tests
          pass, promotes the artifact.
        </p>
        <p>
          A minimal ML CI/CD pipeline includes: unit tests for feature transforms and preprocessing
          functions; integration tests that run a short training job and verify the model achieves
          at least a minimum quality threshold; and automated deployment to a staging environment
          for shadow testing before production promotion. Retraining can be triggered on a schedule
          (daily) or by a drift alert (reactive). The key discipline is that <em>no model enters
          production without passing automated quality gates</em> — the same discipline that
          prevents buggy software from shipping.
        </p>
      </ExplanationBox>
    </div>
  );
}
