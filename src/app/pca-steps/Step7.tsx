'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Key Question: How Many Components?">
        <p>
          PCA gives you as many principal components as you have features. The art is
          deciding how many to keep. Keep too few and you lose important structure in
          the data. Keep too many and you haven&apos;t really reduced dimensionality — the
          curse is back.
        </p>
        <p>
          The answer lives in the eigenvalues. Each eigenvalue tells you exactly how much
          variance that component explains. By looking at eigenvalues as fractions of the
          total, you can make a principled decision.
        </p>
      </ExplanationBox>

      <MathFormula label="Explained variance ratio for component k">
        EVR(k) = λₖ / (λ₁ + λ₂ + … + λₙ)
      </MathFormula>

      <ExplanationBox title="Cumulative Explained Variance">
        <p>
          The <strong>cumulative explained variance</strong> is the sum of EVR values for
          the first k components. A common rule of thumb is to keep enough components to
          reach <strong>95% cumulative explained variance</strong> — though the right
          threshold depends on your use case.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Visualization</strong> — keep 2 or 3 components regardless of EVR,
            because you can only plot in 2D or 3D. Accept whatever variance that captures.
          </li>
          <li>
            <strong>Speed</strong> — keep as few components as possible while retaining
            enough variance for your model to perform acceptably (often 90–95%).
          </li>
          <li>
            <strong>Denoising</strong> — keep only the top few components and discard the
            rest. The small eigenvalue directions often correspond to measurement noise
            rather than real signal, so dropping them actually improves data quality.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Choosing Components for a 4-Feature Dataset">
        <p>
          Suppose you run PCA on a dataset with four features and get these eigenvalues:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          λ₁ = 180 &nbsp;&nbsp; λ₂ = 60 &nbsp;&nbsp; λ₃ = 8 &nbsp;&nbsp; λ₄ = 2
        </p>

        <CalcStep number={1}>
          Compute the total variance (sum of all eigenvalues):<br />
          Total = 180 + 60 + 8 + 2 = 250
        </CalcStep>
        <CalcStep number={2}>
          Compute each explained variance ratio:<br />
          EVR(1) = 180 / 250 = 0.720 &nbsp; (72.0%)<br />
          EVR(2) = 60 / 250 = 0.240 &nbsp; (24.0%)<br />
          EVR(3) = 8 / 250 = 0.032 &nbsp; (3.2%)<br />
          EVR(4) = 2 / 250 = 0.008 &nbsp; (0.8%)
        </CalcStep>
        <CalcStep number={3}>
          Compute cumulative explained variance:<br />
          After 1 component: 72.0%<br />
          After 2 components: 72.0 + 24.0 = <strong>96.0%</strong><br />
          After 3 components: 96.0 + 3.2 = 99.2%<br />
          After 4 components: 100%
        </CalcStep>
        <CalcStep number={4}>
          Decision: keep <strong>2 components</strong>. They already cover 96% of the
          total variance — 4 features compressed to 2, with almost no loss of information.
          Components 3 and 4 together add only 4%, and likely capture noise.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          For our student exam dataset, λ₁ ≈ 224.5 and λ₂ ≈ 4.6, giving a total of 229.1.
          EVR(1) = 224.5 / 229.1 ≈ <strong>98.0%</strong>. One component is enough — we can
          compress 2 features into 1 number and retain 98% of the variance. That single
          number is a student&apos;s &quot;overall academic score.&quot;
        </p>
      </WorkedExample>

      <ExplanationBox title="The Scree Plot">
        <p>
          A <strong>scree plot</strong> graphs eigenvalues in decreasing order. You&apos;re looking
          for the &quot;elbow&quot; — the point where eigenvalues drop sharply and then flatten out.
          Keep components before the elbow; discard the flat tail. In our 4-feature example
          the elbow is clearly between component 2 (λ = 60) and component 3 (λ = 8).
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The final block completes the from-scratch implementation with the
          explained-variance-ratio calculation and automatic k selection, then shows
          the one-liner scikit-learn equivalent you would use in real projects.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="pca.py"
        caption="Part 4 of 4 — pick k automatically via cumulative explained variance, then the sklearn shortcut."
        code={`# ── (continuing from pca.py Part 3 — eigenvalues and eigenvectors already defined) ─

# ── Step 9: compute explained variance ratio for every component ──────────────
# Each eigenvalue = variance captured by that component.
# Dividing by the total gives the fraction of total variance explained.
total_variance = np.sum(eigenvalues)
evr = eigenvalues / total_variance  # shape: (n_components,)

print("Explained variance ratio per component:", evr)
# e.g. for our 2-D dataset: [0.980, 0.020]

# ── Step 10: cumulative sum to pick k ────────────────────────────────────────
# np.cumsum adds values left-to-right: [0.72, 0.96, 0.992, 1.0] for 4 features.
cumulative_evr = np.cumsum(evr)

# Find the smallest k where cumulative explained variance crosses our threshold.
threshold = 0.95  # 95% is the standard rule of thumb
k_auto = 0
for k_auto, cum in enumerate(cumulative_evr, start=1):
    if cum >= threshold:
        break  # stop as soon as we hit or exceed the target

print("Components needed for", threshold * 100, "% variance:", k_auto)

# ── Step 11: apply the full pipeline end-to-end ───────────────────────────────
# Use k_auto to project the data to the right number of dimensions.
X_reduced = project(X_centred, eigenvectors, k=k_auto)
print("Original shape:", X.shape, "-> Reduced shape:", X_reduced.shape)

# ═══════════════════════════════════════════════════════════════════════════════
# PRACTICAL VERSION: sklearn does everything above in three lines.
# Under the hood it runs the same SVD-based algorithm; use this in real projects.
# ═══════════════════════════════════════════════════════════════════════════════
from sklearn.decomposition import PCA

# n_components=0.95 tells sklearn to keep however many components reach 95% EVR.
pca = PCA(n_components=0.95)
X_sklearn = pca.fit_transform(X)  # centres the data internally

print("sklearn explained variance ratios:", pca.explained_variance_ratio_)
print("sklearn reduced shape:", X_sklearn.shape)
`}
      />

      <ExplanationBox title="What You&apos;ve Learned">
        <p>
          You now have the full PCA pipeline from first principles:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Centre the data</strong> — subtract the mean of each feature.</li>
          <li><strong>Compute the covariance matrix</strong> — captures how every pair of features co-varies.</li>
          <li><strong>Find eigenvectors and eigenvalues</strong> — eigenvectors are the principal component directions; eigenvalues measure the variance each captures.</li>
          <li><strong>Sort by eigenvalue</strong> — rank components from most to least informative.</li>
          <li><strong>Project the data</strong> — dot each centred data point with the top k eigenvectors to get the compressed representation.</li>
          <li><strong>Choose k via explained variance ratio</strong> — keep enough components to hit your target cumulative EVR (typically 95%).</li>
        </ul>
        <p>
          With these tools you can take a dataset with hundreds of correlated features and
          reduce it to a handful of informative dimensions — making your models faster,
          your visualizations possible, and your data cleaner.
        </p>
      </ExplanationBox>
    </div>
  );
}
