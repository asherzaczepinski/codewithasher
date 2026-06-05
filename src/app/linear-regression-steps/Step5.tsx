'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Do We Have to Iterate?">
        <p>
          Gradient descent works by taking many small steps downhill. It is powerful and general,
          but it raises an obvious question: instead of slowly creeping toward the bottom, can we
          just <em>solve</em> for the exact best w and b in one shot?
        </p>
        <p>
          For linear regression, the answer is <strong>yes</strong>. Because the MSE surface is
          a perfect convex bowl, its minimum has a closed-form algebraic solution. Setting the
          gradient equations to zero and solving gives us the <strong>Normal Equation</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Intuition: Setting the Slope to Zero">
        <p>
          At the very bottom of a bowl, the slope is zero — you are neither going uphill nor
          downhill in any direction. So we take the gradient formulas from Module 4, set them
          equal to zero, and solve for w and b.
        </p>
        <p>
          With a single feature this gives us two equations and two unknowns (w and b), which is
          straightforward to solve. With many features, the same idea is expressed more compactly
          using matrix notation:
        </p>
      </ExplanationBox>

      <MathFormula label="Normal Equation (matrix form)">
        θ = (XᵀX)⁻¹ · Xᵀ · y
      </MathFormula>

      <ExplanationBox title="Reading the Matrix Formula">
        <p>
          <strong>X</strong> is the design matrix — each row is one data point, and the columns
          hold the feature values plus a column of ones (for the bias). If we have n houses and 1
          feature, X has shape n × 2.
        </p>
        <p>
          <strong>y</strong> is the column vector of actual prices, shape n × 1.
        </p>
        <p>
          <strong>θ</strong> (theta) is the column vector of parameters [b, w], which is what we
          are solving for.
        </p>
        <p>
          <strong>Xᵀ</strong> is the transpose of X (rows and columns swapped).
        </p>
        <p>
          <strong>(XᵀX)⁻¹</strong> is the matrix inverse of XᵀX. This is the step that requires
          the most computation — inverting a matrix takes time proportional to the cube of its
          size.
        </p>
      </ExplanationBox>

      <ExplanationBox title="When to Use the Normal Equation vs. Gradient Descent">
        <p>
          Each approach has a sweet spot:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Normal Equation</strong> — one-shot, no learning rate to tune, no convergence
            to wait for. Best when the number of features is small (roughly fewer than 10 000).
            The matrix inversion becomes prohibitively slow with very many features.
          </li>
          <li>
            <strong>Gradient Descent</strong> — scales to millions of features and billions of
            data points. Required when the dataset is too large to fit in memory at once, or when
            you are extending to non-linear models (neural networks) where no closed form exists.
          </li>
        </ul>
        <p>
          In practice, most deep-learning libraries use gradient descent (or faster variants like
          Adam), but the Normal Equation is a beautiful result that shows why linear regression is
          so special: it is one of the rare models where the optimal parameters can be computed
          exactly with a single formula.
        </p>
      </ExplanationBox>

      <WorkedExample title="Solving with the Normal Equation (2 × 2 case)">
        <p>
          With one feature (size x) and a bias, θ = [b, w]. Using just two of our houses to keep
          the arithmetic manageable — House A (x=1000, y=200 000) and House B (x=1500, y=275 000):
        </p>

        <CalcStep number={1}>
          Build X (add a ones column for the bias): X = [[1, 1000], [1, 1500]].
          y = [200 000, 275 000].
        </CalcStep>
        <CalcStep number={2}>
          Compute XᵀX: [[1,1],[1000,1500]] · [[1,1000],[1,1500]]
          = [[2, 2500], [2500, 3 250 000]].
        </CalcStep>
        <CalcStep number={3}>
          Compute Xᵀy: [[1,1],[1000,1500]] · [200 000, 275 000]
          = [475 000, 612 500 000].
        </CalcStep>
        <CalcStep number={4}>
          Invert XᵀX (2×2 formula: swap diagonal, negate off-diagonal, divide by determinant).
          det = 2·3 250 000 − 2500·2500 = 6 500 000 − 6 250 000 = 250 000.
          (XᵀX)⁻¹ = (1/250 000) · [[3 250 000, −2500], [−2500, 2]].
        </CalcStep>
        <CalcStep number={5}>
          θ = (XᵀX)⁻¹ · Xᵀy.
          b = (3 250 000·475 000 − 2500·612 500 000) / 250 000
            = (1 543 750 000 000 − 1 531 250 000 000) / 250 000
            = 12 500 000 000 / 250 000 = 50 000.
          w = (−2500·475 000 + 2·612 500 000) / 250 000
            = (−1 187 500 000 + 1 225 000 000) / 250 000
            = 37 500 000 / 250 000 = 150.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The Normal Equation gives <strong>w = 150, b = 50 000</strong> — exactly the values we
          used throughout the course. No iteration required.
        </p>
      </WorkedExample>

    </div>
  );
}
