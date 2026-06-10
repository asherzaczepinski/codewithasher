'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Spam or not spam? Fraudulent transaction or legitimate one? Positive review or negative one?
          These are <strong>classification</strong> problems — given a description of something, which
          category does it belong to?
        </p>
        <p>
          One of the oldest and most effective answers to this question is <strong>Naive Bayes</strong>,
          a classifier built entirely on probability. It is fast, interpretable, and often works
          surprisingly well even on large, messy data sets.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: A Spam Filter">
        <p>
          Throughout this course we will build a spam filter. Every email arrives as a bag of words —
          we do not care about word order, just which words appear. The filter reads those words and
          asks: given what I see, is this email more likely <strong>spam</strong> or
          more likely <strong>ham</strong> (legitimate mail)?
        </p>
        <p>
          For example, an email containing the words <em>free</em>, <em>winner</em>,
          and <em>click</em> looks very different from one containing <em>meeting</em>,{' '}
          <em>agenda</em>, and <em>attached</em>. The classifier learns those patterns
          from thousands of labelled examples and then applies them to new mail.
        </p>
      </ExplanationBox>

      <ExplanationBox title='Why &quot;Naive&quot; — and Why It Still Works'>
        <p>
          The &quot;naive&quot; part refers to a bold simplifying assumption: the classifier treats each
          word as <strong>independent</strong> of every other word, given the class. In reality, words
          are correlated — emails that contain <em>free</em> are more likely to also contain{' '}
          <em>offer</em>. Ignoring that correlation is mathematically naive.
        </p>
        <p>
          Yet the classifier works remarkably well in practice. Why? Because even though the
          probability <em>scores</em> it produces are miscalibrated, the class it ranks highest
          is usually the correct one. The ranking decision is robust even when the exact numbers
          are off. That is the key insight this course will make precise.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Will Build">
        <p>
          By the end of this course you will be able to: understand conditional probability and Bayes&apos;
          theorem from first principles; derive the Naive Bayes decision rule; walk through a complete
          numerical classification of a new email; and apply practical fixes like Laplace smoothing and
          log-space arithmetic. No libraries required — just arithmetic and clear reasoning.
        </p>
      </ExplanationBox>
    </div>
  );
}
