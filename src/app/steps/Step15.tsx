'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step15() {
  return (
    <div>
      <ExplanationBox title="The Network Was Wrong. Now What?">
        <p>
          Our network predicted 70% chance of rain. It actually rained. The correct answer was 100%. We were off.
        </p>
        <p>
          We computed the loss — a number that tells us how wrong we were. But that number alone
          doesn&apos;t tell us what to do about it. We have a whole network full of weights that all
          contributed to this wrong answer. Which ones do we change? By how much? In which direction?
        </p>
        <p>
          That&apos;s the question this step answers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Blame Each Weight for Its Share of the Mistake">
        <p>
          Think of it like this. The network just made a bad call. You want to trace that mistake
          backward through every neuron and figure out which weights were responsible.
        </p>
        <p>
          For each weight, there&apos;s one question: <em>if this weight had been slightly larger, would
          the prediction have gotten closer to the right answer or further away?</em>
        </p>
        <p>
          If larger = closer to right, the weight is too small — increase it.
          If larger = further from right, the weight is too large — decrease it.
          And the more a weight contributed to the mistake, the bigger the correction it needs.
        </p>
        <p>
          This &quot;blame score&quot; for each weight is called its <strong>gradient</strong>. Once you
          have the gradient for every weight, you have a complete map of exactly what to change
          and in which direction. That&apos;s the whole goal.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Trick: Break the Chain Into Simple Pieces">
        <p style={{ marginBottom: '0.75rem' }}>
          A weight doesn&apos;t sit right next to the loss — it affects the weighted sum, which affects
          the output, which affects the loss. The effect is indirect, rippling through every step in between.
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          margin: '0.25rem 0 1rem',
          flexWrap: 'wrap',
        }}>
          {['weight', 'weighted sum', 'output', 'loss'].map((label, i, arr) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{
                padding: '0.3rem 0.65rem',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                whiteSpace: 'nowrap',
              }}>{label}</span>
              {i < arr.length - 1 && (
                <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 300 }}>→</span>
              )}
            </span>
          ))}
        </div>
        <p>
          Each step in that chain is simple on its own. All you need to know at each arrow is:
          if the value on the left nudges up slightly, how much does the value on the right move?
          There&apos;s one rate for each arrow. Multiply all three rates together and you have the
          weight&apos;s gradient — its exact share of the blame for the mistake.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Computing the Correction for Each Weight">
        <p>
          To correct a weight we need to know two things: how much did it contribute to the mistake,
          and which direction should it move? The answer comes from measuring the rate of change at
          each link in the chain — weight → weighted sum → output → loss. Each link has one rate.
          Multiply all three together and you get the weight&apos;s gradient: a single number whose size
          tells you how big a correction it needs and whose sign tells you which direction.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 1: Loss vs Output">
        <p>
          The further the prediction is from the target, the faster the loss is climbing — so
          nudging the output helps a lot when the error is large, and barely at all when the
          prediction is close. The sign tells you direction: if the prediction is below the target
          this rate is negative (increasing the output reduces the loss), and positive if above.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Output vs Weighted Sum">
        <p>
          This rate depends on where the neuron sits on the sigmoid curve. On the steep middle
          section a small change to the weighted sum moves the output a lot. On the flat ends
          near 0 or 1 the output barely budges no matter what you do — that&apos;s the
          <strong> vanishing gradient problem</strong>: the correction signal shrinks to near
          zero and learning stalls for that neuron.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 3: Weighted Sum vs Each Weight">
        <p>
          A weight&apos;s effect on the weighted sum is exactly proportional to its input — a weight
          connected to a strong input has a big lever arm, a weak input a small one. That&apos;s why
          weights connected to stronger inputs get larger corrections: they had more influence
          over the wrong prediction. The bias is the special case — its lever arm is always 1,
          so it always gets the full correction signal unchanged.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Every Weight Gets Its Own Gradient">
        <p>
          Multiply the three rates together and you have one weight&apos;s gradient. Do that for every
          weight in the network — each one gets its own number, its own direction, its own
          correction sized exactly to how much it was responsible. That&apos;s the complete picture
          of what went wrong and what to fix. The next step is applying those corrections.
        </p>
      </ExplanationBox>

    </div>
  );
}
