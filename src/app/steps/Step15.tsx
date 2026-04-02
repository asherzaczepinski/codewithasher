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

      <ExplanationBox title="The Complication: Weights Don't Directly Touch the Loss">
        <p>
          Here&apos;s what makes this tricky. A weight doesn&apos;t sit right next to the loss. There are
          things in between. When you change the humidity weight in the output neuron, here&apos;s
          what actually happens:
        </p>
        <ol style={{ marginTop: '0.75rem', lineHeight: '2.4' }}>
          <li>The humidity weight changes.</li>
          <li>That changes the <strong>weighted sum</strong> inside that neuron.</li>
          <li>That changes the neuron&apos;s <strong>output</strong> — the confidence value sigmoid produces.</li>
          <li>That changes the <strong>loss</strong> — how wrong the final prediction was.</li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          The weight&apos;s effect on the loss is indirect. It ripples through every step in between.
          So to figure out how much a weight affected the final mistake, you have to trace that
          ripple through every step it passed through.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Trick: Break the Chain Into Simple Pieces">
        <p>
          The chain from weight to loss looks complicated, but each individual step is simple.
          For each step, all you need to know is one thing: if the value on the left goes up a
          tiny bit, how much does the value on the right change?
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Do that for every step in the chain, and you can combine them into a single answer.
          The rule for combining is: multiply them all together.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Think of it like a chain of gears. Gear 1 turns gear 2, gear 2 turns gear 3, gear 3
          turns gear 4. To know how much turning gear 1 affects gear 4, you look at the size
          ratio at each connection — and multiply them all together.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Same idea here. The chain has three connections:
        </p>
        <ol style={{ marginTop: '0.5rem', lineHeight: '2.4' }}>
          <li><strong>How much does the loss change when the output changes?</strong></li>
          <li><strong>How much does the output change when the weighted sum changes?</strong></li>
          <li><strong>How much does the weighted sum change when a weight changes?</strong></li>
        </ol>
        <p style={{ marginTop: '0.75rem' }}>
          Answer each one, multiply them together, and you have the weight&apos;s gradient — its
          exact share of the blame for the mistake.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 1: Loss vs Output">
        <p>
          The first connection is between the output (the neuron&apos;s prediction) and the loss.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          When the prediction is far below the right answer, nudging it up helps a lot — the
          loss drops sharply. When the prediction is already very close to the right answer,
          nudging it barely changes the loss — it&apos;s almost perfect already.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So this rate is large when the error is large, and small when the error is small.
          The network automatically pushes harder on bigger mistakes. That&apos;s a direct consequence
          of how the loss is calculated — squaring the error makes the loss grow faster the
          further off you are, which in turn makes the correction stronger.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The sign also tells you direction. If the prediction is below the target, nudging
          it up reduces the loss — negative rate. If the prediction is above the target, nudging
          it up makes the loss worse — positive rate. The sign is the network&apos;s compass: negative
          means increase, positive means decrease.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 2: Output vs Weighted Sum">
        <p>
          The second connection is between the weighted sum and the sigmoid output.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This one depends entirely on where the neuron currently sits on the sigmoid curve.
          The sigmoid is an S-shape — steep in the middle, completely flat at both ends. If
          the neuron&apos;s output is around 0.5, it&apos;s on the steep part: nudge the weighted sum
          and the output moves a lot. If the output is near 0 or 1, it&apos;s on the flat part:
          you could change the weighted sum dramatically and the output barely moves.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Think of pushing a ball along a hill. On the steepest section, the tiniest push
          sends it rolling. At the very top or bottom — where the ground is nearly level —
          you can push hard and the ball barely goes anywhere.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A neuron whose output is stuck near 0 or 1 is a problem. No matter how wrong the
          network is, adjusting that neuron&apos;s weights barely changes its output, so the
          correction signal dies out before it can fix anything. This is called the
          <strong> vanishing gradient problem</strong> — the gradient shrinks so close to zero
          that learning effectively stops for that neuron.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Step 3: Weighted Sum vs Each Weight">
        <p>
          The third connection is between an individual weight and the weighted sum.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The weighted sum is just a bunch of inputs multiplied by their weights and added up.
          So how much does one specific weight affect the weighted sum? Exactly as much as its
          input. A weight connected to a strong input signal has a big lever arm — small changes
          to that weight swing the weighted sum a lot. A weight connected to a weak input barely
          moves the weighted sum at all.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This is also why the bias is special. The bias adds directly to the weighted sum with
          no input multiplying it — its lever arm is always 1. So the bias always gets exactly
          the full correction signal, never amplified or dampened by an input.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          And it tells you something intuitive about blame: the weight connected to the strongest
          input was the one with the most influence over the weighted sum — and therefore the most
          influence over the wrong prediction. It gets the biggest correction. The weight connected
          to the weakest input barely mattered, so it gets the smallest correction.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Put It Together: Multiply the Three Rates">
        <p>
          Once you have the rate at each of the three connections, you multiply them together.
          That gives you the weight&apos;s gradient — a single number that says: &quot;increase by this
          much to reduce the loss.&quot;
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Every weight in the output neuron gets its own gradient this way. They all share the
          same first two rates (since they all live in the same neuron), but each has a different
          third rate — because each connects to a different input.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Weights connected to stronger inputs get larger gradients. Weights connected to weaker
          inputs get smaller gradients. The bias gets the middle rate unchanged. And every single
          one gets a sign telling it which direction to move.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Rest of the Network">
        <p>
          We just described how to compute gradients for the output neuron&apos;s weights. But hidden
          layer 2 has weights too. And hidden layer 1. Every weight in the network needs a gradient.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          For a weight in hidden layer 2, the chain is longer — it has to pass through the output
          neuron before reaching the loss. But the idea is the same: find the rate at every
          connection along the chain, multiply them together.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          And here&apos;s the clever part: when we computed the output neuron&apos;s gradients, we already
          did part of the work for hidden layer 2. The output neuron&apos;s gradient gets passed
          backward — hidden layer 2 picks it up and uses it as the starting point for its own
          calculation, rather than recomputing the whole chain from scratch.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Hidden layer 1 does the same with hidden layer 2&apos;s result. Each layer passes its
          gradient backward to the layer before it, like handing off a baton. By the time you
          reach layer 1, every weight in the entire network has its gradient — computed
          efficiently, layer by layer, starting from the output and working backward.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That process — computing gradients backward through the network — is <strong>backpropagation</strong>.
          The next step goes through it with actual numbers.
        </p>
      </ExplanationBox>
    </div>
  );
}
