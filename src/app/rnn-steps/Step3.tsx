'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Core RNN Equation">
        <p>
          An RNN processes a sequence one element at a time. At each time step <em>t</em> it
          receives two inputs: the current token <em>x</em><sub>t</sub> (a word embedding or a
          sensor reading) and the previous hidden state <em>h</em><sub>t&minus;1</sub> (its
          memory of everything seen so far). It combines them, squashes the result through a
          nonlinearity, and produces a new hidden state <em>h</em><sub>t</sub>.
        </p>
        <p>
          That one equation is the whole RNN:
        </p>
      </ExplanationBox>

      <MathFormula label="RNN hidden state update">
        h_t = tanh(W_x · x_t + W_h · h_(t-1) + b)
      </MathFormula>

      <ExplanationBox title="Breaking Down Every Symbol">
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>x<sub>t</sub></strong> — the input at step <em>t</em>. For next-word
            prediction this is a vector of numbers that represents the current word (a word
            embedding). For temperature forecasting it is the scalar temperature reading at
            hour <em>t</em>.
          </li>
          <li>
            <strong>h<sub>t&minus;1</sub></strong> — the hidden state from the previous step.
            At step 1 there is no previous step, so we initialise <em>h</em><sub>0</sub> to a
            vector of all zeros: the network starts with a blank notepad.
          </li>
          <li>
            <strong>W<sub>x</sub></strong> — a weight matrix that controls how much each
            dimension of the input influences the new hidden state. These weights are
            <em> learned during training</em>.
          </li>
          <li>
            <strong>W<sub>h</sub></strong> — a weight matrix that controls how much each
            dimension of the old hidden state is carried forward. This is what gives the
            RNN its &quot;memory.&quot;
          </li>
          <li>
            <strong>b</strong> — a bias vector, exactly like the bias in a feedforward network.
            It shifts the result independently of the input.
          </li>
          <li>
            <strong>tanh</strong> — the hyperbolic tangent function. It squashes any real number
            into the range (−1, 1), keeping hidden state values bounded so they do not explode
            as we multiply through many time steps.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The Same Weights at Every Step">
        <p>
          The most important thing to notice: <strong>W<sub>x</sub>, W<sub>h</sub>, and b are
          shared across every time step.</strong> At step 1, step 2, step 50 — the exact same
          weight matrices are used. This is called <strong>weight tying</strong>.
        </p>
        <p>
          Weight tying has two big advantages. First, it keeps the number of parameters fixed
          regardless of sequence length — a network that handles 5-word sentences uses the exact
          same number of parameters as one that handles 500-word sequences. Second, it forces the
          network to learn a <em>general</em> rule for how to update memory, not a special rule
          for &quot;what to do at step 3.&quot;
        </p>
        <p>
          The downside is that the same weights must do the right thing for every position, which
          is a harder optimisation problem — and it is part of why long-range memory is difficult
          for plain RNNs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Loop in Words">
        <p>
          Picture the RNN as a box with two inputs and one output:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Input 1:</strong> the current token x<sub>t</sub>, entering from the left.
          </li>
          <li>
            <strong>Input 2:</strong> the previous hidden state h<sub>t&minus;1</sub>, entering
            from below (looping back from the box&apos;s own output at the last step).
          </li>
          <li>
            <strong>Output:</strong> the new hidden state h<sub>t</sub>, which exits right and
            also loops back to become Input 2 at the next step.
          </li>
        </ul>
        <p>
          That looping arrow — h<sub>t</sub> feeding back as h<sub>t&minus;1</sub> — is the
          recurrent connection that gives the RNN its name. The box is the same box every time;
          only the values flowing through it change.
        </p>
        <p>
          After the final step, the last hidden state h<sub>T</sub> summarises the entire
          sequence. We then feed h<sub>T</sub> into a small output layer (a linear layer
          followed by softmax for word prediction, or a linear layer for temperature regression)
          to produce the actual prediction.
        </p>
      </ExplanationBox>

      <MathFormula label="Output prediction (next word or temperature)">
        ŷ = softmax(W_y · h_T + b_y)
      </MathFormula>

      <ExplanationBox title="tanh vs sigmoid">
        <p>
          Earlier in the Neural Networks course we used <strong>sigmoid</strong> (output 0 to 1).
          RNNs typically use <strong>tanh</strong> (output −1 to 1). Why?
        </p>
        <p>
          Hidden states need to represent both positive and negative influence. A state of
          −0.8 might mean &quot;the last few tokens strongly suggest this is NOT a weather
          context&quot;, while +0.8 means the opposite. Sigmoid&apos;s range of 0 to 1 cannot
          represent negative signal without extra tricks; tanh can do it directly. Both functions
          squash large values and both have well-behaved gradients near zero — but tanh is
          zero-centred, which makes gradient flow slightly better in practice.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Below is the RNN cell as a plain Python function using NumPy. This is the exact
          equation from above — nothing hidden, nothing abstracted away.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="rnn.py"
        caption="The rnn_cell function: one time step of recurrence implemented with NumPy."
        code={`import numpy as np

# ------------------------------------------------------------
# rnn_cell: one step of the vanilla RNN recurrence.
#
# Inputs
#   x_t    -- current input vector, shape (input_size,)
#   h_prev -- hidden state from the PREVIOUS step, shape (hidden_size,)
#   Wx     -- input weight matrix, shape (hidden_size, input_size)
#   Wh     -- hidden-to-hidden weight matrix, shape (hidden_size, hidden_size)
#   b      -- bias vector, shape (hidden_size,)
#
# Output
#   h_t    -- new hidden state, shape (hidden_size,)
#             values are bounded in (-1, 1) because of tanh
# ------------------------------------------------------------

def rnn_cell(x_t, h_prev, Wx, Wh, b):

    # Step 1: project the current input into hidden space.
    # Wx @ x_t has shape (hidden_size,) -- one number per hidden unit.
    input_contribution = Wx @ x_t

    # Step 2: project the OLD hidden state into hidden space.
    # This is the "memory" term -- how much of the past survives.
    memory_contribution = Wh @ h_prev

    # Step 3: add both contributions plus bias, then squash with tanh.
    # tanh keeps every element of h_t in the range (-1, 1),
    # preventing hidden states from growing without bound over time.
    h_t = np.tanh(input_contribution + memory_contribution + b)

    return h_t  # carry this forward as h_prev at the next time step


# --- Quick sanity check with tiny dimensions ---

input_size  = 3   # e.g. a 3-dimensional word embedding
hidden_size = 4   # hidden state has 4 units

# Random weights -- in a real network these would be trained.
np.random.seed(0)
Wx = np.random.randn(hidden_size, input_size) * 0.1
Wh = np.random.randn(hidden_size, hidden_size) * 0.1
b  = np.zeros(hidden_size)

x_t    = np.array([0.5, -0.3, 0.8])  # the current token
h_prev = np.zeros(hidden_size)        # blank slate at step 0

h_t = rnn_cell(x_t, h_prev, Wx, Wh, b)
print("h_t:", h_t)
# All values between -1 and 1 -- tanh guarantee holds.`}
      />
    </div>
  );
}
