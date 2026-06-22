'use client';

import ExplanationBox from '@/components/ExplanationBox';
import NBLiveClassifier from '@/components/NBLiveClassifier';

export default function Step11() {
  return (
    <div>
      <ExplanationBox title="Put It All Together">
        <p>
          You have seen every piece: priors, likelihoods, the multiply-and-compare rule, and the
          normalisation to a posterior. Now run the whole machine yourself. The classifier below
          starts from the priors P(spam) = 0.40 and P(ham) = 0.60 and multiplies in the likelihood of
          every word you switch on.
        </p>
        <p>
          Tick words on and off and watch both class scores update instantly. Each word is coloured by
          which class it favours — red words push toward spam, blue words push toward ham.
        </p>
      </ExplanationBox>

      <NBLiveClassifier />

      <ExplanationBox title="Watch the Evidence Compound">
        <p>
          Add a single strong spam word like <strong style={{ color: '#dc2626' }}>winner</strong>{' '}
          (0.700 vs 0.017) and the spam score barely shrinks while the ham score is crushed by a
          factor of roughly 40. Add a second spam word and the gap widens again. This is{' '}
          <strong>evidence compounding</strong>: each word multiplies into the running score, so
          several mild signals combine into a confident verdict.
        </p>
        <p>
          Watch the multiplication chains in the two boxes. Every line is one word&apos;s likelihood
          being folded in. The confidence bar at the bottom is just the spam score divided by the sum
          of both scores — the normalised posterior P(spam | words).
        </p>
      </ExplanationBox>

      <ExplanationBox title="When Spam Words and Ham Words Disagree">
        <p>
          The interesting cases are mixed emails. Turn on{' '}
          <strong style={{ color: '#dc2626' }}>free</strong> and{' '}
          <strong style={{ color: '#dc2626' }}>winner</strong> together with{' '}
          <strong style={{ color: '#2563eb' }}>meeting</strong> and{' '}
          <strong style={{ color: '#2563eb' }}>agenda</strong>. Now both sides are pulling hard. The
          verdict goes to whichever side&apos;s likelihoods, multiplied with the prior, produce the
          larger product.
        </p>
        <p>
          Try to find a tipping point — the exact set of words where the bar sits near 50/50. You will
          notice that one strong word (a likelihood near 0.7 against 0.02) outweighs two or three weak
          ones. That is the model telling you which words it considers the most decisive evidence.
        </p>
      </ExplanationBox>
    </div>
  );
}
