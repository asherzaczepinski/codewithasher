'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="How Wide Is the Street?">
        <p>
          We said the margin is the distance between the two edge lines w · x + b = +1 and
          w · x + b = −1. Let&apos;s compute that distance precisely. The perpendicular distance
          between two parallel lines defined by w · x + b = +1 and w · x + b = −1 is:
        </p>
      </ExplanationBox>

      <MathFormula label="Margin Width">
        Margin = 2 / ||w||
      </MathFormula>

      <ExplanationBox title="Unpacking the Formula">
        <p>
          <strong>||w||</strong> is the length of the weight vector — the square root of the sum of
          its squared components. For a 2D weight vector w = (w₁, w₂), that is √(w₁² + w₂²).
        </p>
        <p>
          The formula says: <em>margin is inversely proportional to the length of w</em>. A short w
          gives a wide margin; a long w gives a narrow one. This is the key geometric insight that
          drives all of SVM training.
        </p>
        <p>
          To <strong>maximize the margin</strong> we therefore want to <strong>minimize ||w||</strong>.
          Equivalently — because it makes the calculus slightly cleaner — we minimize
          (1/2)||w||², which has the same minimum.
        </p>
      </ExplanationBox>

      <MathFormula label="SVM Objective (Hard Margin)">
        Minimize   (1/2) ||w||²
        {'\n'}
        Subject to  y_i (w · x_i + b) ≥ 1  for every training point i
      </MathFormula>

      <ExplanationBox title="Reading the Constraint">
        <p>
          Each training point x_i has a label y_i of +1 (Versicolor) or −1 (Setosa). The constraint
          y_i (w · x_i + b) ≥ 1 does two jobs at once:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            For a Versicolor point (y_i = +1): requires w · x_i + b ≥ +1 — the point must be
            on or outside the +1 edge line.
          </li>
          <li>
            For a Setosa point (y_i = −1): requires w · x_i + b ≤ −1 — the point must be on
            or outside the −1 edge line.
          </li>
        </ul>
        <p>
          When both conditions hold simultaneously no point sits inside the street — every flower is
          safely in its own lane. Solving the minimization problem under these constraints is a
          standard quadratic program, and the solution produces exactly the optimal w and b.
        </p>
      </ExplanationBox>

      <WorkedExample title="Margin Width Calculation">
        <p>
          Suppose the SVM found a weight vector w = (2, 1). Let&apos;s compute the margin width.
        </p>

        <CalcStep number={1}>Write down the weight vector: w = (2, 1)</CalcStep>
        <CalcStep number={2}>Compute ||w||: √(2² + 1²) = √(4 + 1) = √5 ≈ 2.236</CalcStep>
        <CalcStep number={3}>Apply the margin formula: Margin = 2 / ||w|| = 2 / 2.236 ≈ 0.894</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Now suppose instead the SVM found w = (1, 0.5) — exactly half as long. Then
          ||w|| = √(1 + 0.25) = √1.25 ≈ 1.118 and Margin = 2 / 1.118 ≈ 1.789. The margin
          doubled because w was halved. This confirms: <strong>smaller ||w|| = wider street</strong>.
          The SVM training process searches for the w that is as short as possible while still
          keeping every flower outside the street.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Not Just Use Any Separator?">
        <p>
          A classifier that happens to separate the training data might have a very large ||w||,
          producing a razor-thin margin. It classifies every training flower correctly, but a new
          flower sitting near the boundary has almost no buffer — a tiny measurement error puts it on
          the wrong side.
        </p>
        <p>
          The SVM explicitly trades away solutions with large ||w|| in favour of the solution with
          the smallest ||w|| that still satisfies all constraints. That trade-off is the mathematical
          expression of choosing the widest, most confident boundary.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          We extend <strong>svm.py</strong> with the margin formula and verify the worked example
          numbers in code. Both functions build directly on the decision_function from Step 2.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="svm.py"
        caption="margin_width(w) encodes the core SVM objective: a shorter weight vector means a wider street."
        code={`import numpy as np

# --- (decision_function and classify from Step 2 are already defined above) ---

def margin_width(w):
    # ||w|| is the Euclidean length of the weight vector.
    # np.linalg.norm computes sqrt(w[0]**2 + w[1]**2 + ...) for any dimension.
    norm_w = np.linalg.norm(w)

    # The margin formula: the perpendicular distance between the two edge lines
    # w.x + b = +1  and  w.x + b = -1  is exactly 2 / ||w||.
    # Wider margin <=> smaller ||w||.  That is why SVM minimizes (1/2)||w||^2.
    return 2.0 / norm_w

# --- reproduce the worked-example numbers ---

w1 = np.array([2.0, 1.0])          # the first weight vector from the example
margin1 = margin_width(w1)         # 2 / sqrt(5) ≈ 0.894

w2 = np.array([1.0, 0.5])          # exactly half as long as w1
margin2 = margin_width(w2)         # 2 / sqrt(1.25) ≈ 1.789  (double the margin)

# Confirm the key insight: halving w doubles the margin.
# This is why the SVM training objective penalises large ||w||.
ratio = margin2 / margin1           # should be very close to 2.0

# --- check that a candidate w satisfies the hard-margin constraint ---
# Each training point x_i with label y_i must satisfy: y_i * (w.x_i + b) >= 1.
def satisfies_hard_margin(X, y, w, b):
    # X: array of shape (n_samples, n_features)
    # y: array of labels, each +1 or -1
    # Returns True only if every single point is outside the margin street.
    scores = X.dot(w) + b           # decision values for all points at once
    margins = y * scores            # positive means correctly outside the margin
    return bool(np.all(margins >= 1.0))
`}
      />
    </div>
  );
}
