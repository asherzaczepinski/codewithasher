'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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
        <p>
          In Python with NumPy this is simply:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          y_hat = np.dot(w, x) + b
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

      <ExplanationBox title="In Python">
        <p>
          We generalise <code>predict</code> and <code>train</code> to handle any number of
          features. The only change is replacing the scalar <code>w * x</code> with{' '}
          <code>np.dot(X, w)</code> — everything else (loss, gradients, update rule) stays
          identical. This is the complete, working implementation of linear regression.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="linear_regression.py"
        caption="The complete implementation: predict and train now work for any number of features — the dot product does all the heavy lifting."
        code={`# ── linear_regression.py — COMPLETE MULTI-FEATURE VERSION ───────────────────
# We generalise every function from the earlier modules so that w is now a
# VECTOR of weights, one per feature, instead of a single scalar.

import numpy as np

def predict(X, w, b):
    # X : 2-D array, shape (n_samples, n_features) — each row is one house
    # w : 1-D array, shape (n_features,)           — one weight per feature
    # b : scalar bias
    #
    # np.dot(X, w) multiplies each row of X by w element-wise, then sums.
    # For a single house x = [1400, 3, 10] and w = [120, 8000, -500]:
    #   dot = 120*1400 + 8000*3 + (-500)*10 = 168000 + 24000 - 5000 = 187000
    return np.dot(X, w) + b   # shape (n_samples,) — one prediction per house


def mean_squared_error(predictions, targets):
    # Unchanged from Module 3 — works on any shape because numpy broadcasts.
    return ((targets - predictions) ** 2).mean()


def train(X, y, lr=1e-10, epochs=20_000):
    # X : 2-D feature matrix  (n_samples, n_features)
    # y : 1-D target vector   (n_samples,)
    n, p = X.shape              # n houses, p features

    w = np.zeros(p)             # initialise all weights to 0 (one per feature)
    b = 0.0

    for epoch in range(epochs):
        preds     = predict(X, w, b)
        residuals = y - preds            # shape (n,)

        # Gradient w.r.t. each weight: (-2/n) * X^T @ residuals
        # X.T @ residuals = [sum(x_j * residual) for each feature j]
        # This is the vectorised form of the scalar formula from Module 4.
        dw = (-2 / n) * (X.T @ residuals)   # shape (p,) — one gradient per feature
        db = (-2 / n) * residuals.sum()     # scalar — same as before

        w = w - lr * dw
        b = b - lr * db

        if epoch % 5_000 == 0:
            loss = mean_squared_error(preds, y)
            print(f"epoch {epoch:>6}  loss={loss:>15,.0f}  w={w}  b={b:.1f}")

    return w, b


# ── 3-feature dataset: size (sq ft), bedrooms, age (years) ───────────────────
X_multi = np.array([
    [1000, 2, 20],   # House A
    [1500, 3, 10],   # House B
    [2000, 4,  5],   # House C
    [2500, 5,  2],   # House D
], dtype=float)

y_multi = np.array([200_000.0, 275_000.0, 360_000.0, 430_000.0])

w_multi, b_multi = train(X_multi, y_multi)

# Predict a new house: 1400 sq ft, 3 bedrooms, 10 years old
new_house = np.array([1400.0, 3.0, 10.0])
price = predict(new_house, w_multi, b_multi)
print(f"Predicted price for new house: {price:,.0f}")
# The model has learned a weight for EACH feature automatically from the data.`}
      />
    </div>
  );
}
