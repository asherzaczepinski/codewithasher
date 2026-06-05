'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Two Memories, Not One">
        <p>
          The key innovation of the LSTM is splitting memory into two streams:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>The cell state C<sub>t</sub></strong> — a slow-moving conveyor belt that
            carries information over long distances. Updates to the cell state are
            <em> additive</em>, not multiplicative, so gradients can flow backward through it
            without shrinking exponentially.
          </li>
          <li>
            <strong>The hidden state h<sub>t</sub></strong> — a fast-moving working memory,
            produced each step from the cell state. This is what the output layer reads.
          </li>
        </ul>
        <p>
          Three learnable <strong>gates</strong> — each producing a number between 0 and 1 via a
          sigmoid — control what information enters, stays on, or leaves the cell state. A gate
          value of 0 means &quot;block completely&quot;; a value of 1 means &quot;let everything
          through.&quot; In practice the network learns intermediate values that mix signals.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Gate 1: The Forget Gate">
        <p>
          The forget gate decides which parts of the <em>old</em> cell state C<sub>t&minus;1</sub>
          are worth keeping. It looks at the current input x<sub>t</sub> and the previous hidden
          state h<sub>t&minus;1</sub>, then outputs a number between 0 and 1 for each cell-state
          dimension.
        </p>
        <p>
          <strong>Intuition:</strong> in our temperature example, if the input suddenly says
          &quot;it is now summer&quot;, the forget gate learns to erase the accumulated memory of
          winter temperatures — they are no longer relevant. In language, when a new paragraph
          starts the forget gate can clear context from the previous paragraph.
        </p>
      </ExplanationBox>

      <MathFormula label="Forget gate">
        f_t = sigmoid(W_f · [h_(t-1), x_t] + b_f)
      </MathFormula>

      <ExplanationBox title="Gate 2: The Input Gate">
        <p>
          The input gate decides which <em>new</em> information to write into the cell state. It
          has two parts working together:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>i<sub>t</sub></strong> — a sigmoid gate that chooses <em>which</em> positions
            of the cell state to update (0 = skip, 1 = update fully).
          </li>
          <li>
            <strong>g̃<sub>t</sub></strong> — a tanh layer that computes <em>what</em> the new
            candidate values are (ranging from −1 to 1).
          </li>
        </ul>
        <p>
          The actual write is the element-wise product i<sub>t</sub> ⊙ g̃<sub>t</sub>: only the
          positions the input gate selected get updated, and only by the candidate amount.
        </p>
        <p>
          <strong>Intuition:</strong> reading that today&apos;s temperature dropped sharply, the
          input gate learns to write that &quot;sharp drop&quot; signal into the cell state,
          because it is likely relevant for the near-future prediction.
        </p>
      </ExplanationBox>

      <MathFormula label="Input gate and candidate values">
        i_t = sigmoid(W_i · [h_(t-1), x_t] + b_i)
        g̃_t = tanh(W_g · [h_(t-1), x_t] + b_g)
      </MathFormula>

      <MathFormula label="Cell state update (the conveyor belt)">
        C_t = f_t ⊙ C_(t-1) + i_t ⊙ g̃_t
      </MathFormula>

      <ExplanationBox title="Why the Cell State Solves Vanishing Gradients">
        <p>
          Look carefully at the cell state update: it is a <strong>sum</strong>, not a product.
          Old memory f<sub>t</sub> ⊙ C<sub>t&minus;1</sub> is <em>added</em> to new information
          i<sub>t</sub> ⊙ g̃<sub>t</sub>. During backpropagation, the gradient of the loss with
          respect to C<sub>t&minus;1</sub> passes through this addition almost unchanged — it is
          only multiplied by f<sub>t</sub>, a learned value the network can keep close to 1.0
          when it wants to preserve memory. Compare this to the plain RNN, where the gradient is
          multiplied by W<sub>h</sub> <em>and</em> the tanh derivative at every step, causing
          exponential decay. The additive path through C is the architectural reason LSTMs can
          remember things 100+ steps back.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Gate 3: The Output Gate">
        <p>
          The output gate decides what part of the cell state to expose as the hidden state
          h<sub>t</sub> — the value the next step and the output layer will actually read. Not
          all stored memory needs to be visible at every step; the output gate filters it.
        </p>
        <p>
          <strong>Intuition:</strong> the cell state might be holding many historical temperature
          readings. The output gate learns to surface only the most relevant summary for the
          current prediction — perhaps the recent trend rather than the raw history.
        </p>
      </ExplanationBox>

      <MathFormula label="Output gate and new hidden state">
        o_t = sigmoid(W_o · [h_(t-1), x_t] + b_o)
        h_t = o_t ⊙ tanh(C_t)
      </MathFormula>

      <WorkedExample title="One LSTM Step — Concrete Numbers">
        <p>
          We run one LSTM step with a 1-dimensional cell and hidden state, using small hand-picked
          weights to show the full flow. Suppose:
        </p>
        <CalcStep number={1}>Previous cell state: C_(t-1) = 0.5 (warm trend stored)</CalcStep>
        <CalcStep number={2}>Previous hidden state: h_(t-1) = 0.3</CalcStep>
        <CalcStep number={3}>Current input: x_t = −0.4 (temperature dropped)</CalcStep>
        <CalcStep number={4}>Forget gate pre-activation: −0.6 → f_t = sigmoid(−0.6) ≈ 0.35 (forget most of warm trend)</CalcStep>
        <CalcStep number={5}>Forget old cell: f_t ⊙ C_(t-1) = 0.35 × 0.5 = 0.175</CalcStep>
        <CalcStep number={6}>Input gate: i_t = sigmoid(0.7) ≈ 0.668</CalcStep>
        <CalcStep number={7}>Candidate values: g̃_t = tanh(−0.5) ≈ −0.462 (new info: it got colder)</CalcStep>
        <CalcStep number={8}>New info contribution: i_t ⊙ g̃_t = 0.668 × (−0.462) ≈ −0.309</CalcStep>
        <CalcStep number={9}>New cell state: C_t = 0.175 + (−0.309) = −0.134 (trend shifted to cool)</CalcStep>
        <CalcStep number={10}>Output gate: o_t = sigmoid(0.4) ≈ 0.599</CalcStep>
        <CalcStep number={11}>New hidden state: h_t = o_t ⊙ tanh(C_t) = 0.599 × tanh(−0.134) ≈ 0.599 × (−0.133) ≈ −0.080</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The cell state flipped from +0.5 (warm memory) to −0.134 (cool memory) in one step,
          because the forget gate partly cleared the old trend and the input gate wrote in the
          new cold signal. The hidden state h<sub>t</sub> ≈ −0.080 reflects this: a slight
          negative lean, predicting cooling. The cell state preserved structure across steps via
          addition — no gradient-crushing multiplication chain.
        </p>
      </WorkedExample>

      <ExplanationBox title="Summary: Three Gates, Three Jobs">
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Forget gate f<sub>t</sub>:</strong> erase stale cell-state content.</li>
          <li><strong>Input gate i<sub>t</sub> + candidate g̃<sub>t</sub>:</strong> write new relevant information into the cell state.</li>
          <li><strong>Output gate o<sub>t</sub>:</strong> filter what part of the cell state to publish as the hidden state for this step.</li>
        </ul>
        <p>
          All three gates are learned end-to-end by gradient descent. No human decides when to
          forget or what to remember — the network discovers these policies purely from training
          data.
        </p>
      </ExplanationBox>

    </div>
  );
}
