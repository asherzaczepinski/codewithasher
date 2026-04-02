'use client';

import ExplanationBox from '@/components/ExplanationBox';

const CHAIN = ['weight', 'weighted sum', 'output', 'loss'] as const;

function ChainDiagram({ highlight }: { highlight: string[] }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      margin: '0.75rem 0',
      flexWrap: 'wrap',
    }}>
      {CHAIN.map((label, i) => {
        const active = highlight.includes(label);
        return (
          <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span style={{
              padding: '0.3rem 0.65rem',
              background: active ? '#dcfce7' : '#f1f5f9',
              border: `1px solid ${active ? '#86efac' : '#e2e8f0'}`,
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: active ? '#166534' : '#94a3b8',
              whiteSpace: 'nowrap',
            }}>{label}</span>
            {i < CHAIN.length - 1 && (
              <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 300 }}>→</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

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


<ExplanationBox title="The Trick: Break the Chain Into Simple Pieces">
        <p>
          A weight&apos;s effect on the loss is indirect — it ripples through the weighted sum, then
          the output, then finally the loss. Instead of trying to figure out that whole chain at
          once, you just look at each step on its own and measure what happens there. Put those
          pieces together and you have everything you need to know how much this weight was
          responsible for the mistake.
        </p>
      </ExplanationBox>

<ExplanationBox title="Step 1: Loss vs Output">
        <ChainDiagram highlight={['output', 'loss']} />
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
        <p style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
          <strong>Summary:</strong> Step 1 gives you the urgency and direction of the correction — how badly the network messed up, and whether weights need to go up or down. This number is the same for every weight in the neuron.
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '13px', color: '#6b21a8' }}>
          <strong>To fix it:</strong> The only way to reduce the loss is to change weights so the output moves toward the target. If the prediction is too low, weights need to increase the output. If it&apos;s too high, weights need to decrease it. Step 1 tells you which — the sign of this rate is the direction every weight in the neuron will move.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Output vs Weighted Sum">
        <ChainDiagram highlight={['weighted sum', 'output']} />
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
        <p style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
          <strong>Summary:</strong> Step 2 tells you whether the correction can actually get through. It&apos;s a gate — wide open when the neuron is in the middle of the sigmoid curve, nearly shut when it&apos;s stuck near 0 or 1. Also the same for every weight in the neuron.
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '13px', color: '#6b21a8' }}>
          <strong>To fix it:</strong> If the gate is nearly shut — neuron stuck near 0% or 100% — adjusting any single weight in this neuron barely helps, because the correction gets killed by the flat sigmoid slope before it can move the output. The deeper fix is to change the weights feeding into this neuron from the previous layer, pulling its weighted sum back toward zero so sigmoid puts it on the steep part of the curve again where corrections can flow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 3: Weighted Sum vs Each Weight">
        <ChainDiagram highlight={['weight', 'weighted sum']} />
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
        <p style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
          <strong>Summary:</strong> Step 3 is the only rate that&apos;s different for each weight. Because all inputs are normalized to the same 0-to-1 scale, comparing them directly tells you which weight had the most leverage over the weighted sum relative to the others — and therefore which weight deserves the biggest correction.
        </p>
        <p style={{ marginTop: '0.5rem', padding: '0.6rem 0.8rem', background: '#faf5ff', border: '1px solid #d8b4fe', borderRadius: '6px', fontSize: '13px', color: '#6b21a8' }}>
          <strong>To fix it:</strong> Each weight gets nudged by an amount proportional to its input. The humidity weight (input 0.9) gets a bigger adjustment than the temperature weight (input 0.2) because nudging humidity&apos;s weight moves the weighted sum more. You can&apos;t fix the mistake equally across all weights — some had more say in the wrong answer than others, and the corrections reflect that exactly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Every Correction Happens Through Weights">
        <p style={{ padding: '0.6rem 0.8rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px', fontSize: '13px', color: '#1e40af', lineHeight: 1.65 }}>
          <strong>The only thing training ever changes is weights.</strong> That&apos;s it. The inputs are fixed measurements from the real world. The sigmoid function is fixed math. The loss formula is fixed. The only knobs the network has are the weights — and all three steps exist purely to figure out how to turn them. Step 1 says how urgently they need to move and in which direction. Step 2 says how effectively a change in any weight will actually reach the output right now — a stuck neuron means the knob is barely connected to anything. Step 3 says which weights are worth turning the most, because some are connected to stronger signals and have more pull over the outcome. Together the three steps produce a precise instruction for every single weight in the network: turn this one by this much, in this direction.
        </p>

        <p style={{ marginTop: '0.75rem', padding: '0.75rem 0.9rem', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '6px', fontSize: '13px', color: '#713f12', lineHeight: 1.75 }}>
          <strong>Example — watching the fix happen:</strong><br /><br />
          <strong>Before training:</strong> humidity weight = 0.40, temperature weight = 0.25, bias = −0.20<br />
          Weighted sum = (0.9 × 0.40) + (0.3 × 0.25) + (−0.20) = 0.36 + 0.075 − 0.20 = <strong>0.235</strong><br />
          sigmoid(0.235) = <strong>55.8% rain</strong> — too low, it actually rained.<br /><br />

          <strong>After one round of corrections</strong> (gradients applied, learning rate 0.5):<br />
          humidity weight: 0.40 → <strong>0.452</strong> &nbsp;·&nbsp; temperature weight: 0.25 → <strong>0.269</strong> &nbsp;·&nbsp; bias: −0.20 → <strong>−0.137</strong><br />
          New weighted sum = (0.9 × 0.452) + (0.3 × 0.269) + (−0.137) = 0.407 + 0.081 − 0.137 = <strong>0.351</strong><br />
          sigmoid(0.351) = <strong>58.7%</strong> — better, still not there.<br /><br />

          <strong>After several more rounds:</strong><br />
          Round 3 → <strong>65.2%</strong> &nbsp;·&nbsp; Round 6 → <strong>74.8%</strong> &nbsp;·&nbsp; Round 10 → <strong>84.1%</strong> &nbsp;·&nbsp; Round 15 → <strong>92.4%</strong> &nbsp;·&nbsp; Round 22 → <strong>97.9%</strong> &nbsp;·&nbsp; Round 30 → <strong>99.3%</strong><br /><br />

          Each round the weights shift a little. Each shift pushes the weighted sum higher. Each higher weighted sum gives sigmoid a larger number to squeeze, pushing the confidence closer to 100%. The network never makes a single big leap — it takes many small, precise steps, each guided by the three rates, until the prediction converges on the right answer.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Each Step Is Really Doing">
        <p>
          Step 1 measures how bad the mistake was and in which direction — it&apos;s the raw error
          signal, the same number for every weight in the neuron. Step 2 measures how
          &quot;reachable&quot; the output is from the weighted sum right now — how much a push from
          inside the neuron can actually move the needle. This is also shared by every weight
          in the same neuron. Neither of those two rates has anything to do with which specific
          weight you&apos;re looking at.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Step 3 is the one that&apos;s unique to each weight, and it&apos;s answering a specific
          question: relative to the other weights in this neuron, how much influence did
          this weight have over the weighted sum? Because the inputs are normalized — all
          scaled to the same 0-to-1 range — you can compare them directly. A humidity input
          of 0.8 and a temperature input of 0.3 are on the same scale, so the ratio genuinely
          tells you that humidity&apos;s weight had about 2.7× more leverage over the weighted sum
          than temperature&apos;s weight did. That relative leverage is exactly what Step 3 captures —
          and it&apos;s why the correction each weight receives is proportional to how much it
          actually mattered.
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
          Multiply the three rates together and you have one weight&apos;s gradient — a single number
          encoding everything: how bad the mistake was, whether the neuron can receive a correction,
          and how much this specific weight was responsible for it. Steps 1 and 2 are identical for
          every weight in the same neuron. Step 3 is what makes each weight&apos;s gradient unique.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The result is a complete correction map for the entire network. Every weight gets a
          number. Every number has a size — how big a nudge it needs — and a sign — which
          direction to nudge it. Nothing is guessed. Nothing is the same for two different weights
          unless they genuinely had the same influence. The gradient is the network figuring out,
          mathematically and precisely, exactly who was responsible for the mistake and by how much.
        </p>
      </ExplanationBox>


    </div>
  );
}
