'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What Conditional Probability Means">
        <p>
          Plain probability asks: out of all possible outcomes, how often does event A happen?
          Conditional probability asks something sharper: <strong>given that B has already
          happened</strong>, how often does A happen?
        </p>
        <p>
          We write this as <strong>P(A | B)</strong> — read aloud as &quot;the probability of A
          given B.&quot; The vertical bar means &quot;given that we already know.&quot;
        </p>
        <p>
          The formal definition ties it to a ratio: out of all the times B occurred, in what
          fraction of those times did A also occur?
        </p>
      </ExplanationBox>

      <MathFormula label="Conditional Probability">
        P(A | B) = P(A and B) / P(B)
      </MathFormula>

      <ExplanationBox title="Updating Your Belief">
        <p>
          Think of conditional probability as <strong>belief revision</strong>. Before you open
          an email you might estimate a 20 % chance it is spam — that is your
          <em> prior</em> belief. After you read the word <em>free</em> in the subject line,
          your belief updates. You now assign a much higher probability to spam — that
          updated belief is the <em>posterior</em>.
        </p>
        <p>
          Naive Bayes formalises exactly this update process: start with a prior for each class,
          then revise it upward or downward as each new word of evidence arrives.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Small Word / Spam Table">
        <p>
          Suppose we have labelled 100 emails. Here is a small count table for three words:
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '0.75rem' }}>
          <thead>
            <tr style={{ background: '#f0f4ff' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Word</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>Appears in spam (of 40)</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>Appears in ham (of 60)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>free</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>32</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>4</td>
            </tr>
            <tr style={{ background: '#fafafa' }}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>meeting</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>2</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>42</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>winner</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>28</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>1</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.75rem' }}>
          From this table we can read off conditional probabilities directly.
          P(word = &quot;free&quot; | spam) = 32/40 = <strong>0.80</strong>.
          P(word = &quot;free&quot; | ham) = 4/60 ≈ <strong>0.067</strong>.
        </p>
        <p>
          The word <em>free</em> is twelve times more likely to appear in spam than in ham.
          That is powerful evidence — and the classifier will exploit exactly this ratio.
        </p>
      </ExplanationBox>

      <WorkedExample title="Reading a Conditional Probability">
        <p>Using the table above, let&apos;s compute P(spam | word = &quot;winner&quot;) step by step.</p>
        <CalcStep number={1}>Total emails: 100. Spam emails: 40. Ham emails: 60.</CalcStep>
        <CalcStep number={2}>Emails containing &quot;winner&quot;: 28 spam + 1 ham = 29 total.</CalcStep>
        <CalcStep number={3}>P(spam and &quot;winner&quot;) = 28 / 100 = 0.28</CalcStep>
        <CalcStep number={4}>P(&quot;winner&quot;) = 29 / 100 = 0.29</CalcStep>
        <CalcStep number={5}>P(spam | &quot;winner&quot;) = 0.28 / 0.29 ≈ 0.966</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          An email containing &quot;winner&quot; has a <strong>96.6 % probability of being spam</strong> based
          on this training set. One word alone is already very informative.
        </p>
      </WorkedExample>
    </div>
  );
}
