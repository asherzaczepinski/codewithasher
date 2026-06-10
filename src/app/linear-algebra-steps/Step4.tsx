'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import VectorPlot from '@/components/VectorPlot';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Multiplying Two Vectors Into One Number">
        <p>
          <strong>The point:</strong> the dot product is how a computer answers &quot;how much do these two things
          agree?&quot; with a single number. It is the one operation behind search results, recommendations, and
          every neuron in a neural network — which is why it&apos;s worth slowing down for.
        </p>
        <p>
          Addition and scalar multiplication produce new vectors. The <strong>dot product</strong> does
          something different: it takes two vectors of the same length and collapses them into a{' '}
          <em>single number</em>. That number encodes how much the two vectors &quot;agree&quot; with
          each other — how strongly they point in the same direction.
        </p>
        <p>
          The mechanics are simple: multiply each pair of matching components, then add all the products.
        </p>
      </ExplanationBox>

      <MathFormula label="Dot Product (algebraic definition)">
        a · b = a₁b₁ + a₂b₂ + ... + aₙbₙ
      </MathFormula>

      <MathFormula label="Dot Product (geometric definition)">
        a · b = ||a|| · ||b|| · cos(θ)
      </MathFormula>

      <ExplanationBox title="What the Geometric Formula Tells Us">
        <p>
          The two formulas are equivalent — they always give the same answer. The geometric form reveals
          the <em>meaning</em>: the dot product depends on the angle θ between the two vectors.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>θ = 0° (same direction):</strong> cos(0) = 1 → dot product is maximally positive. The vectors agree completely.</li>
          <li><strong>θ = 90° (perpendicular):</strong> cos(90°) = 0 → dot product is zero. The vectors are &quot;unrelated.&quot;</li>
          <li><strong>θ = 180° (opposite directions):</strong> cos(180°) = −1 → dot product is maximally negative. The vectors disagree completely.</li>
        </ul>
        <p>
          This makes the dot product the canonical measure of <strong>similarity</strong> between two
          vectors. &quot;Cosine similarity&quot; in search engines and recommender systems is literally
          the dot product of normalised vectors.
        </p>
        <VectorPlot
          arrows={[
            { x: 4, y: 1, color: '#2563eb', label: 'a' },
            { x: 1, y: 4, color: '#16a34a', label: 'b' },
          ]}
          caption="The dot product depends on the angle θ between a and b. A small angle (vectors agreeing) gives a large positive value; at 90° it is exactly zero; past 90° it turns negative."
        />
      </ExplanationBox>

      <ExplanationBox title="The Dot Product Powers Every Neuron">
        <p>
          Recall from the Neural Networks course: a neuron multiplies each input by a weight and sums
          the results. Written out for a house with 4 features:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          z = sqft×w₁ + beds×w₂ + baths×w₃ + dist×w₄ + bias
        </p>
        <p>
          The first four terms are <em>exactly</em> the dot product of the input vector and the weight
          vector: <strong>h · w</strong>. The neuron is asking: &quot;how much does this house&apos;s
          feature profile align with the pattern my weights encode?&quot; A high dot product means strong
          alignment; the neuron fires. A near-zero dot product means the house doesn&apos;t match
          the pattern; the neuron stays quiet.
        </p>
        <p>
          Every layer in every neural network is computing dot products, thousands of times per forward
          pass. Linear algebra is not a metaphor for ML — it <em>is</em> ML.
        </p>
      </ExplanationBox>

      <WorkedExample title="Dot Product: House Features vs. Learned Weights">
        <p>
          Suppose our model has learned the following weight vector for predicting house price
          (higher weight = more important feature):
        </p>
        <ul style={{ lineHeight: '1.9', marginBottom: '0.75rem' }}>
          <li><strong>h = [1400, 3, 2, 0.8]</strong> — house vector (sqft, beds, baths, km-to-school)</li>
          <li><strong>w = [0.5, 10, 8, −15]</strong> — weight vector (learned by training)</li>
        </ul>
        <p>
          The weight signs tell a story: sqft and bedrooms and bathrooms push the price up (positive
          weights); being far from a school pushes it down (negative weight on distance).
          Let&apos;s compute h · w:
        </p>

        <CalcStep number={1}>sqft contribution: 1400 × 0.5 = 700</CalcStep>
        <CalcStep number={2}>beds contribution: 3 × 10 = 30</CalcStep>
        <CalcStep number={3}>baths contribution: 2 × 8 = 16</CalcStep>
        <CalcStep number={4}>distance contribution: 0.8 × (−15) = −12</CalcStep>
        <CalcStep number={5}>Sum all contributions: 700 + 30 + 16 + (−12) = 734</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The dot product is <strong>734</strong>. Before adding a bias and passing through an activation
          function, this is the neuron&apos;s raw signal for House 1. A larger house farther from a school
          would produce a different dot product — and the model would rank it accordingly.
        </p>
      </WorkedExample>

    </div>
  );
}
