'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import VectorPlot from '@/components/VectorPlot';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Matrices as Transformations">
        <p>
          Every matrix can be thought of as a <strong>function that transforms vectors</strong>.
          Multiply a vector v by matrix A and you get a new vector Av — rotated, stretched, sheared,
          or some combination of all three. Different matrices encode different geometric transformations.
        </p>
        <p>
          Most input vectors get their direction changed by this transformation. But for every matrix,
          there exist special vectors whose direction is <em>completely unchanged</em> — they get
          stretched or shrunk, but they keep pointing the same way. These are called{' '}
          <strong>eigenvectors</strong>, and the stretch factor is called an <strong>eigenvalue</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="The eigenvector equation">
        A · v = λ · v
      </MathFormula>

      <ExplanationBox title="Unpacking A·v = λ·v">
        <p>
          Read this equation carefully: applying matrix A to vector v (left side) produces exactly
          the same result as multiplying v by the scalar λ (right side). In other words, A&apos;s complex
          multi-dimensional transformation simplifies to a simple scaling along the direction of v.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>v</strong> is the <em>eigenvector</em> — a non-zero vector that the matrix only stretches, never rotates.</li>
          <li><strong>λ</strong> (lambda) is the <em>eigenvalue</em> — the scalar that tells us by how much v is stretched.</li>
          <li>If λ = 2, the transformation doubles the length of v. If λ = −1, it flips the direction. If λ = 0, v collapses to the zero vector.</li>
        </ul>
        <p>
          Every n×n matrix has exactly n eigenvalues (counting multiplicities, possibly complex).
          Finding them requires solving det(A − λI) = 0, which produces a degree-n polynomial
          in λ. For 2×2 matrices this is a quadratic; for larger matrices, numerical methods
          are used in practice.
        </p>
        <VectorPlot
          arrows={[
            { x: 4, y: 4, color: '#94a3b8', dashed: true, label: 'A·v = 4v' },
            { x: 1, y: 1, color: '#2563eb', label: 'v (eigenvector)' },
            { x: 1, y: 0, color: '#16a34a', label: 'u' },
            { x: 3, y: 1, color: '#d63384', label: 'A·u' },
          ]}
          caption="For A = [[3, 1], [1, 3]]: the eigenvector v = [1, 1] only gets stretched — A·v = [4, 4] stays on the same line. A non-eigenvector u = [1, 0] gets rotated off its original direction to A·u = [3, 1]."
        />
      </ExplanationBox>

      <WorkedExample title="Verifying an Eigenvector by Hand">
        <p>
          Let&apos;s verify that v = [1, 1] is an eigenvector of the matrix A below, and find λ.
          Imagine A is a covariance matrix computed from our house dataset:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '16px', borderRadius: '6px', margin: '0.75rem 0', lineHeight: '2.2' }}>
          A = [ 3 &nbsp; 1 ]<br />
          &nbsp;&nbsp;&nbsp;&nbsp;[ 1 &nbsp; 3 ]<br />
          <br />
          v = [ 1 ]<br />
          &nbsp;&nbsp;&nbsp;&nbsp;[ 1 ]
        </p>

        <CalcStep number={1}>Compute A·v — row 1: (3×1) + (1×1) = 3 + 1 = 4</CalcStep>
        <CalcStep number={2}>Row 2: (1×1) + (3×1) = 1 + 3 = 4</CalcStep>
        <CalcStep number={3}>So A·v = [4, 4]</CalcStep>
        <CalcStep number={4}>Can we write [4, 4] = λ · [1, 1]? Yes — with λ = 4.</CalcStep>
        <CalcStep number={5}>Check: 4 · [1, 1] = [4, 4] ✓ — direction unchanged, length multiplied by 4.</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The vector [1, 1] points equally in both directions — it is the direction of maximum variance
          in A. The eigenvalue 4 tells us the variance (spread) along that direction is 4. This is
          not a coincidence: the other eigenvector is [1, −1] with eigenvalue 2, the direction of
          second-most variance.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why ML Cares: A Preview of PCA">
        <p>
          Our house dataset has 4 features. Plotted in 4-dimensional space, those houses form a cloud
          of points. The cloud has certain directions along which it is spread out a lot (high variance)
          and other directions along which it is nearly flat (low variance).
        </p>
        <p>
          <strong>Principal Component Analysis (PCA)</strong> finds the eigenvectors of the
          data&apos;s covariance matrix. Each eigenvector is a <em>principal component</em> — a
          direction of variance in the data. The corresponding eigenvalue tells us how much variance
          lies in that direction.
        </p>
        <p>
          By keeping only the eigenvectors with the largest eigenvalues (the directions of greatest
          spread), we can project our 4D house data onto 2D while retaining most of the information.
          This is <strong>dimensionality reduction</strong>: fewer features, easier training, less
          overfitting — all powered by eigendecomposition.
        </p>
        <p>
          The same idea underlies <strong>SVD</strong> (Singular Value Decomposition), which
          decomposes any matrix into eigenvector-like components and powers everything from image
          compression to the recommendation engines behind streaming services.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You Now Speak the Language of ML">
        <p>
          You&apos;ve covered the full foundation: vectors represent data points, matrices represent
          datasets and transformations, matrix multiplication powers every neural network layer,
          and eigenvectors reveal the intrinsic geometry hidden inside data.
        </p>
        <p>
          Every time you read a machine learning paper and encounter an expression like{' '}
          <em>&quot;the weight matrix W ∈ ℝ^(d×h)&quot;</em> or{' '}
          <em>&quot;the leading eigenvectors of the covariance matrix&quot;</em>, you now have
          the tools to parse it. The language of ML is linear algebra — and you speak it.
        </p>
      </ExplanationBox>
    </div>
  );
}
