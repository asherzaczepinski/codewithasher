'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Bell Curve">
        <p>
          The <strong>normal distribution</strong> (also called the Gaussian distribution or
          bell curve) is the most important probability distribution in all of statistics and ML.
          It describes countless real-world quantities: measurement errors, the heights of a
          population, the noise in sensor readings, the weights in a randomly initialised neural
          network.
        </p>
        <p>
          Its shape is symmetric and bell-shaped, peaking at the centre and tapering toward zero
          on both sides. It never actually touches zero — technically the tails go on forever —
          but values far from the centre become vanishingly rare.
        </p>
      </ExplanationBox>

      <MathFormula label="Normal Distribution PDF">
        f(x) = (1 / (σ√(2π))) · exp(−(x − μ)² / (2σ²))
      </MathFormula>

      <ExplanationBox title="Two Parameters Define the Shape">
        <p>
          The normal distribution is completely determined by just two numbers:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Mean μ</strong> — shifts the bell curve left or right. The peak always sits
            at x = μ. Changing μ doesn&apos;t change the shape, just its location.
          </li>
          <li>
            <strong>Standard deviation σ</strong> — controls the width. A small σ produces a
            tall, narrow spike; a large σ produces a wide, flat bell. Changing σ changes the
            spread without moving the centre.
          </li>
        </ul>
        <p>
          Written compactly: X ~ N(μ, σ²) means &quot;X follows a normal distribution with
          mean μ and variance σ².&quot;
        </p>
      </ExplanationBox>

      <ExplanationBox title="The 68-95-99.7 Rule">
        <p>
          One of the most practical facts about the normal distribution is how probability is
          distributed relative to the mean:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>68%</strong> of values fall within 1 standard deviation of the mean (between μ − σ and μ + σ).</li>
          <li><strong>95%</strong> of values fall within 2 standard deviations (between μ − 2σ and μ + 2σ).</li>
          <li><strong>99.7%</strong> of values fall within 3 standard deviations (between μ − 3σ and μ + 3σ).</li>
        </ul>
        <p>
          This means a value more than 3σ from the mean is genuinely rare — happening less than
          0.3% of the time. Anomaly detection in ML exploits exactly this: flag data points that
          are more than 2 or 3 standard deviations from the expected mean.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Z-Scores: Standardising to a Common Scale">
        <p>
          A <strong>z-score</strong> converts any value from any normal distribution into a number
          that says &quot;how many standard deviations above or below the mean is this value?&quot;
          A z-score of 0 is exactly at the mean. A z-score of +2 is two standard deviations above.
          A z-score of −1.5 is one and a half standard deviations below.
        </p>
        <p>
          Z-scores let you compare values from completely different distributions on a common scale —
          a key step in data preprocessing (standardisation / z-score normalisation) before feeding
          data into many ML algorithms.
        </p>
      </ExplanationBox>

      <MathFormula label="Z-Score">
        z = (x − μ) / σ
      </MathFormula>

      <ExplanationBox title="Why the Normal Distribution Appears Everywhere">
        <p>
          The reason the normal distribution is so ubiquitous is the <strong>Central Limit
          Theorem (CLT)</strong>: if you take a large enough sample of independent measurements
          and add them up (or average them), the result follows a normal distribution — regardless
          of the original distribution of each individual measurement.
        </p>
        <p>
          That is remarkable. Roll 30 dice (each following a uniform distribution) and average them.
          Do it a thousand times and plot the averages: a perfect bell curve appears. This is why
          the errors in real-world measurements tend to be normally distributed — they are the sum
          of many small independent noise sources.
        </p>
        <p>
          In ML: mini-batch gradients, sums of neuron outputs, and log-likelihood scores all
          tend toward normal distributions as networks grow, which underpins statistical inference
          about model performance.
        </p>
      </ExplanationBox>

      <WorkedExample title="Z-Score Interpretation for Test Scores">
        <p>
          Exam scores follow N(μ = 70, σ = 10). A student scored 85. How unusual is this?
        </p>

        <CalcStep number={1}>
          Compute the z-score: z = (85 − 70) / 10 = 15 / 10 = 1.5.
        </CalcStep>
        <CalcStep number={2}>
          A z-score of 1.5 means the student scored 1.5 standard deviations above the mean.
        </CalcStep>
        <CalcStep number={3}>
          By the 68-95-99.7 rule, 95% of students scored within 2σ of the mean (50 to 90).
          The student&apos;s score of 85 is within that 95% band — strong but not extreme.
        </CalcStep>
        <CalcStep number={4}>
          What score would be in the top ~2.5%? That requires z ≥ 2, meaning score ≥ μ + 2σ = 70 + 20 = 90.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Z-scores give you an instant sense of rarity. A score of 85 (z = 1.5) is above average
          but comfortably within the normal range. A score of 95 (z = 2.5) would be genuinely
          exceptional — only about 0.6% of students score that high.
        </p>
      </WorkedExample>

    </div>
  );
}
