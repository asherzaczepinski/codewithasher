'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Problem 1: Zero Probabilities">
        <p>
          What happens if a word appears in the new email but <em>never</em> appeared in any
          spam email during training? Its estimated likelihood P(word | spam) would be 0/40 = 0.
          Multiply anything by 0 and the entire spam score collapses to zero — that one missing
          word would make spam impossible no matter how many other spam indicators are present.
        </p>
        <p>
          This is called the <strong>zero-probability problem</strong>, and it is a serious
          practical failure. A single unseen word should not override mountains of other evidence.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fix: Laplace (Add-One) Smoothing">
        <p>
          The standard fix is <strong>Laplace smoothing</strong>, also called add-one smoothing.
          Instead of using raw counts, we pretend we saw every word at least once in every class.
          We add 1 to every word count, and compensate in the denominator by adding the size of
          the vocabulary (|V|) so that probabilities still sum to 1.
        </p>
      </ExplanationBox>

      <MathFormula label="Laplace-Smoothed Likelihood">
        P(word | class) = (count(word, class) + 1) / (count(all words in class) + |V|)
      </MathFormula>

      <ExplanationBox title="Smoothing in Practice">
        <p>
          Suppose our vocabulary has |V| = 1,000 unique words. In the 40 spam emails there are
          a total of 8,000 word occurrences. A word that appeared 0 times in spam gets:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          P(new_word | spam) = (0 + 1) / (8000 + 1000) = 1 / 9000 ≈ 0.000111
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That is a very small number — correctly reflecting that this word is rare in spam —
          but it is not zero. The spam score can no longer be wiped out by a single unseen word.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Problem 2: Numerical Underflow">
        <p>
          Multiplying together dozens or hundreds of small probabilities produces an astronomically
          tiny number. For an email with 200 words, a product of values around 0.05 each gives
          roughly 0.05²⁰⁰ ≈ 10⁻²⁶⁰ — a number that most floating-point systems round to
          exactly zero. This is <strong>numerical underflow</strong>.
        </p>
        <p>
          Even if the spam score and ham score both underflow, we cannot compare them — both
          appear as zero and the classifier breaks.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Fix: Working in Log Space">
        <p>
          Logarithms turn multiplication into addition and make tiny products manageable.
          Because log is a monotonically increasing function, the class with the highest score
          also has the highest log-score — the ranking is preserved.
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
          Sums of numbers like −4.5 and −7.6 never underflow, no matter how many words the
          email contains. This is why every production implementation of Naive Bayes works in
          log space.
        </p>
      </WorkedExample>

      <ExplanationBox title="Strengths of Naive Bayes">
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Fast to train</strong> — one pass through the data to count word frequencies.</li>
          <li><strong>Fast to predict</strong> — a few additions in log space per word.</li>
          <li><strong>Works well with little data</strong> — simple models generalise better when
          training data is scarce.</li>
          <li><strong>Interpretable</strong> — you can inspect which words drive each class and why.</li>
          <li><strong>Handles high-dimensional input well</strong> — large vocabularies are no problem.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Weaknesses and When to Use Something Else">
        <ul style={{ lineHeight: '2' }}>
          <li><strong>The independence assumption is wrong</strong> — probabilities are not well
          calibrated, even if rankings are correct.</li>
          <li><strong>Struggles with rare feature combinations</strong> — smoothing helps but does
          not fully solve correlation blindness.</li>
          <li><strong>Ignores word order</strong> — &quot;dog bites man&quot; and &quot;man bites dog&quot; look identical.</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          When those limitations matter, consider logistic regression (which models feature
          correlations), or modern transformer-based classifiers (which model word order and
          context). But for a fast, transparent baseline on text, Naive Bayes remains a
          first-rate choice.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Variants Worth Knowing">
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Multinomial Naive Bayes</strong> — counts how many times each word appears in the
            email rather than just whether it appears. Better for longer documents where frequency matters.
          </li>
          <li>
            <strong>Bernoulli Naive Bayes</strong> — binary features only: did the word appear or not?
            Good for short texts and keyword detection. The model we built in this course.
          </li>
          <li>
            <strong>Gaussian Naive Bayes</strong> — for continuous features (like sensor readings),
            assumes each feature follows a normal distribution given the class. The same prior ×
            likelihood structure applies, but the likelihood is computed from the Gaussian PDF.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          All three variants share the same core idea: prior × product of per-feature likelihoods.
          Once you understand that structure, switching between variants is straightforward.
        </p>
      </ExplanationBox>
    </div>
  );
}
