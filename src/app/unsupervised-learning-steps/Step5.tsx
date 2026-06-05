'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Curse of Dimensionality">
        <p>
          Our customer dataset might have 200 features — one count per product category.
          In 200-dimensional space, almost every pair of points is roughly the same
          distance apart; there is no &quot;nearby&quot; and &quot;far away.&quot; Clustering
          and visualization both become unreliable. <strong>Dimensionality reduction</strong>
          compresses the data into a small number of dimensions while preserving as much
          meaningful structure as possible.
        </p>
      </ExplanationBox>

      <ExplanationBox title="PCA Recap: Maximum Variance Directions">
        <p>
          Principal Component Analysis (covered in detail in the dedicated PCA course)
          finds the directions in the original feature space along which the data varies
          most. The first principal component is the single direction that captures the
          most variance; the second captures the most remaining variance while being
          perpendicular to the first; and so on. Projecting the data onto the top k
          principal components gives a k-dimensional summary that loses as little
          information as possible — in a least-squares sense.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Singular Value Decomposition (SVD)">
        <p>
          PCA is most elegantly and stably computed via the
          <strong> Singular Value Decomposition</strong>. SVD decomposes any m-by-n
          matrix A into three matrices:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>U</strong> — an m-by-m orthogonal matrix. Its columns are the
            &quot;left singular vectors&quot; — directions in the row (observation) space.
          </li>
          <li>
            <strong>Sigma (diagonal)</strong> — an m-by-n diagonal matrix. The diagonal
            entries sigma_1 &gt;= sigma_2 &gt;= ... &gt;= 0 are the
            <strong> singular values</strong>. Larger singular values indicate directions
            that capture more variance.
          </li>
          <li>
            <strong>V-transpose</strong> — an n-by-n orthogonal matrix. Its rows are the
            &quot;right singular vectors&quot; — directions in the column (feature) space.
            These are exactly the principal components of A.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Singular Value Decomposition">
        A = U * Sigma * V^T
      </MathFormula>

      <ExplanationBox title="Low-Rank Approximation">
        <p>
          The power of SVD is that you can truncate it. Keep only the top k singular
          values and their corresponding columns of U and rows of V-transpose, and you get
          the best possible rank-k approximation of A — best in the sense that it minimizes
          the sum of squared differences from the original matrix (the Frobenius norm).
        </p>
        <p>
          For our customer matrix (rows = customers, columns = product categories), the
          rank-5 SVD approximation might capture 80% of the total variance while reducing
          the representation from 200 numbers per customer to just 5. Those 5 numbers are
          the customer&apos;s coordinates in &quot;latent preference space&quot; — far more
          tractable for downstream clustering or modeling.
        </p>
      </ExplanationBox>

      <MathFormula label="Best rank-k approximation (Eckart-Young theorem)">
        A_k = U_k * Sigma_k * V_k^T    where sigma_1 ... sigma_k are the k largest singular values
      </MathFormula>

      <WorkedExample title="Variance Explained by Singular Values">
        <p>
          Suppose SVD on the customer matrix yields singular values:
          sigma_1 = 12, sigma_2 = 8, sigma_3 = 5, sigma_4 = 3, sigma_5 = 1.
        </p>
        <CalcStep number={1}>
          Square each singular value (variance is proportional to sigma^2):
          144, 64, 25, 9, 1. Total = 243.
        </CalcStep>
        <CalcStep number={2}>
          Variance explained by component 1: 144 / 243 ≈ 59.3%
        </CalcStep>
        <CalcStep number={3}>
          Variance explained by components 1 and 2: (144 + 64) / 243 = 208 / 243 ≈ 85.6%
        </CalcStep>
        <CalcStep number={4}>
          Variance explained by top 3 components: (144 + 64 + 25) / 243 = 233 / 243 ≈ 95.9%
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Keeping only 3 of 5 (hypothetical) dimensions already preserves 95.9% of the
          variance. In practice with 200 features, the first few components often capture
          the bulk of the signal while the rest is noise — justifying the compression.
        </p>
      </WorkedExample>

      <ExplanationBox title="Uses Beyond Compression">
        <p>
          SVD is the backbone of many techniques beyond PCA: <strong>latent semantic
          analysis</strong> for text (rows = documents, columns = words, singular vectors
          capture topics), <strong>collaborative filtering</strong> for recommendations
          (rows = users, columns = items), and <strong>image compression</strong> (rows and
          columns are pixel dimensions). Whenever you see &quot;low-rank approximation&quot;
          or &quot;latent factors,&quot; SVD is usually working behind the scenes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          <code>numpy.linalg.svd</code> returns U, the singular values (s), and Vt.
          Truncating to k components and multiplying them back gives the best rank-k
          reconstruction — the same thing sklearn&apos;s PCA does internally.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="svd_pca_demo.py"
        caption="numpy SVD decomposes a centered data matrix; keeping the top-k components gives the PCA low-rank approximation."
        code={`import numpy as np

# Small customer matrix: 5 customers x 4 product-category spend values.
# Rows = customers, columns = features (categories).
A = np.array([
    [10.0, 2.0,  1.0, 0.5],
    [ 9.5, 2.2,  0.8, 0.6],
    [ 0.3, 8.0,  7.5, 0.1],
    [ 0.2, 7.8,  8.0, 0.2],
    [ 5.0, 5.0,  4.5, 5.0],
])

# PCA prerequisite: center each feature (subtract column mean).
# This ensures the first singular vector captures variance, not the mean.
A_centered = A - A.mean(axis=0)

# Full SVD: A_centered = U @ diag(s) @ Vt
# U shape: (m, m) = (5, 5)  -- left singular vectors (customer directions)
# s shape: (min(m,n),) = (4,) -- singular values, descending order
# Vt shape: (n, n) = (4, 4) -- right singular vectors (feature directions = PCA components)
U, s, Vt = np.linalg.svd(A_centered, full_matrices=True)

# How much variance does each component explain?
variance_explained = (s ** 2) / (s ** 2).sum()
print("Variance explained per component:", variance_explained.round(3))
# First component typically captures the bulk of the signal.

# ---- Low-rank approximation: keep only the top k=2 components ----
k = 2
# Slice U to first k columns, s to first k values, Vt to first k rows.
A_k = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]

print("Original A_centered (row 0):", A_centered[0].round(2))
print("Rank-2 approx  (row 0)     :", A_k[0].round(2))
# The approximation is close but not identical -- it discards the small
# variance captured by components 3 and 4, which are likely noise.

# ---- PCA scores: coordinates of each customer in "latent space" ----
# These k-dimensional vectors are what you pass to downstream clustering.
pca_scores = U[:, :k] @ np.diag(s[:k])
print("PCA scores (5 customers x 2 components):")
print(pca_scores.round(2))
# Each row is a customer's position in the low-dimensional representation.
`}
      />
    </div>
  );
}
