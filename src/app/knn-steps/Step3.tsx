'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="From Distances to a Decision">
        <p>
          Once we have a distance from the new point to every labeled example, KNN does something
          beautifully simple: it picks the <strong>k smallest distances</strong>, looks at the
          labels attached to those neighbors, and returns the <strong>majority label</strong> as
          its prediction.
        </p>
        <p>
          It&apos;s a democratic vote — each neighbor gets exactly one vote, and the candidate
          with the most votes wins. With k&nbsp;=&nbsp;3, three neighbors vote; with k&nbsp;=&nbsp;5,
          five vote.
        </p>
      </ExplanationBox>

      <MathFormula label="KNN Classification Rule">
        ŷ = majority label among the k neighbors with smallest d(new point, neighbor)
      </MathFormula>

      <ExplanationBox title="Tie-Breaking">
        <p>
          When two classes receive the same number of votes, there is a tie. The safest strategy
          is to use an <strong>odd k</strong> so ties can&apos;t happen in a binary (two-class)
          problem. We&apos;ll dig deeper into choosing k in the next part of the course.
        </p>
      </ExplanationBox>

      <WorkedExample title="Full Classification: Mystery Fruit M = (180, 7)">
        <p>
          We have five labeled fruits. Using <strong>Euclidean distance</strong>, let&apos;s
          compute the distance from mystery fruit <strong>M&nbsp;=&nbsp;(180,&nbsp;7)</strong> to
          each one, then classify with <strong>k&nbsp;=&nbsp;3</strong>.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Step 1 — Compute all distances</p>

        <CalcStep number={1}>
          Fruit A (170, 7) — Apple: √((180−170)²+(7−7)²) = √(100+0) = 10.00
        </CalcStep>
        <CalcStep number={2}>
          Fruit B (160, 6) — Apple: √((180−160)²+(7−6)²) = √(400+1) = √401 ≈ 20.02
        </CalcStep>
        <CalcStep number={3}>
          Fruit C (270, 4) — Orange: √((180−270)²+(7−4)²) = √(8100+9) = √8109 ≈ 90.05
        </CalcStep>
        <CalcStep number={4}>
          Fruit D (280, 5) — Orange: √((180−280)²+(7−5)²) = √(10000+4) = √10004 ≈ 100.02
        </CalcStep>
        <CalcStep number={5}>
          Fruit E (175, 8) — Apple: √((180−175)²+(7−8)²) = √(25+1) = √26 ≈ 5.10
        </CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Step 2 — Rank by distance</p>

        <CalcStep number={6}>1st nearest: Fruit E — 5.10 — Apple</CalcStep>
        <CalcStep number={7}>2nd nearest: Fruit A — 10.00 — Apple</CalcStep>
        <CalcStep number={8}>3rd nearest: Fruit B — 20.02 — Apple</CalcStep>
        <CalcStep number={9}>4th nearest: Fruit C — 90.05 — Orange</CalcStep>
        <CalcStep number={10}>5th nearest: Fruit D — 100.02 — Orange</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Step 3 — Vote with k = 3</p>

        <CalcStep number={11}>Neighbors selected: E (Apple), A (Apple), B (Apple)</CalcStep>
        <CalcStep number={12}>Apple votes: 3 &nbsp;|&nbsp; Orange votes: 0</CalcStep>
        <CalcStep number={13}>Majority label: Apple</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          KNN predicts the mystery fruit is an <strong>Apple</strong> — a unanimous verdict from
          its three nearest neighbors. All three are apples clustered near weight&nbsp;≈&nbsp;170–175&nbsp;g
          and sweetness&nbsp;≈&nbsp;6–8, matching the mystery fruit closely. The two oranges are
          nearly 90 units away and never even entered the vote.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We now extend <code>knn.py</code> with <code>knn_classify</code>, which automates the
          three-step process — compute, rank, vote — for any dataset and any k.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="knn.py"
        caption="knn_classify wires together distance computation, sorting, and majority voting."
        code={`import numpy as np
from collections import Counter

# euclidean() defined in Step 2 — reproduced here so the file runs standalone.
def euclidean(a, b):
    diff = a - b
    return np.sqrt(np.sum(diff ** 2))


# ── Classification ────────────────────────────────────────────────────────────

def knn_classify(new_point, X, y, k):
    # Classify new_point using the k nearest labeled examples.
    #
    # Parameters
    #   new_point : 1-D array-like  — the query point, e.g. [180, 7]
    #   X         : 2-D array-like  — training features, shape (n_samples, n_features)
    #   y         : 1-D array-like  — training labels,   shape (n_samples,)
    #   k         : int             — number of neighbors to consult

    new_point = np.array(new_point)
    X = np.array(X)
    y = np.array(y)

    # Step 1: compute the distance from new_point to every training example.
    # We store (distance, label) pairs so they stay linked after sorting.
    distances = [(euclidean(new_point, X[i]), y[i]) for i in range(len(X))]

    # Step 2: sort ascending by distance so the nearest neighbors come first.
    distances.sort(key=lambda pair: pair[0])

    # Step 3: slice the k nearest, extract just their labels, then count votes.
    k_labels = [label for _, label in distances[:k]]
    vote_counts = Counter(k_labels)          # e.g. Counter({"Apple": 3})

    # most_common(1) returns [(label, count)]; we want only the label.
    return vote_counts.most_common(1)[0][0]


# ── Reproduce the worked example ──────────────────────────────────────────────
X_train = np.array([
    [170, 7],   # Fruit A
    [160, 6],   # Fruit B
    [270, 4],   # Fruit C
    [280, 5],   # Fruit D
    [175, 8],   # Fruit E
])
y_train = np.array(["Apple", "Apple", "Orange", "Orange", "Apple"])

mystery = np.array([180, 7])

prediction = knn_classify(mystery, X_train, y_train, k=3)
print("Predicted class:", prediction)   # Apple`}
      />
    </div>
  );
}
