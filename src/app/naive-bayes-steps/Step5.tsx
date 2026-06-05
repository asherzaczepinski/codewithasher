'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Full Classification Formula">
        <p>
          We now have every ingredient. To classify a new email containing words
          w₁, w₂, …, wₙ we compute an <strong>unnormalised score</strong> for each class and
          pick the winner:
        </p>
      </ExplanationBox>

      <MathFormula label="Naive Bayes Score for a Class">
        score(class) = P(class) × P(w₁ | class) × P(w₂ | class) × … × P(wₙ | class)
      </MathFormula>

      <ExplanationBox title="The Setup">
        <p>
          We have 100 labelled training emails: <strong>40 spam</strong> and <strong>60 ham</strong>.
          From them we have estimated the following per-word likelihoods (fraction of emails in
          that class that contain the word):
        </p>
        <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '0.75rem' }}>
          <thead>
            <tr style={{ background: '#f0f4ff' }}>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'left' }}>Word</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>P(word | spam)</th>
              <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>P(word | ham)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>free</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>0.800</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>0.067</td>
            </tr>
            <tr style={{ background: '#fafafa' }}>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>winner</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>0.700</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>0.017</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ccc', padding: '8px' }}>meeting</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>0.050</td>
              <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'right' }}>0.700</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.75rem' }}>
          A new email arrives with the subject line: <strong>&quot;Free winner meeting.&quot;</strong>
          It contains all three words. Let&apos;s classify it.
        </p>
      </ExplanationBox>

      <WorkedExample title="Step-by-Step Classification">
        <p><strong>Step A — Priors</strong></p>
        <CalcStep number={1}>P(spam) = 40 / 100 = 0.400</CalcStep>
        <CalcStep number={2}>P(ham)  = 60 / 100 = 0.600</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step B — Spam Score</strong></p>
        <CalcStep number={3}>Start with prior: 0.400</CalcStep>
        <CalcStep number={4}>Multiply by P(&quot;free&quot; | spam) = 0.800 → 0.400 × 0.800 = 0.3200</CalcStep>
        <CalcStep number={5}>Multiply by P(&quot;winner&quot; | spam) = 0.700 → 0.3200 × 0.700 = 0.2240</CalcStep>
        <CalcStep number={6}>Multiply by P(&quot;meeting&quot; | spam) = 0.050 → 0.2240 × 0.050 = 0.01120</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step C — Ham Score</strong></p>
        <CalcStep number={7}>Start with prior: 0.600</CalcStep>
        <CalcStep number={8}>Multiply by P(&quot;free&quot; | ham) = 0.067 → 0.600 × 0.067 = 0.04020</CalcStep>
        <CalcStep number={9}>Multiply by P(&quot;winner&quot; | ham) = 0.017 → 0.04020 × 0.017 = 0.000683</CalcStep>
        <CalcStep number={10}>Multiply by P(&quot;meeting&quot; | ham) = 0.700 → 0.000683 × 0.700 = 0.000478</CalcStep>

        <p style={{ marginTop: '1rem' }}><strong>Step D — Compare and Decide</strong></p>
        <CalcStep number={11}>Spam score: 0.01120</CalcStep>
        <CalcStep number={12}>Ham score:  0.000478</CalcStep>
        <CalcStep number={13}>0.01120 &gt; 0.000478 → classify as SPAM</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Even though &quot;meeting&quot; is a strong ham indicator, the two powerhouse spam words
          <em> free</em> and <em>winner</em> combined with the spam prior were enough to
          overwhelm it. The spam score is roughly <strong>23 times larger</strong> than the
          ham score, so the classifier confidently labels this email as spam.
        </p>
        <p>
          Notice that the word &quot;meeting&quot; did meaningfully pull the ham score upward — the
          classifier is not ignoring it. Every word contributes, and the final decision reflects
          the balance of all the evidence.
        </p>
      </WorkedExample>

      <ExplanationBox title="Interpreting the Raw Scores">
        <p>
          The numbers 0.01120 and 0.000478 are <em>not</em> true probabilities — they do not
          sum to 1 because we dropped the denominator P(words). They are proportional to the
          true posterior probabilities. If you want calibrated probabilities you can normalise:
        </p>
      </ExplanationBox>

      <MathFormula label="Normalising to a True Posterior">
        P(spam | words) = score(spam) / (score(spam) + score(ham))
        = 0.01120 / (0.01120 + 0.000478) ≈ 0.959
      </MathFormula>

      <ExplanationBox title="The Result">
        <p>
          After normalising, the classifier assigns a <strong>95.9 % posterior probability</strong> to
          spam. In a production spam filter you might mark anything above 90 % as spam and
          let everything else through — this email would be filtered automatically.
        </p>
      </ExplanationBox>
    </div>
  );
}
