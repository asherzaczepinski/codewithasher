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
          The <strong>output</strong> here is the neuron&apos;s final prediction — the rain confidence
          percentage that sigmoid spits out. In our example, that&apos;s 70%. The <strong>loss</strong>
          is the number measuring how wrong that was. It rained, so the target was 100%, and the
          loss captures that 30-point gap.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This first rate asks: if the prediction nudged up slightly — say from 70% to 70.1% —
          how much would the loss drop? When the prediction is way off like ours is, that nudge
          helps a lot. The loss is falling steeply and any improvement matters. But if the
          prediction were already at 99%, nudging it to 99.1% barely changes anything — the loss
          was already near zero.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The sign matters too. Our prediction is below the target (70% vs 100%), so pushing
          the output up reduces the loss — this rate comes out negative. If we had predicted
          110% somehow and overshot, pushing the output up would make things worse — positive
          rate. The sign is what tells the network which direction to move each weight.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Output vs Weighted Sum">
        <p>
          Inside every neuron, the weighted sum is the raw number computed before sigmoid —
          say it comes out to 0.85. Sigmoid then converts that into the output confidence:
          sigmoid(0.85) ≈ 70%. That 70% is what the neuron sends forward and what eventually
          becomes the final prediction.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Step 2 asks: if the weighted sum nudged from 0.85 to 0.86, how much would the
          output move from 70%? The answer depends on the slope of the sigmoid curve at
          that exact point. At 70% output, sigmoid still has decent slope — the output would
          move noticeably. But imagine a different neuron whose weighted sum is so large that
          sigmoid has already pushed its output to 98%. That neuron is sitting on the flat
          tail of the S-curve. Nudging its weighted sum from 3.9 to 4.0 barely changes
          the output at all — it stays stuck at roughly 98% no matter what.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Why does this matter for correction? Because the correction to the weighted sum
          has to travel through this slope to reach the output. If the slope is nearly zero,
          the correction signal gets multiplied by nearly zero — and arrives at the output
          as almost nothing. That neuron can&apos;t learn. This is the <strong>vanishing gradient
          problem</strong>: a neuron saturated near 0% or 100% stops responding to corrections
          no matter how wrong the network is.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 3: Weighted Sum vs Each Weight">
        <p>
          Now we trace one step further back. The weighted sum is built by multiplying each
          input by its weight and adding everything up. Say humidity is 0.9 and its weight
          is 0.4 — that contributes 0.9 × 0.4 = 0.36 to the weighted sum. Temperature is
          0.2 and its weight is 0.6 — that contributes 0.2 × 0.6 = 0.12.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Step 3 asks: if the humidity weight nudged from 0.4 to 0.41, how much would the
          weighted sum change? The answer is exactly the humidity input — 0.9. That tiny
          +0.01 change to the weight gets multiplied by 0.9 on its way into the weighted
          sum. Now do the same for temperature: nudging its weight by +0.01 only changes
          the weighted sum by 0.2 — because temperature&apos;s input was 0.2, not 0.9. Humidity
          has the bigger lever arm, so changes to its weight have more impact.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This is why the correction isn&apos;t the same for every weight. The humidity weight
          contributed more to the weighted sum, which contributed more to the prediction,
          which contributed more to the mistake — so it gets the larger correction. The
          temperature weight had less influence end-to-end, so it gets a smaller nudge.
          The bias has no input at all, just a lever arm of 1, so it always gets the
          correction exactly as-is.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How the Three Steps Chain Together">
        <p>
          Here&apos;s the key idea. Each step feeds into the next, so a correction has to travel
          through all three to reach a weight. Take the humidity weight as an example:
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Step 1 tells you how sensitive the loss is to the output right now — the prediction
          was 70% and the target was 100%, so the loss is dropping fast and there&apos;s a strong
          signal to improve. Step 2 tells you how much the output actually moves when the
          weighted sum moves — sigmoid has decent slope at 70%, so corrections pass through
          reasonably well. Step 3 tells you how much the weighted sum moves when the humidity
          weight moves — humidity was 0.9, so its weight has a strong lever arm.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Multiply those three rates together and you get the humidity weight&apos;s gradient:
          a number that says exactly how much this weight pushed the prediction in the wrong
          direction, and therefore exactly how much to correct it. Every weight in the
          network gets its own version of this calculation — same first two rates for all
          weights in the same neuron, but a different third rate depending on what input
          each weight is connected to.
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
