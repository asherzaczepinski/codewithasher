'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What a Loss Function Does">
        <p>
          A <strong>loss function</strong> (also called a cost function) takes the model&apos;s predictions
          and the true answers, and returns a single number measuring how wrong the model is.
          The smaller the number, the better the model. During training, the optimizer drives
          this number down; during evaluation, you use it to compare models or diagnose problems.
        </p>
        <p>
          For regression — predicting a continuous number like house price — the three loss
          functions you will reach for again and again are <strong>MSE</strong>, <strong>MAE</strong>,
          and <strong>RMSE</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Mean Squared Error (MSE)">
        <p>
          MSE squares every error before averaging. Squaring does two things: it makes all
          errors positive, and it <em>punishes large errors disproportionately</em>. An error of 10
          contributes 100 to the sum; an error of 1 contributes only 1. If your problem truly
          treats a 10-unit miss as ten times worse than a 1-unit miss, MSE aligns with that.
        </p>
        <p>
          The downside: a single extreme outlier can dominate the entire MSE, making the metric
          noisy on messy real-world data.
        </p>
      </ExplanationBox>

      <MathFormula label="MSE — Mean Squared Error">
        MSE = (1/n) × sum of (y_i - y_hat_i)^2 for i = 1 to n
      </MathFormula>

      <ExplanationBox title="Mean Absolute Error (MAE)">
        <p>
          MAE takes the absolute value of each error instead of squaring it, then averages.
          Every unit of error counts equally: a 10-unit miss is treated as exactly ten times
          worse than a 1-unit miss — no more, no less.
        </p>
        <p>
          MAE is <strong>robust to outliers</strong>. If your dataset has a handful of freakishly
          expensive houses that are genuinely hard to predict, MAE will not let them hijack the
          entire metric. This makes MAE the better choice when outliers exist but represent
          real data rather than data-entry errors.
        </p>
      </ExplanationBox>

      <MathFormula label="MAE — Mean Absolute Error">
        MAE = (1/n) × sum of |y_i - y_hat_i| for i = 1 to n
      </MathFormula>

      <ExplanationBox title="Root Mean Squared Error (RMSE)">
        <p>
          RMSE is simply the square root of MSE. Taking the square root brings the units back
          to the same scale as the target variable — if you are predicting prices in thousands
          of dollars, RMSE is also in thousands of dollars. MSE alone is in <em>squared</em> dollars,
          which is hard to interpret.
        </p>
        <p>
          RMSE still inherits MSE&apos;s sensitivity to outliers (large errors are still squared
          before the root), but it is far more readable. It is the most common regression
          metric reported in papers and competitions.
        </p>
      </ExplanationBox>

      <MathFormula label="RMSE — Root Mean Squared Error">
        RMSE = sqrt( (1/n) × sum of (y_i - y_hat_i)^2 )
      </MathFormula>

      <ExplanationBox title="When to Use Which">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>MSE</strong> — when you are training a model (most optimisers minimise MSE natively) and large errors are genuinely much worse than small ones.</li>
          <li><strong>MAE</strong> — when reporting performance to stakeholders who need an intuitive &quot;average error&quot;, or when outliers are a real concern.</li>
          <li><strong>RMSE</strong> — when you need MSE&apos;s sensitivity to large errors but also need a metric in the original units for communication.</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Computing MSE, MAE, and RMSE on Five Houses">
        <p>
          Our house-price regressor predicts sale prices (in $1,000s) for five houses.
          Here are the true prices and predictions:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          House 1: true = 200, predicted = 210 → error = +10<br />
          House 2: true = 350, predicted = 340 → error = −10<br />
          House 3: true = 150, predicted = 145 → error = −5<br />
          House 4: true = 500, predicted = 460 → error = −40<br />
          House 5: true = 280, predicted = 283 → error = +3
        </p>

        <CalcStep number={1}>Compute squared errors: 10² = 100, (−10)² = 100, (−5)² = 25, (−40)² = 1600, 3² = 9</CalcStep>
        <CalcStep number={2}>Sum of squared errors: 100 + 100 + 25 + 1600 + 9 = 1834</CalcStep>
        <CalcStep number={3}>MSE = 1834 / 5 = 366.8 (in squared thousands of dollars)</CalcStep>
        <CalcStep number={4}>RMSE = sqrt(366.8) ≈ 19.15 — so the model is off by roughly $19,150 on average, with large errors penalised more</CalcStep>
        <CalcStep number={5}>Compute absolute errors: |10| = 10, |−10| = 10, |−5| = 5, |−40| = 40, |3| = 3</CalcStep>
        <CalcStep number={6}>Sum of absolute errors: 10 + 10 + 5 + 40 + 3 = 68</CalcStep>
        <CalcStep number={7}>MAE = 68 / 5 = 13.6 — the model is off by $13,600 on a typical prediction</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice how House 4 (a $40,000 error) dominates RMSE (19.15) far more than it affects
          MAE (13.6). That gap is the outlier-sensitivity tradeoff made concrete. If House 4 is a
          genuine hard case, MAE gives a fairer picture of typical performance.
        </p>
      </WorkedExample>
    </div>
  );
}
