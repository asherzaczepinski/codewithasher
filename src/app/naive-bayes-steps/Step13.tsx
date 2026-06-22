'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import NBLogSpace from '@/components/NBLogSpace';

export default function Step13() {
  return (
    <div>
      <ExplanationBox title="Problem 2: Numerical Underflow">
        <p>
          Multiplying together dozens or hundreds of small probabilities produces an astronomically
          tiny number. For an email with 200 words, a product of values around 0.05 each gives roughly
          0.05²⁰⁰ ≈ 10⁻²⁶⁰ — a number that most floating-point systems round to exactly zero. This is{' '}
          <strong>numerical underflow</strong>.
        </p>
        <p>
          Even if the spam score and ham score both underflow, we cannot compare them — both appear as
          zero and the classifier breaks.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fix: Working in Log Space">
        <p>
          Logarithms turn multiplication into addition and make tiny products manageable. Because log
          is a monotonically increasing function, the class with the highest score also has the
          highest log-score — the ranking is preserved.
        </p>
      </ExplanationBox>

      <MathFormula label="Log-Space Score">
        log score(class) = log P(class) + log P(w₁|class) + log P(w₂|class) + … + log P(wₙ|class)
      </MathFormula>

      <WorkedExample title="Log-Space Spam Calculation">
        <p>
          Repeating the &quot;free winner meeting&quot; email from the previous module in log space
          (using natural log):
        </p>
        <CalcStep number={1}>log P(spam) = log(0.400) ≈ −0.916</CalcStep>
        <CalcStep number={2}>log P(&quot;free&quot; | spam) = log(0.800) ≈ −0.223</CalcStep>
        <CalcStep number={3}>log P(&quot;winner&quot; | spam) = log(0.700) ≈ −0.357</CalcStep>
        <CalcStep number={4}>log P(&quot;meeting&quot; | spam) = log(0.050) ≈ −2.996</CalcStep>
        <CalcStep number={5}>Log spam score = −0.916 + (−0.223) + (−0.357) + (−2.996) = −4.492</CalcStep>
        <CalcStep number={6}>log P(ham) = log(0.600) ≈ −0.511</CalcStep>
        <CalcStep number={7}>log P(&quot;free&quot; | ham) = log(0.067) ≈ −2.703</CalcStep>
        <CalcStep number={8}>log P(&quot;winner&quot; | ham) = log(0.017) ≈ −4.075</CalcStep>
        <CalcStep number={9}>log P(&quot;meeting&quot; | ham) = log(0.700) ≈ −0.357</CalcStep>
        <CalcStep number={10}>Log ham score = −0.511 + (−2.703) + (−4.075) + (−0.357) = −7.646</CalcStep>
        <CalcStep number={11}>−4.492 &gt; −7.646 → classify as SPAM (same result, no underflow)</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Sums of numbers like −4.5 and −7.6 never underflow, no matter how many words the email
          contains. This is why every production implementation of Naive Bayes works in log space.
        </p>
      </WorkedExample>

      <ExplanationBox title="Watch the Product Underflow">
        <p>
          Slide the number of words below and compare the two columns. The raw product shrinks toward
          zero and eventually rounds to exactly 0 — at which point comparison is impossible. The log
          sum stays a calm, manageable negative number no matter how many words you add.
        </p>
      </ExplanationBox>

      <NBLogSpace />

      <ExplanationBox title="Why Every Real Implementation Uses Logs">
        <p>
          Real emails and documents have hundreds or thousands of tokens. A raw product over that many
          sub-one probabilities underflows to zero almost immediately, destroying the comparison the
          classifier depends on. Working in log space replaces a long, fragile chain of
          multiplications with a stable chain of additions.
        </p>
        <p>
          Because logarithms preserve order, the winning class in log space is the same winning class
          you would get from the raw products — you lose nothing and gain numerical safety. That is
          why you will never see a production Naive Bayes implementation multiply probabilities
          directly; it always sums their logs.
        </p>
      </ExplanationBox>
    </div>
  );
}
