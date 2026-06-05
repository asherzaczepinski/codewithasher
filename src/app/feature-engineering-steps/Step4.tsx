'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

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
