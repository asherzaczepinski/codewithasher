'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Training an Unrolled RNN">
        <p>
          Once the RNN is unrolled into a sequence of copies, training looks almost like training
          a very deep feedforward network. We run the forward pass — computing h₁, h₂, &hellip;,
          h<sub>T</sub> and the final prediction ŷ — then measure the loss (how wrong the
          prediction was), and finally run <strong>backpropagation through time (BPTT)</strong>:
          we send the error gradient <em>backward</em> through every time step, computing how
          much each weight contributed to the mistake.
        </p>
        <p>
          The key insight is that the weight W<sub>h</sub> appears at <em>every</em> step. To
          update it correctly we must add up its contribution across all steps — and that means
          multiplying gradients together many times as we travel backward.
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient flowing back T steps involves repeated multiplication">
        ∂L/∂h₁ = ∂L/∂h_T · W_h^(T-1) · (tanh derivatives at each step)
      </MathFormula>

      <ExplanationBox title="Why Repeated Multiplication Is Dangerous">
        <p>
          Every time the gradient passes through one time step it gets multiplied by W<sub>h</sub>
          (roughly) and by the derivative of tanh at that step. Two things can then go wrong:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Vanishing gradients:</strong> if |W<sub>h</sub>| &lt; 1, multiplying it by
            itself over and over makes the gradient shrink exponentially. After 20 steps a gradient
            that started at 1.0 might reach 0.8²⁰ ≈ 0.012. After 50 steps: nearly zero. The
            weights that affect early time steps receive essentially no update signal — the network
            cannot learn long-range dependencies.
          </li>
          <li>
            <strong>Exploding gradients:</strong> if |W<sub>h</sub>| &gt; 1, the gradient grows
            exponentially. After 50 steps even a tiny initial gradient becomes astronomically large,
            causing weight updates that wildly overshoot and destabilise training.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Vanishing in Action — 10 Steps Back">
        <p>
          Suppose the tanh derivative at each step is approximately 0.5 and W<sub>h</sub> = 0.8.
          The gradient multiplier per step is 0.8 × 0.5 = 0.4. Watch what happens over 10 steps:
        </p>
        <CalcStep number={1}>After 1 step back: gradient × 0.4¹ = 0.400</CalcStep>
        <CalcStep number={2}>After 2 steps back: gradient × 0.4² = 0.160</CalcStep>
        <CalcStep number={3}>After 3 steps back: gradient × 0.4³ = 0.064</CalcStep>
        <CalcStep number={4}>After 5 steps back: gradient × 0.4⁵ ≈ 0.010</CalcStep>
        <CalcStep number={5}>After 7 steps back: gradient × 0.4⁷ ≈ 0.002</CalcStep>
        <CalcStep number={6}>After 10 steps back: gradient × 0.4¹⁰ ≈ 0.0001</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A gradient that was 1.0 at the output becomes <strong>0.0001</strong> by the time it
          reaches step 1. The weight update for anything early in the sequence is effectively
          zero — the network cannot learn that &quot;clouds&quot; back at step 1 matters for the
          prediction at step 10.
        </p>
      </WorkedExample>

      <ExplanationBox title="The tanh Derivative Makes It Worse">
        <p>
          The tanh function has a derivative that peaks at 1.0 (when its input is 0) and falls
          toward 0 as the input grows large in either direction. In practice, hidden states are
          often pushed into the saturated region where the derivative is close to 0.1 or less.
          This means the per-step multiplier is often far smaller than W<sub>h</sub> alone, and
          vanishing happens even faster than the weight alone would suggest.
        </p>
        <p>
          Sigmoid suffers even more: its maximum derivative is only 0.25, so every step through
          a sigmoid gate multiplies the gradient by at most 0.25. This is why tanh became the
          standard for RNN hidden states — but even tanh is not enough to solve the problem for
          long sequences.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Partial Fix: Gradient Clipping">
        <p>
          The <em>exploding</em> gradient problem has a cheap fix: <strong>gradient clipping</strong>.
          Before applying the update, we check whether the gradient&apos;s magnitude exceeds a
          threshold (commonly 1.0 or 5.0). If it does, we scale it down so it fits within the
          threshold. This prevents catastrophic weight updates and is standard practice when
          training any RNN.
        </p>
        <p>
          Vanishing gradients are much harder to fix with clipping — you cannot amplify a signal
          that has already decayed to nearly zero. That requires a fundamentally different
          architecture, which brings us to the LSTM.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Intuition: Short-Term vs. Long-Term">
        <p>
          A plain RNN effectively has <strong>short-term memory</strong>. It remembers what
          happened in the last few steps reasonably well, because the gradient chain is short.
          But it cannot reliably remember what happened 20, 50, or 100 steps ago, because the
          gradient signal that would teach it to care about those early steps vanishes before it
          arrives.
        </p>
        <p>
          In our temperature example, the RNN can learn &quot;the temperature one hour ago&quot;
          easily. Learning &quot;the temperature three days ago&quot; — 72 steps back — is
          essentially impossible for a plain RNN. For language, remembering the subject of a
          sentence when predicting a verb 15 words later is already on the edge of what plain
          RNNs can manage.
        </p>
        <p>
          The LSTM was designed from scratch to solve exactly this problem. Instead of letting the
          gradient fight its way through repeated multiplications, it creates a separate{' '}
          <strong>cell state</strong> with an additive update path — a pathway where gradients can
          flow across hundreds of steps with almost no decay.
        </p>
      </ExplanationBox>

    </div>
  );
}
