'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Full Loop">
        <p>
          K-means is nothing more than two steps repeated in a loop:
        </p>
        <ol style={{ lineHeight: '2' }}>
          <li><strong>Assign</strong> — give every point the label of its nearest centroid.</li>
          <li><strong>Update</strong> — move each centroid to the mean of its assigned points.</li>
        </ol>
        <p>
          That&apos;s the entire algorithm. You keep looping until the assignments stop changing —
          no point switches clusters from one iteration to the next. At that moment the algorithm
          has <strong>converged</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why It Must Converge">
        <p>
          Each assignment step minimises the total distance from points to their centroids, given
          the current centroid positions. Each update step then moves centroids to further reduce
          that total distance, given the current assignments. Neither step can ever increase the
          total distance, and the number of possible assignment configurations is finite, so the
          algorithm is guaranteed to stop in a finite number of iterations.
        </p>
        <p>
          In practice convergence is usually very fast — often fewer than 20 iterations even on
          large datasets.
        </p>
      </ExplanationBox>

      <WorkedExample title="Tracing Two Full Iterations on Our Dataset">
        <p>
          Points: P1=(1,7), P2=(3,9), P3=(8,1), P4=(6,3), P5=(2,6).
          Starting centroids: C₁=(2,8), C₂=(7,2).
        </p>

        <CalcStep number={1}>
          Iteration 1 — Assign (from Step 4): C₁ gets &#123;P1, P2, P5&#125;; C₂ gets &#123;P3, P4&#125;
        </CalcStep>
        <CalcStep number={2}>
          Iteration 1 — Update (from Step 5): new C₁ = (2.00, 7.33); new C₂ = (7.00, 2.00)
        </CalcStep>
        <CalcStep number={3}>
          Iteration 2 — Reassign P1=(1,7):
          d(P1, C₁) = √((1−2)²+(7−7.33)²) = √(1+0.11) ≈ 1.05
          d(P1, C₂) = √((1−7)²+(7−2)²) = √(36+25) ≈ 7.81  → stays in C₁
        </CalcStep>
        <CalcStep number={4}>
          Iteration 2 — Reassign P2=(3,9):
          d(P2, C₁) = √((3−2)²+(9−7.33)²) = √(1+2.79) ≈ 1.95
          d(P2, C₂) = √((3−7)²+(9−2)²) = √(16+49) ≈ 8.06  → stays in C₁
        </CalcStep>
        <CalcStep number={5}>
          Iteration 2 — Reassign P5=(2,6):
          d(P5, C₁) = √((2−2)²+(6−7.33)²) = √(0+1.77) ≈ 1.33
          d(P5, C₂) = √((2−7)²+(6−2)²) = √(25+16) ≈ 6.40  → stays in C₁
        </CalcStep>
        <CalcStep number={6}>
          Iteration 2 — P3 and P4 similarly remain in C₂ (their distances to C₁ are both &gt; 7)
        </CalcStep>
        <CalcStep number={7}>
          Iteration 2 — Update: assignments unchanged → centroids don&apos;t move. Converged!
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The algorithm converged after just one full iteration. Final clusters: frequent
          lower-spend customers &#123;P1, P2, P5&#125; and infrequent higher-spend customers
          &#123;P3, P4&#125;. These are exactly the natural groups a human analyst would identify
          by eye.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          kmeans() wires assign_clusters() and update_centroids() into the full loop,
          stopping as soon as the labels stop changing (convergence) or the iteration
          budget runs out.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="kmeans.py"
        caption="The complete K-means implementation built up across Steps 3-6 — under 40 lines of real Python."
        code={`import numpy as np


# ---- helpers from earlier steps --------------------------------

def euclidean(a, b):
    # Straight-line distance between two points in any number of dims.
    return np.sqrt(np.sum((np.subtract(a, b)) ** 2))

def assign_clusters(points, centroids):
    # Label every point with the index of its nearest centroid.
    labels = [np.argmin([euclidean(p, c) for c in centroids]) for p in points]
    return np.array(labels)

def update_centroids(points, labels, k):
    # Slide each centroid to the mean position of its current members.
    return np.array([np.mean(points[labels == i], axis=0) for i in range(k)])


# ----------------------------------------------------------------
# FULL K-MEANS LOOP
# Repeatedly assign then update until nothing moves (converged)
# or we hit the iteration cap.  Returns final labels and centroids.
# ----------------------------------------------------------------

def kmeans(points, k, max_iters=100):
    # Seed the centroids by picking k distinct points at random.
    # (Production code uses k-means++ instead, but random is clear for learning.)
    rng = np.random.default_rng(seed=42)   # fixed seed for reproducibility
    idx = rng.choice(len(points), size=k, replace=False)
    centroids = points[idx].astype(float)

    labels = np.full(len(points), -1)      # start with every label "unset"

    for iteration in range(max_iters):
        new_labels = assign_clusters(points, centroids)

        # Convergence check: if NO point changed cluster, we are done.
        if np.array_equal(new_labels, labels):
            print(f"Converged after {iteration} iteration(s).")
            break

        labels = new_labels
        centroids = update_centroids(points, labels, k)

    return labels, centroids


# --- run on our 5-customer dataset ---
customers = np.array([
    [1, 7],   # low spend, frequent visitor
    [3, 9],   # moderate spend, very frequent visitor
    [8, 1],   # high spend, rare visitor
    [6, 3],   # high spend, occasional visitor
    [2, 6],   # low spend, frequent visitor
], dtype=float)

labels, centroids = kmeans(customers, k=2)
print("Labels:   ", labels)     # Expected: [0 0 1 1 0]  (or equivalent)
print("Centroids:", centroids)  # Expected: [[2. 7.33], [7. 2.]]`}
      />

      <ExplanationBox title="Local Minima and Random Initialisation">
        <p>
          K-means is guaranteed to converge, but not to the <em>best</em> possible clustering.
          Different random starting positions for the centroids can produce different final results,
          some of which are worse than others. This is called getting stuck in a <strong>local
          minimum</strong>.
        </p>
        <p>
          The standard fix is <strong>K-means++</strong> initialisation: instead of placing
          centroids completely at random, you spread them out deliberately — each new centroid is
          chosen with probability proportional to its squared distance from the nearest already-chosen
          centroid. This simple change dramatically reduces the chance of a bad initialisation and
          is the default in every major machine-learning library.
        </p>
        <p>
          Another common practice is to run K-means several times with different random seeds and
          keep the solution with the lowest total distance (called <strong>inertia</strong>).
        </p>
      </ExplanationBox>
    </div>
  );
}
