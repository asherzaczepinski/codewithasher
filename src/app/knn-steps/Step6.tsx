'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="When Features Live on Different Scales">
        <p>
          KNN measures distance in feature space. If one feature has a range of hundreds (weight
          in grams: 150–300) and another has a range of single digits (sweetness: 4–8), the
          large-range feature will dominate every distance calculation — effectively making the
          small-range feature invisible.
        </p>
        <p>
          In our fruit example, a 90 g weight difference overwhelms a 3-point sweetness
          difference even if sweetness is actually more informative for the classification. The
          algorithm doesn&apos;t know which feature matters more; it just adds up squared
          differences. We have to tell it — by putting all features on the same scale first.
        </p>
      </ExplanationBox>

      <MathFormula label="Min-Max Normalization (scale to [0, 1])">
        x_scaled = (x − x_min) / (x_max − x_min)
      </MathFormula>

      <MathFormula label="Z-Score Standardization (mean 0, std 1)">
        x_scaled = (x − μ) / σ
      </MathFormula>

      <ExplanationBox title="Which Scaler Should You Use?">
        <p>
          <strong>Min-max normalization</strong> compresses every value into [0,&nbsp;1]. It
          preserves the shape of the distribution and works well when you know the feature&apos;s
          hard bounds (e.g., percentages always lie in [0,&nbsp;100]).
        </p>
        <p>
          <strong>Z-score standardization</strong> re-centers around mean 0 and scales by
          standard deviation. It handles outliers better than min-max and is generally the
          default choice when you don&apos;t know the feature&apos;s natural bounds.
        </p>
        <p>
          <strong>Critical rule</strong>: compute the scaling parameters (min, max, μ, σ) on
          the <em>training set only</em>, then apply the same transformation to the validation
          and test sets. Never fit the scaler on test data — that leaks future information.
        </p>
      </ExplanationBox>

      <WorkedExample title="Scaling Our Fruit Features">
        <p>
          Training data ranges: weight ∈ [160, 280], sweetness ∈ [4, 8]. Apply min-max
          normalization, then recompute the distance from mystery fruit M to Fruit C to see
          how scaling changes things.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Scale the mystery fruit M = (180, 7)</p>
        <CalcStep number={1}>weight_scaled = (180 − 160) / (280 − 160) = 20 / 120 ≈ 0.167</CalcStep>
        <CalcStep number={2}>sweetness_scaled = (7 − 4) / (8 − 4) = 3 / 4 = 0.750</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Scale Fruit C = (270, 4)</p>
        <CalcStep number={3}>weight_scaled = (270 − 160) / 120 = 110 / 120 ≈ 0.917</CalcStep>
        <CalcStep number={4}>sweetness_scaled = (4 − 4) / 4 = 0 / 4 = 0.000</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Euclidean distance after scaling</p>
        <CalcStep number={5}>Δweight = 0.167 − 0.917 = −0.750 → (−0.750)² = 0.5625</CalcStep>
        <CalcStep number={6}>Δsweetness = 0.750 − 0.000 = 0.750 → (0.750)² = 0.5625</CalcStep>
        <CalcStep number={7}>d = √(0.5625 + 0.5625) = √1.125 ≈ 1.061</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Before scaling, sweetness contributed almost nothing (3² = 9 vs 90² = 8100). After
          scaling, both features contribute <strong>equally</strong> (0.5625 each). Now the
          algorithm genuinely weighs both dimensions — a meaningful improvement in fairness
          between features.
        </p>
      </WorkedExample>

      <ExplanationBox title="The Curse of Dimensionality">
        <p>
          Adding more features — more dimensions — sounds like it should help. In practice it
          often hurts KNN severely, for a geometric reason called the{' '}
          <strong>curse of dimensionality</strong>.
        </p>
        <p>
          In high dimensions, <em>all points become almost equally far from each other</em>.
          Imagine a unit hypercube in d dimensions. The volume of the cube is 1. To capture
          just 1% of the data points you need a sub-cube whose side length is
          0.01^(1/d). In d&nbsp;=&nbsp;10 that&apos;s 0.01^0.1 ≈ 0.63 — you need to
          stretch 63% of the way along every axis just to find 1% of the data. Your
          &quot;nearest&quot; neighbors are no longer close at all.
        </p>
        <p>
          The practical consequences:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Distances lose meaning</strong> — the ratio of the farthest to nearest neighbor approaches 1 as dimensions grow.</li>
          <li><strong>You need exponentially more data</strong> to maintain the same density in feature space.</li>
          <li><strong>Irrelevant features hurt</strong> — each useless dimension adds noise to every distance calculation.</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Mitigation strategies: feature selection (drop irrelevant features), dimensionality
          reduction (PCA, t-SNE), or switching to a model that handles high dimensions better.
          KNN tends to shine in low-dimensional spaces (roughly 2–20 features) and struggles
          beyond that.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Computational Cost at Prediction Time">
        <p>
          Unlike a trained neural network that just runs a matrix multiply, KNN must scan every
          stored training point during each prediction. With N training examples and d features,
          one prediction costs <strong>O(N × d)</strong> operations. With one million training
          points and 50 features that&apos;s 50 million multiplications per query — slow for
          real-time systems.
        </p>
        <p>
          Approximate solutions exist: <strong>KD-trees</strong> and <strong>ball trees</strong>
          partition space so you only search a relevant subset, reducing average cost to
          O(d log N). Libraries like scikit-learn use these automatically. For very large N or
          high d, approximate nearest-neighbor libraries (FAISS, Annoy, HNSW) trade a small
          accuracy loss for orders-of-magnitude speed gains.
        </p>
      </ExplanationBox>
    </div>
  );
}
