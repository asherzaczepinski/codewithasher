'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Spread = Signal">
        <p>
          If every student scored exactly 72 on the math exam, that feature tells you
          absolutely nothing about the differences between students. It carries zero
          information. Now imagine the scores range from 30 to 98 — suddenly the feature
          is highly informative. The spread is the signal.
        </p>
        <p>
          In statistics, spread along a single axis is measured by <strong>variance</strong>.
          PCA&apos;s core idea is that the directions in which the data spreads the most are
          the directions worth keeping. Flat directions — where data barely moves — can be
          discarded with little loss.
        </p>
      </ExplanationBox>

      <MathFormula label="Variance of a feature x with n data points">
        Var(x) = (1/n) × Σ (xᵢ − x̄)²
      </MathFormula>

      <ExplanationBox title="Breaking Down the Formula">
        <p>
          <strong>x̄</strong> is the mean — the average value. We subtract it from each
          data point so we measure spread <em>around the center</em>, not around zero.
        </p>
        <p>
          We then <strong>square</strong> each difference so that positive and negative
          deviations don&apos;t cancel out — a point 5 above the mean and a point 5 below
          are equally &quot;spread out,&quot; and squaring makes both contribute positively.
        </p>
        <p>
          Finally we <strong>average</strong> those squared differences. A large result
          means points are spread widely; a small result means they cluster tightly around
          the mean.
        </p>
      </ExplanationBox>

      <WorkedExample title="Variance of Five Exam Scores">
        <p>
          Five students scored the following on the math exam:{' '}
          <strong>60, 70, 75, 80, 90</strong>. Let&apos;s compute the variance.
        </p>

        <CalcStep number={1}>
          Compute the mean: x̄ = (60 + 70 + 75 + 80 + 90) / 5 = 375 / 5 = 75
        </CalcStep>
        <CalcStep number={2}>
          Subtract the mean from each score and square the result:
          (60−75)² = (−15)² = 225 &nbsp;|&nbsp;
          (70−75)² = (−5)² = 25 &nbsp;|&nbsp;
          (75−75)² = 0² = 0 &nbsp;|&nbsp;
          (80−75)² = 5² = 25 &nbsp;|&nbsp;
          (90−75)² = 15² = 225
        </CalcStep>
        <CalcStep number={3}>
          Sum the squared differences: 225 + 25 + 0 + 25 + 225 = 500
        </CalcStep>
        <CalcStep number={4}>
          Divide by n = 5: Var(math) = 500 / 5 = <strong>100</strong>
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The variance is <strong>100</strong>, which means scores typically deviate from
          the mean by about √100 = 10 points (that square root is called the standard
          deviation). Now imagine computing this variance for a physics exam too. Whichever
          feature has higher variance carries more spread — and therefore more information
          about differences between students.
        </p>
      </WorkedExample>

      <ExplanationBox title="Variance Along an Arbitrary Direction">
        <p>
          So far we&apos;ve measured variance along the original feature axes (math score,
          physics score). But PCA asks a deeper question: is there some <em>diagonal</em>{' '}
          direction through the 2D cloud of points where the data spreads out even more?
        </p>
        <p>
          That direction — the one that maximizes variance — is the <strong>first principal
          component</strong>. In the next module we&apos;ll make this concrete by rotating a
          line through the data and watching the projected variance rise and fall.
        </p>
      </ExplanationBox>
    </div>
  );
}
