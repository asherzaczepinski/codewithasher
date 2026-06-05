'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="How Wrong Are We?">
        <p>
          Once we have a line — some values of w and b — we need a way to measure how well it fits
          the data. Without a measurement of error, we have no way to tell whether one line is
          better than another, and no way to improve.
        </p>
        <p>
          For each data point, we compare the <em>actual</em> price the house sold for with the
          price our model <em>predicted</em>. The difference is called a <strong>residual</strong>.
        </p>
      </ExplanationBox>

      <MathFormula label="Residual for one data point">
        residualᵢ = yᵢ − ŷᵢ
      </MathFormula>

      <ExplanationBox title="Why We Square the Residuals">
        <p>
          A positive residual means we predicted too low; a negative residual means we predicted
          too high. If we simply added all the residuals together, the positives and negatives
          would cancel and a terrible line could look perfect on paper.
        </p>
        <p>
          Squaring each residual solves both problems at once:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>All errors become positive.</strong> Whether we were $20 000 too high or
            $20 000 too low, the squared error is the same: 400 000 000. Sign no longer matters.
          </li>
          <li>
            <strong>Big errors are punished more than small errors.</strong> A residual of 2 squared
            is 4. A residual of 10 squared is 100. Squaring makes the algorithm fight hardest
            against the worst mistakes.
          </li>
        </ul>
        <p>
          We then take the <em>mean</em> (average) of all those squared residuals. The result is
          called <strong>Mean Squared Error</strong>, or MSE.
        </p>
      </ExplanationBox>

      <MathFormula label="Mean Squared Error (MSE)">
        MSE = (1/n) · Σᵢ (yᵢ − ŷᵢ)²
      </MathFormula>

      <ExplanationBox title="Reading the Formula">
        <p>
          <strong>n</strong> is the number of data points (houses in our dataset).
        </p>
        <p>
          <strong>yᵢ</strong> is the actual sale price of house i.
        </p>
        <p>
          <strong>ŷᵢ</strong> is the price our model predicted for house i, computed as
          w · xᵢ + b.
        </p>
        <p>
          <strong>Σ</strong> means &quot;add up across all i from 1 to n.&quot;
        </p>
        <p>
          Dividing by n gives the <em>average</em> squared error per house, so the score does not
          grow just because we have more data.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing MSE for Our Four Houses">
        <p>
          We use w = 150, b = 50 000. Our four houses from Module 1 are:
        </p>

        <CalcStep number={1}>
          House A: x = 1 000, actual y = 200 000. Predicted: 150 × 1 000 + 50 000 = 200 000.
          Residual = 200 000 − 200 000 = 0. Squared: 0.
        </CalcStep>
        <CalcStep number={2}>
          House B: x = 1 500, actual y = 275 000. Predicted: 150 × 1 500 + 50 000 = 275 000.
          Residual = 275 000 − 275 000 = 0. Squared: 0.
        </CalcStep>
        <CalcStep number={3}>
          House C: x = 2 000, actual y = 360 000. Predicted: 150 × 2 000 + 50 000 = 350 000.
          Residual = 360 000 − 350 000 = 10 000. Squared: 100 000 000.
        </CalcStep>
        <CalcStep number={4}>
          House D: x = 2 500, actual y = 430 000. Predicted: 150 × 2 500 + 50 000 = 425 000.
          Residual = 430 000 − 425 000 = 5 000. Squared: 25 000 000.
        </CalcStep>
        <CalcStep number={5}>
          Sum of squared residuals: 0 + 0 + 100 000 000 + 25 000 000 = 125 000 000.
        </CalcStep>
        <CalcStep number={6}>
          MSE = 125 000 000 ÷ 4 = 31 250 000.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Our MSE is <strong>31 250 000</strong> (in squared dollars). That sounds large, but
          remember the units are dollars² — we squared the dollar errors. What matters is that a
          perfect line would give MSE = 0, and any improvement in w or b that lowers the MSE is a
          step in the right direction. The next module shows how to find those improvements
          automatically.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We add a <code>mean_squared_error</code> function to our growing file. It takes a list
          of predictions and a list of true prices and returns one number — the average squared
          error — which is exactly what gradient descent will minimise in the next step.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="linear_regression.py"
        caption="Adding the loss function: MSE turns many individual errors into one number the optimiser can chase downhill."
        code={`# ── continuing linear_regression.py ──────────────────────────────────────────
# predict() was defined in Module 2.  Here we add the loss function that tells
# us how badly the current w and b are performing.

import numpy as np   # numpy gives us fast array maths; plain Python lists work too

def mean_squared_error(predictions, targets):
    # predictions : array of ŷ values our model produced
    # targets     : array of true y values from the dataset
    # Returns     : a single float — average squared error across all houses
    errors = targets - predictions          # residuals: positive = under-predicted
    squared = errors ** 2                   # square every residual (makes all positive)
    return squared.mean()                   # divide by n to get the average


# ── Quick sanity check with the 4-house running example ──────────────────────
sizes   = np.array([1000, 1500, 2000, 2500])   # square footage of each house
actuals = np.array([200_000, 275_000, 360_000, 430_000])  # real sale prices

w, b = 150, 50_000                             # the "decent" parameters from Module 2
preds = predict(sizes, w, b)                   # [200000, 275000, 350000, 425000]

loss = mean_squared_error(preds, actuals)
print(f"MSE with w={w}, b={b}: {loss:,.0f}")
# -> MSE with w=150, b=50000: 31,250,000
# Houses C and D have non-zero residuals (10k and 5k off), which drives the loss.`}
      />
    </div>
  );
}
