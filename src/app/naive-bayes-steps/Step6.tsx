'use client';

import ExplanationBox from '@/components/ExplanationBox';
import NBBeliefUpdate from '@/components/NBBeliefUpdate';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Belief Is a Number That Updates">
        <p>
          Bayes&apos; theorem is best understood as a machine for <strong>updating belief</strong>. You
          begin with a number — your prior, say a 40 % hunch that an email is spam. Then each piece of
          evidence nudges that number up or down. When the evidence runs out, the number you are left
          with is your posterior: your final, informed belief.
        </p>
        <p>
          The slider below sets the prior P(spam). The checkboxes add words of evidence. Watch the bar
          move as belief flows from prior to posterior. Nothing here is hand-waved — every position of
          the bar is computed from the same canonical likelihoods we&apos;ve been using.
        </p>
      </ExplanationBox>

      <NBBeliefUpdate />

      <ExplanationBox title="Evidence Multiplies, It Doesn't Add">
        <p>
          A common mistake is to imagine evidence stacking up like points on a scoreboard. It doesn&apos;t.
          Each word <strong>multiplies</strong> the running score by a likelihood ratio. The word{' '}
          <em>free</em> multiplies the spam side by P(free|spam)=0.80 and the ham side by only
          P(free|ham)=0.067 — a roughly 12× swing toward spam, applied as a factor, not a sum.
        </p>
        <p>
          Multiplication is why a single very spammy word can move the bar dramatically, and why
          combining two spammy words is far stronger than either alone — their ratios compound. Toggle{' '}
          <em>free</em> off and on and feel how much one factor shifts the posterior.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Stacking Evidence">
        <p>
          Turn on <em>free</em> and <em>winner</em> together. Each pulls hard toward spam, and because
          their ratios multiply, the posterior pins almost to 100 %. Now add <em>meeting</em> — a strong
          ham word. It tugs the bar back, but it cannot fully undo two damning words: the spam factors
          still dominate the product. This is exactly the &quot;free winner meeting&quot; email you&apos;ll
          score by hand in a later step.
        </p>
        <p>
          Notice too what the prior slider does. Drop the prior to a few percent and even good spam
          evidence struggles; raise it and the email tips to spam with almost no words. The posterior is
          always a tug-of-war between <strong>how common a class is</strong> (the prior) and{' '}
          <strong>how well the words fit it</strong> (the likelihood) — which is Bayes&apos; theorem made
          visible.
        </p>
      </ExplanationBox>
    </div>
  );
}
