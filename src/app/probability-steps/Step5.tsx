'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="What Is a Random Variable?">
        <p>
          A <strong>random variable</strong> is a variable whose value is determined by a random
          process. Instead of holding a fixed number, it maps each outcome in the sample space
          to a number we care about.
        </p>
        <p>
          When you roll a die, you might define X = &quot;the number shown on top.&quot;
          X is a random variable. Before the roll, X could be 1, 2, 3, 4, 5, or 6 — each with
          some probability. After the roll, X takes on one definite value.
        </p>
        <p>
          In ML, random variables are everywhere: the label assigned to a data point,
          the output of a neuron before activation, the loss on a random mini-batch.
          Treating these as random variables lets us reason about their typical values and spread.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Discrete Distributions and the PMF">
        <p>
          A <strong>discrete</strong> random variable takes on a countable set of values (like the
          integers 1 through 6). Its probability distribution is described by a
          <strong> probability mass function (PMF)</strong>, which assigns a probability to each
          possible value.
        </p>
        <p>
          The PMF must satisfy two properties: every probability is between 0 and 1, and all
          probabilities sum to exactly 1. If they don&apos;t sum to 1, something is missing from the
          sample space.
        </p>
      </ExplanationBox>

      <MathFormula label="PMF Requirements">
        0 ≤ P(X = x) ≤ 1 for all x, and Σ P(X = x) = 1
      </MathFormula>

      <ExplanationBox title="The Uniform Distribution">
        <p>
          The simplest discrete distribution is the <strong>uniform distribution</strong>, where
          every outcome has the same probability. A fair die follows a discrete uniform distribution:
          each of the six faces has probability 1/6.
        </p>
        <p>
          Uniformity is also the default assumption when you have no reason to prefer one outcome
          over another — a key principle called the <em>principle of insufficient reason</em>.
          Many ML initialisation strategies (e.g. random weight initialisation) rely on this idea.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Expected Value: The Long-Run Average">
        <p>
          The <strong>expected value</strong> E[X] is the probability-weighted average of all
          possible values. It tells you what you&apos;d get on average if you repeated the random
          experiment many times.
        </p>
        <p>
          Expected value is not necessarily a value X can actually take — the expected number of
          children per family might be 1.8, even though no family has exactly 1.8 children.
          It&apos;s a summary of the distribution&apos;s centre of mass.
        </p>
      </ExplanationBox>

      <MathFormula label="Expected Value">
        E[X] = Σ x · P(X = x)
      </MathFormula>

      <WorkedExample title="Expected Value of a Fair Die Roll">
        <p>
          X = number shown on a single fair die. What is E[X]?
        </p>

        <CalcStep number={1}>
          List all values and their probabilities: P(X=1) = P(X=2) = ... = P(X=6) = 1/6.
        </CalcStep>
        <CalcStep number={2}>
          E[X] = 1·(1/6) + 2·(1/6) + 3·(1/6) + 4·(1/6) + 5·(1/6) + 6·(1/6)
        </CalcStep>
        <CalcStep number={3}>
          Factor out 1/6: E[X] = (1/6) · (1 + 2 + 3 + 4 + 5 + 6)
        </CalcStep>
        <CalcStep number={4}>
          Sum = 21, so E[X] = 21/6 = 3.5.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          E[X] = 3.5 means that if you rolled a fair die thousands of times and averaged all the
          results, the average would converge to 3.5. No single roll can equal 3.5, but the
          distribution is symmetric around it — 1 and 6 balance, 2 and 5 balance, 3 and 4 balance.
          Expected value is the balance point of the distribution.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Below we compute E[X] two ways: first using the definition (sum of x&nbsp;&middot;&nbsp;P(x)),
          then by simulating many die rolls and averaging. Both routes should give 3.5.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="expected_value.py"
        caption="Computing expected value analytically and verifying it with a simulation."
        code={`import numpy as np

# ---- Analytic calculation: E[X] = sum(x * P(x)) ----

# All possible outcomes of a fair six-sided die
outcomes = np.array([1, 2, 3, 4, 5, 6])

# Each outcome is equally likely, so every probability is 1/6
probabilities = np.array([1/6, 1/6, 1/6, 1/6, 1/6, 1/6])

# Sanity check: probabilities must sum to exactly 1
assert abs(probabilities.sum() - 1.0) < 1e-10, "PMF must sum to 1"

# Apply the definition: weight each outcome by its probability, then sum
expected_value = np.sum(outcomes * probabilities)
print(f"Analytic E[X] = {expected_value}")  # prints 3.5

# ---- Simulation: roll the die many times and average ----
np.random.seed(0)
n_rolls = 500_000
rolls = np.random.randint(1, 7, size=n_rolls)  # uniform over {1,2,3,4,5,6}

# np.mean computes the sample mean -- the empirical estimate of E[X]
simulated_mean = np.mean(rolls)
print(f"Simulated mean after {n_rolls} rolls = {simulated_mean:.4f}")
# By the law of large numbers this converges to 3.5 as n grows

# ---- Generalise: expected value of any discrete distribution ----
# Suppose we have a loaded die with custom probabilities
loaded_outcomes = np.array([1, 2, 3, 4, 5, 6])
loaded_probs    = np.array([0.10, 0.10, 0.10, 0.10, 0.10, 0.50])  # 6 comes up half the time

# The formula is identical -- just plug in the new probabilities
loaded_ev = np.sum(loaded_outcomes * loaded_probs)
print(f"Loaded-die E[X] = {loaded_ev}")  # higher than 3.5 because 6 is overrepresented`}
      />
    </div>
  );
}
