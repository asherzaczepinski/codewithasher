'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Hierarchical Clustering">
        <p>
          What if you don&apos;t know how many clusters you want? Hierarchical clustering
          sidesteps that question entirely by building a <strong>full tree of merges</strong>
          — called a <strong>dendrogram</strong> — that you can cut at any level to get
          any number of clusters you like.
        </p>
        <p>
          The most common flavor is <strong>agglomerative</strong> (bottom-up): start with
          every point as its own cluster, then repeatedly merge the two closest clusters
          until only one remains. The result is a binary tree. Cut it high and you get 2
          large clusters; cut it low and you get many fine-grained ones.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Linkage: How to Measure Distance Between Clusters">
        <p>
          Once clusters contain multiple points, &quot;distance between clusters&quot; needs
          a definition. The three most common are:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Single linkage</strong> — distance between the two closest points across
            the clusters. Tends to produce long, chain-like clusters.
          </li>
          <li>
            <strong>Complete linkage</strong> — distance between the two farthest points.
            Produces compact, equally sized clusters.
          </li>
          <li>
            <strong>Average linkage</strong> — mean distance between all pairs of points,
            one from each cluster. A robust middle ground and the most commonly used default.
          </li>
        </ul>
        <p>
          In the customer dataset, complete linkage tends to give us tight segments
          (every member is genuinely close to every other member), which usually makes
          the resulting groups more actionable for marketing.
        </p>
      </ExplanationBox>

      <WorkedExample title="Tracing Two Merges in a Tiny Customer Tree">
        <p>
          Four customers A, B, C, D with pairwise distances (average linkage):
        </p>
        <CalcStep number={1}>
          Distances: dist(A,B) = 1.2, dist(C,D) = 0.8, dist(A,C) = 3.1,
          dist(A,D) = 3.4, dist(B,C) = 2.9, dist(B,D) = 3.0
        </CalcStep>
        <CalcStep number={2}>
          Smallest distance is dist(C,D) = 0.8 — merge C and D into cluster (CD).
        </CalcStep>
        <CalcStep number={3}>
          Next smallest is dist(A,B) = 1.2 — merge A and B into cluster (AB).
        </CalcStep>
        <CalcStep number={4}>
          Remaining distance: dist((AB),(CD)) = average of dist(A,C), dist(A,D),
          dist(B,C), dist(B,D) = (3.1+3.4+2.9+3.0)/4 = 3.1
        </CalcStep>
        <CalcStep number={5}>
          Final merge: (AB) and (CD) unite at height 3.1.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Cutting the dendrogram below 3.1 but above 1.2 gives exactly 2 clusters:
          (A, B) and (C, D). A retailer might choose that cut because it separates
          two natural behavioral segments without over-fragmenting.
        </p>
      </WorkedExample>

      <ExplanationBox title="DBSCAN: Clustering by Density">
        <p>
          Both k-means and hierarchical clustering struggle with clusters that have
          irregular shapes — think a ring of customers surrounding a dense core, or
          two interleaved crescents. <strong>DBSCAN</strong> (Density-Based Spatial
          Clustering of Applications with Noise) handles these naturally because it
          defines clusters as dense regions separated by sparse space.
        </p>
        <p>
          DBSCAN has two parameters: <strong>eps</strong> (the neighborhood radius)
          and <strong>minPts</strong> (the minimum number of points that must be within
          eps distance of a point for that point to be considered dense). Every point
          is classified as one of three types:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Core point</strong> — has at least minPts neighbors within eps.
            These form the backbone of a cluster.
          </li>
          <li>
            <strong>Border point</strong> — within eps of a core point but has fewer
            than minPts neighbors itself. It joins the cluster but does not expand it.
          </li>
          <li>
            <strong>Noise point</strong> — neither core nor border. DBSCAN labels it
            an outlier and assigns it to no cluster. This is built-in anomaly detection
            for free.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="DBSCAN neighborhood">
        N_eps(p) = all points q such that dist(p, q) &lt;= eps
      </MathFormula>

      <ExplanationBox title="When Each Method Beats K-Means">
        <p>
          Use <strong>hierarchical clustering</strong> when you want to explore multiple
          granularities at once (e.g., first a 3-segment view, then a 10-segment view),
          when the dataset is small enough to visualize the full dendrogram, or when
          you have no prior idea of k.
        </p>
        <p>
          Use <strong>DBSCAN</strong> when clusters are non-spherical or vary in density,
          when you expect meaningful outliers (DBSCAN identifies them explicitly), or when
          you cannot assume all points belong to a cluster. In the customer dataset, DBSCAN
          naturally flags the handful of customers with extreme, anomalous behavior rather
          than forcing them into the nearest centroid.
        </p>
      </ExplanationBox>

    </div>
  );
}
