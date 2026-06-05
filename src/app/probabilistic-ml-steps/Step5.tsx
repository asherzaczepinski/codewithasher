'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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

    </div>
  );
}
