'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="From Probability to a Decision">
        <p>
          The sigmoid gives us a probability. But to actually classify an email we need a
          concrete answer: spam or not spam. We pick a <strong>threshold</strong> — typically
          0.5 — and make the call:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>If σ(z) ≥ 0.5 → predict <strong>spam (class 1)</strong></li>
          <li>If σ(z) &lt; 0.5 → predict <strong>not spam (class 0)</strong></li>
        </ul>
        <p>
          Since σ(z) ≥ 0.5 exactly when z ≥ 0, the threshold is equivalent to asking:
          is the raw linear score positive or negative? This brings us to the idea of a
          decision boundary.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Decision Boundary">
        <p>
          The <strong>decision boundary</strong> is the set of points in input space where
          the model is exactly 50/50 — where z = 0. Everywhere on one side of this line the
          model says &quot;spam&quot;; everywhere on the other side it says &quot;not spam.&quot;
        </p>
        <p>
          With two features, the raw score z is:
        </p>
      </ExplanationBox>

      <MathFormula label="Linear score z">
        z = w₁x₁ + w₂x₂ + b
      </MathFormula>

      <ExplanationBox title="What the Boundary Looks Like">
        <p>
          Setting z = 0 gives: w₁x₁ + w₂x₂ + b = 0. Rearranging for x₂:
        </p>
      </ExplanationBox>

      <MathFormula label="Decision boundary line">
        x₂ = −(w₁/w₂)x₁ − (b/w₂)
      </MathFormula>

      <ExplanationBox title="How Weights Tilt the Boundary">
        <p>
          This is a straight line in the (x₁, x₂) feature space. The weights control its slope
          and the bias shifts it up or down:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Increasing w₁ relative to w₂ rotates the boundary so it becomes more sensitive to
            suspicious word count (x₁).</li>
          <li>A more negative bias b shifts the line upward, making the spam region smaller
            (the model requires more evidence before calling something spam).</li>
          <li>A more positive bias shifts it downward, widening the spam region — the model
            becomes trigger-happy.</li>
        </ul>
        <p>
          Training finds the weights and bias that place this boundary optimally between the
          two classes in the training data.
        </p>
      </ExplanationBox>

      <WorkedExample title="Classifying a New Email">
        <p>
          A new email arrives with x₁ = 5 suspicious words and x₂ = 3 exclamation marks.
          Our current weights: w₁ = 0.4, w₂ = 0.3, b = −1.0.
        </p>
        <CalcStep number={1}>
          Compute z: z = 0.4(5) + 0.3(3) + (−1.0) = 2.0 + 0.9 − 1.0 = <strong>1.9</strong>
        </CalcStep>
        <CalcStep number={2}>
          Apply sigmoid: σ(1.9) = 1 / (1 + e^(−1.9)) = 1 / (1 + 0.1496) ≈ <strong>0.870</strong>
        </CalcStep>
        <CalcStep number={3}>
          Compare to threshold: 0.870 ≥ 0.5, so z &gt; 0 → predict <strong>SPAM</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The model is 87% confident this is spam and flags it accordingly. The decision boundary
          for these weights and bias sits at x₂ = −(0.4/0.3)x₁ + (1.0/0.3) ≈ −1.33x₁ + 3.33.
          Our email&apos;s point (5, 3) lies above this boundary in the spam region.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We extend logistic_regression.py with two new functions: one that computes the raw score
          and applies sigmoid, and one that turns the probability into a hard 0/1 prediction.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="logistic_regression.py"
        caption="predict_proba and predict are the two-step pipeline: score → probability → decision."
        code={`import numpy as np

# --- sigmoid is defined in Step 3; we repeat it here so the file is self-contained ---
def sigmoid(z):
    # Maps any real-valued score to a probability in (0, 1)
    return 1 / (1 + np.exp(-z))

# predict_proba computes the probability that a single sample belongs to class 1 (spam).
# x : 1-D numpy array of feature values, e.g. [5, 3] for (words, exclamations)
# w : 1-D numpy array of weights, one per feature
# b : scalar bias term
def predict_proba(x, w, b):
    # Step 1 — linear combination: raw score z = w1*x1 + w2*x2 + ... + b
    # np.dot handles any number of features; no need to hard-code each weight.
    z = np.dot(w, x) + b
    # Step 2 — squash z into a probability with the sigmoid
    return sigmoid(z)

# predict converts the continuous probability into a hard binary decision.
# Threshold = 0.5 is the standard choice and corresponds to z = 0 (the decision boundary).
def predict(x, w, b, threshold=0.5):
    prob = predict_proba(x, w, b)
    # 1 means spam, 0 means not spam
    return 1 if prob >= threshold else 0

# --- Classify the worked-example email: x1=5 suspicious words, x2=3 exclamation marks ---
w = np.array([0.4, 0.3])   # current weight vector
b = -1.0                    # current bias

x_new = np.array([5, 3])
prob  = predict_proba(x_new, w, b)   # -> ~0.870
label = predict(x_new, w, b)         # -> 1  (SPAM)

print(f"Probability of spam: {prob:.3f}")   # 0.870
print(f"Predicted class:     {label}")      # 1`}
      />
    </div>
  );
}
