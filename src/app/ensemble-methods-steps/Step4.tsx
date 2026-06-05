'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Core Idea of Boosting">
        <p>
          Where bagging trains models <em>in parallel</em> on random subsets and averages them,
          boosting trains models <em>sequentially</em>. Each new model looks at what the
          previous model got wrong and focuses its effort there.
        </p>
        <p>
          Think of it like a study group. After a practice exam, the group reviews only the
          questions they missed. The next study session is targeted at exactly those weaknesses.
          Repeating this process, the group converges on mastery — not by being brilliant
          individually, but by consistently correcting mistakes.
        </p>
        <p>
          Boosting primarily reduces <strong>bias</strong>. Each round corrects systematic
          errors the ensemble is making. A shallow decision tree (a &quot;stump&quot; with depth 1 or 2)
          has high bias on its own — boosting turns a hundred stumps into a powerful model.
        </p>
      </ExplanationBox>

      <ExplanationBox title="AdaBoost: Reweighting Mistakes">
        <p>
          AdaBoost (Adaptive Boosting, 1997) is the original boosting algorithm. It works by
          maintaining a <strong>weight</strong> on every training example. Initially all weights
          are equal: w&#7522; = 1/N for all i. After each round:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Correctly classified examples have their weights <strong>decreased</strong>.</li>
          <li>Misclassified examples have their weights <strong>increased</strong>.</li>
        </ul>
        <p>
          The next weak learner trains on this reweighted distribution, so it automatically
          focuses on the hard examples. The final prediction is a weighted majority vote of
          all weak learners, where better learners (lower error) get a larger vote.
        </p>
      </ExplanationBox>

      <MathFormula label="AdaBoost: Learner Weight (alpha)">
        alpha&#8346; = 0.5 &times; ln((1 - err&#8346;) / err&#8346;)
      </MathFormula>

      <MathFormula label="AdaBoost: Sample Weight Update for Misclassified Example i">
        w&#7522; &#8592; w&#7522; &times; exp(alpha&#8346;) &nbsp;&nbsp; then renormalise so all weights sum to 1
      </MathFormula>

      <WorkedExample title="AdaBoost Weight Update — Loan Default Example">
        <p>
          We have 6 training examples. Round 1 trains a depth-1 stump and misclassifies
          examples 3 and 5 (both defaults that the stump called repay). Initial weight per
          example = 1/6 &asymp; 0.167.
        </p>
        <CalcStep number={1}>
          Round 1 error: 2 misclassified out of 6. Weighted error = (0.167 + 0.167) = 0.333.
        </CalcStep>
        <CalcStep number={2}>
          alpha&#8321; = 0.5 &times; ln((1 - 0.333) / 0.333) = 0.5 &times; ln(2.00) = 0.5 &times; 0.693 = <strong>0.347</strong>.
        </CalcStep>
        <CalcStep number={3}>
          Correctly classified examples (4 of them): new weight = 0.167 &times; exp(-0.347) = 0.167 &times; 0.707 = 0.118.
        </CalcStep>
        <CalcStep number={4}>
          Misclassified examples (2 of them): new weight = 0.167 &times; exp(+0.347) = 0.167 &times; 1.415 = 0.236.
        </CalcStep>
        <CalcStep number={5}>
          Sum of all new weights = 4 &times; 0.118 + 2 &times; 0.236 = 0.472 + 0.472 = 0.944.
        </CalcStep>
        <CalcStep number={6}>
          Renormalise: divide each weight by 0.944. Correct examples: 0.118/0.944 = <strong>0.125</strong>. Misclassified: 0.236/0.944 = <strong>0.250</strong>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Round 2 now sees examples 3 and 5 with weight 0.250 each — double the weight of
          the correctly classified examples. The next stump is trained on this reweighted
          data and will prioritise getting those two loan applications right.
        </p>
      </WorkedExample>

      <ExplanationBox title="Bagging vs Boosting: Side by Side">
        <p>
          <strong>Bagging</strong> — parallel, independent models; reduces variance; base learners
          should be complex (deep trees); robust to hyperparameter tuning; hard to overfit with more trees.
        </p>
        <p>
          <strong>Boosting</strong> — sequential, dependent models; reduces bias; base learners are
          deliberately simple (shallow stumps or small trees); sensitive to hyperparameters (learning rate,
          depth); can overfit if too many rounds. Regularisation (early stopping, shrinkage) is essential.
        </p>
        <p>
          In practice: start with a Random Forest to get a strong, reliable baseline quickly. Then
          try gradient boosting (XGBoost, LightGBM) for a further accuracy gain when you have time to tune.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The loop below implements the AdaBoost weight-update rule from scratch so you can see every
          step — alpha computation, weight scaling, and renormalisation — before we hand off to sklearn.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="ensembles.py"
        caption="AdaBoost weight-update loop built from scratch, extending the bagging code from Step 2."
        code={`import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.metrics import roc_auc_score

# ── (continuing from Step 2: X_train, y_train, X_test, y_test already defined) ──

# ── 4. AdaBoost from scratch — exposing the weight-update math ───────────────
def adaboost_fit(X_train, y_train, n_rounds=50, seed=0):
    n = len(y_train)
    # All samples start with equal weight — every example is equally important.
    weights = np.ones(n) / n

    # Labels must be {-1, +1} for the sign-based AdaBoost formula.
    labels = np.where(y_train == 1, 1, -1).astype(float)

    alphas = []       # learner weight for each round
    stumps = []       # the trained weak learner for each round

    rng = np.random.default_rng(seed)

    for t in range(n_rounds):
        # Train a depth-1 decision stump on the current sample-weight distribution.
        # Depth-1 = one split = one condition = a "weak" learner by design.
        stump = DecisionTreeClassifier(max_depth=1, random_state=int(rng.integers(0, 10000)))
        stump.fit(X_train, y_train, sample_weight=weights)

        preds = np.where(stump.predict(X_train) == 1, 1, -1).astype(float)

        # Weighted error: fraction of total weight on misclassified examples.
        # Using weighted error (not accuracy) ensures sample weights matter.
        incorrect = (preds != labels).astype(float)
        err = np.dot(weights, incorrect)

        # Clamp error away from 0 and 1 to keep log and division stable.
        err = np.clip(err, 1e-10, 1 - 1e-10)

        # Alpha: how much vote weight this stump earns.
        # Higher alpha for lower error — accurate stumps speak louder.
        alpha = 0.5 * np.log((1 - err) / err)

        # Update sample weights.
        # Misclassified (incorrect=1): multiply by exp(+alpha) → higher weight.
        # Correctly classified (incorrect=0): multiply by exp(-alpha) → lower weight.
        weights = weights * np.exp(alpha * (2 * incorrect - 1))

        # Renormalise so weights sum to 1 — they form a valid probability distribution.
        weights = weights / weights.sum()

        alphas.append(alpha)
        stumps.append(stump)

    return stumps, alphas

def adaboost_predict_proba(stumps, alphas, X_test):
    # Final score = sum of (alpha_t * stump_t_prediction).
    # A large positive score → predict 1; large negative → predict 0.
    score = np.zeros(len(X_test))
    for stump, alpha in zip(stumps, alphas):
        preds = np.where(stump.predict(X_test) == 1, 1, -1).astype(float)
        score += alpha * preds
    # Convert the raw score to a [0,1] probability via the logistic function.
    return 1 / (1 + np.exp(-2 * score))

stumps, alphas = adaboost_fit(X_train, y_train, n_rounds=50)
scratch_proba  = adaboost_predict_proba(stumps, alphas, X_test)
print(f"AdaBoost (scratch) AUC : {roc_auc_score(y_test, scratch_proba):.4f}")

# ── sklearn AdaBoostClassifier — same algorithm, production-grade ────────────
# SAMME.R is the default; it uses soft probabilities instead of hard signs
# and usually converges faster than the classic SAMME (sign-based) variant.
ada = AdaBoostClassifier(
    estimator=DecisionTreeClassifier(max_depth=1),  # depth-1 stump as weak learner
    n_estimators=50,
    learning_rate=1.0,   # shrinkage on each stump's vote; lower = more conservative
    algorithm='SAMME',
    random_state=42
)
ada.fit(X_train, y_train)
print(f"AdaBoost (sklearn) AUC : {roc_auc_score(y_test, ada.predict_proba(X_test)[:, 1]):.4f}")
`}
      />
    </div>
  );
}
