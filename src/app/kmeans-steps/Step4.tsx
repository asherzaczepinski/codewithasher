'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Assignment Step">
        <p>
          The first half of every K-means iteration is the <strong>assignment step</strong>: look at
          every data point and decide which centroid it belongs to. The rule is dead simple —
          a point goes to whichever centroid is nearest.
        </p>
        <p>
          You compute the Euclidean distance from the point to <em>each</em> centroid, then pick the
          minimum. Repeat for every point in the dataset. When you&apos;re done, every point has a
          cluster label — even though nobody labeled the data in advance.
        </p>
      </ExplanationBox>

      <MathFormula label="Assignment Rule">
        label(p) = argmin_k  d(p, centroid_k)
      </MathFormula>

      <ExplanationBox title="Our Setup">
        <p>
          We have <strong>5 customers</strong> described by (annual spend in $100s, visits/month)
          and <strong>2 centroids</strong> placed at C₁ = (2, 8) and C₂ = (7, 2). These centroids
          were chosen randomly — we&apos;ll talk about better initialisation strategies later.
        </p>
        <p>Our five customers are:</p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>P1 = (1, 7) — low spend, frequent visitor</li>
          <li>P2 = (3, 9) — moderate spend, very frequent visitor</li>
          <li>P3 = (8, 1) — high spend, rare visitor</li>
          <li>P4 = (6, 3) — high spend, occasional visitor</li>
          <li>P5 = (2, 6) — low spend, frequent visitor</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Assigning All 5 Points to Nearest Centroid">
        <p>
          C₁ = (2, 8), C₂ = (7, 2). For each point we compute d to C₁ and d to C₂, then assign.
        </p>

        <CalcStep number={1}>
          P1 = (1, 7):  d(P1, C₁) = √((1−2)² + (7−8)²) = √(1 + 1) = √2 ≈ 1.41
          |  d(P1, C₂) = √((1−7)² + (7−2)²) = √(36 + 25) = √61 ≈ 7.81
          →  Assign P1 to C₁
        </CalcStep>

        <CalcStep number={2}>
          P2 = (3, 9):  d(P2, C₁) = √((3−2)² + (9−8)²) = √(1 + 1) = √2 ≈ 1.41
          |  d(P2, C₂) = √((3−7)² + (9−2)²) = √(16 + 49) = √65 ≈ 8.06
          →  Assign P2 to C₁
        </CalcStep>

        <CalcStep number={3}>
          P3 = (8, 1):  d(P3, C₁) = √((8−2)² + (1−8)²) = √(36 + 49) = √85 ≈ 9.22
          |  d(P3, C₂) = √((8−7)² + (1−2)²) = √(1 + 1) = √2 ≈ 1.41
          →  Assign P3 to C₂
        </CalcStep>

        <CalcStep number={4}>
          P4 = (6, 3):  d(P4, C₁) = √((6−2)² + (3−8)²) = √(16 + 25) = √41 ≈ 6.40
          |  d(P4, C₂) = √((6−7)² + (3−2)²) = √(1 + 1) = √2 ≈ 1.41
          →  Assign P4 to C₂
        </CalcStep>

        <CalcStep number={5}>
          P5 = (2, 6):  d(P5, C₁) = √((2−2)² + (6−8)²) = √(0 + 4) = 2.00
          |  d(P5, C₂) = √((2−7)² + (6−2)²) = √(25 + 16) = √41 ≈ 6.40
          →  Assign P5 to C₁
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          <strong>Result:</strong> Cluster 1 = &#123;P1, P2, P5&#125; (frequent, lower-spend
          customers). Cluster 2 = &#123;P3, P4&#125; (infrequent, higher-spend customers). The
          algorithm has already found a meaningful split — and we haven&apos;t even updated the
          centroids yet.
        </p>
      </WorkedExample>
    </div>
  );
}
