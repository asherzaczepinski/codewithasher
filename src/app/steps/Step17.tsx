'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step17() {
  return (
    <div>
      <ExplanationBox title="Does the Bias Get Trained Too?">
        <p>
          Backpropagation handed a correction to every <strong>weight</strong> in the network. But
          each neuron also carries a <strong>bias</strong>. Does it get trained — and if so, does it
          need some special, separate rule of its own?
        </p>
        <p>
          The answer is the nicest kind: <strong>no special rule</strong>. The bias learns the exact
          same way a weight does. Here is the one idea that makes that true.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Bias Is Just a Weight Whose Input Is Always 1">
        <p>
          Look at what a neuron computes: it multiplies each input by a weight, adds those up, then
          adds the bias. Now notice — the bias is just <em>one more term in that sum</em>. You can
          think of it as a weight attached to an invisible input that is permanently stuck at{' '}
          <strong>1</strong>.
        </p>
        <p>
          That reframing is the whole trick. If the bias is &quot;a weight with input 1,&quot; then
          backpropagation doesn&apos;t have to treat it specially. It runs the same step it runs for
          every weight: take the neuron&apos;s <strong>blame</strong> and multiply it by that
          knob&apos;s input.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Same Rule, One Tiny Difference">
        <p>
          A correction is always <strong>blame × input</strong>. The blame — how wrong the neuron
          was — is identical for everything attached to the neuron. The only thing that changes from
          knob to knob is the input it gets multiplied by:
        </p>
        <MathFormula label="Weight update">
          weight ← weight − learning rate × (blame × input)
        </MathFormula>
        <MathFormula label="Bias update">
          bias ← bias − learning rate × (blame × 1)
        </MathFormula>
        <p style={{ marginTop: '0.75rem' }}>
          Same equation, top and bottom. A weight gets scaled by its input; the bias gets scaled by
          1. And since multiplying by 1 changes nothing, the bias simply collects the neuron&apos;s
          full, undiluted blame.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How Does It Know Which Way to Push?">
        <p>
          Each update can push a knob <strong>up</strong> or <strong>down</strong>. So how does it
          decide which? It doesn&apos;t need a map or a memory — it just compares the neuron&apos;s
          guess to the truth. The direction is simply the <strong>sign of (prediction − target)</strong>.
        </p>
        <p>
          Take our rain neuron on a day it&apos;s <strong>pouring</strong> (target = 100%), but the
          neuron only predicted <strong>30%</strong>. The gap is 0.30 − 1.00 = <strong>−0.70</strong>,
          a negative blame. Drop that into <em>bias ← bias − learning rate × blame</em>: subtracting
          a negative number pushes the bias <strong>up</strong>. A higher bias makes the neuron more
          eager to fire, so next time it guesses higher — climbing toward 100%. Exactly what we want.
        </p>
        <p>
          Now flip it: a <strong>bone-dry</strong> day (target = 0%) where the neuron wrongly
          predicted <strong>85%</strong>. The gap is 0.85 − 0 = <strong>+0.85</strong>, a positive
          blame. The same rule now pushes the bias <strong>down</strong>, making the neuron more
          reluctant, so its next guess drops toward 0%. The direction was never decided by hand — it
          falls straight out of whether the guess landed <em>above</em> or <em>below</em> the truth.
          (The sigmoid slope only scales <em>how big</em> the step is; the <em>sign</em> — the
          direction — comes entirely from that gap.)
        </p>
      </ExplanationBox>

      <ExplanationBox title="How Far It Moves Depends on How Much Blame It Gets">
        <p>
          The <em>size</em> of each step is just the size of the blame. So a neuron that is already
          nearly right barely moves. If our rain neuron predicts <strong>98%</strong> on a rainy day,
          the gap is only <strong>−0.02</strong> — a tiny correction, and the bias inches up by almost
          nothing. A neuron that is rarely wrong keeps its bias close to where it started; it never
          really needed a starting line at all.
        </p>
        <p>
          But a neuron that is <strong>consistently, badly wrong in the same direction</strong> keeps
          collecting big blame every round. Say it under-predicts rain over and over — each pass hands
          it another large negative blame, so its bias keeps drifting <strong>up</strong>, step after
          step, piling up into a real, meaningful value. That settled value <em>is</em> the starting
          line — the head start that makes the neuron lean toward firing before any input even arrives.
        </p>
        <p>
          So the amount of blame decides how much the bias ends up mattering: <strong>little blame →
          the bias stays near nothing</strong>; <strong>lots of blame → the bias settles at a
          definite amount</strong>, wherever it needs to be so the neuron starts in the right place.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Wait — Isn&apos;t This Extra Knob Kind of Pointless?">
        <p>
          By now you might be thinking the bias is a bit silly — a whole separate dial that just
          multiplies by 1? Why not let the weights do everything? It&apos;s a fair doubt, so here is
          what the bias actually buys you.
        </p>
        <p>
          Weights can only ever <strong>scale the inputs you have</strong>. So picture a moment when
          the readings are quiet — temperature and humidity both near zero. With no bias, the
          weighted sum is 0, and the neuron is <strong>forced to sit exactly on the fence</strong>:
          sigmoid(0) = 50%. It has no way to lean one way or the other before the evidence arrives.
        </p>
        <p>
          But real situations have a <em>default</em>. Imagine our rain network lives in a rainforest
          town where it pours most days. A good rain neuron should <strong>start out expecting
          rain</strong> and only be talked out of it by genuinely hot, dry readings. The weights
          can&apos;t express that — they only react to inputs. The <strong>bias</strong> is what lets
          the neuron say &quot;my default guess is high; convince me otherwise.&quot; A negative bias
          says the opposite: &quot;assume no rain unless the evidence is strong.&quot;
        </p>
        <p>
          That&apos;s the overall purpose: weights decide <strong>how much to listen to each piece of
          evidence</strong>, and the bias decides <strong>how easily the neuron is convinced in the
          first place</strong>. Without it, every neuron&apos;s decision would be nailed to the
          origin — always 50/50 when the inputs are quiet. The bias unsticks that starting point and
          lets each neuron set its own. That flexibility is exactly why the extra knob is worth it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why the Difference Matters">
        <p>
          <strong>Weights re-weigh the evidence</strong> — how much each input should count — so it
          makes sense that a weight&apos;s correction is tied to how strong its input was. A weight
          fed by a dead, zero-valued input had no say in the mistake this round, so it gets no nudge.
        </p>
        <p>
          The <strong>bias re-sets the starting line</strong> — how eager the neuron is to fire
          before any input arrives. It has no input to tie it to, so it always takes the
          neuron&apos;s full share of the blame: when predictions run low, the bias drifts up so the
          neuron fires more readily next time; when they run high, it drifts down. Weights and bias
          are tuned in the same pass, by the same rule, separated only by that fixed input of 1.
        </p>
      </ExplanationBox>
    </div>
  );
}
