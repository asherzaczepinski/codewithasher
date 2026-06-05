'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="More Features Is Not Always Better">
        <p>
          Adding every column you can find sounds safe — if a feature is useless the model can
          just ignore it, right? In practice, irrelevant features cause real harm:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Noise:</strong> a model trained on random noise alongside real signal will
            partially fit the noise, hurting generalisation.
          </li>
          <li>
            <strong>Curse of dimensionality:</strong> in high-dimensional spaces, data becomes
            sparse and distance-based models (k-NN, SVMs) break down.
          </li>
          <li>
            <strong>Slower training and inference:</strong> every extra column costs compute at
            every training step and at prediction time.
          </li>
          <li>
            <strong>Harder interpretation:</strong> a model with 500 features is much harder to
            explain than one with 20 well-chosen features.
          </li>
        </ul>
        <p>
          Feature selection finds the smallest subset of features that retains the most predictive
          power.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Filter Methods">
        <p>
          Filter methods score each feature independently of the model, then keep the top-scoring
          ones. They are fast and act as a cheap first pass.
        </p>
        <p>
          <strong>Variance threshold:</strong> remove any column whose variance falls below a
          threshold. A column that is almost always the same value (say, 99% zeros) carries almost
          no information.
        </p>
        <p>
          <strong>Correlation filter:</strong> compute the Pearson or Spearman correlation between
          each feature and the target. Features with near-zero correlation are unlikely to help.
          Also remove one from each pair of features whose mutual correlation exceeds a threshold
          (e.g. 0.95) — keeping both is redundant.
        </p>
      </ExplanationBox>

      <MathFormula label="Pearson correlation between feature x and target y">
        r = (sum of (xi - x_mean)(yi - y_mean)) / sqrt(sum of (xi - x_mean)&sup2; &times; sum of (yi - y_mean)&sup2;)
      </MathFormula>

      <ExplanationBox title="Wrapper Methods">
        <p>
          Wrapper methods treat feature selection as a search problem: try different subsets, train
          the actual model on each, and keep the subset that scores best on a validation set.
        </p>
        <p>
          <strong>Recursive Feature Elimination (RFE)</strong> is the most common wrapper approach.
          It starts with all features, fits the model, ranks features by importance (e.g. by
          coefficient magnitude), drops the weakest one, and repeats until the desired number of
          features remains.
        </p>
        <p>
          Wrappers find better subsets than filters because they account for interactions between
          features, but they are expensive — each step requires a full model fit.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Embedded Methods — L1 Regularisation">
        <p>
          <strong>Embedded methods</strong> perform selection during model training rather than
          before or after it. The most important is <strong>L1 regularisation</strong> (also called
          Lasso in regression).
        </p>
        <p>
          L1 adds a penalty equal to the sum of the absolute values of all coefficients. Because
          the L1 penalty has sharp corners at zero, the optimiser is pushed to set irrelevant
          feature coefficients exactly to zero — automatically removing those features from the
          model.
        </p>
        <p>
          For our churn model, fitting a logistic regression with L1 regularisation might
          automatically zero out redundant billing columns while keeping account_age,
          support_calls_per_month, and is_month_to_month — the variables that genuinely separate
          churners from stayers.
        </p>
      </ExplanationBox>

      <MathFormula label="L1-regularised loss (Lasso)">
        Loss = prediction_error + lambda &times; (|w1| + |w2| + ... + |wn|)
      </MathFormula>

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows <strong>SelectKBest</strong> for a fast statistical filter
          and <strong>SelectFromModel</strong> with L1 regularisation for embedded selection —
          the two most practical starting points for a new project.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="selection.py"
        caption="SelectKBest (chi-squared / F-statistic filter) and L1-based SelectFromModel on a small churn dataset."
        code={`import pandas as pd
from sklearn.feature_selection import SelectKBest, f_classif, SelectFromModel
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# ── Toy churn feature matrix ───────────────────────────────────────────────
# Six features: two genuinely predictive, four that are noise or redundant.
X = pd.DataFrame({
    "account_age_months":    [3, 24, 12, 36, 6, 18],  # strong signal
    "support_calls_per_mo":  [5,  0,  8,  0, 3,  1],  # strong signal
    "random_noise_1":        [0.1, 0.9, 0.3, 0.7, 0.5, 0.2],  # pure noise
    "random_noise_2":        [42, 99, 17, 63, 81, 55],          # pure noise
    "monthly_charges":       [85, 45, 120, 30, 70, 60],         # weak signal
    "account_age_squared":   [9, 576, 144, 1296, 36, 324],      # redundant with age
})
y = [1, 0, 1, 0, 1, 0]  # churn labels

# ── Filter method: SelectKBest with f_classif ──────────────────────────────
# f_classif computes the ANOVA F-score between each feature and the target.
# High F-score = the feature means differ significantly across classes.
# k=3 keeps the three features with the highest F-scores.
selector_filter = SelectKBest(score_func=f_classif, k=3)
selector_filter.fit(X, y)

# Get the feature names that survived the filter.
selected_filter = X.columns[selector_filter.get_support()].tolist()
print("SelectKBest kept:", selected_filter)
# Expect account_age_months and support_calls_per_mo to rank highly;
# the noise columns should score near zero.

# F-scores for all features (higher is more predictive):
scores = dict(zip(X.columns, selector_filter.scores_.round(2)))
print("F-scores:", scores)

# ── Embedded method: L1-regularised logistic regression ───────────────────
# L1 (C controls regularisation strength; smaller C = stronger penalty).
# Scale features first — L1 regularisation is sensitive to feature magnitude.
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# LogisticRegression with penalty="l1" and solver="liblinear" pushes
# unimportant feature coefficients to exactly zero.
l1_model = LogisticRegression(penalty="l1", C=0.5, solver="liblinear", random_state=42)

# SelectFromModel fits the model internally, then keeps features whose
# absolute coefficient exceeds the mean absolute coefficient (threshold="mean").
selector_l1 = SelectFromModel(l1_model, threshold="mean")
selector_l1.fit(X_scaled, y)

selected_l1 = X.columns[selector_l1.get_support()].tolist()
print("L1 SelectFromModel kept:", selected_l1)
# Features with zero or near-zero coefficients are automatically dropped.

# Inspect the actual coefficients the L1 model learned:
selector_l1.estimator_.fit(X_scaled, y)
coef_df = pd.Series(
    selector_l1.estimator_.coef_[0].round(3),
    index=X.columns
)
print("L1 coefficients (zero = eliminated):")
print(coef_df.sort_values())
`}
      />

      <ExplanationBox title="Choosing a Method">
        <p>
          A sensible workflow: run a variance and correlation filter first to eliminate the obvious
          junk cheaply. Then use an embedded method (L1 or tree-based feature importances) to get
          a ranked shortlist. Finally, if you have budget, run RFE on the shortlist to fine-tune
          the count. This layered approach avoids the high cost of wrappers on full feature sets
          while getting most of their benefit.
        </p>
      </ExplanationBox>
    </div>
  );
}
