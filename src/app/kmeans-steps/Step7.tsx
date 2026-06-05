'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="k Is a Hyperparameter">
        <p>
          K-means needs you to decide in advance how many clusters to find. That number —
          <strong> k</strong> — is a <strong>hyperparameter</strong>: a setting you choose before
          training, not something the algorithm learns from the data.
        </p>
        <p>
          Pick k too small and you force genuinely different groups to share a centroid. Pick k too
          large and you split natural groups apart, inventing structure that isn&apos;t there. How
          do you choose the right k?
        </p>
      </ExplanationBox>

      <ExplanationBox title="Inertia: Measuring How Tight the Clusters Are">
        <p>
          The most common quality metric for K-means is <strong>inertia</strong> (also called
          within-cluster sum of squared distances, or WCSS). It measures how compact the clusters
          are: for every point, compute its squared distance to its assigned centroid, then sum all
          of those up.
        </p>
        <p>
          Lower inertia means points are tightly packed around their centroids — a better fit.
          Higher inertia means points are spread far from their centers — a looser, sloppier
          clustering.
        </p>
      </ExplanationBox>

      <MathFormula label="Inertia (WCSS)">
        Inertia = Σ_k  Σ_(p in cluster k)  d(p, C_k)²
      </MathFormula>

      <ExplanationBox title="The Elbow Method">
        <p>
          Here&apos;s the key insight: as you increase k, inertia always goes down — in the extreme
          case where k equals the number of points, every point is its own cluster and inertia is
          zero. So &quot;lowest inertia&quot; is not a useful criterion by itself.
        </p>
        <p>
          The <strong>elbow method</strong> looks at how quickly inertia falls as k grows. You plot
          inertia on the y-axis and k on the x-axis. At first, going from k=1 to k=2 to k=3
          produces large drops — each new cluster is capturing a genuinely new group. At some point
          adding another cluster barely helps: you&apos;re just splitting an already-tight cluster.
          That inflection point — the &quot;elbow&quot; — is the natural choice for k.
        </p>
        <p>
          For our 5-customer dataset the inertia curve would show a sharp drop from k=1 to k=2 (the
          two natural groups we found), then a much smaller drop going to k=3. The elbow at k=2
          confirms what the algorithm already discovered.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Inertia for Our k=2 Solution">
        <p>
          Final clusters: C₁=(2.00, 7.33) with &#123;P1=(1,7), P2=(3,9), P5=(2,6)&#125;;
          C₂=(7.00, 2.00) with &#123;P3=(8,1), P4=(6,3)&#125;. Let&apos;s calculate inertia.
        </p>

        <CalcStep number={1}>
          P1 to C₁: (1−2)²+(7−7.33)² = 1 + 0.11 = 1.11
        </CalcStep>
        <CalcStep number={2}>
          P2 to C₁: (3−2)²+(9−7.33)² = 1 + 2.79 = 3.79
        </CalcStep>
        <CalcStep number={3}>
          P5 to C₁: (2−2)²+(6−7.33)² = 0 + 1.77 = 1.77
        </CalcStep>
        <CalcStep number={4}>
          P3 to C₂: (8−7)²+(1−2)² = 1 + 1 = 2.00
        </CalcStep>
        <CalcStep number={5}>
          P4 to C₂: (6−7)²+(3−2)² = 1 + 1 = 2.00
        </CalcStep>
        <CalcStep number={6}>
          Total inertia = 1.11 + 3.79 + 1.77 + 2.00 + 2.00 = 10.67
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          An inertia of <strong>10.67</strong> for k=2 is our baseline. If we ran k=3 and got,
          say, 2.1, the drop would be dramatic and worth it. If k=3 gave 9.5, the marginal
          improvement is tiny — k=2 is almost certainly the better choice.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          inertia() measures clustering quality, and a simple loop over candidate values of k
          produces the data needed to draw the elbow curve.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="kmeans.py"
        caption="Pair inertia() with kmeans() from Step 6 to find the elbow automatically."
        code={`import numpy as np


# ---- full kmeans() and helpers from Steps 3-6 (abbreviated) ----

def euclidean(a, b):
    return np.sqrt(np.sum((np.subtract(a, b)) ** 2))

def assign_clusters(points, centroids):
    return np.array([np.argmin([euclidean(p, c) for c in centroids]) for p in points])

def update_centroids(points, labels, k):
    return np.array([np.mean(points[labels == i], axis=0) for i in range(k)])

def kmeans(points, k, max_iters=100):
    rng = np.random.default_rng(seed=42)
    centroids = points[rng.choice(len(points), size=k, replace=False)].astype(float)
    labels = np.full(len(points), -1)
    for _ in range(max_iters):
        new_labels = assign_clusters(points, centroids)
        if np.array_equal(new_labels, labels):
            break
        labels = new_labels
        centroids = update_centroids(points, labels, k)
    return labels, centroids


# ----------------------------------------------------------------
# INERTIA  (Within-Cluster Sum of Squared Distances)
# Low inertia = tight clusters = good fit.
# We use SQUARED distance here (no sqrt) — that is the standard
# definition and also what scikit-learn reports.
# ----------------------------------------------------------------

def inertia(points, labels, centroids):
    total = 0.0
    for i, point in enumerate(points):
        centroid = centroids[labels[i]]         # centroid for this point
        diff = np.subtract(point, centroid)
        total += np.sum(diff ** 2)              # squared distance, no sqrt
    return total


# ----------------------------------------------------------------
# ELBOW METHOD
# Run K-means for k = 1, 2, ..., max_k and record the inertia.
# The "elbow" is the k where the inertia curve bends sharply.
# ----------------------------------------------------------------

customers = np.array([[1,7],[3,9],[8,1],[6,3],[2,6]], dtype=float)

max_k = 4   # test k = 1 through 4  (no point going beyond n_points)
elbow_data = []

for k in range(1, max_k + 1):
    labels, centroids = kmeans(customers, k=k)
    score = inertia(customers, labels, centroids)
    elbow_data.append((k, score))
    print(f"k={k}  inertia={score:.2f}")

# Reading the output:
# k=1  large  (all points share one centroid — very loose)
# k=2  much smaller  (the natural two groups — the "elbow")
# k=3  small further drop  (splitting a tight cluster — diminishing returns)
# k=4  barely improves    (overfitting structure that is not there)`}
      />

      <ExplanationBox title="Limitations to Keep in Mind">
        <p>
          K-means makes two strong assumptions that can hurt it in practice:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Assumes round (spherical) clusters</strong> — because it uses Euclidean distance
            and centroid means, it naturally finds round blobs. If your data has elongated, crescent-shaped,
            or interleaved clusters, K-means will misclassify many points. Algorithms like DBSCAN or
            Gaussian Mixture Models handle non-spherical shapes better.
          </li>
          <li>
            <strong>Sensitive to feature scale</strong> — a feature measured in thousands (e.g.,
            raw annual spend in dollars) will dominate the distance calculation and drown out a
            feature measured in single digits (e.g., monthly visits). Always <strong>normalise</strong>
            your features — subtract the mean and divide by the standard deviation, or scale to
            [0, 1] — before running K-means. In our example we already used scaled axes for
            exactly this reason.
          </li>
          <li>
            <strong>k must be chosen manually</strong> — the elbow method gives guidance, but
            there is no universally correct answer. Domain knowledge often matters more than any
            metric.
          </li>
        </ul>
        <p>
          Despite these limitations, K-means remains one of the most useful tools in data science
          because it is fast, interpretable, and surprisingly effective when the data is reasonably
          well-behaved. You now understand every part of how it works — from distance arithmetic
          to convergence to picking k.
        </p>
      </ExplanationBox>
    </div>
  );
}
