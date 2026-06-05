'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
    </div>
  );
}
