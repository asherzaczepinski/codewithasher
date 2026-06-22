'use client';

import ExplanationBox from '@/components/ExplanationBox';
import NBLikelihoodTable from '@/components/NBLikelihoodTable';

export default function Step9() {
  return (
    <div>
      <ExplanationBox title="Training Is Just Counting">
        <p>
          There is no fancy optimisation in Naive Bayes — no gradient descent, no iterations.
          &quot;Training&quot; means making a single pass over your labelled emails and{' '}
          <strong>counting how often each word appears in each class</strong>. That is it.
        </p>
        <p>
          We have 100 labelled emails: 40 spam and 60 ham. For every word in our vocabulary we tally
          how many spam emails contained it and how many ham emails contained it. Those raw counts
          are the entire result of training.
        </p>
      </ExplanationBox>

      <NBLikelihoodTable />

      <ExplanationBox title="From Counts to Probabilities">
        <p>
          A raw count is not yet a probability. To turn the count of a word in a class into{' '}
          <strong>P(word | class)</strong>, we divide by the number of emails in that class. The word
          &quot;free&quot; appeared in 32 of the 40 spam emails, so:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          P(free | spam) = 32 / 40 = 0.800
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The same word appeared in only 4 of the 60 ham emails, so P(free | ham) = 4 / 60 ≈ 0.067.
          Toggle the table above to &quot;P(word | class)&quot; and you will see every count converted
          this way. &quot;winner&quot; is even more lopsided (0.700 vs 0.017), while
          &quot;meeting&quot; flips the pattern (0.050 vs 0.700).
        </p>
      </ExplanationBox>

      <ExplanationBox title="This Table IS the Model">
        <p>
          Once the table is filled in, you are done. There are no other parameters hiding anywhere —
          the likelihood table, together with the class priors P(spam) = 0.40 and P(ham) = 0.60,{' '}
          <strong>is the complete Naive Bayes model</strong>.
        </p>
        <p>
          To classify a new email you will simply look up each of its words in this table and
          multiply the probabilities together, once for spam and once for ham. Because the model is
          just a table of counts, you can read it, audit it, and explain exactly why any email was
          flagged — a transparency most modern classifiers cannot offer.
        </p>
      </ExplanationBox>
    </div>
  );
}
