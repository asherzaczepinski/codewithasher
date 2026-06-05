'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Updating Beliefs With New Information">
        <p>
          Conditional probability answers the question: <em>given that I already know B happened,
          what is the probability that A also happened?</em>
        </p>
        <p>
          This is the core of ML inference. A spam filter starts with a prior belief about how
          likely an email is spam. Then it sees the word &quot;FREE&quot; and updates that belief.
          Then it sees &quot;click here&quot; and updates again. Each update is conditional
          probability in action.
        </p>
      </ExplanationBox>

      <MathFormula label="Conditional Probability">
        P(A | B) = P(A and B) / P(B)
      </MathFormula>

      <ExplanationBox title="Intuition: Shrinking the Sample Space">
        <p>
          The formula makes geometric sense. When you learn that B happened, you throw away
          all outcomes where B did <em>not</em> happen. Your sample space shrinks to just
          the B outcomes. Among those remaining outcomes, what fraction also have A? That
          fraction is P(A | B).
        </p>
        <p>
          The denominator P(B) is the renormalization step — it makes the shrunken space sum to 1
          again. Without it, the probabilities over the reduced space wouldn&apos;t add up to 1,
          which would violate the fundamental rules of probability.
        </p>
        <p>
          Read <strong>P(A | B)</strong> as &quot;the probability of A <em>given</em> B.&quot;
          The vertical bar means &quot;given&quot; or &quot;conditioned on.&quot;
        </p>
      </ExplanationBox>

      <ExplanationBox title="Dependence Revealed">
        <p>
          Conditional probability also gives us a precise definition of independence:
          A and B are independent if and only if knowing B gives you no new information about A.
          Mathematically: P(A | B) = P(A). If this holds, then P(A and B) = P(A) × P(B),
          which is exactly the multiplication rule from the previous module.
        </p>
        <p>
          So independence is not just a gut feeling — it&apos;s a testable mathematical condition.
        </p>
      </ExplanationBox>

      <WorkedExample title="Dice: Conditional on Knowing the Roll Is Even">
        <p>
          We roll a single fair die. Someone peeks and tells us only that the result is even.
          Given that, what is the probability it is a 6?
        </p>

        <CalcStep number={1}>
          Full sample space S = &#123;1, 2, 3, 4, 5, 6&#125;, each with probability 1/6.
        </CalcStep>
        <CalcStep number={2}>
          Event B = &quot;roll is even&quot; = &#123;2, 4, 6&#125;. P(B) = 3/6 = 1/2.
        </CalcStep>
        <CalcStep number={3}>
          Event A = &quot;roll is 6&quot; = &#123;6&#125;. P(A) = 1/6.
        </CalcStep>
        <CalcStep number={4}>
          P(A and B) = P(6 and even) = P(6) = 1/6. (6 is already even, so the intersection is just &#123;6&#125;.)
        </CalcStep>
        <CalcStep number={5}>
          P(A | B) = P(A and B) / P(B) = (1/6) / (1/2) = (1/6) × (2/1) = 2/6 = 1/3 ≈ 0.333.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Without the hint, P(six) = 1/6 ≈ 0.167. After learning the roll is even, P(six | even) jumps
          to 1/3 ≈ 0.333. The sample space shrunk from 6 outcomes to 3 even outcomes, so a six became
          twice as likely. New information genuinely changed our belief — that is exactly what
          conditional probability captures.
        </p>
      </WorkedExample>
    </div>
  );
}
