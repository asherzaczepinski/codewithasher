'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Gradient Boosting: The Key Insight">
        <p>
          AdaBoost reweights examples. Gradient Boosting (Friedman, 2001) takes a more general
          and elegant view: <strong>fit each new tree directly to the residuals</strong> — the
          errors — of the current ensemble. If your ensemble predicts a default probability of
          0.55 for a borrower who actually defaulted (true label = 1), the residual is
          1 - 0.55 = 0.45. The next tree&apos;s job is to predict that 0.45 gap.
        </p>
        <p>
          More precisely, gradient boosting fits each tree to the <strong>negative gradient</strong>
          of the loss function with respect to the current prediction. For mean squared error loss,
          the negative gradient is exactly the residual. For log-loss (used in classification),
          it is a slightly different quantity — but the intuition remains: each tree corrects
          what the current ensemble gets wrong.
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient Boosting Model After M Trees">
        F&#8337;(x) = F&#8320;(x) + eta &times; h&#8321;(x) + eta &times; h&#8322;(x) + ... + eta &times; h&#8337;(x)
      </MathFormula>

      <ExplanationBox title="The Learning Rate (Shrinkage)">
        <p>
          Each tree&apos;s contribution is multiplied by a small constant eta (the <strong>learning
          rate</strong>), typically between 0.01 and 0.3. Smaller eta means each tree contributes
          less, so you need more trees — but the model generalises better because no single tree
          dominates.
        </p>
        <p>
          The golden rule: <strong>lower learning rate + more trees = better generalisation</strong>,
          at the cost of more training time. Use <em>early stopping</em> on a validation set to
          find the right number of trees automatically.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>eta = 0.1, trees = 100 is a common starting point.</li>
          <li>eta = 0.01, trees = 1000 often gives a slight accuracy edge with more compute.</li>
          <li>eta = 1.0, trees = 10 risks high variance — each tree takes too big a step.</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Negative Gradient (Pseudo-Residual) for Squared Error Loss">
        r&#7522;&#8337; = y&#7522; - F&#8337;&#8208;&#8321;(x&#7522;) &nbsp;&nbsp; (the residual: true label minus current prediction)
      </MathFormula>

      <WorkedExample title="One Round of Gradient Boosting — Loan Default">
        <p>
          We use a regression framing for simplicity (predicting default probability 0 or 1
          with squared-error loss). After 3 trees, here are the current ensemble predictions
          for 5 training examples. True labels are 0 (repay) or 1 (default).
        </p>
        <CalcStep number={1}>
          Example A: true = 0, predicted = 0.10, residual = 0 - 0.10 = <strong>-0.10</strong>
        </CalcStep>
        <CalcStep number={2}>
          Example B: true = 1, predicted = 0.55, residual = 1 - 0.55 = <strong>+0.45</strong>
        </CalcStep>
        <CalcStep number={3}>
          Example C: true = 0, predicted = 0.30, residual = 0 - 0.30 = <strong>-0.30</strong>
        </CalcStep>
        <CalcStep number={4}>
          Example D: true = 1, predicted = 0.72, residual = 1 - 0.72 = <strong>+0.28</strong>
        </CalcStep>
        <CalcStep number={5}>
          Example E: true = 0, predicted = 0.08, residual = 0 - 0.08 = <strong>-0.08</strong>
        </CalcStep>
        <CalcStep number={6}>
          Tree 4 is trained to predict these residuals: (-0.10, +0.45, -0.30, +0.28, -0.08).
          After fitting, tree 4 predicts: (-0.09, +0.42, -0.28, +0.27, -0.09).
        </CalcStep>
        <CalcStep number={7}>
          With eta = 0.1, the ensemble update for each example is: old prediction + 0.1 &times; tree-4 prediction.
        </CalcStep>
        <CalcStep number={8}>
          Example B update: 0.55 + 0.1 &times; 0.42 = 0.55 + 0.042 = <strong>0.592</strong>. Closer to 1. Repeat next round.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Each round the predictions creep toward the true labels. With 100 such rounds, the
          ensemble reaches 88% AUC on our loan test set — substantially better than Random
          Forest&apos;s 81%.
        </p>
      </WorkedExample>

      <ExplanationBox title="Subsample and Column Subsample">
        <p>
          Modern gradient boosting frameworks also add two more forms of randomness to control
          variance: <strong>row subsampling</strong> (train each tree on a random fraction of
          rows, e.g. 80%) and <strong>column subsampling</strong> (use a random subset of
          features per tree or per split, like Random Forest does). Both act as regularisation,
          reducing the risk of overfitting and speeding up training.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The loop below builds gradient boosting from first principles: each round we compute
          residuals from the current ensemble and fit the next tree to them — exactly the
          worked example above, now in code.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="ensembles.py"
        caption="Gradient boosting residual-fitting loop from scratch, then sklearn GradientBoostingClassifier."
        code={`import numpy as np
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score

# ── (X_train, y_train, X_test, y_test still in scope from Step 2) ────────────

# ── 5. Gradient Boosting from scratch (regression framing, MSE loss) ─────────
#    We predict a probability in [0,1]; the negative gradient of MSE is just
#    the residual: r = y_true - y_pred.  Simple and clean to code up.

def gb_fit(X_train, y_train, n_estimators=100, learning_rate=0.1, max_depth=3):
    # Start the ensemble at the mean of the target — the best constant prediction
    # under MSE loss minimises the sum of squared residuals.
    F = np.full(len(y_train), y_train.mean(), dtype=float)

    trees = []   # store every fitted tree so we can predict on test data later

    for m in range(n_estimators):
        # Compute negative gradient = residual (true label minus current prediction).
        # For MSE loss: -dL/dF = y - F.  This is what the next tree must learn.
        residuals = y_train - F

        # Fit a small regression tree to the residuals, not the original labels.
        # max_depth controls how complex each correction step is; 3 is a good default.
        tree = DecisionTreeRegressor(max_depth=max_depth, random_state=m)
        tree.fit(X_train, residuals)

        # Update the ensemble: add a *shrunk* version of this tree's prediction.
        # The learning rate (eta) acts as a step size.  Smaller = safer, slower.
        F += learning_rate * tree.predict(X_train)

        trees.append(tree)

    return trees, y_train.mean()   # also return the initial constant

def gb_predict(trees, init_val, X_test, learning_rate=0.1):
    F = np.full(len(X_test), init_val, dtype=float)
    for tree in trees:
        F += learning_rate * tree.predict(X_test)
    # Clip to [0,1] so we can treat the output as a probability.
    # A proper implementation would use logistic loss; this MSE version is illustrative.
    return np.clip(F, 0, 1)

trees, init_val = gb_fit(X_train, y_train.astype(float), n_estimators=100, learning_rate=0.1)
gb_proba = gb_predict(trees, init_val, X_test, learning_rate=0.1)
print(f"GB scratch AUC : {roc_auc_score(y_test, gb_proba):.4f}")

# ── sklearn GradientBoostingClassifier — uses log-loss, proper probabilities ──
# This is the reference implementation; for large datasets prefer XGBoost/LightGBM.
gb_sklearn = GradientBoostingClassifier(
    n_estimators=300,        # more trees compensate for a lower learning rate
    learning_rate=0.05,      # smaller step → needs more trees but generalises better
    max_depth=4,             # depth-4 trees capture interactions up to 4 features deep
    subsample=0.8,           # train each tree on a random 80 % of rows → stochastic GB
    max_features='sqrt',     # column subsampling per split, like a Random Forest
    random_state=42
)
gb_sklearn.fit(X_train, y_train)
print(f"GB sklearn AUC : {roc_auc_score(y_test, gb_sklearn.predict_proba(X_test)[:, 1]):.4f}")
`}
      />
    </div>
  );
}
