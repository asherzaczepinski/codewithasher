'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="One Feature Is Rarely Enough">
        <p>
          A 1 400 sq ft house in a desirable neighbourhood with 4 bedrooms will sell for more than
          a 1 400 sq ft house built in 1940 on a busy street. Size alone does not tell the whole
          story. To make better predictions we need to give the model more information.
        </p>
        <p>
          <strong>Multiple linear regression</strong> extends our model to handle many input
          features at once. The math is almost identical — we just have more numbers to multiply.
        </p>
      </ExplanationBox>

      <ExplanationBox title="From a Line to a Hyperplane">
        <p>
          With one feature the model traces a straight line through 2-D space. With two features
          it traces a flat plane through 3-D space. With three or more features the model is a
          <em> hyperplane</em> in high-dimensional space — impossible to visualize, but the algebra
          is the same.
        </p>
        <p>
          We now have a separate weight for every feature. Each weight says how much that feature
          affects the predicted price, holding everything else constant.
        </p>
      </ExplanationBox>

      <MathFormula label="Multiple-feature prediction">
        ŷ = w₁·x₁ + w₂·x₂ + w₃·x₃ + … + wₙ·xₙ + b
      </MathFormula>

      <ExplanationBox title="Compact Notation: The Dot Product">
        <p>
          Writing out every wᵢ·xᵢ quickly becomes unwieldy. We collect all the weights into a
          vector <strong>w</strong> and all the feature values into a vector <strong>x</strong>,
          then use the <em>dot product</em>:
        </p>
      </ExplanationBox>

      <MathFormula label="Vector form of the linear model">
        ŷ = w · x + b
      </MathFormula>

      <ExplanationBox title="What the Dot Product Does">
        <p>
          The dot product multiplies matching pairs — w₁·x₁, w₂·x₂, and so on — and sums the
          results. It is the same operation we used in Module 7 of the Neural Networks course
          (pre-activation). Here we are just applying it to a regression problem.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Training works exactly as before: gradient descent (or the Normal Equation) adjusts
          every weight and the bias to minimize MSE. The gradient formula generalises naturally —
          there is one gradient per weight, each computed from the same residuals.
        </p>
      </ExplanationBox>

      <WorkedExample title="Predicting Price with Three Features">
        <p>
          Our features: x₁ = size (sq ft), x₂ = number of bedrooms, x₃ = age (years, smaller is
          newer). Suppose the model has learned:
        </p>

        <CalcStep number={1}>
          Weights: w₁ = 120 ($/sq ft), w₂ = 8 000 ($/bedroom), w₃ = −500 ($/year of age).
          Bias: b = 30 000.
        </CalcStep>
        <CalcStep number={2}>
          Our house: 1 400 sq ft, 3 bedrooms, 10 years old.
          Feature vector: x = [1400, 3, 10].
        </CalcStep>
        <CalcStep number={3}>
          Size contribution: w₁ · x₁ = 120 × 1 400 = 168 000.
        </CalcStep>
        <CalcStep number={4}>
          Bedrooms contribution: w₂ · x₂ = 8 000 × 3 = 24 000.
        </CalcStep>
        <CalcStep number={5}>
          Age contribution: w₃ · x₃ = −500 × 10 = −5 000.
        </CalcStep>
        <CalcStep number={6}>
          Dot product: 168 000 + 24 000 + (−5 000) = 187 000.
        </CalcStep>
        <CalcStep number={7}>
          Add bias: ŷ = 187 000 + 30 000 = 217 000.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Our multi-feature model predicts <strong>$217 000</strong>. Notice how the negative
          weight on age automatically lowers the price for older homes, while each extra bedroom
          adds a fixed premium. Each weight encodes exactly one piece of domain knowledge that the
          algorithm discovered from the data.
        </p>
      </WorkedExample>

    </div>
  );
}
