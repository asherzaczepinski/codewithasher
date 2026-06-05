'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Counting Types of Errors">
        <p>
          When a classifier makes a prediction, exactly one of four things happens:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>True Positive (TP):</strong> the model predicted positive and the label is positive — a correct detection.</li>
          <li><strong>True Negative (TN):</strong> the model predicted negative and the label is negative — a correct rejection.</li>
          <li><strong>False Positive (FP):</strong> the model predicted positive but the label is negative — a false alarm.</li>
          <li><strong>False Negative (FN):</strong> the model predicted negative but the label is positive — a missed case.</li>
        </ul>
        <p>
          The <strong>confusion matrix</strong> is a 2x2 table that tallies TP, FP, TN, FN across all
          predictions. Every metric we define below is a formula built from these four numbers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Accuracy">
        <p>
          Accuracy answers: &quot;what fraction of all predictions were correct?&quot; It counts TPs and TNs
          and divides by everything.
        </p>
        <p>
          <strong>When it lies:</strong> on an imbalanced dataset (say 95% negative), a model
          that always predicts negative gets 95% accuracy while having TP = 0. Accuracy hides the
          complete failure to detect the positive class.
        </p>
      </ExplanationBox>

      <MathFormula label="Accuracy">
        Accuracy = (TP + TN) / (TP + TN + FP + FN)
      </MathFormula>

      <ExplanationBox title="Precision — When It Flags Something, Is It Right?">
        <p>
          Precision asks: &quot;of all the examples the model called positive, how many actually were?&quot;
          A high-precision model raises few false alarms. In a spam detector, high precision means
          almost nothing in the spam folder is actually legitimate mail.
        </p>
        <p>
          <strong>Tradeoff:</strong> you can boost precision trivially by predicting positive only when you are
          very sure — but then you will miss many real positives (low recall).
        </p>
      </ExplanationBox>

      <MathFormula label="Precision">
        Precision = TP / (TP + FP)
      </MathFormula>

      <ExplanationBox title="Recall — Does It Find All the Positives?">
        <p>
          Recall (also called <strong>sensitivity</strong> or <strong>True Positive Rate</strong>) asks:
          &quot;of all the actual positives, how many did the model find?&quot; A high-recall model misses
          few real cases. In disease screening, high recall means almost no sick patients are
          sent home undiagnosed.
        </p>
        <p>
          <strong>Tradeoff:</strong> you can guarantee perfect recall by predicting positive for
          everyone — but then precision collapses to the base rate of the disease.
        </p>
      </ExplanationBox>

      <MathFormula label="Recall (Sensitivity)">
        Recall = TP / (TP + FN)
      </MathFormula>

      <ExplanationBox title="F1 Score — The Harmonic Balance">
        <p>
          The <strong>F1 score</strong> is the harmonic mean of precision and recall. The harmonic
          mean rewards balance: a model with precision 0.99 and recall 0.01 gets F1 ≈ 0.02 —
          far lower than its best individual component — because the imbalance is so extreme.
          F1 is the right single number to optimise when both false alarms and missed detections
          are costly.
        </p>
      </ExplanationBox>

      <MathFormula label="F1 Score">
        F1 = 2 × (Precision × Recall) / (Precision + Recall)
      </MathFormula>

      <WorkedExample title="Computing All Metrics from a Confusion Matrix">
        <p>
          Our disease classifier was applied to 200 patients. The confusion matrix is:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          TP = 40 (sick, correctly flagged)<br />
          FP = 10 (healthy, wrongly flagged)<br />
          FN = 20 (sick, missed by the model)<br />
          TN = 130 (healthy, correctly cleared)
        </p>
        <p>Total examples = 40 + 10 + 20 + 130 = 200.</p>

        <CalcStep number={1}>Accuracy = (TP + TN) / total = (40 + 130) / 200 = 170 / 200 = 0.85 (85%)</CalcStep>
        <CalcStep number={2}>Precision = TP / (TP + FP) = 40 / (40 + 10) = 40 / 50 = 0.80 (80%)</CalcStep>
        <CalcStep number={3}>Recall = TP / (TP + FN) = 40 / (40 + 20) = 40 / 60 ≈ 0.667 (66.7%)</CalcStep>
        <CalcStep number={4}>F1 = 2 × (0.80 × 0.667) / (0.80 + 0.667) = 2 × 0.533 / 1.467 ≈ 0.727 (72.7%)</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Accuracy says &quot;85% — pretty good.&quot; But recall of 66.7% reveals the model misses one in
          three sick patients. For a disease test, that is alarming. This is exactly the failure
          accuracy hides. Depending on context, we might lower the decision threshold to recover
          recall at the cost of precision — which is where the next module&apos;s ROC curve comes in.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Accuracy Fails on Imbalance — Concretely">
        <p>
          Suppose we use a dumb model that always predicts &quot;healthy&quot; on our 200 patients
          (40 sick, 160 healthy). Its confusion matrix would be TP = 0, FP = 0, FN = 40, TN = 160.
        </p>
        <p>
          Accuracy = (0 + 160) / 200 = 80%. Sounds respectable. But Recall = 0 / 40 = 0 —
          the model never catches a single sick patient. F1 = 0 because precision is undefined
          (never predicts positive) and recall is 0. Accuracy concealed a completely broken model;
          precision, recall, and F1 exposed it immediately.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The snippet below extracts TP, FP, TN, FN directly from a NumPy confusion matrix,
          then computes every metric by hand so you can see exactly where each formula lives
          in code. It finishes by letting scikit-learn&apos;s <code>classification_report</code>
          produce the same numbers in one call.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="confusion_matrix.py"
        caption="TP/FP/TN/FN computed from NumPy arrays, then all four classification metrics derived by hand and confirmed with sklearn."
        code={`import numpy as np
from sklearn.metrics import confusion_matrix, classification_report

# Hard binary predictions made by our disease classifier (0 = healthy, 1 = sick).
y_pred = np.array([1,1,0,1,0,1,0,0,1,0,
                   1,0,1,0,0,1,0,1,1,0])

# Ground-truth labels from clinicians.
y_true = np.array([1,0,0,1,0,1,0,0,1,0,
                   1,1,1,0,0,0,0,1,1,0])

# --- sklearn confusion matrix ---
# cm[0,0] = TN, cm[0,1] = FP, cm[1,0] = FN, cm[1,1] = TP
# (row = actual class, column = predicted class)
cm = confusion_matrix(y_true, y_pred)

# Unpack the four cells -- giving them names makes every formula below self-documenting.
TN, FP, FN, TP = cm[0,0], cm[0,1], cm[1,0], cm[1,1]
print(f"TP={TP}  FP={FP}  FN={FN}  TN={TN}")

# --- Accuracy ---
# What fraction of ALL predictions (both classes) were correct?
# Fails on imbalanced data -- a model that always says "healthy" can score high.
accuracy = (TP + TN) / (TP + TN + FP + FN)
print(f"Accuracy  = {accuracy:.3f}")

# --- Precision ---
# Of everything the model CALLED positive, how many truly were?
# High precision = few false alarms. Use when false positives are costly.
precision = TP / (TP + FP)
print(f"Precision = {precision:.3f}")

# --- Recall (Sensitivity / True Positive Rate) ---
# Of all ACTUAL positives, how many did the model catch?
# High recall = few missed cases. Use when false negatives are costly (e.g. disease).
recall = TP / (TP + FN)
print(f"Recall    = {recall:.3f}")

# --- F1 Score ---
# Harmonic mean of precision and recall.
# Harmonic mean punishes extreme imbalance: 0.99 precision + 0.01 recall -> F1 ~0.02.
# Use F1 when both false positives AND false negatives matter.
f1 = 2 * (precision * recall) / (precision + recall)
print(f"F1        = {f1:.3f}")

# --- sklearn one-liner for comparison ---
# classification_report prints precision, recall, f1 for each class plus averages.
# "output_dict=False" gives the human-readable string version.
print(classification_report(y_true, y_pred, target_names=["healthy", "sick"]))`}
      />
    </div>
  );
}
