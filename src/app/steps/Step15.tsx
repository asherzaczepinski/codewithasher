'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step15() {
  return (
    <div>
      <ExplanationBox title="We Know We're Wrong. We Don't Know Why.">
        <p>
          Loss = 0.27. The network is wrong. But that single number alone tells us nothing useful.
          It&apos;s like a test score — knowing you got 60% doesn&apos;t tell you which questions to study.
          You need to know <em>which specific things</em> caused the low score.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Our network has weights everywhere. The humidity weight in layer 1. The temperature weight
          in layer 1. Six weights inside layer 2. Three more in the output layer. Plus biases at
          every neuron. Every single one of these could be contributing to the wrong answer —
          some a lot, some barely at all.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          We need to answer the same question for every weight:{' '}
          <em>&quot;if I increase this weight by a tiny amount, does the loss get better or worse —
          and by exactly how much?&quot;</em>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That answer is called the weight&apos;s <strong>gradient</strong>. Here&apos;s the rule:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Negative gradient</strong> → increasing this weight reduces the loss → increase it</li>
          <li><strong>Positive gradient</strong> → increasing this weight increases the loss → decrease it</li>
          <li><strong>Large magnitude</strong> → this weight has a big effect on the loss → adjust it more</li>
          <li><strong>Near zero</strong> → this weight barely matters right now → barely adjust it</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Once we have all the gradients, we have a complete map: every weight in the entire network
          labeled with exactly how to adjust it. That&apos;s the goal of everything in this step.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why You Can't Just Directly Ask Each Weight">
        <p>
          Here&apos;s the problem. A weight doesn&apos;t sit right next to the loss. It&apos;s separated from
          the loss by several things that happen in between. Look at the chain:
        </p>
        <p style={{ marginTop: '1rem', fontWeight: 600, textAlign: 'center', fontSize: '1rem', letterSpacing: 0.5 }}>
          weight → weighted sum → output → loss
        </p>
        <p style={{ marginTop: '1rem' }}>
          When the humidity weight changes, it doesn&apos;t change the loss directly. It changes the
          weighted sum first. The weighted sum then goes through sigmoid, which changes the output.
          The output is what the loss formula actually sees. So the weight&apos;s effect on the loss
          is an indirect effect — it ripples through every step in between.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Think of it like a series of gears. Turning gear 1 (the weight) turns gear 2 (weighted sum),
          which turns gear 3 (sigmoid output), which turns gear 4 (loss). To know how much rotating
          gear 1 affects gear 4, you need to know the gear ratio at each step — and then multiply
          them all together.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So that&apos;s exactly what we do. For each link in the chain, we figure out: &quot;if the
          thing on the left increases by 1, how much does the thing on the right change?&quot; Then
          we multiply all those rates together to get the full effect from one end of the chain
          to the other.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          There are three links in the chain. We&apos;ll go through each one, then put them together.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Link 1: How Does Loss Change When the Output Changes?">
        <p>
          Start at the end of the chain — the loss. Our loss formula is:
          {' '}<strong>loss = (prediction − target)²</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          We want to know: if the prediction nudges up by a tiny amount, how much does the loss
          change? Let&apos;s just measure it directly first to build intuition.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Take prediction = 0.7, target = 1.0. Nudge the prediction up by 0.001:
        </p>
        <ul style={{ marginTop: '0.25rem', lineHeight: '2.2' }}>
          <li>Before: loss = (0.700 − 1.0)² = (−0.300)² = <strong>0.090000</strong></li>
          <li>After:&nbsp; loss = (0.701 − 1.0)² = (−0.299)² = <strong>0.089401</strong></li>
          <li>Change: 0.089401 − 0.090000 = <strong>−0.000599</strong></li>
          <li>Rate: −0.000599 ÷ 0.001 = <strong>−0.599</strong></li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          A nudge of +0.001 caused the loss to drop by 0.000599 — a rate of about −0.6. That
          makes sense: prediction was too low (0.7 when it should be 1.0), so nudging it up
          makes the network more correct, which reduces the loss.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Now, instead of measuring this every time, we want a formula. Let x = prediction,
          y = target, h = the tiny nudge. The measured rate is:
        </p>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '1.25rem', marginTop: '0.75rem', fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: 2.2 }}>
          <span style={{ color: 'var(--text-muted)' }}>rate = ((x+h − y)² − (x − y)²) ÷ h</span><br />
          <br />
          <span style={{ color: 'var(--text-muted)' }}>let z = (x − y), so (x+h − y) becomes (z + h):</span><br />
          <br />
          = ((z + h)² − z²) ÷ h<br />
          = (z² + 2zh + h² − z²) ÷ h<br />
          = (2zh + h²) ÷ h<br />
          = 2z + h<br />
          <br />
          <span style={{ color: 'var(--text-muted)' }}>as h shrinks to nothing, the leftover h disappears:</span><br />
          = <strong>2z = 2(x − y)</strong>
        </div>
        <p style={{ marginTop: '0.75rem' }}>
          The formula <strong>2(x − y)</strong> — which means <strong>2 × (prediction − target)</strong> —
          is literally what the measurement process turns into when you do the algebra. It&apos;s not
          a separate fact you have to memorize; it&apos;s just a faster way to get the same number.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Call the result the <strong>loss gradient</strong>. Here&apos;s what different values mean:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2.2' }}>
          <li>
            Prediction = 0.7, target = 1.0 → 2 × (0.7 − 1.0) = <strong>−0.6</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Negative — prediction needs to go up. Makes sense, it&apos;s too low.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Prediction = 1.3, target = 1.0 → 2 × (1.3 − 1.0) = <strong>+0.6</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Positive — prediction needs to go down. It overshot.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Prediction = 1.0, target = 1.0 → 2 × (0) = <strong>0</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Zero — prediction is perfect. No correction needed.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Prediction = 0.1, target = 1.0 → 2 × (0.1 − 1.0) = <strong>−1.8</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Large negative — prediction is way off. Needs a big correction.</span>
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The further the prediction is from the target, the bigger the gradient. The network
          automatically pushes harder on bigger mistakes — and barely touches things that are
          nearly right. That&apos;s a nice property of squaring the error.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Link 2: How Does the Output Change When the Weighted Sum Changes?">
        <p>
          Now move one step back in the chain. The output of a neuron = sigmoid(weighted sum).
          If the weighted sum nudges up by a tiny amount, how much does the output move?
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This depends on where on the sigmoid curve the neuron currently sits. Remember the S-shape:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Middle of the S</strong> (weighted sum near 0, output near 0.5): the curve is steep. A small nudge to the weighted sum moves the output a lot.</li>
          <li><strong>Top of the S</strong> (output near 1.0): the curve has flattened out. A large nudge to the weighted sum barely moves the output.</li>
          <li><strong>Bottom of the S</strong> (output near 0.0): same thing — flat. The neuron is barely moving no matter what you do to the weighted sum.</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          So the &quot;gear ratio&quot; at this link depends on the current output. The steepness of sigmoid
          at any given output turns out to be exactly:
        </p>
        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
          sigmoid gradient = output × (1 − output)
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          You already have the output — you computed it during the forward pass. Just multiply
          it by one minus itself. That&apos;s the whole formula.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Let&apos;s check that it makes sense for different outputs:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2.2' }}>
          <li>
            Output = 0.5 → 0.5 × (1 − 0.5) = 0.5 × 0.5 = <strong>0.25</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Maximum steepness. Right in the middle of the S. Nudging the weighted sum here matters most.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Output = 0.7 → 0.7 × 0.3 = <strong>0.21</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Still responsive. The curve is starting to flatten but not badly yet.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Output = 0.9 → 0.9 × 0.1 = <strong>0.09</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Getting flat. The neuron is very confident — adjusting weights barely changes its output.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Output = 0.99 → 0.99 × 0.01 = <strong>0.0099</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Almost zero. The neuron has completely saturated. Learning nearly stops here — this is the &quot;vanishing gradient&quot; problem.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            Output = 0.354 → 0.354 × 0.646 = <strong>0.229</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Our Cool Moisture neuron from earlier. Still in the responsive zone — learning will work fine here.</span>
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The formula is also self-checking: output is always between 0 and 1, so output × (1 − output)
          is always between 0 and 0.25. The sigmoid gradient can never be negative (nudging the
          weighted sum always moves the output in the same direction) and never exceeds 0.25.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Putting the Links Together: Why We Multiply">
        <p>
          We now have two rates:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li><strong>Loss gradient</strong> = how much the loss changes per unit change in the output</li>
          <li><strong>Sigmoid gradient</strong> = how much the output changes per unit change in the weighted sum</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          We want: how much does the loss change per unit change in the weighted sum? We
          multiply the two rates:
        </p>
        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
          total gradient = loss gradient × sigmoid gradient
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Here&apos;s why multiplying is correct. Suppose:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2' }}>
          <li>Nudging the weighted sum by 1 moves the output by 0.21 (sigmoid gradient = 0.21)</li>
          <li>Moving the output by 1 changes the loss by −0.6 (loss gradient = −0.6)</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          So nudging the weighted sum by 1 moves the output by 0.21, which in turn changes the
          loss by 0.21 × (−0.6) = −0.126. The output acts as a relay — scaling the loss gradient
          down by the sigmoid gradient before passing it on.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          It&apos;s the same logic as currency conversion. If 1 dollar = 0.9 euros, and 1 euro = 1.1 francs,
          then 1 dollar = 0.9 × 1.1 = 0.99 francs. Each conversion is a multiplication — and when
          you chain them, you multiply all of them together.
        </p>
      </ExplanationBox>

      <WorkedExample title="Full Worked Example: Output Neuron">
        <p>
          Our rain network predicted 0.7. It actually rained — target = 1.0. We&apos;re off by 0.3.
          Let&apos;s compute the total gradient on the output neuron&apos;s weighted sum, step by step.
        </p>

        <p style={{ marginTop: '1rem' }}><strong>Link 1 — how much does the loss change when the output changes?</strong></p>
        <CalcStep number={1}>error = prediction − target = 0.7 − 1.0 = −0.3</CalcStep>
        <CalcStep number={2}>loss_gradient = 2 × error = 2 × (−0.3) = −0.6</CalcStep>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Prediction is below target. Gradient is negative — pushing the output up would reduce the loss.
          The magnitude 0.6 reflects that we&apos;re moderately far off (error = 0.3).
        </p>

        <p style={{ marginTop: '1.25rem' }}><strong>Link 2 — how much does the output change when the weighted sum changes?</strong></p>
        <CalcStep number={3}>sigmoid_gradient = output × (1 − output)</CalcStep>
        <CalcStep number={4}>sigmoid_gradient = 0.7 × (1 − 0.7) = 0.7 × 0.3 = 0.21</CalcStep>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Output is 0.7 — still in the responsive part of the sigmoid curve. A nudge to the
          weighted sum will move the output by about 21% of that nudge.
        </p>

        <p style={{ marginTop: '1.25rem' }}><strong>Combine — total effect of the weighted sum on the loss</strong></p>
        <CalcStep number={5}>total_gradient = loss_gradient × sigmoid_gradient</CalcStep>
        <CalcStep number={6}>total_gradient = −0.6 × 0.21 = −0.126</CalcStep>
        <p style={{ marginTop: '0.75rem' }}>
          <strong>Total gradient = −0.126.</strong> If we increase the output neuron&apos;s weighted sum,
          the loss goes down by 0.126 per unit increase. The weighted sum needs to go up — which
          means the weights feeding into this neuron need to increase.
        </p>
      </WorkedExample>

      <ExplanationBox title="Link 3: From the Weighted Sum to Each Individual Weight">
        <p>
          We know how the loss changes with the <em>weighted sum</em>. But the weighted sum is
          not a single knob — it&apos;s built from several weights. We need each weight&apos;s individual gradient.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The weighted sum formula is:
        </p>
        <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          weighted_sum = (input₁ × weight₁) + (input₂ × weight₂) + (input₃ × weight₃) + bias
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          If weight₁ increases by a tiny amount h, then:
        </p>
        <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          new weighted_sum = (input₁ × (weight₁ + h)) + ... = old weighted_sum + (input₁ × h)
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          So the weighted sum increases by input₁ × h. The rate of change is input₁ — the
          weight&apos;s lever arm is exactly the input it&apos;s connected to.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Chaining through one more time: we know the loss changes by total_gradient per unit change
          in the weighted sum. And the weighted sum changes by input₁ per unit change in weight₁.
          So the loss changes by:
        </p>
        <p style={{ marginTop: '0.75rem', fontWeight: 600 }}>
          weight_gradient = total_gradient × input connected to that weight
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          For our output neuron (total_gradient = −0.126), the three inputs coming from hidden layer 2
          were [0.589, 0.545, 0.713]:
        </p>
        <ul style={{ marginTop: '0.5rem', lineHeight: '2.2' }}>
          <li>
            weight₁ gradient = −0.126 × 0.589 = <strong>−0.074</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Negative → increase weight₁. Its input was 0.589 — moderate influence.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            weight₂ gradient = −0.126 × 0.545 = <strong>−0.069</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Negative → increase weight₂. Smallest correction — its input was the weakest.</span>
          </li>
          <li style={{ marginTop: '0.25rem' }}>
            weight₃ gradient = −0.126 × 0.713 = <strong>−0.090</strong><br />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Negative → increase weight₃ the most. Its input was 0.713 — the strongest, so it gets the most blame.</span>
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          This is intuitive: weight₃ connects to the strongest input signal (0.713). That means
          weight₃ had the most influence over the weighted sum — so it contributed most to the
          wrong prediction and deserves the largest correction.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The bias gradient is simply total_gradient × 1 = −0.126. The bias adds directly to
          the weighted sum with no input scaling it, so it always gets the full total gradient.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What We Just Did — And What's Left">
        <p>
          We computed gradients for every weight in the output neuron. The full chain was:
        </p>
        <p style={{ marginTop: '0.75rem', fontWeight: 600, textAlign: 'center' }}>
          weight → weighted sum → output → loss
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          At each arrow, we found the rate of change. Then we multiplied all the rates together
          to get from the weight all the way to the loss. That&apos;s it — that&apos;s the whole algorithm.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          But our network has two more layers of weights we haven&apos;t touched: hidden layer 2 and
          hidden layer 1. For those, the chain is longer — the error from the output has to travel
          back through the output layer first before it reaches layer 2&apos;s weights, and then back
          again before it reaches layer 1&apos;s weights.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The key insight is that we already computed part of the chain for the output neuron.
          When we go back to compute layer 2&apos;s gradients, we can reuse that work — we don&apos;t start
          over. We take the total gradient from the output neuron and pass it backward as the
          starting point for layer 2.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          That reuse is what makes <strong>backpropagation</strong> efficient. Instead of computing
          the full chain from scratch for every weight in the network, you compute once and pass
          the result backward layer by layer. That&apos;s the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
