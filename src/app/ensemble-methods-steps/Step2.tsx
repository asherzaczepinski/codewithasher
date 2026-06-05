'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Bootstrap Sampling">
        <p>
          Bagging starts with a simple trick: <strong>bootstrap sampling</strong>. Given a training
          set of N rows, draw N rows <em>with replacement</em>. Some rows appear twice or more; others
          do not appear at all (roughly 37% of rows are left out of each bootstrap sample — these
          become the <strong>out-of-bag</strong> rows, which we will use for free validation later).
        </p>
        <p>
          Repeat this B times to get B different training sets. Train one decision tree on each. Each
          tree sees a slightly different slice of reality, so each makes different errors. When you
          average their predictions, the errors cancel out and the signal remains.
        </p>
      </ExplanationBox>

      <MathFormula label="Bagging Prediction (Regression)">
        y&#770; = (1/B) &times; (tree&#8321;(x) + tree&#8322;(x) + ... + tree&#8338;(x))
      </MathFormula>

      <MathFormula label="Bagging Prediction (Classification — Majority Vote)">
        y&#770; = argmax over class c of: count of trees predicting c
      </MathFormula>

      <ExplanationBox title="Random Forests: Bagging Plus Feature Randomness">
        <p>
          A plain bagged forest still has a problem: if one feature (say, <em>credit score</em>) is
          very predictive, every tree will use it near the root. All B trees become highly correlated
          with each other, and averaging correlated predictions gives less variance reduction than
          averaging independent ones.
        </p>
        <p>
          Random Forests fix this by adding <strong>feature subsampling</strong>: at each split,
          instead of considering all F features, randomly select m features and only split on the best
          of those m. A common default is m = sqrt(F) for classification and m = F/3 for regression.
          This forces each tree to rely on different features, reducing correlation.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>More trees</strong> always helps (or at worst does nothing) — variance only drops.</li>
          <li>Typical B: 100 to 500 trees. Beyond 500 the marginal gain is negligible.</li>
          <li>Trees are grown fully (no pruning) because the averaging step handles overfitting.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Out-of-Bag Estimation">
        <p>
          Because each tree is trained on a bootstrap sample, about 37% of the original rows are
          never seen by that tree. These <strong>out-of-bag (OOB)</strong> rows act as a built-in
          validation set for each tree. To get an OOB prediction for row i, average only the trees
          that did <em>not</em> train on row i. The resulting OOB score closely tracks held-out
          test performance, giving you a free cross-validation estimate without a separate validation split.
        </p>
      </ExplanationBox>

      <WorkedExample title="Majority-Vote Worked Example">
        <p>
          Five trees vote on whether a loan application defaults. Each tree has independently
          learned different patterns from its bootstrap sample:
        </p>
        <CalcStep number={1}>Tree 1 (trained on bootstrap A): predicts <strong>Default</strong></CalcStep>
        <CalcStep number={2}>Tree 2 (trained on bootstrap B): predicts <strong>Repay</strong></CalcStep>
        <CalcStep number={3}>Tree 3 (trained on bootstrap C): predicts <strong>Default</strong></CalcStep>
        <CalcStep number={4}>Tree 4 (trained on bootstrap D): predicts <strong>Default</strong></CalcStep>
        <CalcStep number={5}>Tree 5 (trained on bootstrap E): predicts <strong>Repay</strong></CalcStep>
        <CalcStep number={6}>Vote tally: Default = 3, Repay = 2. Majority wins: <strong>Predict Default.</strong></CalcStep>
        <p style={{ marginTop: '1rem' }}>
          For a probability, use the fraction: 3/5 = <strong>0.60 default probability</strong>.
          This soft probability is more useful than a hard vote because you can tune a decision
          threshold (e.g., flag as high-risk if p &gt; 0.40 to catch more defaults at the cost of
          more false alarms).
        </p>
      </WorkedExample>

      <ExplanationBox title="Loan Default Results">
        <p>
          On our loan dataset, a single decision tree (max depth = unlimited) scores 72% accuracy
          on the test set and shows signs of overfitting — training accuracy is 99%. A Random Forest
          of 200 trees with m = sqrt(5) = 2 features per split achieves <strong>81% AUC</strong>,
          and the OOB estimate (80.8% AUC) matches the test score closely — confirming the OOB
          estimate is trustworthy.
        </p>
      </ExplanationBox>
    </div>
  );
}
