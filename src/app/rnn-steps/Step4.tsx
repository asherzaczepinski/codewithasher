'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Folded vs. Unrolled">
        <p>
          The recurrent diagram from the previous module shows the RNN as a single box with a
          feedback arrow. That is a compact, folded picture. To actually <em>compute</em> outputs
          and train the network, we <strong>unroll</strong> that loop — we draw a separate copy of
          the box for each time step, laid out left to right, with arrows between them carrying the
          hidden state forward.
        </p>
        <p>
          Unrolling turns a loop into a deep (but thin) feedforward network. Each &quot;layer&quot;
          in the unrolled view corresponds to one time step. The weights W<sub>x</sub>,
          W<sub>h</sub>, and b are identical in every copy — they are the same parameters,
          reused at each step.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Worked Example Setup">
        <p>
          We will predict the next temperature reading after seeing three hourly readings.
          To keep the arithmetic transparent we use a tiny 1-dimensional hidden state (a single
          number, not a vector) and small hand-chosen weights. In a real network the hidden state
          might have 256 or 512 dimensions, but the math is identical.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Inputs:</strong> x<sub>1</sub> = 0.3, x<sub>2</sub> = 0.2, x<sub>3</sub> = 0.1 (normalised temperatures, declining trend)</li>
          <li><strong>W<sub>x</sub></strong> = 0.5 (input weight)</li>
          <li><strong>W<sub>h</sub></strong> = 0.8 (hidden-state weight)</li>
          <li><strong>b</strong> = 0.0 (bias)</li>
          <li><strong>h<sub>0</sub></strong> = 0.0 (initial hidden state — blank slate)</li>
        </ul>
        <p>
          We apply the RNN equation at each step:
        </p>
      </ExplanationBox>

      <MathFormula label="RNN update (scalar version)">
        h_t = tanh(W_x · x_t + W_h · h_(t-1) + b)
      </MathFormula>

      <WorkedExample title="Step 1 — Read x₁ = 0.3">
        <CalcStep number={1}>Weighted input: W_x · x₁ = 0.5 × 0.3 = 0.15</CalcStep>
        <CalcStep number={2}>Weighted past memory: W_h · h₀ = 0.8 × 0.0 = 0.00</CalcStep>
        <CalcStep number={3}>Pre-activation: 0.15 + 0.00 + 0.0 (bias) = 0.15</CalcStep>
        <CalcStep number={4}>Apply tanh: h₁ = tanh(0.15) ≈ 0.149</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          After the first reading, the hidden state is <strong>h₁ ≈ 0.149</strong>. It is small
          because the input was small and there was no prior memory to amplify it.
        </p>
      </WorkedExample>

      <WorkedExample title="Step 2 — Read x₂ = 0.2">
        <CalcStep number={1}>Weighted input: W_x · x₂ = 0.5 × 0.2 = 0.10</CalcStep>
        <CalcStep number={2}>Weighted past memory: W_h · h₁ = 0.8 × 0.149 = 0.119</CalcStep>
        <CalcStep number={3}>Pre-activation: 0.10 + 0.119 + 0.0 = 0.219</CalcStep>
        <CalcStep number={4}>Apply tanh: h₂ = tanh(0.219) ≈ 0.216</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The hidden state grew to <strong>h₂ ≈ 0.216</strong>. Notice that W<sub>h</sub> · h₁
          contributed 0.119 — the network is now genuinely carrying information from step 1
          forward into step 2.
        </p>
      </WorkedExample>

      <WorkedExample title="Step 3 — Read x₃ = 0.1">
        <CalcStep number={1}>Weighted input: W_x · x₃ = 0.5 × 0.1 = 0.05</CalcStep>
        <CalcStep number={2}>Weighted past memory: W_h · h₂ = 0.8 × 0.216 = 0.173</CalcStep>
        <CalcStep number={3}>Pre-activation: 0.05 + 0.173 + 0.0 = 0.223</CalcStep>
        <CalcStep number={4}>Apply tanh: h₃ = tanh(0.223) ≈ 0.220</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The hidden state is <strong>h₃ ≈ 0.220</strong>. Even though x₃ was the smallest input
          (0.1), the accumulated memory from steps 1 and 2 keeps the hidden state elevated — the
          network &quot;remembers&quot; the earlier, warmer readings.
        </p>
      </WorkedExample>

      <WorkedExample title="Output — Predicting the Next Temperature">
        <p>
          After reading all three inputs we pass h₃ through a simple output layer. For
          regression (predicting a number) this is just a linear transformation:
        </p>
        <CalcStep number={1}>Output weight W_y = 0.6, output bias b_y = 0.0</CalcStep>
        <CalcStep number={2}>ŷ = W_y · h₃ + b_y = 0.6 × 0.220 = 0.132</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Our prediction is <strong>ŷ ≈ 0.132</strong> (in normalised units). Recalling that
          our inputs were 0.3, 0.2, 0.1 — a declining trend — a predicted value of 0.132 is
          sensible: slightly below 0.1, continuing the downward direction. The network captured
          the trend purely through its hidden state.
        </p>
      </WorkedExample>

      <ExplanationBox title="What Unrolling Reveals">
        <p>
          Writing out the three steps makes one thing very clear: to get h₃ you need h₂; to get
          h₂ you need h₁; to get h₁ you need h₀. The computation is <strong>strictly
          sequential</strong> — you cannot compute step 3 until step 2 is done. This is why RNNs
          are slow to train compared to Transformers, which process all positions in parallel.
        </p>
        <p>
          It also reveals the training challenge: if the network made a wrong prediction, we need
          to trace the error all the way back through every step to adjust W<sub>x</sub>,
          W<sub>h</sub>, and b. The longer the sequence, the more multiplications that error
          signal passes through — and that is exactly where trouble begins, as we will see in
          the next module.
        </p>
      </ExplanationBox>

    </div>
  );
}
