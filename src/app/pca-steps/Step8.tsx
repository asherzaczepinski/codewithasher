'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import PCAEigenDemo from '@/components/PCAEigenDemo';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="A Quick Eigenvector Reminder">
        <p>
          A matrix transforms vectors — it stretches, rotates, and squishes them. Most
          vectors get both stretched <em>and</em> rotated by a matrix. But a handful of
          special vectors get <strong>only stretched</strong>, never rotated. Those are
          called <strong>eigenvectors</strong>.
        </p>
        <p>
          Formally, a vector <strong>v</strong> is an eigenvector of matrix <strong>C</strong> if:
        </p>
      </ExplanationBox>

      <MathFormula label="Eigenvector equation">
        C · v = λ · v
      </MathFormula>

      <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 4px' }}>
        Drag the slider to rotate an input vector <strong>v</strong> (blue). The output{' '}
        <strong>C·v</strong> (red) usually points somewhere else — but at a couple of magic
        angles it lines up perfectly. Those are the eigenvectors of our covariance matrix.
      </p>
      <PCAEigenDemo />

      <ExplanationBox title="What λ Means">
        <p>
          The scalar λ (lambda) is the <strong>eigenvalue</strong> paired with eigenvector{' '}
          <strong>v</strong>. It tells you how much the matrix stretches that vector.
          A large λ means the matrix stretches v a lot; a small λ means it barely moves.
        </p>
        <p>
          For the covariance matrix, this has a beautiful interpretation: the eigenvalue
          equals the <strong>variance of the data when projected onto that eigenvector direction</strong>.
          A direction with a large eigenvalue is one where the data spreads out widely.
          A direction with a small eigenvalue is nearly flat.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Principal Components Are Eigenvectors of C">
        <p>
          The <strong>first principal component</strong> is the eigenvector of the covariance
          matrix C with the <em>largest</em> eigenvalue. It points along the direction of
          maximum variance in the data.
        </p>
        <p>
          The <strong>second principal component</strong> is the eigenvector with the
          second-largest eigenvalue — and crucially, because C is symmetric, it is
          automatically <em>perpendicular</em> to the first. It captures the most variance
          among all directions that are orthogonal to the first component.
        </p>
        <p>
          This continues for every dimension: each successive eigenvector is perpendicular
          to all previous ones and explains as much of the remaining variance as possible.
          The eigenvalues decrease monotonically: λ₁ ≥ λ₂ ≥ λ₃ ≥ …
        </p>
      </ExplanationBox>

      <WorkedExample title="Finding the Eigenvalues of Our Covariance Matrix">
        <p>
          Our covariance matrix from the last module was:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          C = | 100  109 |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;| 109  129 |
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          To find eigenvalues we solve det(C − λI) = 0:
        </p>

        <CalcStep number={1}>
          Write out the characteristic equation:<br />
          (100 − λ)(129 − λ) − (109)(109) = 0
        </CalcStep>
        <CalcStep number={2}>
          Expand: λ² − 229λ + (100·129 − 109²) = 0<br />
          = λ² − 229λ + (12900 − 11881) = 0<br />
          = λ² − 229λ + 1019 = 0
        </CalcStep>
        <CalcStep number={3}>
          Apply the quadratic formula:<br />
          λ = (229 ± √(229² − 4·1019)) / 2<br />
          = (229 ± √(52441 − 4076)) / 2<br />
          = (229 ± √48365) / 2<br />
          ≈ (229 ± 219.9) / 2
        </CalcStep>
        <CalcStep number={4}>
          Two eigenvalues:<br />
          λ₁ ≈ (229 + 219.9) / 2 ≈ <strong>224.5</strong> (most variance)<br />
          λ₂ ≈ (229 − 219.9) / 2 ≈ <strong>4.6</strong> (little variance)
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The first eigenvalue is about 49× larger than the second. That tells us there
          is one dominant direction in the data — a &quot;general academic ability&quot; axis
          running diagonally through the math-physics plane. The second direction (roughly
          perpendicular) captures almost nothing. This is exactly the situation where we can
          safely drop from 2D down to 1D and lose very little information.
        </p>
      </WorkedExample>

      <ExplanationBox title="Intuition: What Do These Components Look Like?">
        <p>
          The first eigenvector for our data points diagonally — roughly in the direction
          [1, 1] (normalised: [0.71, 0.71]). That&apos;s the &quot;both scores move together&quot;
          direction. Moving along it captures whether a student is generally strong or weak
          academically.
        </p>
        <p>
          The second eigenvector points in the perpendicular direction, roughly [1, −1]
          (normalised: [0.71, −0.71]). It captures the rare student who is much better
          at math than physics, or vice versa. Because our students are fairly balanced
          across subjects, almost no variance lives in this direction — hence the tiny
          eigenvalue of 4.6.
        </p>
      </ExplanationBox>
    </div>
  );
}
