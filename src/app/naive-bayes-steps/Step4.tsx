'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Problem: Multiple Words">
        <p>
          Real emails contain many words, not just one. We need to compute
          P(word₁ and word₂ and word₃ | class) — the joint probability that
          all these words appear together, given the class.
        </p>
        <p>
          In principle, estimating this joint probability would require seeing every
          possible combination of words in the training data. With a vocabulary of
          50,000 words you would need an astronomically large training set — far more
          emails than exist in the world.
        </p>
      </ExplanationBox>

      <ExplanationBox title='The &quot;Naive&quot; Assumption: Conditional Independence'>
        <p>
          Naive Bayes escapes this explosion with one bold assumption: the words are{' '}
          <strong>conditionally independent</strong> given the class. That means, once you
          know the class label, knowing one word tells you nothing extra about the
          probability of another word appearing.
        </p>
        <p>
          Under this assumption, the joint likelihood factors into a simple product:
        </p>
      </ExplanationBox>

      <MathFormula label="The Naive Assumption">
        P(w₁, w₂, …, wₙ | class) = P(w₁ | class) × P(w₂ | class) × … × P(wₙ | class)
      </MathFormula>

      <ExplanationBox title="Why It Is Naive">
        <p>
          The assumption is plainly unrealistic. In spam emails, words like <em>free</em> and{' '}
          <em>offer</em> tend to co-occur far more than chance would predict — they are
          correlated. Treating them as independent ignores that relationship.
        </p>
        <p>
          Likewise, in ham emails the pair <em>meeting</em> and <em>agenda</em> appear together
          often. Assuming independence underestimates that joint probability.
        </p>
        <p>
          Despite this, the classifier makes the <strong>right ranking decision</strong> most
          of the time. The errors in the individual probabilities partially cancel out, and the
          class with the genuinely higher score tends to win regardless.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why It Makes the Math Tractable">
        <p>
          With the naive assumption, we only need to estimate one number per word per class —
          P(word | class) — from the training data. That is just a frequency count: how often
          does this word appear in emails of this class?
        </p>
        <p>
          For a 50,000-word vocabulary and 2 classes, that is 100,000 numbers. Without the
          assumption, the joint space would require billions of numbers that could never be
          reliably estimated from realistic training data.
        </p>
        <p>
          The naive assumption transforms an intractable problem into a loop of simple
          multiplications.
        </p>
      </ExplanationBox>

      <WorkedExample title="Factoring the Likelihood for Two Words">
        <p>
          An email contains both &quot;free&quot; and &quot;winner.&quot; Using our training table (40 spam, 60 ham):
        </p>
        <CalcStep number={1}>P(&quot;free&quot; | spam) = 32/40 = 0.800</CalcStep>
        <CalcStep number={2}>P(&quot;winner&quot; | spam) = 28/40 = 0.700</CalcStep>
        <CalcStep number={3}>Joint likelihood for spam ≈ 0.800 × 0.700 = 0.560</CalcStep>
        <CalcStep number={4}>P(&quot;free&quot; | ham) = 4/60 ≈ 0.0667</CalcStep>
        <CalcStep number={5}>P(&quot;winner&quot; | ham) = 1/60 ≈ 0.0167</CalcStep>
        <CalcStep number={6}>Joint likelihood for ham ≈ 0.0667 × 0.0167 ≈ 0.00111</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The spam joint likelihood (0.560) is over 500 times larger than the ham joint
          likelihood (0.00111). Each additional damning word makes the gap even more extreme —
          which is exactly the behaviour we want from a spam filter.
        </p>
      </WorkedExample>

    </div>
  );
}
