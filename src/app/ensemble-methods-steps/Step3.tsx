'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Extremely Randomized Trees">
        <p>
          Extremely Randomized Trees (Extra Trees, or ET) take Random Forests one step further
          in randomness. Random Forests still search for the <em>best</em> threshold for each
          of the m randomly selected features. Extra Trees go further: they pick the split
          threshold <strong>randomly too</strong>, then choose the best feature-threshold pair
          among the random candidates.
        </p>
        <p>
          This sounds like it should hurt performance, but in practice it often does not — and
          it delivers two concrete benefits:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Speed</strong> — no threshold search means each tree trains much faster,
            especially on large datasets with continuous features.
          </li>
          <li>
            <strong>Lower variance</strong> — more randomness means lower correlation between
            trees, so averaging gives bigger variance reduction.
          </li>
        </ul>
        <p>
          The trade-off is slightly higher bias on any single tree. Whether ET beats RF
          depends on the dataset — in practice, try both and let cross-validation decide.
          On our loan dataset they perform about equally (both ~81% AUC).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Random Forest vs Extra Trees: A Clear Comparison">
        <p><strong>Random Forest split search:</strong></p>
        <ol style={{ lineHeight: '1.9' }}>
          <li>At each node, sample m features at random.</li>
          <li>For each of the m features, find the best threshold (scan all possible split points).</li>
          <li>Use the feature-threshold pair with the best impurity reduction.</li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}><strong>Extra Trees split search:</strong></p>
        <ol style={{ lineHeight: '1.9' }}>
          <li>At each node, sample m features at random.</li>
          <li>For each of the m features, draw one threshold <em>uniformly at random</em> between
          the feature&apos;s min and max values in the current node.</li>
          <li>Use the feature-threshold pair with the best impurity reduction among those random candidates.</li>
        </ol>
      </ExplanationBox>

      <ExplanationBox title="Feature Importance from Tree Ensembles">
        <p>
          One of the most useful by-products of a tree ensemble is a ranking of which features
          matter most. The standard measure is <strong>Mean Decrease in Impurity (MDI)</strong>,
          also called Gini importance:
        </p>
        <p>
          For each feature f, sum up the impurity decrease (weighted by the number of samples
          that reached that node) every time f is used as a split, across all trees. Divide by
          the number of trees. Normalise so all importances sum to 1.
        </p>
      </ExplanationBox>

      <MathFormula label="Feature Importance (MDI) for Feature f">
        Importance(f) = (1/B) &times; sum over trees of sum over nodes where f is used of:
        (n_node / n_total) &times; (impurity_before - impurity_after)
      </MathFormula>

      <WorkedExample title="Reading Feature Importances on the Loan Dataset">
        <p>
          After training a 200-tree Random Forest on our loan default dataset, the top
          feature importances are:
        </p>
        <CalcStep number={1}>debt_to_income_ratio: 0.34 — the single strongest predictor of default.</CalcStep>
        <CalcStep number={2}>credit_score: 0.28 — second most important; low scores mean high risk.</CalcStep>
        <CalcStep number={3}>annual_income: 0.18 — higher income reduces default probability.</CalcStep>
        <CalcStep number={4}>loan_amount: 0.12 — large loans relative to income are riskier.</CalcStep>
        <CalcStep number={5}>employment_length: 0.08 — longer tenure reduces risk, but less decisive.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          These importances sum to 1.00. A loan officer reading this knows: focus underwriting
          attention on DTI and credit score — those two features explain 62% of the model&apos;s
          discriminating power. Employment length matters but is less decisive.
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Caution:</strong> MDI can be biased toward high-cardinality continuous features.
          For a more reliable estimate, use <em>permutation importance</em>: shuffle one feature
          column, rerun predictions, and measure the drop in accuracy. This is model-agnostic and
          avoids the bias.
        </p>
      </WorkedExample>

      <ExplanationBox title="When to Prefer Extra Trees">
        <p>
          Reach for Extra Trees when your dataset is large (&gt;100k rows) and training speed
          matters, or when Random Forest is slightly overfitting and you want to add more
          regularising randomness. In most other cases, Random Forest and Extra Trees perform
          similarly — benchmark both with cross-validation and pick the winner.
        </p>
      </ExplanationBox>
    </div>
  );
}
