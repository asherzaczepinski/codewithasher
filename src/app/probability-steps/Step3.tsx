'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The AND Rule: Both Events Happen">
        <p>
          Sometimes you want the probability that <em>two things both happen</em> — for example,
          flipping heads <strong>and</strong> rolling a six. When two events are
          <strong> independent</strong> (the outcome of one has zero effect on the other),
          you simply <strong>multiply</strong> their probabilities.
        </p>
        <p>
          Independence is the key assumption here. A coin flip and a die roll are independent —
          the coin has no way to influence the die. But drawing two cards from a deck without
          replacement is <em>not</em> independent, because the first draw changes what&apos;s left.
        </p>
      </ExplanationBox>

      <MathFormula label="AND Rule (independent events)">
        P(A and B) = P(A) × P(B)
      </MathFormula>

      <ExplanationBox title="The OR Rule: At Least One Event Happens">
        <p>
          When you want the probability that <em>event A or event B happens</em> (or both),
          you add their individual probabilities — but you must subtract the overlap, because
          outcomes where both A and B happen get counted twice if you just add.
        </p>
        <p>
          This overlap is called the <strong>intersection</strong>: outcomes where A and B
          are both true. If A and B are mutually exclusive (they cannot both happen at once),
          the intersection is zero and you just add.
        </p>
      </ExplanationBox>

      <MathFormula label="OR Rule (general)">
        P(A or B) = P(A) + P(B) − P(A and B)
      </MathFormula>

      <ExplanationBox title="Independence vs Dependence in ML">
        <p>
          Independence is central to machine learning. The Naive Bayes classifier, one of the
          simplest and most effective spam filters, works entirely by assuming that each word in
          an email is <em>independent</em> of every other word given the class (spam vs not-spam).
          It then multiplies probabilities — exactly the AND rule — across all words.
        </p>
        <p>
          The assumption is &quot;naive&quot; because words are clearly not independent in reality
          (&quot;free&quot; and &quot;money&quot; co-occur). Yet the classifier still works
          remarkably well, which is why understanding independence (and when it breaks) matters.
        </p>
      </ExplanationBox>

      <WorkedExample title="Coin AND Die, Even OR Six">
        <p>
          We flip a fair coin and roll a fair die. Let&apos;s compute two probabilities.
        </p>

        <CalcStep number={1}>
          Event A: coin lands Heads. P(A) = 1/2 = 0.5.
        </CalcStep>
        <CalcStep number={2}>
          Event B: die shows 6. P(B) = 1/6 ≈ 0.167.
        </CalcStep>
        <CalcStep number={3}>
          These events are independent — the coin cannot influence the die.
        </CalcStep>
        <CalcStep number={4}>
          P(Heads AND six) = P(A) × P(B) = 0.5 × 1/6 = 1/12 ≈ 0.083.
        </CalcStep>
        <CalcStep number={5}>
          Now a different question: P(die shows even OR die shows 6).
          Event C = &#123;2, 4, 6&#125;, P(C) = 3/6 = 0.5.
          Event D = &#123;6&#125;, P(D) = 1/6.
        </CalcStep>
        <CalcStep number={6}>
          Intersection C and D = &#123;6&#125;, so P(C and D) = 1/6.
        </CalcStep>
        <CalcStep number={7}>
          P(C or D) = P(C) + P(D) − P(C and D) = 3/6 + 1/6 − 1/6 = 3/6 = 0.5.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice that &quot;even OR 6&quot; equals &quot;even&quot; — because 6 is already even.
          The OR formula automatically handles this: the overlap cancels the double-count.
        </p>
      </WorkedExample>
    </div>
  );
}
