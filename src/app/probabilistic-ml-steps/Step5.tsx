'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Modeling Sequences with Hidden State">
        <p>
          Many real-world processes unfold over time: speech, text, financial prices, biological
          sequences. We often observe a noisy signal while the underlying state of the world is
          hidden. A person carries an umbrella — but we cannot directly observe whether it is
          raining. A microphone picks up sound — but we cannot directly observe which phoneme was
          spoken.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          A <strong>Hidden Markov Model (HMM)</strong> is a directed graphical model for exactly
          this setting. It has two kinds of variables at each time step t:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Hidden state Z(t)</strong> — the true (unobserved) state of the world.
            Example: sunny or rainy.
          </li>
          <li>
            <strong>Observation X(t)</strong> — what we actually measure. Example: umbrella
            carried (yes/no).
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The Two Key Probability Tables">
        <p>
          An HMM is completely specified by three components:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Initial distribution &pi;</strong> — the probability of each hidden state at
            time 1: P(Z(1) = k).
          </li>
          <li>
            <strong>Transition matrix A</strong> — P(Z(t) | Z(t-1)). How likely is each state
            tomorrow given today&apos;s state?
          </li>
          <li>
            <strong>Emission matrix B</strong> — P(X(t) | Z(t)). Given the hidden state, what
            observation are we likely to see?
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The Markov Assumption">
        <p>
          The HMM makes one crucial simplifying assumption: the <strong>Markov property</strong>.
          The hidden state at time t depends only on the state at time t-1, not on any earlier
          history:
        </p>
      </ExplanationBox>

      <MathFormula label="Markov Property">
        P(Z(t) | Z(t-1), Z(t-2), ..., Z(1)) = P(Z(t) | Z(t-1))
      </MathFormula>

      <ExplanationBox title="Observations Are Conditionally Independent">
        <p>
          Each observation X(t) depends only on the hidden state at the same time step Z(t) —
          not on previous observations or previous hidden states:
        </p>
      </ExplanationBox>

      <MathFormula label="Emission Assumption">
        P(X(t) | Z(1:t), X(1:t-1)) = P(X(t) | Z(t))
      </MathFormula>

      <ExplanationBox title="The Joint Distribution of an HMM">
        <p>
          These assumptions together give a clean factorization over a sequence of length T:
        </p>
      </ExplanationBox>

      <MathFormula label="HMM Joint Distribution">
        P(Z(1:T), X(1:T)) = P(Z(1)) &times; &prod;(t=2 to T) P(Z(t) | Z(t-1)) &times; &prod;(t=1 to T) P(X(t) | Z(t))
      </MathFormula>

      <ExplanationBox title="What We Infer">
        <p>
          Given a sequence of observations X(1:T), there are three classic inference problems:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Filtering</strong> — compute P(Z(t) | X(1:t)) for each t as observations
            arrive. Solved by the forward algorithm.
          </li>
          <li>
            <strong>Smoothing</strong> — compute P(Z(t) | X(1:T)) using all observations.
            Solved by the forward-backward algorithm.
          </li>
          <li>
            <strong>Decoding (most likely sequence)</strong> — find the single sequence of hidden
            states Z(1:T) that maximizes P(Z(1:T) | X(1:T)). Solved by the
            <strong> Viterbi algorithm</strong>, which uses dynamic programming to efficiently
            find this argmax without enumerating all K^T possible sequences.
          </li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Weather HMM: Computing a Sequence Probability">
        <p>
          Two hidden states: Sunny (S) and Rainy (R). One observation: umbrella carried (U=1) or
          not (U=0). We observe the two-day sequence (U=0, U=1) and compute its probability.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          Parameters: P(S1) = 0.7, P(R1) = 0.3. Transitions: P(S|S) = 0.8, P(R|S) = 0.2,
          P(S|R) = 0.4, P(R|R) = 0.6. Emissions: P(U=0|S) = 0.9, P(U=1|S) = 0.1,
          P(U=0|R) = 0.2, P(U=1|R) = 0.8.
        </p>

        <CalcStep number={1}>
          Sum over all 4 hidden-state sequences: (S,S), (S,R), (R,S), (R,R).
        </CalcStep>
        <CalcStep number={2}>
          (S,S): P(S1) &times; P(U=0|S) &times; P(S|S) &times; P(U=1|S)
          = 0.7 &times; 0.9 &times; 0.8 &times; 0.1 = 0.0504
        </CalcStep>
        <CalcStep number={3}>
          (S,R): P(S1) &times; P(U=0|S) &times; P(R|S) &times; P(U=1|R)
          = 0.7 &times; 0.9 &times; 0.2 &times; 0.8 = 0.1008
        </CalcStep>
        <CalcStep number={4}>
          (R,S): P(R1) &times; P(U=0|R) &times; P(S|R) &times; P(U=1|S)
          = 0.3 &times; 0.2 &times; 0.4 &times; 0.1 = 0.0024
        </CalcStep>
        <CalcStep number={5}>
          (R,R): P(R1) &times; P(U=0|R) &times; P(R|R) &times; P(U=1|R)
          = 0.3 &times; 0.2 &times; 0.6 &times; 0.8 = 0.0288
        </CalcStep>
        <CalcStep number={6}>
          Total P(U=0, U=1) = 0.0504 + 0.1008 + 0.0024 + 0.0288 = 0.1824
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The most probable hidden sequence was (S,R) contributing 0.1008 / 0.1824 &approx; 55%
          of the total — a dry first day (no umbrella) followed by a rainy second day (umbrella).
          The Viterbi algorithm would efficiently find this argmax for long sequences.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The forward algorithm computes P(X(1:T)) efficiently by propagating a vector of partial
          probabilities (the &quot;alpha&quot; messages) left-to-right through the sequence.
          Each step is a matrix-vector product followed by an element-wise multiply — exactly
          what numpy is good at.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="hmm_forward.py"
        caption="The HMM forward algorithm with numpy: compute P(observation sequence) in O(T * K^2) time instead of O(K^T)."
        code={`import numpy as np

# ── HMM parameters (Weather example from the worked example above) ─────────────
# States: 0 = Sunny, 1 = Rainy
# Observations: 0 = no umbrella, 1 = umbrella

# Initial state distribution: pi[k] = P(Z_1 = k)
pi = np.array([0.7, 0.3])  # 70 % chance of starting sunny

# Transition matrix: A[i, j] = P(Z_t = j | Z_{t-1} = i)
# Row i sums to 1 -- each row is a distribution over next states.
A = np.array([
    [0.8, 0.2],  # from Sunny: 80 % stay sunny, 20 % become rainy
    [0.4, 0.6],  # from Rainy: 40 % become sunny, 60 % stay rainy
])

# Emission matrix: B[k, x] = P(X_t = x | Z_t = k)
# Row k sums to 1 -- distribution over observations given hidden state.
B = np.array([
    [0.9, 0.1],  # Sunny: 90 % no umbrella, 10 % umbrella
    [0.2, 0.8],  # Rainy: 20 % no umbrella, 80 % umbrella
])

def forward(obs_seq, pi, A, B):
    # obs_seq: list of integer observation indices, length T
    # Returns: P(X_1, ..., X_T) -- the total probability of the sequence.

    T = len(obs_seq)
    K = len(pi)  # number of hidden states

    # alpha[k] = P(X_1, ..., X_t, Z_t = k)  -- the forward variable.
    # We update this vector in-place at each time step.

    # Initialisation: alpha_1[k] = pi[k] * B[k, x_1]
    # Combine the initial state probability with the first emission.
    alpha = pi * B[:, obs_seq[0]]  # shape (K,)

    for t in range(1, T):
        x_t = obs_seq[t]  # current observation index

        # Prediction step: sum over all possible previous states.
        # alpha_hat[j] = sum_k alpha[k] * A[k, j]
        # Written as a matrix-vector product: A.T @ alpha
        alpha_hat = A.T @ alpha  # shape (K,)

        # Update step: weight by the emission probability at time t.
        # alpha_t[j] = alpha_hat[j] * B[j, x_t]
        alpha = alpha_hat * B[:, x_t]  # shape (K,)

        # Note: in practice we log-scale alpha to avoid underflow for long sequences.

    # The total sequence probability is the sum over all final hidden states.
    return float(alpha.sum())

# ── Reproduce the worked example: obs = (no umbrella, umbrella) = [0, 1] ──────
obs = [0, 1]
prob = forward(obs, pi, A, B)
print(f"P(X=[0,1]) = {prob:.4f}")  # should be 0.1824

# ── Try a longer sequence ──────────────────────────────────────────────────────
obs_long = [0, 1, 1, 0, 1]
prob_long = forward(obs_long, pi, A, B)
print(f"P(X=[0,1,1,0,1]) = {prob_long:.6f}")
# The probability shrinks with length -- more specific sequences are rarer.
`}
      />
    </div>
  );
}
