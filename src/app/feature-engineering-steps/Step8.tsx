'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="The Imbalance Problem">
        <p>
          In our churn dataset, suppose only 8% of customers actually churn. A model that
          predicts &quot;no churn&quot; for every single customer will be 92% accurate — and
          completely useless. Class imbalance causes models to ignore the minority class because
          the loss function rewards them for doing so.
        </p>
        <p>
          Handling imbalance is a form of data engineering: you change what the model sees during
          training so that both classes receive enough learning signal.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Resampling — Undersampling and Oversampling">
        <p>
          The bluntest tools are pure resampling strategies applied to the training set.
        </p>
        <p>
          <strong>Random undersampling</strong> discards majority-class rows at random until the
          classes are balanced (or at a chosen ratio). It is fast and removes no information the
          model needs, but it throws away real training data — if you have 10,000 non-churners
          and 800 churners, you may end up training on only 800 non-churners, discarding 90% of
          your data.
        </p>
        <p>
          <strong>Random oversampling</strong> duplicates minority-class rows at random. No
          information is lost but you do risk the model memorising repeated minority examples
          rather than generalising from them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="SMOTE — Synthetic Minority Oversampling">
        <p>
          <strong>SMOTE</strong> (Synthetic Minority Oversampling Technique) is smarter than
          simple duplication. For each minority-class row it:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Finds its k nearest minority-class neighbours (typically k = 5).</li>
          <li>Picks one neighbour at random.</li>
          <li>Creates a new synthetic row somewhere along the line segment between the original
            row and that neighbour.</li>
        </ul>
        <p>
          The result is new minority examples that are plausible interpolations of real ones,
          not duplicates. This forces the model to generalise across the minority region of
          feature space rather than memorising specific rows.
        </p>
      </ExplanationBox>

      <MathFormula label="SMOTE synthetic point formula">
        x_new = x_i + rand(0, 1) &times; (x_neighbour &minus; x_i)
      </MathFormula>

      <WorkedExample title="Class Weights — No Resampling Needed">
        <p>
          Many frameworks (scikit-learn, PyTorch) support <strong>class weights</strong>: instead
          of changing the dataset, you tell the loss function to penalise mistakes on the minority
          class more heavily. The weight for each class is inversely proportional to its frequency.
        </p>
        <CalcStep number={1}>
          Training set: 9200 non-churners, 800 churners. Total = 10000.
        </CalcStep>
        <CalcStep number={2}>
          Weight for non-churner class = 10000 / (2 &times; 9200) &asymp; 0.54
        </CalcStep>
        <CalcStep number={3}>
          Weight for churner class = 10000 / (2 &times; 800) = 6.25
        </CalcStep>
        <CalcStep number={4}>
          Each churner misclassification now costs the model ~11.6&times; more than each
          non-churner misclassification (6.25 / 0.54), so the model is forced to take the
          minority class seriously.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Class weights are often the easiest first fix — zero extra data manipulation, and
          fully supported in most libraries with a single parameter (class_weight=&apos;balanced&apos;).
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows how to apply <strong>class_weight=&apos;balanced&apos;</strong>
          in scikit-learn — the easiest first fix for imbalance — followed by a commented
          SMOTE example using the <strong>imbalanced-learn</strong> library for when you need
          synthetic oversampling.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="imbalance.py"
        caption="class_weight='balanced' for cost-sensitive learning, plus a commented SMOTE pipeline for synthetic oversampling."
        code={`import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# ── Simulate an imbalanced churn dataset ──────────────────────────────────
# 9200 non-churners (class 0) and 800 churners (class 1): 8% minority rate.
# np.random.seed ensures reproducibility across runs.
rng = np.random.default_rng(seed=42)

n_majority = 9200
n_minority = 800

X_majority = rng.normal(loc=0.0, scale=1.0, size=(n_majority, 4))
X_minority = rng.normal(loc=1.5, scale=1.0, size=(n_minority, 4))  # shifted mean

X = np.vstack([X_majority, X_minority])
y = np.array([0] * n_majority + [1] * n_minority)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)
# stratify=y preserves the 8%/92% ratio in both the train and test splits.

# ── Approach 1: class_weight="balanced" ───────────────────────────────────
# sklearn computes weights automatically as:
#   weight[c] = n_samples / (n_classes * count[c])
# This means the minority class (churners) incurs a much larger loss penalty,
# so the optimiser is forced to classify them correctly.
# No data is added or removed — only the gradient contributions change.
clf_weighted = LogisticRegression(
    class_weight="balanced",   # <-- the only change needed vs a standard fit
    max_iter=1000,
    random_state=42,
)
clf_weighted.fit(X_train, y_train)
y_pred_weighted = clf_weighted.predict(X_test)

print("=== class_weight='balanced' ===")
# classification_report shows precision, recall, and F1 per class.
# With imbalanced data, always look at recall for the minority class (class 1).
print(classification_report(y_test, y_pred_weighted, target_names=["no_churn", "churn"]))

# ── Approach 2: SMOTE (install: pip install imbalanced-learn) ─────────────
# SMOTE creates synthetic minority-class rows by interpolating between real
# neighbours, so the model sees a more populated minority region of feature
# space rather than the same repeated examples.
#
# Uncomment the block below once imbalanced-learn is installed.
#
# from imblearn.over_sampling import SMOTE
# from imblearn.pipeline import Pipeline as ImbPipeline
#
# smote = SMOTE(
#     sampling_strategy=0.5,   # upsample minority to 50% of majority count
#     k_neighbors=5,            # each synthetic point is between a real point
#                               # and one of its 5 nearest minority neighbours
#     random_state=42,
# )
#
# X_resampled, y_resampled = smote.fit_resample(X_train, y_train)
# print("After SMOTE - class counts:", pd.Series(y_resampled).value_counts().to_dict())
#
# clf_smote = LogisticRegression(max_iter=1000, random_state=42)
# clf_smote.fit(X_resampled, y_resampled)
# y_pred_smote = clf_smote.predict(X_test)
# print("=== SMOTE ===")
# print(classification_report(y_test, y_pred_smote, target_names=["no_churn", "churn"]))
#
# IMPORTANT: fit_resample only on X_train, NEVER on X_test.
# Resampling test data would give you falsely optimistic evaluation metrics.
`}
      />

      <ExplanationBox title="Data Augmentation">
        <p>
          <strong>Data augmentation</strong> creates modified copies of existing training examples
          to artificially expand the training set. It is most powerful in domains where the
          label is preserved under natural transformations.
        </p>
        <p>
          <strong>Images:</strong> flip horizontally, rotate a few degrees, adjust brightness or
          contrast, crop randomly. A photo of a cat is still a cat after a 15-degree rotation.
          These transforms are cheap and dramatically reduce overfitting on small image datasets.
        </p>
        <p>
          <strong>Text:</strong> swap synonyms (&quot;great&quot; &rarr; &quot;excellent&quot;),
          back-translate through a second language and back to English, or randomly delete or
          shuffle a small fraction of words. A review saying &quot;excellent battery life&quot;
          likely preserves its positive sentiment when one word is substituted with a synonym.
        </p>
        <p>
          For our product-review sentiment task, synonym replacement is a lightweight augmentation:
          replace 10% of words with a randomly drawn synonym from a small thesaurus. This smooths
          out lexical gaps in the training set without changing the sentiment label.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Putting It All Together">
        <p>
          You now have a complete feature engineering toolkit:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Create</strong> interaction terms, polynomial features, and domain-driven
            columns to surface relationships the model cannot easily discover on its own.</li>
          <li><strong>Encode</strong> categories correctly — one-hot for low-cardinality nominals,
            ordinal for ranked categories, target encoding or embeddings for high-cardinality
            columns.</li>
          <li><strong>Select</strong> features using a filter &rarr; embedded &rarr; wrapper
            pipeline to remove noise and redundancy.</li>
          <li><strong>Extract</strong> compact representations with PCA or learned embeddings
            when dimensionality is high.</li>
          <li><strong>Vectorise text</strong> with TF-IDF or n-grams before passing to a
            classifier.</li>
          <li><strong>Engineer time</strong> carefully — lags, rolling windows, cyclical encoding
            — and always split by time before computing any time-dependent features.</li>
          <li><strong>Fix imbalance</strong> with class weights as a first pass, SMOTE when you
            have enough data, and augmentation when transformations preserve the label.</li>
        </ul>
        <p>
          The single most important lesson: features that encode real understanding of your domain
          beat features generated blindly by automated pipelines. The best feature engineers are
          curious about their data, not just proficient with their tools.
        </p>
      </ExplanationBox>
    </div>
  );
}
