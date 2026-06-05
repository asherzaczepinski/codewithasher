'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Formal Markov Decision Process">
        <p>
          A <strong>Markov Decision Process (MDP)</strong> is the mathematical object that
          almost every RL algorithm assumes. It has five parts:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>S</strong> — a set of states (e.g., the four CartPole numbers).</li>
          <li><strong>A</strong> — a set of actions (push left, push right).</li>
          <li>
            <strong>P(s&apos; | s, a)</strong> — the transition probability: given you are in
            state s and take action a, the probability of landing in state s&apos;.
          </li>
          <li>
            <strong>R(s, a, s&apos;)</strong> — the reward received on that transition.
            In CartPole it is always +1 while the episode continues.
          </li>
          <li>
            <strong>gamma (discount factor)</strong> — a number in (0, 1] that shrinks the
            value of rewards received further in the future. A gamma of 0.99 means a reward
            100 steps away is worth 0.99^100 &asymp; 0.37 of the same reward right now.
          </li>
        </ul>
        <p>
          The <strong>Markov property</strong> is the key assumption: the next state depends
          only on the current state and action, not on anything that happened earlier. The
          present is a sufficient statistic for the future.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Value Functions">
        <p>
          The <strong>state-value function</strong> V(s) tells you the expected total
          discounted reward starting from state s and following policy pi forever after. The
          <strong> action-value function</strong> Q(s, a) tells you the same thing, but you
          first take a specific action a before following the policy.
        </p>
      </ExplanationBox>

      <MathFormula label="State-value function V(s)">
        V(s) = E[ R(t) + gamma * R(t+1) + gamma^2 * R(t+2) + ... | s(t) = s ]
      </MathFormula>

      <MathFormula label="Action-value function Q(s, a)">
        Q(s, a) = E[ R(t) + gamma * V(s(t+1)) | s(t) = s, a(t) = a ]
      </MathFormula>

      <ExplanationBox title="The Bellman Equation">
        <p>
          The Bellman equation is a recursive decomposition of V(s): the value of a state
          equals the immediate reward you expect to get, plus the discounted value of wherever
          you land. This self-referential structure is the engine of almost every RL algorithm.
        </p>
      </ExplanationBox>

      <MathFormula label="Bellman equation (under policy pi)">
        V(s) = SUM over a: pi(a|s) * SUM over s&apos;: P(s&apos;|s,a) * [R(s,a,s&apos;) + gamma * V(s&apos;)]
      </MathFormula>

      <ExplanationBox title="Dynamic Programming: Value Iteration">
        <p>
          When we <em>know</em> the model — both P and R — we can solve the Bellman
          equation exactly using <strong>dynamic programming</strong>. Value iteration
          repeatedly applies the Bellman optimality backup to every state until the values
          stop changing:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', marginTop: '8px' }}>
          V_new(s) = max over a: SUM over s&apos;: P(s&apos;|s,a) * [R(s,a,s&apos;) + gamma * V_old(s&apos;)]
        </p>
        <p>
          Policy iteration alternates between <em>policy evaluation</em> (compute V for the
          current policy) and <em>policy improvement</em> (act greedily with respect to V).
          Both methods converge to the optimal value function V* and optimal policy pi*.
          The catch: we need P and R — the full model — which we rarely have in practice.
          That&apos;s why model-free methods like TD learning exist.
        </p>
      </ExplanationBox>

      <WorkedExample title="Bellman Backup: One Step for CartPole">
        <p>
          Imagine a tiny two-state model to illustrate the backup. State A is
          &quot;pole upright&quot; and state B is &quot;pole fallen&quot; (terminal).
          From state A, the agent pushes right. With probability 0.9 it stays in A
          (earning +1) and with probability 0.1 it transitions to B (earning 0). Use
          gamma = 0.99 and assume V(B) = 0 (terminal). We want one Bellman backup
          for V(A).
        </p>

        <CalcStep number={1}>
          List the transitions: P(A | A, push-right) = 0.9, R = 1;
          P(B | A, push-right) = 0.1, R = 0.
        </CalcStep>
        <CalcStep number={2}>
          Write the backup: V_new(A) = 0.9 * (1 + 0.99 * V(A)) + 0.1 * (0 + 0.99 * V(B)).
        </CalcStep>
        <CalcStep number={3}>
          Seed with V(A) = 0 for the first iteration:
          V_new(A) = 0.9 * (1 + 0.99 * 0) + 0.1 * (0 + 0.99 * 0) = 0.9 * 1 + 0.1 * 0 = 0.90.
        </CalcStep>
        <CalcStep number={4}>
          Second iteration with V(A) = 0.90:
          V_new(A) = 0.9 * (1 + 0.99 * 0.90) + 0.1 * 0 = 0.9 * 1.891 = 1.702.
        </CalcStep>
        <CalcStep number={5}>
          This converges toward V*(A) = 0.9 / (1 - 0.99 * 0.9) &asymp; 0.9 / 0.109
          &asymp; 8.26 — the expected sum of discounted rewards from this state.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Each backup pulls V(A) up toward its true value by looking one step ahead and
          using the current estimate of V for the next state. Apply this to every state in
          a loop and you get value iteration.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The loop below encodes exactly the Bellman optimality backup you just computed
          by hand, applied to every state until the value function converges.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="value_iteration.py"
        caption="Value iteration over a small MDP until the value function converges."
        code={`import numpy as np

# ------------------------------------------------------------------ #
# Tiny MDP definition                                                  #
# States: 0 = pole upright (A), 1 = pole fallen (B, terminal)         #
# Actions: 0 = push-left, 1 = push-right                              #
# ------------------------------------------------------------------ #

# transitions[s][a] = list of (prob, next_state, reward) tuples
transitions = {
    0: {
        0: [(0.8, 0, 1.0), (0.2, 1, 0.0)],  # push-left mostly stays upright
        1: [(0.9, 0, 1.0), (0.1, 1, 0.0)],  # push-right slightly better
    },
    1: {
        0: [(1.0, 1, 0.0)],  # terminal state absorbs all transitions
        1: [(1.0, 1, 0.0)],
    },
}

gamma = 0.99        # discount factor -- future rewards shrink by this each step
theta = 1e-6        # convergence threshold -- stop when max delta < theta
n_states = 2

# Start with an optimistic (or zero) guess for every state value
V = np.zeros(n_states)

iteration = 0
while True:
    delta = 0.0  # track the largest change in any state this sweep

    for s in range(n_states):
        # Compute the Bellman optimality backup: max over all actions
        action_values = []
        for a in transitions[s]:
            # Sum over all possible next states weighted by transition probability
            q_sa = sum(
                prob * (reward + gamma * V[next_s])
                for prob, next_s, reward in transitions[s][a]
            )
            action_values.append(q_sa)

        # The optimal value of s is the best action-value available
        v_new = max(action_values)

        # Track how much V changed -- used for the convergence check
        delta = max(delta, abs(v_new - V[s]))
        V[s] = v_new

    iteration += 1

    # Stop when values have stabilised (largest change smaller than theta)
    if delta < theta:
        break

print(f"Converged after {iteration} iterations")
print(f"V(upright) = {V[0]:.4f}")  # should approach ~8.26 for this MDP
print(f"V(fallen)  = {V[1]:.4f}")  # terminal state -- always 0

# Extract the greedy policy from the converged value function
policy = {}
for s in range(n_states):
    best_action = max(
        transitions[s],
        key=lambda a: sum(
            p * (r + gamma * V[ns]) for p, ns, r in transitions[s][a]
        ),
    )
    policy[s] = best_action

print(f"Optimal policy: {policy}")  # e.g. {0: 1, 1: 0} -- push-right when upright`}
      />
    </div>
  );
}
