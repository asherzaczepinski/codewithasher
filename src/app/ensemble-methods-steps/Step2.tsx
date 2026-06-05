'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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

      <ExplanationBox title="In Python">
        <p>
          Below we build bagging from scratch with NumPy, then show how sklearn&apos;s
          RandomForestClassifier gives you the same thing (and much more) in two lines.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="ensembles.py"
        caption="Bootstrap sampling and majority-vote bagging from scratch, then the sklearn shortcut."
        code={`import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

# ── 0. Toy dataset (mirrors the loan-default setup) ──────────────────────────
X, y = make_classification(
    n_samples=1000, n_features=10, n_informative=5,
    weights=[0.92, 0.08],   # 92 % repay, 8 % default — same imbalance as the course
    random_state=42
)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ── 1. Bootstrap sampling ────────────────────────────────────────────────────
def bootstrap_sample(X, y, rng):
    # Draw N indices WITH replacement from [0, N).
    # On average 63 % of rows are drawn at least once; ~37 % are "out-of-bag".
    n = len(y)
    idx = rng.integers(0, n, size=n)   # numpy Generator — avoids legacy np.random
    return X[idx], y[idx]

# ── 2. Manual bagging loop ───────────────────────────────────────────────────
def bagging_predict(X_train, y_train, X_test, n_estimators=50, max_depth=None, seed=0):
    rng = np.random.default_rng(seed)
    # Collect the raw probability output from every tree so we can soft-vote.
    proba_sum = np.zeros(len(X_test))

    for _ in range(n_estimators):
        # Each tree gets its own bootstrap sample — this is the only source of
        # diversity in plain bagging (no feature subsampling yet).
        X_boot, y_boot = bootstrap_sample(X_train, y_train, rng)

        tree = DecisionTreeClassifier(max_depth=max_depth, random_state=0)
        tree.fit(X_boot, y_boot)

        # predict_proba returns [[p_class0, p_class1], ...]; take column 1.
        proba_sum += tree.predict_proba(X_test)[:, 1]

    # Average the probabilities across all trees (soft majority vote).
    return proba_sum / n_estimators

manual_proba = bagging_predict(X_train, y_train, X_test, n_estimators=50)
print(f"Manual bagging AUC : {roc_auc_score(y_test, manual_proba):.4f}")

# ── 3. sklearn RandomForestClassifier ────────────────────────────────────────
# RandomForest = bagging + feature subsampling at each split.
# max_features='sqrt' means each split considers sqrt(n_features) candidates —
# this is what decorrelates the trees and is the key improvement over plain bagging.
rf = RandomForestClassifier(
    n_estimators=200,        # more trees = lower variance (never hurts, just slower)
    max_features='sqrt',     # default for classification; try 'log2' or a float too
    oob_score=True,          # use the 37 % out-of-bag rows as a free validation set
    class_weight='balanced', # upweight the rare default class automatically
    n_jobs=-1,               # use all CPU cores — each tree is independent
    random_state=42
)
rf.fit(X_train, y_train)

rf_proba = rf.predict_proba(X_test)[:, 1]
print(f"RandomForest AUC   : {roc_auc_score(y_test, rf_proba):.4f}")
print(f"OOB AUC estimate   : {rf.oob_score_:.4f}")  # should track test AUC closely
`}
      />
    </div>
  );
}
