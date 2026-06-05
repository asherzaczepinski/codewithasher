'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Stacking: A Meta-Model Over Base Models">
        <p>
          Stacking (stacked generalisation) is a technique for combining multiple <em>diverse</em>
          base models by training a <strong>meta-model</strong> to learn how to best combine
          their predictions. Where bagging and boosting combine identical model types, stacking
          can combine any mix — Random Forest, XGBoost, logistic regression, k-NN — exploiting
          their different strengths and blind spots.
        </p>
        <p>
          The key detail is <strong>how to train the meta-model without leaking</strong>. If you
          train base models on the full training set and then feed their predictions to the meta-model,
          the base models have already seen those examples and their predictions are overfit — the
          meta-model learns a distorted picture. The fix is cross-validated (or &quot;out-of-fold&quot;)
          stacking:
        </p>
        <ol style={{ lineHeight: '1.9' }}>
          <li>Split the training data into K folds (typically K = 5).</li>
          <li>For each fold, train each base model on the other K-1 folds and predict on the held-out fold.</li>
          <li>After all folds, each training row has an out-of-fold prediction from every base model — these are unbiased.</li>
          <li>Stack these predictions as features; train the meta-model on them.</li>
          <li>For test-set inference: retrain each base model on the full training set, generate test predictions, feed to meta-model.</li>
        </ol>
      </ExplanationBox>

      <MathFormula label="Stacking Meta-Model Prediction">
        y&#770;&#8347;&#8348;&#8344;&#8350;&#8349; = meta_model(h&#8321;(x), h&#8322;(x), ..., h&#8342;(x))
      </MathFormula>

      <WorkedExample title="Stacking on the Loan Default Dataset">
        <p>
          We train three diverse base models and stack with a logistic regression meta-model:
        </p>
        <CalcStep number={1}>
          Base model 1 — Random Forest (200 trees): 5-fold OOF AUC = 80.9%.
        </CalcStep>
        <CalcStep number={2}>
          Base model 2 — XGBoost (eta=0.1, 300 trees, max_depth=5): 5-fold OOF AUC = 87.8%.
        </CalcStep>
        <CalcStep number={3}>
          Base model 3 — Logistic Regression (on raw features, as a weak diverse model): OOF AUC = 74.2%.
        </CalcStep>
        <CalcStep number={4}>
          Stack features: for each training row, the meta-model sees three numbers — the three
          base model OOF predicted probabilities (e.g. 0.61, 0.73, 0.55).
        </CalcStep>
        <CalcStep number={5}>
          Logistic regression meta-model trained on these stacked features: learns to weight XGBoost
          heavily (it is most accurate), use RF as a diversity boost, and partially discount logistic regression.
        </CalcStep>
        <CalcStep number={6}>
          Final stacked ensemble test AUC: <strong>88.9%</strong> — a 0.8 point gain over XGBoost alone.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Small gains like this matter in competition settings. In production, weigh the added
          complexity (5x base-model training, a meta-model, extra infrastructure) against the benefit.
        </p>
      </WorkedExample>

      <ExplanationBox title="Blending: The Simpler Alternative to Stacking">
        <p>
          <strong>Blending</strong> is a shortcut: instead of K-fold OOF predictions, hold out a
          single validation set, train base models on the remainder, predict on the holdout, train
          the meta-model on those predictions. Faster but wastes data and is less reliable on
          smaller datasets. Use stacking for rigour, blending when speed matters more.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Class Imbalance in Ensembles">
        <p>
          Our loan default dataset is imbalanced: only 8% of borrowers actually defaulted. A naive
          model that always predicts &quot;repay&quot; gets 92% accuracy — useless for finding defaults.
          Ensembles do not automatically solve imbalance; they need explicit help.
        </p>
        <p>
          <strong>scale_pos_weight (XGBoost/LightGBM).</strong> Set to (number of negatives) /
          (number of positives) — in our case 92/8 = 11.5. This tells the model to treat each
          positive (default) example as if it were 11.5 negative examples, forcing it to take
          defaults seriously.
        </p>
        <p>
          <strong>Class weights in Random Forest.</strong> Pass class_weight=&quot;balanced&quot; — sklearn
          automatically computes per-class weights inversely proportional to class frequency.
        </p>
        <p>
          <strong>Oversampling / undersampling.</strong> SMOTE (Synthetic Minority Over-sampling
          Technique) generates synthetic minority-class examples by interpolating between real ones.
          Random undersampling of the majority class is simpler and often works as well. Apply
          oversampling only to the training fold, never to the validation or test set — otherwise
          your metrics are optimistic.
        </p>
        <p>
          <strong>Metric choice matters.</strong> Use AUC, precision-recall AUC, or F1 on the
          minority class — not plain accuracy. For loan defaults, the business might care more
          about recall (catching as many real defaults as possible) than precision — encode that
          priority in your metric and threshold choice.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          sklearn&apos;s StackingClassifier handles the cross-validated out-of-fold logic for you.
          The snippet below shows the complete stacking setup from the worked example above.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="ensembles.py"
        caption="Stacking with sklearn: three diverse base models and a logistic regression meta-model."
        code={`import numpy as np
import xgboost as xgb
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# ── (X_train, y_train, X_test, y_test from Step 2 still in scope) ────────────

# ── 7. Stacking: three diverse base models + logistic regression meta-model ───

# Base model 1 — Random Forest.
# Diverse because it uses bagging + feature subsampling.  Adds breadth.
rf_base = RandomForestClassifier(
    n_estimators=200,
    max_features='sqrt',
    class_weight='balanced',
    n_jobs=-1,
    random_state=42
)

# Base model 2 — XGBoost.
# The strongest individual model; stacking lets us keep it and add diversity around it.
xgb_base = xgb.XGBClassifier(
    n_estimators=300,
    learning_rate=0.1,
    max_depth=5,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=11.5,  # handle the 92/8 class imbalance
    eval_metric='logloss',
    random_state=42,
    n_jobs=-1,
    verbosity=0
)

# Base model 3 — Logistic Regression on raw features.
# Intentionally the weakest model; its value is diversity, not raw accuracy.
# StandardScaler is needed because LR is sensitive to feature scale (trees are not).
lr_base = Pipeline([
    ('scaler', StandardScaler()),
    ('lr', LogisticRegression(C=0.1, class_weight='balanced', max_iter=1000, random_state=42))
])

# ── Assemble the stacking ensemble ───────────────────────────────────────────
# StackingClassifier internally runs cross-validated (cv=5) out-of-fold prediction
# for each base model, then trains the final_estimator on those OOF predictions.
# This avoids data leakage — base models never predict on examples they trained on.
stack = StackingClassifier(
    estimators=[
        ('rf',  rf_base),    # (name, estimator) tuples — names used for feature columns
        ('xgb', xgb_base),
        ('lr',  lr_base),
    ],
    final_estimator=LogisticRegression(C=1.0, max_iter=500, random_state=42),
    cv=5,                    # 5-fold OOF — matches the worked example
    stack_method='predict_proba',  # use soft probabilities, not hard class labels
    passthrough=False,       # set True to also pass original features to meta-model
    n_jobs=-1
)

stack.fit(X_train, y_train)

# predict_proba on test: each base model is retrained on the full X_train before predicting.
stack_proba = stack.predict_proba(X_test)[:, 1]
print(f"Stacked ensemble AUC : {roc_auc_score(y_test, stack_proba):.4f}")

# ── Inspect meta-model weights to see which base model is trusted most ────────
meta = stack.final_estimator_
base_names = [name for name, _ in stack.estimators]
# The meta-model has one coefficient per base model (and an intercept).
# A larger positive coefficient means the meta-model trusts that base model more.
for name, coef in zip(base_names, meta.coef_[0]):
    print(f"  meta weight [{name:>3s}]: {coef:+.4f}")
`}
      />

      <ExplanationBox title="Practical Tips and Course Wrap-Up">
        <p>
          Here is a decision framework for tabular ML competitions and production projects:
        </p>
        <ol style={{ lineHeight: '1.9' }}>
          <li>Start with a Random Forest — fast, robust, interpretable feature importances.</li>
          <li>Switch to LightGBM or XGBoost for an accuracy step-up; tune with Optuna or a simple grid search.</li>
          <li>Address imbalance early: set class weights or scale_pos_weight before spending time tuning.</li>
          <li>Stack diverse models only after each base model is individually well-tuned — stacking amplifies, not fixes, weak models.</li>
          <li>Always validate with cross-validation or a held-out test set. OOB estimates are good proxies but not a substitute for a true test set.</li>
        </ol>
        <p>
          You now understand the full arc: from the wisdom-of-crowds intuition, through the
          mathematics of bagging and gradient boosting, to the engineering of XGBoost/LightGBM/CatBoost,
          and finally to stacking and imbalanced data. The loan default example went from 72% accuracy
          with a single decision tree to <strong>88.9% AUC</strong> with a stacked ensemble — without
          collecting one extra data point.
        </p>
        <p>
          That is the power of ensembles: not smarter data, not a bigger model, just systematically
          combining many imperfect learners into something reliably excellent.
        </p>
      </ExplanationBox>
    </div>
  );
}
