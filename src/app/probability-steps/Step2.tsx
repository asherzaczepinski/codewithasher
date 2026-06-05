'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
    </div>
  );
}
