'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="From High-D to Low-D: Projection">
        <p>
          We now have our principal components — eigenvectors of the covariance matrix.
          The next step is to <strong>project</strong> each data point onto those components.
          Projection is the operation that converts a student&apos;s original 2D coordinates
          (math score, physics score) into a 1D number along the first principal component.
        </p>
        <p>
          Think of it like casting a shadow. Imagine shining a light perpendicular to the
          principal component direction. Each data point casts a shadow onto that line. The
          position of the shadow — a single number — is the projected coordinate. That number
          is the student&apos;s score in the new compressed representation.
        </p>
      </ExplanationBox>

      <MathFormula label="Projection of data point x onto unit vector v">
        score = x · v = x₁v₁ + x₂v₂ + … + xₙvₙ
      </MathFormula>

      <ExplanationBox title="The Dot Product Does the Work">
        <p>
          The projection is just a <strong>dot product</strong> between the data point and
          the principal component vector. Because the eigenvectors from PCA are unit vectors
          (length = 1), the dot product gives exactly the coordinate along that direction —
          no extra scaling needed.
        </p>
        <p>
          If you keep k principal components, each data point gets k new coordinates,
          one per component. A dataset with 1,000 original features becomes a dataset with
          k features — and if k is small (say 10), you&apos;ve compressed by a factor of 100.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Mean-Centering First">
        <p>
          Before projecting, you must <strong>subtract the mean</strong> from each feature.
          This puts the origin at the centre of the data cloud. PCA finds directions of
          variance <em>around the centre</em>, so the projection must be done on centred
          data too. Forgetting to centre is one of the most common PCA mistakes.
        </p>
      </ExplanationBox>

      <WorkedExample title="Projecting Student 5 onto the First Principal Component">
        <p>
          Student 5&apos;s raw scores: math = 90, physics = 92. The feature means are both 75.
          The first principal component (eigenvector for λ₁ ≈ 224.5) is approximately{' '}
          <strong>v₁ = [0.707, 0.707]</strong> — the diagonal &quot;both scores high&quot; direction.
        </p>

        <CalcStep number={1}>
          Centre the data point by subtracting the mean from each feature:<br />
          x_centred = [90 − 75, 92 − 75] = [15, 17]
        </CalcStep>
        <CalcStep number={2}>
          Compute the dot product with v₁ = [0.707, 0.707]:<br />
          score = 15 × 0.707 + 17 × 0.707
        </CalcStep>
        <CalcStep number={3}>
          = 10.605 + 12.019 = <strong>22.624</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Student 5&apos;s compressed representation along the first principal component is
          approximately <strong>22.6</strong>. This positive number confirms they are well
          above average academically. Let&apos;s compare with Student 1 (math = 60, physics = 58):
        </p>

        <CalcStep number={4}>
          Centre Student 1: [60 − 75, 58 − 75] = [−15, −17]
        </CalcStep>
        <CalcStep number={5}>
          Project: score = −15 × 0.707 + (−17) × 0.707 = −10.605 − 12.019 = <strong>−22.6</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Student 1 lands at −22.6, the mirror image of Student 5. The single number along
          PC1 perfectly separates these two students — even though we&apos;ve gone from 2 features
          down to 1. The second principal component (scored along v₂ = [0.707, −0.707])
          would capture whether a student is stronger at math vs. physics, but since all
          five students are fairly balanced, those scores are close to zero and carry
          little information.
        </p>
      </WorkedExample>

    </div>
  );
}
