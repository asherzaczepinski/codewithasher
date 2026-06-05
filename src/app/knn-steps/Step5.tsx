'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="From Labels to Numbers">
        <p>
          So far every neighbor has voted for a <em>class label</em> — apple or orange. But what
          if the target is a continuous number instead of a category? Maybe you want to predict
          a fruit&apos;s <strong>price per kilogram</strong> rather than just its type.
        </p>
        <p>
          KNN handles this with one small change: instead of taking the <strong>majority
          label</strong>, take the <strong>average value</strong> of the k nearest neighbors&apos;
          target values. Everything else — computing distances, ranking, selecting k neighbors —
          stays exactly the same.
        </p>
      </ExplanationBox>

      <MathFormula label="KNN Regression Rule">
        ŷ = (1/k) × (y₁ + y₂ + ... + yₖ)
      </MathFormula>

      <ExplanationBox title="Why Averaging Works">
        <p>
          The intuition is identical to classification: similar inputs tend to produce similar
          outputs. If three fruits very close to the mystery fruit sell for $2.10, $2.30, and
          $1.90 per kilogram, a reasonable estimate for the mystery fruit&apos;s price is their
          average — <strong>$2.10/kg</strong>.
        </p>
        <p>
          Like classification, a small k produces a noisy, jagged prediction surface, while a
          large k produces a smoother but potentially underfit surface. The same cross-validation
          approach applies.
        </p>
      </ExplanationBox>

      <WorkedExample title="Predicting Price: Mystery Fruit M = (180, 7)">
        <p>
          We extend our fruit dataset with a price column ($/kg). The labeled data is:
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Fruit</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Weight (g)</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Sweetness</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Price ($/kg)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['A', '170', '7', '2.20'],
              ['B', '160', '6', '1.90'],
              ['C', '270', '4', '1.50'],
              ['D', '280', '5', '1.60'],
              ['E', '175', '8', '2.40'],
            ].map(([id, w, s, p]) => (
              <tr key={id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{id}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{w}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          We already computed all five Euclidean distances in the previous module. The three
          nearest neighbors are <strong>E (5.10)</strong>, <strong>A (10.00)</strong>, and{' '}
          <strong>B (20.02)</strong>.
        </p>

        <CalcStep number={1}>Neighbor E price: $2.40/kg</CalcStep>
        <CalcStep number={2}>Neighbor A price: $2.20/kg</CalcStep>
        <CalcStep number={3}>Neighbor B price: $1.90/kg</CalcStep>
        <CalcStep number={4}>Sum: 2.40 + 2.20 + 1.90 = 6.50</CalcStep>
        <CalcStep number={5}>Average (k = 3): 6.50 / 3 ≈ $2.17/kg</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          KNN regression predicts the mystery fruit will sell for approximately{' '}
          <strong>$2.17 per kilogram</strong>. Notice this is pulled slightly below the
          average of A and E by the cheaper Fruit B — exactly the kind of local averaging
          behavior that makes KNN regression smooth but responsive to nearby values.
        </p>
      </WorkedExample>

      <ExplanationBox title="Weighted Averaging (a Natural Extension)">
        <p>
          Standard KNN regression gives every neighbor equal weight in the average. A common
          refinement is to weight each neighbor by the <em>inverse</em> of its distance — closer
          neighbors count more. The formula becomes:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          ŷ = Σ (yᵢ / dᵢ) / Σ (1 / dᵢ) &nbsp; for i in the k nearest neighbors
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This prevents a slightly farther neighbor from having the same influence as one that
          is almost identical to the new point. Many libraries (including scikit-learn) support
          this via a <code>weights=&apos;distance&apos;</code> parameter.
        </p>
      </ExplanationBox>
    </div>
  );
}
