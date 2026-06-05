'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="A Vector Is an Ordered List of Numbers">
        <p>
          The simplest definition: a <strong>vector</strong> is an ordered list of numbers. The word
          &quot;ordered&quot; matters — [3, 1, 4] is a different vector from [4, 1, 3].
        </p>
        <p>
          Each number in the list is called a <strong>component</strong> (or element, or coordinate).
          The total count of components is the vector&apos;s <strong>dimension</strong>. A vector with
          4 components lives in 4-dimensional space and is written as a <em>4-dimensional vector</em>.
        </p>
        <p>
          Our house listing maps perfectly onto this idea. Suppose a house has:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Square footage: <strong>1 400</strong></li>
          <li>Bedrooms: <strong>3</strong></li>
          <li>Bathrooms: <strong>2</strong></li>
          <li>Distance to school (km): <strong>0.8</strong></li>
        </ul>
        <p>
          We write that house as the vector <strong>h = [1400, 3, 2, 0.8]</strong>. Every distinct house
          is a different point in 4-dimensional feature space. The model&apos;s job is to learn which
          regions of that space correspond to high or low prices.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Geometric Picture: Arrow in Space">
        <p>
          For vectors with 2 or 3 components we can draw them as <strong>arrows starting at the origin</strong>.
          The components tell us how far to travel along each axis. The arrow has two properties that completely
          describe it: <strong>direction</strong> (which way it points) and <strong>magnitude</strong> (how long it is).
        </p>
        <p>
          Two arrows with the same direction and length are the same vector — it doesn&apos;t matter where
          you draw them. This geometric view makes vector addition and the dot product intuitive, as we&apos;ll
          see in the next modules.
        </p>
        <p>
          For higher-dimensional vectors like our 4D house vector, we can&apos;t draw them, but the algebra
          works identically. Geometry gives us intuition; algebra scales to any number of dimensions.
        </p>
      </ExplanationBox>

      <MathFormula label="Magnitude (length) of a vector">
        ||v|| = sqrt( v₁² + v₂² + v₃² + ... + vₙ² )
      </MathFormula>

      <ExplanationBox title="Why Magnitude Matters">
        <p>
          The magnitude (also called the <strong>norm</strong> or <strong>length</strong>) of a vector is
          the straight-line distance from the origin to the tip of the arrow. It comes directly from the
          Pythagorean theorem extended to n dimensions.
        </p>
        <p>
          In ML, magnitude appears constantly: when we <em>normalise</em> a vector (divide by its magnitude
          to get a unit vector of length 1), when we measure how similar two vectors are, and when we
          compute distances between data points.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing the Magnitude of Our House Vector">
        <p>
          Let&apos;s compute the magnitude of a simplified 2-feature house vector so the arithmetic stays
          clean. Suppose we only track square footage and distance: <strong>h = [1400, 0.8]</strong>.
        </p>
        <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
          (In practice we would first normalise features to similar scales — a topic for a data-preprocessing
          course — but the formula is the same regardless.)
        </p>

        <CalcStep number={1}>Write out the formula: ||h|| = sqrt( h₁² + h₂² )</CalcStep>
        <CalcStep number={2}>Square each component: 1400² = 1 960 000 and 0.8² = 0.64</CalcStep>
        <CalcStep number={3}>Sum the squares: 1 960 000 + 0.64 = 1 960 000.64</CalcStep>
        <CalcStep number={4}>Take the square root: sqrt(1 960 000.64) ≈ 1400.0002</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The magnitude is approximately <strong>1 400</strong>. The tiny 0.8 distance component barely
          contributes compared to the huge 1 400 footage component — which is exactly why practitioners
          normalise features before training. Without normalisation, large-scale features dominate.
        </p>
      </WorkedExample>

    </div>
  );
}
