'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Two Features Moving Together">
        <p>
          Variance tells us how much a single feature spreads. But PCA lives in a world
          of <em>multiple</em> features, and we need to understand how pairs of features
          move together. That measure is called <strong>covariance</strong>.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Positive covariance</strong> — when one feature is above its mean,
            the other tends to be above its mean too. Math score and physics score are
            a good example: strong students tend to score high on both.
          </li>
          <li>
            <strong>Negative covariance</strong> — when one feature goes up, the other
            tends to go down. Hours spent gaming vs. hours spent studying might look
            like this.
          </li>
          <li>
            <strong>Zero covariance</strong> — the two features are unrelated; knowing
            one tells you nothing about the other.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Covariance of features x and y">
        Cov(x, y) = (1/n) × Σ (xᵢ − x̄)(yᵢ − ȳ)
      </MathFormula>

      <ExplanationBox title="The Covariance Matrix">
        <p>
          When you have two features, you can collect all pairwise covariances into a
          2×2 <strong>covariance matrix</strong>:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px', lineHeight: '1.8' }}>
          C = | Cov(x,x)  Cov(x,y) |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;| Cov(y,x)  Cov(y,y) |
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The diagonal entries are just the variances: Cov(x, x) = Var(x). The
          off-diagonal entries capture how the two features co-vary. Because Cov(x, y)
          = Cov(y, x), the matrix is always symmetric. This symmetry turns out to be
          crucial — it guarantees that the eigenvectors of C are perpendicular to each
          other, which is what makes PCA&apos;s components geometrically clean.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Covariance Step by Step">
        <p>
          Five students have the following math (x) and physics (y) scores:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          Student 1: x=60, y=58 &nbsp; Student 2: x=70, y=72<br />
          Student 3: x=75, y=74 &nbsp; Student 4: x=80, y=79 &nbsp; Student 5: x=90, y=92
        </p>

        <CalcStep number={1}>
          Compute the means: x̄ = (60+70+75+80+90)/5 = 75 &nbsp;&nbsp; ȳ = (58+72+74+79+92)/5 = 375/5 = 75
        </CalcStep>
        <CalcStep number={2}>
          Compute each (xᵢ − x̄)(yᵢ − ȳ):<br />
          Student 1: (60−75)(58−75) = (−15)(−17) = 255<br />
          Student 2: (70−75)(72−75) = (−5)(−3) = 15<br />
          Student 3: (75−75)(74−75) = (0)(−1) = 0<br />
          Student 4: (80−75)(79−75) = (5)(4) = 20<br />
          Student 5: (90−75)(92−75) = (15)(17) = 255
        </CalcStep>
        <CalcStep number={3}>
          Sum the products: 255 + 15 + 0 + 20 + 255 = 545
        </CalcStep>
        <CalcStep number={4}>
          Divide by n = 5: Cov(x, y) = 545 / 5 = <strong>109</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          A covariance of <strong>109</strong> is large and positive, confirming that
          math and physics scores rise and fall together strongly. If we also computed
          Var(x) = 100 (from the last module) and Var(y) ≈ 129, our full covariance
          matrix would be:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          C = | 100  109 |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;| 109  129 |
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This matrix is the raw material that PCA feeds on. In the next module, we&apos;ll
          find the eigenvectors of C — the principal components — and see exactly why
          they point along the directions of maximum variance.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Below we replicate the worked example exactly: build the raw data matrix,
          centre it by subtracting the column means, then call <code>np.cov</code> to
          get the full covariance matrix. Every line is annotated so you can follow the
          maths alongside the code.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="pca.py"
        caption="Part 1 of 4 — centre the data and build the covariance matrix."
        code={`import numpy as np

# ── Dataset: 5 students, 2 features (math score, physics score) ──────────────
# Each row is one student; columns are [math, physics].
X = np.array([
    [60, 58],
    [70, 72],
    [75, 74],
    [80, 79],
    [90, 92],
], dtype=float)

# ── Step 1: compute the column means ─────────────────────────────────────────
# np.mean with axis=0 averages down the rows, giving one mean per feature.
# Result: mean_math = 75.0, mean_physics = 75.0
col_means = np.mean(X, axis=0)

# ── Step 2: centre the data (subtract the mean from every value) ──────────────
# Broadcasting: numpy automatically subtracts col_means from every row.
# After this step the data cloud is centred at the origin, which is
# required before computing variance or covariance.
X_centred = X - col_means

# ── Step 3: build the covariance matrix ──────────────────────────────────────
# np.cov expects features in rows, samples in columns, so we transpose.
# rowvar=False tells numpy our rows are observations (the default is the opposite).
# ddof=0 uses the population formula (divide by n), matching our hand calculation.
C = np.cov(X_centred, rowvar=False, ddof=0)

# C should equal:
#   [[100.  109. ]
#    [109.  129. ]]
# Diagonal = variances; off-diagonal = covariance between math and physics.
print("Covariance matrix:")
print(C)
`}
      />
    </div>
  );
}
