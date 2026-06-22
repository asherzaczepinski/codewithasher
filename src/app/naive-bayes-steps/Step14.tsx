'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step14() {
  return (
    <div>
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
          context). But for a fast, transparent baseline on text, Naive Bayes remains a first-rate
          choice.
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

      <ExplanationBox title="What You've Learned">
        <p>
          You have built a complete spam classifier from first principles. The full pipeline is just
          five steps you now understand end to end:
        </p>
        <ol style={{ lineHeight: '2' }}>
          <li>
            <strong>Count</strong> — one pass over the training emails tallies how often each word
            appears in each class. Those counts, divided by class totals, become the likelihood table
            — and that table <em>is</em> the model.
          </li>
          <li>
            <strong>Prior × likelihood product</strong> — to score a new email, start from the class
            prior and multiply in P(word | class) for every word it contains, once per class.
          </li>
          <li>
            <strong>Smoothing</strong> — add-one (Laplace) smoothing keeps an unseen word from
            zeroing out an entire class score.
          </li>
          <li>
            <strong>Log space</strong> — replace the fragile product with a sum of logs so long
            documents never underflow to zero.
          </li>
          <li>
            <strong>Compare</strong> — whichever class has the higher (log) score wins; normalise the
            two scores to read off a true posterior probability.
          </li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          Count, multiply, smooth, log, compare. That is Naive Bayes — fast, transparent, and
          surprisingly hard to beat as a text-classification baseline.
        </p>
      </ExplanationBox>
    </div>
  );
}
