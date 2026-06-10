'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="The Point: Turning Things Into Numbers">
        <p>
          A computer can&apos;t think about &quot;a house&quot; or &quot;a customer&quot; or &quot;a photo.&quot;
          It can only do one thing: <strong>arithmetic on numbers</strong>. So before any machine learning
          can happen, we have to turn the real-world thing into a list of numbers. <strong>That list is a vector.</strong>
          That is the entire point of this course — and the reason linear algebra sits underneath every ML model.
        </p>
        <p>
          A house becomes <code>[1400, 3, 2, 0.8]</code> (size, bedrooms, bathrooms, distance to school).
          A customer becomes a list of their purchases. A photo becomes a list of pixel brightnesses.
          Once the thing is a vector, the questions we care about all become arithmetic:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>&quot;Which two houses are most <strong>similar</strong>?&quot; → compare their vectors.</li>
          <li>&quot;<strong>Combine</strong> these data points&quot; → add their vectors.</li>
          <li>&quot;<strong>Predict</strong> the price&quot; → multiply the vector by learned weights.</li>
        </ul>
        <p>
          Vectors aren&apos;t abstract math for its own sake. They are simply <em>how we hand real things to a
          computer</em> so it can measure, combine, and learn from them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Example, Used on Purpose">
        <p>
          To keep every idea concrete, this whole course follows <strong>one running example: a house listing</strong>.
          We reuse it deliberately so the numbers never feel random — when you see <code>[1400, 3, 2, 0.8]</code>
          later, you already know exactly what each number means. The point is always the operation, not the house.
        </p>
        <p>
          A single house is a <strong>vector</strong> (one row of numbers). A thousand houses stacked together
          form a <strong>matrix</strong> (a grid of numbers). Everything in this course is built on those two
          objects and the handful of operations you can do with them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Course Covers">
        <p>
          <strong>Part 1 — Vectors:</strong> what a vector is geometrically and as a list of features;
          how to add, subtract, and scale vectors; the dot product and why it measures similarity; how a
          neural network neuron is literally a dot product.
        </p>
        <p>
          <strong>Part 2 — Matrices:</strong> grids of numbers and their shape notation; the rule of matrix
          multiplication and why it generalises the dot product; special matrices (identity, transpose, inverse)
          that every practitioner encounters daily; eigenvectors and eigenvalues as a preview of dimensionality
          reduction and PCA.
        </p>
        <p>
          Each module contains real calculations you can follow step by step — not just formulas, but the
          arithmetic behind them, using our house-listing example. Let&apos;s start.
        </p>
      </ExplanationBox>
    </div>
  );
}
