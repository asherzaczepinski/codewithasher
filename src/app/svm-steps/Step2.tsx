'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Decision Boundary: A Hyperplane">
        <p>
          In two dimensions, the boundary between classes is a line. In three dimensions it would be
          a flat plane. In any number of dimensions the general term is a <strong>hyperplane</strong>.
          For our flower example — two features, two dimensions — it is simply a straight line.
        </p>
        <p>
          The SVM writes that line using a weight vector <strong>w</strong> and a bias term{' '}
          <strong>b</strong>. A point <strong>x</strong> lies exactly on the boundary when the
          following equation holds:
        </p>
      </ExplanationBox>

      <MathFormula label="Decision Boundary">
        w · x + b = 0
      </MathFormula>

      <ExplanationBox title="What the Equation Means">
        <p>
          The dot product <strong>w · x</strong> measures how far the point x lies along the
          direction that w points. Adding b shifts that measurement so the boundary does not have to
          pass through the origin.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>If <strong>w · x + b &gt; 0</strong> the point is on one side → predict Versicolor.</li>
          <li>If <strong>w · x + b &lt; 0</strong> the point is on the other side → predict Setosa.</li>
          <li>If <strong>w · x + b = 0</strong> the point is on the boundary itself.</li>
        </ul>
        <p>
          The sign of the output is the classifier&apos;s decision. The magnitude tells us how far from
          the boundary the point sits — which will matter when we compute the margin.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Margin: The Empty Street">
        <p>
          The <strong>margin</strong> is the total width of the empty street on both sides of the
          boundary. Picture it like this: imagine painting two dashed lines parallel to the decision
          boundary, one touching the nearest Versicolor flower and one touching the nearest Setosa
          flower. The distance between those two dashed lines is the margin.
        </p>
        <p>
          The SVM does not just find <em>a</em> boundary — it finds the boundary that makes this
          street as wide as possible. Every point in the training set is either outside the street
          (correctly classified and not touching the dashes) or sitting exactly on one of the dashed
          lines (the special points called support vectors, which we meet in the next module).
        </p>
        <p>
          A wide margin means the classifier has maximum confidence even for points that land close
          to the boundary. Narrow margins overfit to the training data and wobble under new inputs.
        </p>
      </ExplanationBox>

      <MathFormula label="Margin Boundary Lines">
        w · x + b = +1  (Versicolor side edge)
        {'\n'}
        w · x + b = −1  (Setosa side edge)
      </MathFormula>

      <ExplanationBox title="Why ±1?">
        <p>
          We can always <em>rescale</em> w and b so that the two edge lines correspond to output
          values of exactly +1 and −1. This is a mathematical convenience, not a constraint. Choosing
          ±1 as the edge values gives us a clean formula for the margin width — something we will
          derive in the Maximizing the Margin module. For now, just remember: the center line is 0,
          the edges are ±1, and the SVM&apos;s job is to push those edges as far apart as possible.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Here is the decision function in code. Every concept from this step — the weight vector,
          the bias, the dot product, and the sign-based classification — appears exactly once.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="svm.py"
        caption="decision_function returns the raw score; classify returns the predicted label (+1 or -1)."
        code={`import numpy as np

# w is the weight vector — one number per feature.
# b is the bias (intercept) — it shifts the boundary off the origin.
# Together they define the hyperplane  w . x + b = 0.

def decision_function(x, w, b):
    # The dot product measures how far x lies along the direction w.
    # Adding b shifts the measurement so the boundary can sit anywhere.
    return np.dot(w, x) + b

def classify(x, w, b):
    # The sign of the score is all we need for a prediction.
    # Positive score -> class +1 (Versicolor).
    # Negative score -> class -1 (Setosa).
    # Score == 0 means the point is exactly on the boundary.
    score = decision_function(x, w, b)
    return 1 if score >= 0 else -1

# --- quick sanity check with a toy boundary ---
# Suppose the SVM found w = [1, 2] and b = -3.
# The boundary line is: 1*x1 + 2*x2 - 3 = 0,  i.e.  x2 = (3 - x1) / 2.
w_example = np.array([1.0, 2.0])
b_example = -3.0

point_A = np.array([3.0, 2.0])  # expected to be on the Versicolor side
point_B = np.array([0.5, 0.5])  # expected to be on the Setosa side

score_A = decision_function(point_A, w_example, b_example)  # 1*3 + 2*2 - 3 = 4  (positive)
score_B = decision_function(point_B, w_example, b_example)  # 1*0.5 + 2*0.5 - 3 = -1.5  (negative)

label_A = classify(point_A, w_example, b_example)  # +1  (Versicolor)
label_B = classify(point_B, w_example, b_example)  # -1  (Setosa)
`}
      />
    </div>
  );
}
