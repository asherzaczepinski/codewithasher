'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step10() {
  const cellStyle: React.CSSProperties = {
    padding: '8px 12px',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
  };

  return (
    <div>
      <ExplanationBox title="The Full Classification Formula">
        <p>
          We now have every ingredient. To classify a new email containing words w₁, w₂, …, wₙ we
          compute an unnormalised score for each class and pick the winner:
        </p>
      </ExplanationBox>

      <MathFormula label="Naive Bayes Score for a Class">
        score(class) = P(class) × P(w₁ | class) × P(w₂ | class) × … × P(wₙ | class)
      </MathFormula>

      <ExplanationBox title="The Setup">
        <p>
          Suppose training gave us the following likelihoods, and that there were 40 spam and 60 ham
          emails. A new email with the subject &quot;Free winner meeting.&quot; contains all three
          words below.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: '#fff',
              borderRadius: 10,
              overflow: 'hidden',
              fontSize: 14,
              margin: '0.75rem 0',
            }}
          >
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ ...cellStyle, textAlign: 'left', fontWeight: 700 }}>Word</th>
                <th style={{ ...cellStyle, color: '#dc2626', fontWeight: 700 }}>P(word|spam)</th>
                <th style={{ ...cellStyle, color: '#2563eb', fontWeight: 700 }}>P(word|ham)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { w: 'free', s: '0.800', h: '0.067' },
                { w: 'winner', s: '0.700', h: '0.017' },
                { w: 'meeting', s: '0.050', h: '0.700' },
              ].map((r) => (
                <tr key={r.w}>
                  <td style={{ ...cellStyle, textAlign: 'left', fontWeight: 600 }}>{r.w}</td>
                  <td style={{ ...cellStyle, color: '#dc2626' }}>{r.s}</td>
                  <td style={{ ...cellStyle, color: '#2563eb' }}>{r.h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ExplanationBox>

      <WorkedExample title="Step-by-Step Classification">
        <p style={{ fontWeight: 600, color: '#64748b' }}>Step A — Priors</p>
        <CalcStep number={1}>P(spam) = 40 / 100 = 0.400</CalcStep>
        <CalcStep number={2}>P(ham) = 60 / 100 = 0.600</CalcStep>

        <p style={{ fontWeight: 600, color: '#dc2626', marginTop: '1rem' }}>Step B — Spam Score</p>
        <CalcStep number={3}>Start with prior: 0.400</CalcStep>
        <CalcStep number={4}>
          Multiply by P(&quot;free&quot; | spam) = 0.800 → 0.400 × 0.800 = 0.3200
        </CalcStep>
        <CalcStep number={5}>
          Multiply by P(&quot;winner&quot; | spam) = 0.700 → 0.3200 × 0.700 = 0.2240
        </CalcStep>
        <CalcStep number={6}>
          Multiply by P(&quot;meeting&quot; | spam) = 0.050 → 0.2240 × 0.050 = 0.01120
        </CalcStep>

        <p style={{ fontWeight: 600, color: '#2563eb', marginTop: '1rem' }}>Step C — Ham Score</p>
        <CalcStep number={7}>Start with prior: 0.600</CalcStep>
        <CalcStep number={8}>
          Multiply by P(&quot;free&quot; | ham) = 0.067 → 0.600 × 0.067 = 0.04020
        </CalcStep>
        <CalcStep number={9}>
          Multiply by P(&quot;winner&quot; | ham) = 0.017 → 0.04020 × 0.017 = 0.000683
        </CalcStep>
        <CalcStep number={10}>
          Multiply by P(&quot;meeting&quot; | ham) = 0.700 → 0.000683 × 0.700 = 0.000478
        </CalcStep>

        <p style={{ fontWeight: 600, color: '#1e293b', marginTop: '1rem' }}>
          Step D — Compare and Decide
        </p>
        <CalcStep number={11}>Spam score: 0.01120</CalcStep>
        <CalcStep number={12}>Ham score: 0.000478</CalcStep>
        <CalcStep number={13}>0.01120 &gt; 0.000478 → classify as SPAM</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Notice that &quot;meeting&quot; is a strong ham indicator — it multiplied the ham score by
          0.700 but slashed the spam score by 0.050. Yet the combination of &quot;free&quot; and
          &quot;winner&quot; plus the spam prior overwhelm it. The spam score ends up roughly{' '}
          <strong>23× larger</strong> than the ham score. Every word contributes to the final
          decision; no single word decides it alone.
        </p>
      </WorkedExample>

      <ExplanationBox title="Interpreting the Raw Scores">
        <p>
          These scores — 0.01120 and 0.000478 — are <em>not</em> true probabilities. We dropped the
          denominator P(words) that would normalise them, because it is identical for both classes
          and therefore irrelevant to deciding which is larger. They are perfectly good for ranking,
          but to read them as a confidence we must normalise.
        </p>
      </ExplanationBox>

      <MathFormula label="Normalising to a True Posterior">
        P(spam | words) = score(spam) / (score(spam) + score(ham)) = 0.01120 / (0.01120 + 0.000478) ≈ 0.959
      </MathFormula>

      <ExplanationBox title="The Result">
        <p>
          The posterior probability that this email is spam is about <strong>95.9%</strong>. A
          production spam filter would typically mark anything above 90% as spam, so
          &quot;Free winner meeting.&quot; lands firmly in the junk folder — exactly the outcome we
          would expect.
        </p>
      </ExplanationBox>
    </div>
  );
}
