'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What Does &quot;Nearest&quot; Mean?">
        <p>
          KNN&apos;s entire job depends on one question: which stored examples are closest to the
          new point? To answer that, we need a way to measure distance between two points in
          feature space.
        </p>
        <p>
          We&apos;ll cover the two most common distance metrics. Both take two points —
          call them <strong>P = (p₁, p₂)</strong> and <strong>Q = (q₁, q₂)</strong> — and
          return a single number representing how far apart they are.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Euclidean Distance">
        <p>
          Euclidean distance is the straight-line distance between two points — the one you
          learned with the Pythagorean theorem. If you plotted the two fruits on a graph and
          stretched a ruler between them, you&apos;d get the Euclidean distance.
        </p>
        <p>
          It&apos;s the most natural sense of &quot;how far apart&quot; and works well when
          features are continuous and measured on similar scales.
        </p>
      </ExplanationBox>

      <MathFormula label="Euclidean Distance">
        d(P, Q) = √((p₁ − q₁)² + (p₂ − q₂)²)
      </MathFormula>

      <ExplanationBox title="Manhattan Distance">
        <p>
          Manhattan distance (also called &quot;taxicab&quot; distance) adds up the absolute
          differences along each axis separately — like navigating a grid of city blocks where you
          can only move horizontally or vertically, never diagonally.
        </p>
        <p>
          It is less sensitive to large differences in a single feature, making it useful when
          outliers in one dimension should not dominate the distance calculation.
        </p>
      </ExplanationBox>

      <MathFormula label="Manhattan Distance">
        d(P, Q) = |p₁ − q₁| + |p₂ − q₂|
      </MathFormula>

      <ExplanationBox title="What Distance Means for Features">
        <p>
          Features with large numeric ranges will dominate the distance calculation. If weight
          ranges from 150 to 300 g but sweetness only ranges from 4 to 8, a 1-point sweetness
          difference is swamped by even a small weight difference. This is why feature scaling
          matters — we&apos;ll address it in the final module. For now, we&apos;ll work with raw
          values to build intuition.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Both Distances: Mystery Fruit vs Fruit A">
        <p>
          Our mystery fruit is <strong>M = (180, 7)</strong> (weight 180 g, sweetness 7).
          Fruit A is <strong>A = (170, 7)</strong>. Let&apos;s compute both distances.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Euclidean Distance</p>
        <CalcStep number={1}>Difference in weight: 180 − 170 = 10</CalcStep>
        <CalcStep number={2}>Difference in sweetness: 7 − 7 = 0</CalcStep>
        <CalcStep number={3}>Square each: 10² = 100, 0² = 0</CalcStep>
        <CalcStep number={4}>Sum: 100 + 0 = 100</CalcStep>
        <CalcStep number={5}>Square root: √100 = 10.00</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Manhattan Distance</p>
        <CalcStep number={6}>|180 − 170| = 10</CalcStep>
        <CalcStep number={7}>|7 − 7| = 0</CalcStep>
        <CalcStep number={8}>Sum: 10 + 0 = 10.00</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Both metrics agree: Fruit A is <strong>10 units</strong> away from the mystery fruit.
          The two distances happen to be equal here because the difference lives entirely along
          one axis — on a grid, the straight-line and block-walking paths are identical when you
          never need to turn a corner.
        </p>
      </WorkedExample>

      <WorkedExample title="Computing Both Distances: Mystery Fruit vs Fruit C">
        <p>
          Now compare the mystery fruit <strong>M = (180, 7)</strong> against Fruit C{' '}
          <strong>C = (270, 4)</strong>, an orange.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Euclidean Distance</p>
        <CalcStep number={1}>Difference in weight: 180 − 270 = −90</CalcStep>
        <CalcStep number={2}>Difference in sweetness: 7 − 4 = 3</CalcStep>
        <CalcStep number={3}>Square each: (−90)² = 8100, 3² = 9</CalcStep>
        <CalcStep number={4}>Sum: 8100 + 9 = 8109</CalcStep>
        <CalcStep number={5}>Square root: √8109 ≈ 90.05</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Manhattan Distance</p>
        <CalcStep number={6}>|180 − 270| = 90</CalcStep>
        <CalcStep number={7}>|7 − 4| = 3</CalcStep>
        <CalcStep number={8}>Sum: 90 + 3 = 93.00</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Fruit C is roughly <strong>90 units</strong> away — much farther than Fruit A&apos;s
          10 units. Intuitively that makes sense: the mystery fruit weighs 180 g (apple-like),
          not 270 g (orange-like). Next, we&apos;ll use all five distances together to cast a vote.
        </p>
      </WorkedExample>

    </div>
  );
}
