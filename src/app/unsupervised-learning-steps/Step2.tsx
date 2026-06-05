'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What Is Clustering?">
        <p>
          Clustering is the task of dividing a dataset into groups — called <strong>clusters</strong> —
          so that points inside the same group are more similar to each other than to points
          in other groups. Crucially, no one tells the algorithm how many groups to form or
          what those groups mean. It discovers them purely from the geometry of the data.
        </p>
        <p>
          In our customer dataset, clustering might reveal that customers fall into a
          &quot;weekend deal-seeker&quot; group, a &quot;brand-loyal weekday buyer&quot; group,
          and a &quot;high-spend infrequent visitor&quot; group — without anyone ever writing
          those labels down.
        </p>
      </ExplanationBox>

      <ExplanationBox title="K-Means Recap">
        <p>
          The k-means algorithm (covered in detail in the dedicated k-means course) works
          in three repeating steps: choose k random <strong>centroids</strong> (one per
          cluster), assign every point to its nearest centroid by Euclidean distance, then
          move each centroid to the arithmetic mean of all points assigned to it. Repeat
          until assignments stop changing. K-means is fast and scales to millions of points,
          but it assumes clusters are roughly spherical, equally sized, and it is sensitive
          to outliers because the mean is pulled toward extreme values.
        </p>
      </ExplanationBox>

      <ExplanationBox title="K-Medoids: Robust Centroids">
        <p>
          K-medoids fixes k-means&apos; outlier sensitivity by replacing the arithmetic mean
          with a <strong>medoid</strong> — an actual data point that minimizes the total
          distance to all other members of its cluster. Because the center must be a real
          observation, a single outlier customer with unusually high spend cannot drag the
          cluster center into empty space the way a mean can.
        </p>
        <p>
          The trade-off is cost: choosing the best medoid requires comparing every candidate
          point against every other point in the cluster, making k-medoids slower than
          k-means. The most common algorithm is <strong>PAM</strong> (Partitioning Around
          Medoids). It starts with k randomly chosen medoids and iteratively swaps each
          medoid with a non-medoid point if doing so reduces the total within-cluster
          distance.
        </p>
      </ExplanationBox>

      <MathFormula label="Within-cluster cost (k-medoids)">
        Cost = sum over all clusters c of: sum over all points x in c of dist(x, medoid_c)
      </MathFormula>

      <ExplanationBox title="Measuring Distance">
        <p>
          Both k-means and k-medoids rely on a distance measure. The default is
          <strong> Euclidean distance</strong>. For two points with features (a1, a2) and
          (b1, b2):
        </p>
      </ExplanationBox>

      <MathFormula label="Euclidean distance (2 features)">
        dist(A, B) = sqrt((a1 - b1)^2 + (a2 - b2)^2)
      </MathFormula>

      <WorkedExample title="Assigning a Customer to the Nearest Medoid">
        <p>
          Suppose we have two medoids in a simplified 2-feature space where
          Feature 1 is &quot;monthly spend&quot; (normalized 0-1) and Feature 2 is
          &quot;purchase frequency&quot; (normalized 0-1). A new customer C must be
          assigned to one of them.
        </p>
        <CalcStep number={1}>
          Medoid M1 = (0.2, 0.8) — low spend, high frequency (deal-seeker segment)
        </CalcStep>
        <CalcStep number={2}>
          Medoid M2 = (0.9, 0.3) — high spend, low frequency (luxury segment)
        </CalcStep>
        <CalcStep number={3}>
          New customer C = (0.85, 0.4)
        </CalcStep>
        <CalcStep number={4}>
          dist(C, M1) = sqrt((0.85 - 0.2)^2 + (0.4 - 0.8)^2)
          = sqrt(0.4225 + 0.16) = sqrt(0.5825) ≈ 0.763
        </CalcStep>
        <CalcStep number={5}>
          dist(C, M2) = sqrt((0.85 - 0.9)^2 + (0.4 - 0.3)^2)
          = sqrt(0.0025 + 0.01) = sqrt(0.0125) ≈ 0.112
        </CalcStep>
        <CalcStep number={6}>
          0.112 &lt; 0.763, so customer C is assigned to cluster M2 (luxury segment).
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Because M2 is an <em>actual customer</em> in the dataset, not an imaginary average,
          the cluster center remains interpretable — you can look up that specific customer
          and understand what &quot;typical luxury buyer&quot; looks like concretely.
        </p>
      </WorkedExample>
    </div>
  );
}
