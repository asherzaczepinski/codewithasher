'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Why Accuracy Alone Is Not Enough">
        <p>
          A model that predicts loan default with 95% accuracy sounds impressive. But if 95% of
          applicants in the training set were approved and never defaulted, a model that always
          predicts &quot;no default&quot; achieves 95% accuracy without learning anything. Worse, if the
          model has learned to use race or gender as a proxy for creditworthiness — even
          indirectly through correlated features — it may be highly accurate on historical
          data while perpetuating historical discrimination.
        </p>
        <p>
          Fairness-aware machine learning formalizes what it means for a model to treat
          individuals or groups equitably, and provides tools to measure and enforce those
          properties.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Fairness Notions">
        <p>
          There is no single universally agreed definition of fairness — different notions
          reflect different moral frameworks, and they are often mathematically incompatible
          with each other.
        </p>
        <p>
          <strong>Demographic Parity (Statistical Parity):</strong> The model&apos;s positive
          prediction rate should be equal across groups. If 40% of group A is predicted positive,
          then 40% of group B should be too. This ignores whether predictions are accurate —
          a model that randomly approves 40% from each group satisfies demographic parity.
        </p>
        <p>
          <strong>Equalized Odds:</strong> Both the true positive rate and the false positive
          rate should be equal across groups. This means the model is equally accurate for all
          groups, separately for positive and negative ground-truth cases. It is strictly stronger
          than just matching positive prediction rates.
        </p>
        <p>
          <strong>Calibration:</strong> Among all individuals who receive a score of p, fraction
          p should actually belong to the positive class, independently for each group. Widely
          used in risk assessment tools.
        </p>
        <p>
          <strong>Individual Fairness:</strong> Similar individuals should receive similar
          predictions. This requires defining a task-relevant similarity metric between
          individuals — which is itself a difficult and contested design choice.
        </p>
      </ExplanationBox>

      <MathFormula label="Equalized Odds (True Positive Rate parity)">
        P(Y_hat = 1 | Y = 1, A = 0) = P(Y_hat = 1 | Y = 1, A = 1)
      </MathFormula>

      <ExplanationBox title="The Impossibility of Simultaneous Fairness">
        <p>
          A celebrated result in algorithmic fairness (Chouldechova 2017, Kleinberg et al. 2016)
          shows that when base rates differ between groups — that is, the actual proportion of
          positive cases differs — it is mathematically impossible to simultaneously satisfy
          calibration, equal false positive rates, and equal false negative rates (unless the
          classifier is perfect or the base rates are equal).
        </p>
        <p>
          This is not a limitation of any particular algorithm. It is an arithmetic consequence.
          Choosing a fairness criterion is therefore a value judgment, not a purely technical one.
          Different stakeholders may legitimately disagree, and the right choice depends on
          the context, the stakes, and who bears the costs of different error types.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Interpretability: Why We Need to Open the Box">
        <p>
          A deployed model makes consequential decisions. A doctor relies on a diagnostic model.
          A judge uses a recidivism risk score. A bank uses a credit model. In each case, the
          human decision-maker needs to be able to:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Catch cases where the model is wrong in a way that matters</li>
          <li>Understand what features drove a specific decision</li>
          <li>Identify when the model is operating outside its training distribution</li>
          <li>Comply with regulations (e.g., the EU AI Act requires explanations for automated
          decisions affecting individuals)</li>
        </ul>
        <p>
          <strong>Feature importance</strong> methods assign a score to each input feature
          reflecting how much it contributed to the model&apos;s prediction. Global feature
          importance summarizes behavior across the whole dataset; local feature importance
          explains a single prediction.
        </p>
      </ExplanationBox>

      <ExplanationBox title="SHAP and LIME">
        <p>
          <strong>SHAP (SHapley Additive exPlanations)</strong> grounds feature attribution
          in cooperative game theory. The Shapley value of feature i is the average marginal
          contribution of feature i across all possible coalitions of features. SHAP values
          satisfy three desirable axioms: efficiency (attributions sum to the prediction),
          symmetry (features with identical contributions receive equal values), and nullity
          (a feature that never changes the output gets zero attribution).
        </p>
        <p>
          <strong>LIME (Local Interpretable Model-agnostic Explanations)</strong> takes a
          different approach: it fits a simple, interpretable model (usually a sparse linear
          model) locally around the input of interest, using samples generated by perturbing
          the original input. The linear model&apos;s coefficients are the explanation. LIME is
          fast and model-agnostic but less theoretically grounded than SHAP.
        </p>
        <p>
          Both methods are <em>post-hoc</em> — they explain an already-trained model without
          requiring any change to the training procedure.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Mechanistic Interpretability">
        <p>
          Post-hoc feature attribution tells you <em>which inputs matter</em> for a prediction.
          <strong>Mechanistic interpretability</strong> asks a deeper question: <em>what algorithm
          is the network actually implementing in its weights?</em>
        </p>
        <p>
          This research area (pioneered largely at Anthropic and DeepMind) studies the internal
          circuits of neural networks — which neurons activate together, what concepts specific
          attention heads track, whether there are identifiable sub-circuits responsible for
          specific capabilities like indirect object identification or modular arithmetic.
        </p>
        <p>
          The approach is to identify <strong>features</strong> (directions in activation space
          that correspond to human-interpretable concepts) and <strong>circuits</strong> (subgraphs
          of the network that implement a specific computation). Superposition — the phenomenon
          where a single neuron participates in representing multiple features — is a major
          challenge, because it means you cannot simply read off what each neuron &quot;means.&quot;
        </p>
        <p>
          Mechanistic interpretability is young but high-stakes: if we can verify that a model
          is implementing a safe algorithm rather than a superficially similar but dangerous one,
          we gain much stronger guarantees than any post-hoc explanation can provide.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>Two complementary snippets: permutation importance (global, model-agnostic)
        and a from-scratch Shapley value computation (local, for one prediction).
        Both use only NumPy so every line is visible.</p>
      </ExplanationBox>

      <CodeBlock
        filename="interpretability.py"
        caption="Permutation importance and exact Shapley values — two ways to attribute a model&apos;s predictions to input features."
        code={`import numpy as np
from itertools import combinations

# ===================================================================
# PART 1 — Permutation Feature Importance (global, sklearn-style)
# ===================================================================
# Idea: shuffle one feature at a time across the whole validation set.
# If the model relied on that feature, accuracy drops sharply.
# If the feature was irrelevant, accuracy barely changes.
# This is model-agnostic: works with ANY predict() function.

def permutation_importance(model_predict, X_val, y_val, n_repeats=5, rng=None):
    # model_predict : callable, X -> predicted labels (shape (n,))
    # X_val         : validation features, shape (n_samples, n_features)
    # y_val         : true labels, shape (n_samples,)
    # n_repeats     : how many shuffles per feature (average out randomness)
    # Returns       : array of shape (n_features,) — mean accuracy DROP per feature
    if rng is None:
        rng = np.random.default_rng(42)

    # Baseline accuracy on unshuffled data
    baseline_acc = (model_predict(X_val) == y_val).mean()

    n_features = X_val.shape[1]
    importances = np.zeros(n_features)

    for feat_idx in range(n_features):
        drop_per_repeat = []
        for _ in range(n_repeats):
            X_shuffled = X_val.copy()
            # Shuffle only column feat_idx — all other features stay intact.
            # Shuffling breaks the association between this feature and the label.
            rng.shuffle(X_shuffled[:, feat_idx])
            shuffled_acc = (model_predict(X_shuffled) == y_val).mean()
            drop_per_repeat.append(baseline_acc - shuffled_acc)
        # A large drop means the model needed this feature.
        # A near-zero or negative drop means the feature added little.
        importances[feat_idx] = np.mean(drop_per_repeat)

    return importances


# ===================================================================
# PART 2 — Exact Shapley Values (local, for one prediction)
# ===================================================================
# The Shapley value for feature i is its average MARGINAL CONTRIBUTION
# across all possible orderings of features (equivalently: all subsets).
# It satisfies: efficiency, symmetry, nullity, linearity — no other
# attribution method satisfies all four simultaneously (Shapley 1953).

def shapley_values(f, x, baseline=None):
    # f        : callable, feature_subset_vector -> scalar prediction
    #            (features NOT in the coalition are set to baseline values)
    # x        : single input row, shape (n_features,)
    # baseline : reference point (e.g. training-set mean); shape (n_features,)
    #            Represents the absent-feature state.
    # Returns  : Shapley values, shape (n_features,) — sums to f(x) - f(baseline).
    n = len(x)
    if baseline is None:
        baseline = np.zeros(n)  # default: treat 0 as the absent-feature value

    phi = np.zeros(n)  # one Shapley value per feature

    for i in range(n):
        other_features = [j for j in range(n) if j != i]

        # Iterate over all subsets of features that do NOT include i.
        for size in range(len(other_features) + 1):
            for subset in combinations(other_features, size):
                # Weight for this subset: |S|!(n-|S|-1)!/n!
                # Larger subsets get lower weight because there are more of them.
                s = len(subset)
                weight = (
                    np.math.factorial(s)
                    * np.math.factorial(n - s - 1)
                    / np.math.factorial(n)
                )

                # Build two vectors: one with i included, one without.
                # Features outside the coalition are replaced by baseline.
                v_with = baseline.copy()
                v_without = baseline.copy()
                for j in subset:
                    v_with[j] = x[j]
                    v_without[j] = x[j]
                v_with[i] = x[i]  # i is present in v_with only

                # Marginal contribution of feature i given this coalition.
                phi[i] += weight * (f(v_with) - f(v_without))

    return phi


# --- Tiny demo: a linear model with 3 features ----------------------
# f(x) = 2*x0 + 0.5*x1 - 1.0*x2 + 0.3  (intercept)
def linear_model(v):
    return 2.0 * v[0] + 0.5 * v[1] - 1.0 * v[2] + 0.3

x_instance = np.array([1.0, 2.0, 0.5])
baseline   = np.array([0.0, 0.0, 0.0])  # prediction at baseline = 0.3

phi = shapley_values(linear_model, x_instance, baseline)
print("Shapley values:", phi)
# phi[0] ~ 2.0, phi[1] ~ 1.0, phi[2] ~ -0.5
# They sum to f(x) - f(baseline) = 4.05 - 0.3 = 3.75 (efficiency check).
print("Sum of Shapley values:", phi.sum())
print("f(x) - f(baseline):", linear_model(x_instance) - linear_model(baseline))`}
      />

      <WorkedExample title="Computing a SHAP Value by Hand">
        <p>
          A model f takes two binary features: A (income high) and B (has collateral). Possible
          prediction values: f() = 0.1, f(A) = 0.5, f(B) = 0.3, f(A,B) = 0.8.
          We compute the Shapley value for feature A.
        </p>
        <CalcStep number={1}>
          Coalition without A, adding A: marginal contribution = f(A) - f() = 0.5 - 0.1 = 0.4.
          This coalition (empty set) has weight 1/2 (for 2 features, there are two orderings where
          this coalition comes first).
        </CalcStep>
        <CalcStep number={2}>
          Coalition with B already, adding A: marginal contribution = f(A,B) - f(B) = 0.8 - 0.3 = 0.5.
          This coalition has weight 1/2.
        </CalcStep>
        <CalcStep number={3}>
          Shapley value for A = (1/2)(0.4) + (1/2)(0.5) = 0.20 + 0.25 = 0.45
        </CalcStep>
        <CalcStep number={4}>
          Similarly, Shapley value for B = (1/2)(0.2) + (1/2)(0.3) = 0.25. Check: 0.45 + 0.25 = 0.70 = f(A,B) - f() = 0.8 - 0.1. Efficiency satisfied.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Feature A (income) gets attribution 0.45 and feature B (collateral) gets 0.25.
          They sum to 0.70, exactly the prediction&apos;s deviation from the baseline — no
          attribution is hidden or double-counted. This additive property is what makes
          SHAP values so practically useful.
        </p>
      </WorkedExample>
    </div>
  );
}
