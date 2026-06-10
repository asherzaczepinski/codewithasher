'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="What Is Calibration?">
        <p>
          A classifier is <strong>calibrated</strong> if its predicted probabilities match observed
          frequencies. Concretely: among all patients to whom the model assigns roughly 80%
          probability of disease, approximately 80% should actually have the disease.
        </p>
        <p>
          Many models are not calibrated out of the box. Support vector machines and gradient
          boosted trees tend to output probabilities that are too extreme (pushed toward 0 and 1).
          Neural networks can be overconfident. Random forests can be underconfident. A model that
          assigns 80% probability to every prediction it ends up getting right is not 80%
          calibrated — it is just lucky.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Reliability Diagrams">
        <p>
          The standard tool for visualising calibration is a <strong>reliability diagram</strong>{' '}
          (also called a calibration plot). Here is how to construct one:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Bin predictions into buckets by predicted probability — e.g. (0–0.1), (0.1–0.2), ..., (0.9–1.0).</li>
          <li>For each bucket, compute the mean predicted probability and the actual fraction of positives.</li>
          <li>Plot mean predicted probability on the x-axis and actual fraction of positives on the y-axis.</li>
          <li>A perfectly calibrated model lies on the diagonal line y = x.</li>
        </ul>
        <p>
          Points above the diagonal: the model is <em>underconfident</em> (actual rate is higher than
          predicted). Points below the diagonal: the model is <em>overconfident</em> (actual rate is
          lower than predicted).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Fixing Calibration">
        <p>
          Two standard post-hoc calibration methods can be applied after training:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Platt Scaling:</strong> fit a logistic regression on top of the model&apos;s raw output scores using a held-out calibration set. Simple, works well for binary classifiers.</li>
          <li><strong>Isotonic Regression:</strong> a non-parametric monotone function fitted to the raw scores. More flexible than Platt scaling but requires more calibration data.</li>
        </ul>
        <p>
          Always calibrate on data the original model has never seen — otherwise you are just
          overfitting the calibration layer.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Threshold Selection in Practice">
        <p>
          Once probabilities are trustworthy, choosing a threshold becomes a deliberate business
          decision. Two common frameworks:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Cost-sensitive threshold:</strong> assign a cost to each error type (FP cost vs. FN cost). The optimal threshold minimises expected total cost. For the disease classifier, a missed diagnosis (FN) may cost 100x more than a false alarm (FP), pushing the threshold very low.</li>
          <li><strong>F-beta score:</strong> F1 weights precision and recall equally. F2 weights recall twice as heavily; F0.5 weights precision twice as heavily. Pick the beta that reflects your cost ratio, then find the threshold that maximises F-beta on the validation set.</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="F-beta Score">
        F_beta = (1 + beta²) × (Precision × Recall) / (beta² × Precision + Recall)
      </MathFormula>

      <ExplanationBox title="Error Analysis — Learning From Failures">
        <p>
          Aggregate metrics tell you <em>how much</em> the model fails. Error analysis tells you{' '}
          <em>where</em> and <em>why</em>. The process:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Collect the errors:</strong> gather all examples from the validation set that the model got wrong (or that had high loss).</li>
          <li><strong>Tag and categorise:</strong> manually inspect a random sample. Group errors into categories — e.g. &quot;patients with comorbidities,&quot; &quot;patients over 65,&quot; &quot;houses in zip codes with few training examples.&quot;</li>
          <li><strong>Measure category size:</strong> if 60% of all errors fall into one category, fixing the model on that category could nearly halve total error.</li>
          <li><strong>Prioritise:</strong> focus data collection and feature engineering on the highest-impact error categories first.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Comparing Models Fairly">
        <p>
          When comparing two models, several pitfalls can produce misleading conclusions:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Always use the same held-out test set.</strong> Re-evaluating on training data, or on a validation set used to tune hyperparameters, gives optimistic estimates.</li>
          <li><strong>Use the same metric.</strong> Model A optimised for AUC and Model B optimised for F1 are not directly comparable unless you report the same metric for both.</li>
          <li><strong>Account for variance.</strong> If Model A scores 0.74 and Model B scores 0.75 on the same 200-patient test set, the difference may not be statistically significant. Use bootstrap confidence intervals or McNemar&apos;s test for paired comparisons.</li>
          <li><strong>Disaggregate.</strong> A model with higher overall accuracy may perform worse on minority subgroups. Reporting per-subgroup metrics guards against this.</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Calibration Check and Threshold Decision">
        <p>
          Our disease classifier has been binned into four probability buckets. We check calibration
          and then pick a threshold given cost constraints.
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          Bucket 0.0–0.25: 50 patients, 6 actually positive → actual rate = 6/50 = 0.12<br />
          Bucket 0.25–0.50: 60 patients, 18 actually positive → actual rate = 18/60 = 0.30<br />
          Bucket 0.50–0.75: 55 patients, 35 actually positive → actual rate = 35/55 = 0.64<br />
          Bucket 0.75–1.00: 35 patients, 30 actually positive → actual rate = 30/35 = 0.86
        </p>

        <CalcStep number={1}>Bucket 0–0.25: mean predicted ≈ 0.13, actual = 0.12. Very close to diagonal — well calibrated here.</CalcStep>
        <CalcStep number={2}>Bucket 0.25–0.50: mean predicted ≈ 0.38, actual = 0.30. Slight overconfidence — model scores a bit high for this band.</CalcStep>
        <CalcStep number={3}>Bucket 0.50–0.75: mean predicted ≈ 0.62, actual = 0.64. Close — acceptable.</CalcStep>
        <CalcStep number={4}>Bucket 0.75–1.00: mean predicted ≈ 0.87, actual = 0.86. Near-perfect — high-confidence predictions are trustworthy.</CalcStep>
        <CalcStep number={5}>Overall verdict: mild overconfidence in the 0.25–0.50 band. Apply Platt scaling on a held-out calibration set to correct this before deployment.</CalcStep>
        <CalcStep number={6}>Threshold decision: FN cost is 8x FP cost (missing disease is far worse than a false alarm). Using F2 scoring on the validation set, optimal threshold = 0.30 rather than 0.50 — this raises recall to 0.88 at the cost of dropping precision to 0.61.</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          This final module brings the whole course together. You started by seeing why accuracy
          alone lies. You now have the full toolkit: choose the right loss for the task, measure it
          honestly with cross-validation, diagnose overfitting with learning curves, verify that
          probabilities are trustworthy, set the threshold deliberately, and dig into the failures
          systematically. That is what measuring what actually matters looks like in practice.
        </p>
      </WorkedExample>
    </div>
  );
}
