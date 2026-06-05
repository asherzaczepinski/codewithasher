'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Update Step">
        <p>
          After every point has been assigned to a cluster, the centroids are probably in the wrong
          place. They were initialised randomly — they don&apos;t yet reflect where the actual
          members of each cluster live. The <strong>update step</strong> fixes that.
        </p>
        <p>
          The rule is simply: move each centroid to the <em>mean position</em> of all the points
          currently assigned to it. In 2D that means computing the average x-coordinate and the
          average y-coordinate of every member, and placing the centroid at (average x, average y).
        </p>
        <p>
          This is why the algorithm is called <strong>K-means</strong> — K clusters, each
          represented by a mean.
        </p>
      </ExplanationBox>

      <MathFormula label="New Centroid Formula">
        C_k = (1 / |S_k|) × Σ  p_i   for all p_i in cluster k
      </MathFormula>

      <ExplanationBox title="Reading the Formula">
        <p>
          |S_k| is the number of points in cluster k. The formula says: add up all the point
          coordinates in the cluster, then divide by how many there are. That&apos;s just the
          arithmetic mean — the same average you learned in grade school, applied separately to
          each feature dimension.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing New Centroids After Iteration 1">
        <p>
          From the assignment step: Cluster 1 = &#123;P1=(1,7), P2=(3,9), P5=(2,6)&#125; and
          Cluster 2 = &#123;P3=(8,1), P4=(6,3)&#125;. Let&apos;s find the new centroids.
        </p>

        <CalcStep number={1}>
          Cluster 1 — sum the x-coordinates (spend): 1 + 3 + 2 = 6
        </CalcStep>
        <CalcStep number={2}>
          Cluster 1 — average x: 6 ÷ 3 = 2.00
        </CalcStep>
        <CalcStep number={3}>
          Cluster 1 — sum the y-coordinates (visits): 7 + 9 + 6 = 22
        </CalcStep>
        <CalcStep number={4}>
          Cluster 1 — average y: 22 ÷ 3 ≈ 7.33
        </CalcStep>
        <CalcStep number={5}>
          New C₁ = (2.00, 7.33)  — moved from (2, 8) to the true center of its members
        </CalcStep>
        <CalcStep number={6}>
          Cluster 2 — sum x: 8 + 6 = 14  →  average x: 14 ÷ 2 = 7.00
        </CalcStep>
        <CalcStep number={7}>
          Cluster 2 — sum y: 1 + 3 = 4  →  average y: 4 ÷ 2 = 2.00
        </CalcStep>
        <CalcStep number={8}>
          New C₂ = (7.00, 2.00)  — happened to stay exactly the same this iteration
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          C₁ shifted slightly downward from (2, 8) to (2.00, 7.33) because P5&apos;s visit count
          of 6 pulled the average below 8. C₂ didn&apos;t move because (8+6)/2 = 7 and (1+3)/2 = 2
          exactly matched the original placement. In the next module we&apos;ll see what happens
          when we feed these new centroids back into the assignment step.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          update_centroids() completes the second half of the loop: given the current labels,
          recompute each centroid as the column-wise mean of its members.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="kmeans.py"
        caption="update_centroids() uses np.mean so the averaging works for any number of features, not just 2."
        code={`import numpy as np

# euclidean() and assign_clusters() defined in earlier steps (omitted for brevity).


# ------------------------------------------------------------------
# UPDATE STEP
# Once every point has a label, slide each centroid to the mean
# position of all points currently wearing that label.
# This is why the algorithm is named K-MEANS.
# ------------------------------------------------------------------

def update_centroids(points, labels, k):
    # points  -- 2-D array, shape (n_points, n_features)
    # labels  -- 1-D integer array, length n_points  (from assign_clusters)
    # k       -- total number of clusters (some may temporarily be empty)

    n_features = points.shape[1]          # 2 in our customer example
    new_centroids = np.zeros((k, n_features))  # pre-allocate result array

    for cluster_idx in range(k):
        # Boolean mask: True for every row that belongs to this cluster.
        mask = (labels == cluster_idx)    # e.g. [True, True, False, False, True]

        # Slice out only the points in this cluster.
        members = points[mask]            # shape: (n_members, n_features)

        # np.mean with axis=0 averages each feature column independently.
        # That gives us (avg_spend, avg_visits) for this cluster.
        new_centroids[cluster_idx] = np.mean(members, axis=0)

    return new_centroids   # shape (k, n_features)


# --- verify against the worked example above ---
points = np.array([[1,7],[3,9],[8,1],[6,3],[2,6]], dtype=float)
labels = np.array([0, 0, 1, 1, 0])   # from assign_clusters in Step 4
print(update_centroids(points, labels, k=2))
# Expected: [[2.   7.33...], [7.  2.  ]]`}
      />
    </div>
  );
}
