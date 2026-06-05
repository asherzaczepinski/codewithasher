'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
