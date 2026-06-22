'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import NBSmoothing from '@/components/NBSmoothing';

export default function Step12() {
  return (
    <div>
      <ExplanationBox title="Problem 1: Zero Probabilities">
        <p>
          What happens if a word appears in the new email but <em>never</em> appeared in any spam
          email during training? Its estimated likelihood P(word | spam) would be 0/40 = 0. Multiply
          anything by 0 and the entire spam score collapses to zero — that one missing word would make
          spam impossible no matter how many other spam indicators are present.
        </p>
        <p>
          This is called the <strong>zero-probability problem</strong>, and it is a serious practical
          failure. A single unseen word should not override mountains of other evidence.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fix: Laplace (Add-One) Smoothing">
        <p>
          The standard fix is <strong>Laplace smoothing</strong>, also called add-one smoothing.
          Instead of using raw counts, we pretend we saw every word at least once in every class. We
          add 1 to every word count, and compensate in the denominator by adding the size of the
          vocabulary (|V|) so that probabilities still sum to 1.
        </p>
      </ExplanationBox>

      <MathFormula label="Laplace-Smoothed Likelihood">
        P(word | class) = (count(word, class) + 1) / (count(all words in class) + |V|)
      </MathFormula>

      <ExplanationBox title="Smoothing in Practice">
        <p>
          Suppose our vocabulary has |V| = 1,000 unique words. In the 40 spam emails there are a total
          of 8,000 word occurrences. A word that appeared 0 times in spam gets:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          P(new_word | spam) = (0 + 1) / (8000 + 1000) = 1 / 9000 ≈ 0.000111
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That is a very small number — correctly reflecting that this word is rare in spam — but it
          is not zero. The spam score can no longer be wiped out by a single unseen word.
        </p>
      </ExplanationBox>

      <ExplanationBox title="See Smoothing in Action">
        <p>
          Drag the smoothing strength α below. At α = 0 (no smoothing) the unseen-word probability is
          exactly 0 and the spam score collapses. As you increase α, that probability becomes a small
          positive number and the score survives.
        </p>
      </ExplanationBox>

      <NBSmoothing />

      <ExplanationBox title="Tuning the Smoothing Strength">
        <p>
          α = 1 is the classic &quot;add-one&quot; choice, but it is a knob you can turn. A smaller α
          (closer to 0) trusts your counts more and assigns very tiny probabilities to unseen words; a
          larger α pulls every probability toward uniform, smoothing harder and effectively saying
          &quot;I&apos;m less sure my training data saw everything.&quot;
        </p>
        <p>
          With lots of training data a small α is fine, because your counts are reliable. With little
          data a larger α guards against over-confident zeros. In practice α is tuned on a validation
          set — but the essential job never changes: keep any probability from collapsing to exactly
          zero.
        </p>
      </ExplanationBox>
    </div>
  );
}
