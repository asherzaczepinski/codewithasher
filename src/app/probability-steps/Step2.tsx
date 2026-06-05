'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Sample Space">
        <p>
          Before you can calculate a probability, you need to know all the possible outcomes.
          That complete list is called the <strong>sample space</strong>, written S.
        </p>
        <p>
          When you flip a fair coin, the sample space is S = &#123;Heads, Tails&#125;. When you
          roll a standard die, the sample space is S = &#123;1, 2, 3, 4, 5, 6&#125;. Every possible
          outcome lives in the sample space — nothing is left out.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Events and Probability">
        <p>
          An <strong>event</strong> is any subset of the sample space — one or more outcomes
          you care about. &quot;Rolling an even number&quot; is the event &#123;2, 4, 6&#125;.
          &quot;Getting heads&quot; is the event &#123;Heads&#125;.
        </p>
        <p>
          For equally likely outcomes, the probability of an event is simply the fraction of
          outcomes in the sample space that belong to that event.
        </p>
      </ExplanationBox>

      <MathFormula label="Probability of an Event">
        P(A) = (number of outcomes in A) / (total outcomes in S)
      </MathFormula>

      <ExplanationBox title="Three Fundamental Rules">
        <p>
          Three rules hold for <em>every</em> probability, no matter how complex:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Bounded:</strong> P(A) is always between 0 and 1 inclusive. A probability
            below 0 or above 1 is a sign of a calculation error.
          </li>
          <li>
            <strong>Certain event:</strong> The probability of something in the sample space
            happening is exactly 1. P(S) = 1. Something must happen.
          </li>
          <li>
            <strong>Complement rule:</strong> The probability that A does <em>not</em> happen
            equals 1 minus the probability it does happen. P(not A) = 1 − P(A).
          </li>
        </ul>
        <p>
          The complement rule is especially useful: instead of calculating P(at least one six
          in three rolls) directly, it&apos;s often easier to calculate P(no sixes) and subtract from 1.
        </p>
      </ExplanationBox>

      <MathFormula label="Complement Rule">
        P(not A) = 1 − P(A)
      </MathFormula>

      <WorkedExample title="Coin and Dice: Four Calculations">
        <p>
          Let&apos;s apply the rules to a coin flip and a standard six-sided die.
        </p>

        <CalcStep number={1}>
          Sample space for a coin: S = &#123;H, T&#125;. Total outcomes = 2.
        </CalcStep>
        <CalcStep number={2}>
          P(Heads) = 1 / 2 = 0.5. One outcome (H) out of two total.
        </CalcStep>
        <CalcStep number={3}>
          P(not Heads) = 1 − 0.5 = 0.5. By the complement rule — makes sense, it must be Tails.
        </CalcStep>
        <CalcStep number={4}>
          Sample space for a die: S = &#123;1, 2, 3, 4, 5, 6&#125;. Total outcomes = 6.
        </CalcStep>
        <CalcStep number={5}>
          P(even number) = P(&#123;2, 4, 6&#125;) = 3 / 6 = 0.5. Three even outcomes out of six.
        </CalcStep>
        <CalcStep number={6}>
          P(rolling a 6) = 1 / 6 ≈ 0.167. Just one favourable outcome.
        </CalcStep>
        <CalcStep number={7}>
          P(not rolling a 6) = 1 − 1/6 = 5/6 ≈ 0.833. Much more likely to miss the 6.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice how the complement rule saved work on step 7 — we didn&apos;t need to count the
          five non-six outcomes individually. This shortcut becomes even more powerful in complex
          ML calculations.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Let&apos;s use NumPy to simulate thousands of coin flips and die rolls, then check
          whether the empirical (observed) frequencies match the theoretical probabilities above.
          Running many trials and averaging is called a <strong>Monte Carlo</strong> estimate.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="probability_basics.py"
        caption="Simulating coin flips and die rolls to verify theoretical probabilities empirically."
        code={`import numpy as np

# Fix the random seed so results are reproducible every time you run this
np.random.seed(42)

# ---------- coin flip ----------
# np.random.randint(0, 2, size=n) draws n integers uniformly from {0, 1}
# We treat 1 as Heads, 0 as Tails
n_flips = 100_000
coin_flips = np.random.randint(0, 2, size=n_flips)

# Count how many flips landed Heads, then divide by total flips
empirical_heads = coin_flips.sum() / n_flips
theoretical_heads = 0.5  # 1 favourable outcome out of 2 equally likely ones

print(f"Coin  | empirical P(H) = {empirical_heads:.4f}  theoretical = {theoretical_heads}")
# Expected output: very close to 0.5000 -- the law of large numbers at work

# ---------- six-sided die ----------
# np.random.randint(1, 7, size=n) draws uniformly from {1, 2, 3, 4, 5, 6}
n_rolls = 100_000
die_rolls = np.random.randint(1, 7, size=n_rolls)

# Event: rolling an even number {2, 4, 6}
even_mask = die_rolls % 2 == 0  # boolean array, True where the roll is even
empirical_even = even_mask.sum() / n_rolls
theoretical_even = 3 / 6  # 3 even outcomes out of 6 possible

print(f"Die   | empirical P(even) = {empirical_even:.4f}  theoretical = {theoretical_even:.4f}")

# Event: rolling a 6 (exactly one favourable outcome)
six_mask = die_rolls == 6
empirical_six = six_mask.sum() / n_rolls
theoretical_six = 1 / 6  # approximately 0.1667

print(f"Die   | empirical P(6) = {empirical_six:.4f}  theoretical = {theoretical_six:.4f}")

# Complement rule check: P(not 6) should equal 1 - P(6)
empirical_not_six = 1 - empirical_six
print(f"Die   | empirical P(not 6) = {empirical_not_six:.4f}  theoretical = {5 / 6:.4f}")
# With 100 000 trials the empirical values will land within ~0.002 of the theory`}
      />
    </div>
  );
}
