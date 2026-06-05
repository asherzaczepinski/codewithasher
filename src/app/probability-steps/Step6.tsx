'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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
          <strong>Variance</strong> measures spread by computing the average <em>squared deviation</em>
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

      <ExplanationBox title="In Python">
        <p>
          We recreate the exact dataset from the worked example using NumPy, compute the mean,
          variance, and standard deviation both with built-in functions and by hand, then confirm
          the two approaches agree.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="variance_std.py"
        caption="Mean, variance, and standard deviation computed with NumPy and verified by the by-hand formula."
        code={`import numpy as np

# The dataset from the worked example: eight monthly rain measurements (hours)
data = np.array([2, 4, 4, 4, 5, 5, 7, 9])

# ---- Mean ----
# np.mean sums all values then divides by the count -- identical to (1/n) * sum(x)
mu = np.mean(data)
print(f"Mean  mu = {mu}")  # expect 5.0

# ---- Variance (population) ----
# ddof=0 divides by n (population formula).  ddof=1 divides by n-1 (sample formula).
# We use ddof=0 here to match the formula shown: sigma^2 = (1/n) * sum((xi - mu)^2)
variance = np.var(data, ddof=0)
print(f"Variance sigma^2 = {variance}")  # expect 4.0

# ---- Standard deviation ----
# np.std is simply sqrt(np.var) -- brings the unit back from squared to original
std = np.std(data, ddof=0)
print(f"Std dev  sigma = {std}")  # expect 2.0

# ---- By-hand verification (no built-ins for the core calculation) ----
n = len(data)
mu_byhand = sum(data) / n              # step 1-2: sum then divide by count

# Step 3: squared deviation for each data point
squared_devs = [(x - mu_byhand) ** 2 for x in data]

# Step 4-5: average the squared deviations
variance_byhand = sum(squared_devs) / n

# Step 6: square root gives standard deviation
std_byhand = variance_byhand ** 0.5

print(f"By-hand variance = {variance_byhand}  std = {std_byhand}")

# Both approaches should agree to floating-point precision
assert abs(variance - variance_byhand) < 1e-10, "Variance mismatch"
assert abs(std     - std_byhand)      < 1e-10, "Std dev mismatch"
print("Both methods agree -- the formulas are equivalent.")`}
      />
    </div>
  );
}
