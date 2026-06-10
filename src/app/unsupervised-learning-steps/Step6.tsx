'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Why Linear Methods Are Not Enough">
        <p>
          PCA finds linear directions of maximum variance. But many real datasets lie on
          curved surfaces — called <strong>manifolds</strong> — embedded in high-dimensional
          space. Imagine all the photos of a face taken from different angles: the data
          lives on a curved 2-D surface (angle left/right, angle up/down) sitting inside
          a million-dimensional pixel space. PCA, being linear, cannot &quot;unfurl&quot; that
          curve. Nonlinear dimensionality reduction methods can.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Manifold Learning Idea">
        <p>
          A <strong>manifold</strong> is a smooth low-dimensional surface embedded in a
          higher-dimensional space. The manifold hypothesis — widely supported empirically —
          says that real high-dimensional data (images, text embeddings, customer behavior
          vectors) tends to lie near a low-dimensional manifold. Nonlinear methods try to
          find coordinates on that manifold.
        </p>
        <p>
          In the customer dataset, the &quot;true&quot; structure might be a 3-D manifold
          (axes: price-sensitivity, brand-loyalty, novelty-seeking) curved and folded inside
          200-D feature space. Unfolding it reveals the customer segments much more cleanly
          than raw PCA would.
        </p>
      </ExplanationBox>

      <ExplanationBox title="t-SNE: Preserving Local Neighborhoods">
        <p>
          <strong>t-SNE</strong> (t-distributed Stochastic Neighbor Embedding) is the most
          widely used method for visualizing high-dimensional data in 2-D or 3-D. Its core
          idea: define a probability distribution over pairs of points in the
          high-dimensional space (nearby points get high probability of being &quot;neighbors&quot;)
          and then find a low-dimensional layout whose neighbor probabilities match as
          closely as possible.
        </p>
        <p>
          In the high-dimensional space, similarities are computed using a Gaussian kernel.
          In the low-dimensional space, a <strong>Student&apos;s t-distribution</strong>{' '}
          (which has heavier tails than a Gaussian) is used instead. This heavy tail
          pushes dissimilar points far apart in the 2-D map, creating the beautiful
          well-separated cluster visualizations t-SNE is famous for.
        </p>
      </ExplanationBox>

      <MathFormula label="t-SNE similarity in low-dimensional space (Student-t kernel)">
        q(i,j) = (1 + dist(y_i, y_j)^2)^(-1) / (sum over k not equal l of (1 + dist(y_k, y_l)^2)^(-1))
      </MathFormula>

      <ExplanationBox title="UMAP: Faster and More Global">
        <p>
          <strong>UMAP</strong> (Uniform Manifold Approximation and Projection) is a newer
          alternative that is typically 5-10 times faster than t-SNE and better at
          preserving <em>global</em> structure — meaning the relative positions of clusters
          in the 2-D map are more meaningful. UMAP is grounded in topological data analysis:
          it constructs a fuzzy topological representation of the high-dimensional data and
          then finds a low-dimensional representation with the same fuzzy topology.
        </p>
        <p>
          UMAP has two key parameters: <strong>n_neighbors</strong> (how many local
          neighbors to consider — small values emphasize local structure, large values
          emphasize global) and <strong>min_dist</strong> (how tightly points can cluster
          in the 2-D map — small values give denser clumps).
        </p>
      </ExplanationBox>

      <WorkedExample title="Interpreting a t-SNE / UMAP Customer Map">
        <p>
          After running t-SNE on the 200-D customer dataset projected to 2-D, we observe
          several well-separated blobs. Here is how to read the output correctly:
        </p>
        <CalcStep number={1}>
          Identify dense blobs — each is likely a distinct customer segment. Customers
          inside a blob are behaviorally similar in ways the algorithm found meaningful.
        </CalcStep>
        <CalcStep number={2}>
          Color points by a known variable (e.g., total spend quartile) that was NOT given
          to the algorithm. If one color dominates a blob, that segment has a coherent
          spend profile — validating that the structure is real, not random.
        </CalcStep>
        <CalcStep number={3}>
          Do NOT interpret the distance between blobs as meaningful in t-SNE — a blob on
          the left and one on the right are not necessarily more different from each other
          than two adjacent blobs. This is the most common misinterpretation.
        </CalcStep>
        <CalcStep number={4}>
          With UMAP, inter-cluster distances are more trustworthy. If two blobs are far
          apart in the UMAP plot, they are likely genuinely dissimilar in the original space.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Both methods are <em>exploratory</em> visualization tools, not classifiers.
          Use the clusters they reveal as hypotheses to validate with domain knowledge
          or further statistical testing.
        </p>
      </WorkedExample>

      <ExplanationBox title="Cautions When Using t-SNE and UMAP">
        <p>
          These are the rules that trip up practitioners most often:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Cluster sizes are not meaningful.</strong> A large blob in t-SNE does
            not mean a large segment — the algorithm stretches and shrinks regions freely.
          </li>
          <li>
            <strong>Results depend on hyperparameters.</strong> Run t-SNE with perplexity
            5 and perplexity 50 on the same data and you may see very different pictures.
            Always try multiple settings before drawing conclusions.
          </li>
          <li>
            <strong>Do not use as input to other models.</strong> The 2-D coordinates are
            for human visualization, not for training a classifier or computing distances.
            Use PCA or SVD embeddings for that.
          </li>
          <li>
            <strong>Random initialization matters.</strong> Set a random seed for
            reproducibility; different runs can produce different-looking (but equally
            valid) layouts.
          </li>
        </ul>
      </ExplanationBox>

    </div>
  );
}
