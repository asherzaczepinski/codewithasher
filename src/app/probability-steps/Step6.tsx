'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Mean: Centre of the Data">
        <p>
          The <strong>mean</strong> (also called the average) is the sum of all values divided by
          how many there are. It tells you the &quot;centre of gravity&quot; of your dataset —
          the single number that best represents the typical value.
        </p>
        <p>
          In ML, the mean appears constantly: mean squared error loss, batch normalisation,
          and gradient averaging over a mini-batch all rely on it. Understanding the mean deeply
          makes these techniques click.
        </p>
      </ExplanationBox>

      <MathFormula label="Mean">
        μ = (x₁ + x₂ + ... + xₙ) / n = (1/n) Σ xᵢ
      </MathFormula>

      <ExplanationBox title="Variance: How Spread Out Is the Data?">
        <p>
          The mean tells you the centre but nothing about spread. Two datasets can have the same
          mean and look completely different: &#123;5, 5, 5, 5&#125; and &#123;2, 4, 6, 8&#125;
          both have mean 5, but the second is far more spread out.
        </p>
        <p>
          <strong>Variance</strong> measures spread by computing the average <em>squared deviation</em>{' '}
          from the mean. Squaring does two things: it makes all deviations positive (so negative and
          positive deviations don&apos;t cancel), and it penalises large deviations more than small ones.
        </p>
      </ExplanationBox>

      <MathFormula label="Variance (population)">
        σ² = (1/n) Σ (xᵢ − μ)²
      </MathFormula>

      <ExplanationBox title="Standard Deviation: Back in Original Units">
        <p>
          Variance is in <em>squared</em> units. If your data is in kilograms, variance is in kg².
          That makes it hard to interpret alongside the original data. The <strong>standard
          deviation</strong> σ is simply the square root of the variance — it brings the spread
          measure back into the same units as the data.
        </p>
        <p>
          In neural networks, initialising weights with standard deviation 1/√n (where n is the
          number of inputs) keeps activations from exploding or vanishing — a technique called
          Xavier initialisation. That&apos;s standard deviation at work in practice.
        </p>
      </ExplanationBox>

      <MathFormula label="Standard Deviation">
        σ = √(σ²) = √((1/n) Σ (xᵢ − μ)²)
      </MathFormula>

      <WorkedExample title="Computing Mean, Variance, and Std Dev by Hand">
        <p>
          Dataset: &#123;2, 4, 4, 4, 5, 5, 7, 9&#125; — eight measurements of something
          (say, hours of rain per month). Let&apos;s find μ, σ², and σ.
        </p>

        <CalcStep number={1}>
          Sum all values: 2 + 4 + 4 + 4 + 5 + 5 + 7 + 9 = 40.
        </CalcStep>
        <CalcStep number={2}>
          Mean: μ = 40 / 8 = 5.
        </CalcStep>
        <CalcStep number={3}>
          Compute each squared deviation (xᵢ − μ)²:
          (2−5)² = 9, (4−5)² = 1, (4−5)² = 1, (4−5)² = 1,
          (5−5)² = 0, (5−5)² = 0, (7−5)² = 4, (9−5)² = 16.
        </CalcStep>
        <CalcStep number={4}>
          Sum of squared deviations: 9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32.
        </CalcStep>
        <CalcStep number={5}>
          Variance: σ² = 32 / 8 = 4.
        </CalcStep>
        <CalcStep number={6}>
          Standard deviation: σ = √4 = 2.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Interpretation: the average is 5 hours, and a &quot;typical&quot; value sits within
          about 2 hours of that average. The value 9 is two standard deviations above the mean —
          relatively unusual but not extreme. This kind of reasoning with σ is exactly what
          z-scores and the normal distribution formalise in the next module.
        </p>
      </WorkedExample>

    </div>
  );
}
