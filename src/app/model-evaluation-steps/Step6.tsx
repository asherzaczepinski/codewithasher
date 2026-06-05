'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Three-Way Split">
        <p>
          Before cross-validation, the standard approach was to split data into three fixed sets:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Training set:</strong> the model learns from this data (weights are updated here).</li>
          <li><strong>Validation set:</strong> used during development to tune hyperparameters and catch overfitting early. The model never trains on it, but you look at it often — so it leaks information over time.</li>
          <li><strong>Test set:</strong> touched exactly once at the end to give an honest final estimate. Never used to make any decisions.</li>
        </ul>
        <p>
          The problem with a single validation split: if your dataset is small, the validation set
          might be unrepresentative by chance. A model that happens to fit the quirks of that
          particular split will look better than it really is — and you would never know.
        </p>
      </ExplanationBox>

      <ExplanationBox title="K-Fold Cross-Validation">
        <p>
          <strong>K-fold CV</strong> solves this by reusing the data. The training data (keeping the
          test set locked away) is divided into <em>k</em> equal-sized chunks called <strong>folds</strong>.
          We train and evaluate <em>k</em> times, using a different fold as the validation set each time.
          We then average the <em>k</em> validation scores to get a single, more reliable estimate.
        </p>
        <p>
          Common choices: <strong>k = 5</strong> or <strong>k = 10</strong>. With k = 5 you train
          5 models, each on 80% of the data, each validated on a fresh 20%. No example is ever
          in the validation fold more than once.
        </p>
      </ExplanationBox>

      <MathFormula label="CV Score (average of k folds)">
        CV Score = (1/k) × (Score_fold1 + Score_fold2 + ... + Score_foldk)
      </MathFormula>

      <ExplanationBox title="Stratified K-Fold">
        <p>
          For classification, especially on imbalanced datasets, plain k-fold can leave one fold
          with almost no positive examples by chance. <strong>Stratified k-fold</strong> fixes this
          by ensuring each fold has roughly the same class distribution as the full dataset.
          Always use stratified k-fold for classification unless you have a specific reason not to.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why CV Gives a More Reliable Estimate">
        <p>
          Each of the k folds acts as an independent experiment. By averaging their results you
          get a score with much lower variance than a single split — you are essentially observing
          the model&apos;s performance across k different slices of reality. The standard deviation
          across fold scores also tells you how <em>stable</em> the model is: a model whose score
          swings wildly across folds may be sensitive to small data changes.
        </p>
        <p>
          CV also lets you use more data for training (only 1/k is held out at each step) compared
          to a fixed 80/20 split where the 20% validation set is permanently unavailable.
        </p>
      </ExplanationBox>

      <WorkedExample title="5-Fold CV on the Disease Classifier">
        <p>
          We run 5-fold stratified CV on our disease classifier measuring F1 score. Each fold
          holds out a different 20% of the 200-patient dataset as validation.
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          Fold 1: train on patients 41–200, validate on 1–40  → F1 = 0.74<br />
          Fold 2: train on 1–40 and 81–200, validate on 41–80  → F1 = 0.71<br />
          Fold 3: train on 1–80 and 121–200, validate on 81–120 → F1 = 0.76<br />
          Fold 4: train on 1–120 and 161–200, validate on 121–160 → F1 = 0.69<br />
          Fold 5: train on 1–160, validate on 161–200 → F1 = 0.73
        </p>

        <CalcStep number={1}>Sum of fold F1 scores: 0.74 + 0.71 + 0.76 + 0.69 + 0.73 = 3.63</CalcStep>
        <CalcStep number={2}>Mean CV F1 = 3.63 / 5 = 0.726</CalcStep>
        <CalcStep number={3}>Standard deviation across folds: sqrt(mean of squared deviations from 0.726) ≈ 0.024 — the model is quite stable</CalcStep>
        <CalcStep number={4}>Report: CV F1 = 0.726 ± 0.024. This is our honest pre-test-set estimate of the model&apos;s real-world performance.</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          If we had used a single validation split and happened to land on the easy fold (F1 = 0.76),
          we might have believed the model was better than it is. The average of all five folds
          gives a much more trustworthy estimate, and the small standard deviation tells us the
          model is not strongly sensitive to which patients end up in which fold.
        </p>
      </WorkedExample>

      <ExplanationBox title="Leave-One-Out and When Not to Use CV">
        <p>
          The extreme case is <strong>Leave-One-Out CV (LOOCV)</strong>: k equals n (every example
          is its own validation set). This is maximally data-efficient but very slow on large datasets
          and can have high variance. It is practical only for very small datasets (fewer than a few hundred examples).
        </p>
        <p>
          When <em>not</em> to use CV: time-series data. If your data has a time ordering, shuffling
          folds leaks the future into the past. Use a rolling or expanding window approach instead.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The snippet shows <code>cross_val_score</code> with both plain <code>KFold</code> and
          <code> StratifiedKFold</code>. Comments explain how to read the per-fold array, why
          stratification matters for classifiers, and how to report the final CV score correctly.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="cross_validation.py"
        caption="5-fold and stratified-5-fold cross-validation with sklearn, averaging fold scores and computing standard deviation to measure stability."
        code={`import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, KFold, StratifiedKFold

# Create a synthetic imbalanced classification dataset.
# weights=[0.8, 0.2] means 80% of examples are class 0, 20% are class 1.
# This is a realistic medical scenario where positive cases are rare.
X, y = make_classification(
    n_samples=200,
    n_features=10,
    weights=[0.8, 0.2],   # 160 healthy, 40 sick
    random_state=42
)

# The model we want to evaluate -- a simple logistic regression.
# cross_val_score will clone and refit it for every fold automatically.
model = LogisticRegression(max_iter=1000)

# --- Plain K-Fold (5 folds) ---
# Shuffles then splits into 5 equal chunks.
# On imbalanced data some folds may contain very few (or zero) positive examples
# purely by chance, making fold scores noisy and unreliable.
kf = KFold(n_splits=5, shuffle=True, random_state=42)

# cross_val_score returns one score per fold -- here we use F1 macro.
# scoring="f1" requires hard predictions; sklearn converts probabilities internally.
scores_kf = cross_val_score(model, X, y, cv=kf, scoring="f1")

print("KFold fold scores :", scores_kf.round(3))
# Mean is the headline CV score; std tells us how stable the model is.
# A large std means the model is sensitive to which examples end up in each fold.
print(f"KFold  mean = {scores_kf.mean():.3f}  std = {scores_kf.std():.3f}")

# --- Stratified K-Fold (5 folds) ---
# Guarantees each fold has the same class ratio as the full dataset (~80/20 here).
# ALWAYS prefer StratifiedKFold for classification on imbalanced data.
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores_skf = cross_val_score(model, X, y, cv=skf, scoring="f1")

print("StratifiedKFold fold scores:", scores_skf.round(3))
print(f"Stratified mean = {scores_skf.mean():.3f}  std = {scores_skf.std():.3f}")

# --- Reporting convention ---
# Always report BOTH mean and standard deviation.
# "CV F1 = 0.726 +/- 0.024" is informative; "CV F1 = 0.726" alone hides instability.
mean_cv = scores_skf.mean()
std_cv  = scores_skf.std()
print(f"Final report: CV F1 = {mean_cv:.3f} +/- {std_cv:.3f}")`}
      />
    </div>
  );
}
