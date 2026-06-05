'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Representing a Cluster With Its Center">
        <p>
          K-means represents each cluster by a single point called its <strong>centroid</strong> —
          the cluster&apos;s center of mass. Instead of keeping track of every member of a cluster,
          you just track one number per feature: the average position of all the members.
        </p>
        <p>
          Think of it like describing a city by its geographic center. You lose some detail, but you
          capture the essential location. The centroid is the algorithm&apos;s summary of
          &quot;where this group lives&quot; in the data.
        </p>
        <p>
          In our customer example each point has two features — annual spend and visit frequency —
          so each centroid is also a pair of numbers: (average spend, average visits) for all
          customers in that cluster.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Measuring Similarity With Distance">
        <p>
          K-means decides which cluster a point belongs to by asking: <em>which centroid is
          closest?</em> Closer means more similar. So we need a way to measure distance between two
          points in 2D space.
        </p>
        <p>
          We use <strong>Euclidean distance</strong> — the straight-line distance you would measure
          with a ruler. It comes directly from the Pythagorean theorem: the distance is the square
          root of the sum of squared differences across every feature.
        </p>
      </ExplanationBox>

      <MathFormula label="Euclidean Distance (2D)">
        d(A, B) = √((x₂ − x₁)² + (y₂ − y₁)²)
      </MathFormula>

      <ExplanationBox title="Reading the Formula">
        <p>
          For two points A = (x₁, y₁) and B = (x₂, y₂):
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>(x₂ − x₁)</strong> — how far apart they are horizontally (difference in spend)</li>
          <li><strong>(y₂ − y₁)</strong> — how far apart they are vertically (difference in visits)</li>
          <li><strong>Square each</strong> — makes differences positive and penalises large gaps more</li>
          <li><strong>Sum and square-root</strong> — combines both gaps into one straight-line distance</li>
        </ul>
        <p>
          This extends naturally to any number of features: just add more squared-difference terms
          under the square root. K-means works in any number of dimensions.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Distance Between Two Customers">
        <p>
          Customer A spends $300/year and visits 2 times/month → point (3, 2) on our scaled axes.
          Centroid C₁ sits at (2, 5). How far apart are they?
        </p>

        <CalcStep number={1}>Write the points: A = (3, 2), C₁ = (2, 5)</CalcStep>
        <CalcStep number={2}>Difference in spend: 3 − 2 = 1</CalcStep>
        <CalcStep number={3}>Square it: 1² = 1</CalcStep>
        <CalcStep number={4}>Difference in visits: 2 − 5 = −3</CalcStep>
        <CalcStep number={5}>Square it: (−3)² = 9</CalcStep>
        <CalcStep number={6}>Sum: 1 + 9 = 10</CalcStep>
        <CalcStep number={7}>Square root: √10 ≈ 3.16</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The distance from Customer A to centroid C₁ is <strong>≈ 3.16 units</strong>. We&apos;d
          repeat this calculation for every other centroid and assign the customer to whichever one
          gives the smallest result. That&apos;s the entire assignment step — which we&apos;ll work
          through in full next.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          NumPy lets us express the Euclidean distance formula in one readable line.
          This function is the building block every other part of K-means will call.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="kmeans.py"
        caption="euclidean() is the only distance function the whole implementation needs."
        code={`import numpy as np

# ------------------------------------------------------------------
# DISTANCE HELPER
# Every K-means decision (assign a point, move a centroid) ultimately
# reduces to: how far apart are these two points?  We centralise that
# question in one tiny function so we never repeat the arithmetic.
# ------------------------------------------------------------------

def euclidean(a, b):
    # a and b are 1-D NumPy arrays, one per data point or centroid.
    # np.subtract gives us the element-wise difference vector.
    diff = np.subtract(a, b)        # e.g. [3,2] - [2,5] = [1,-3]

    # Square every element so negative differences become positive
    # and large gaps are penalised more than small ones.
    squared = diff ** 2             # [1, 9]

    # Sum the squared differences, then take the square root.
    # That is exactly the Pythagorean theorem generalised to N dims.
    return np.sqrt(np.sum(squared)) # sqrt(1+9) = sqrt(10) ~= 3.16


# Quick sanity-check matching the worked example above:
a = np.array([3, 2])   # Customer A  (spend=$300, visits=2/month)
c1 = np.array([2, 5])  # Centroid C1
print(euclidean(a, c1))  # Expected: ~3.16`}
      />
    </div>
  );
}
