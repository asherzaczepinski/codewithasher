'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Knowing How Good a State Is">
        <p>
          Rewards tell the agent what just happened. But to make smart decisions, the agent needs to
          know something deeper: <em>how good is the situation I&apos;m in right now?</em>
        </p>
        <p>
          That&apos;s exactly what <strong>value functions</strong> capture. A value function estimates
          the expected return — the total discounted future reward — starting from a particular state
          or state-action pair, assuming the agent follows a specific policy &pi; from that point on.
        </p>
      </ExplanationBox>

      <ExplanationBox title="State-Value Function V(s)">
        <p>
          The <strong>state-value function V&pi;(s)</strong> answers: &quot;If I&apos;m in state s and
          I follow policy &pi; from here, how much total return do I expect to get?&quot;
        </p>
        <p>
          In our grid-world, cells close to the goal have high V — getting there quickly means collecting
          the big +10 reward before discounting shrinks it too much. Cells far from the goal have lower V.
          The pit cell has a very negative V because stepping in ends the episode with −10.
        </p>
      </ExplanationBox>

      <MathFormula label="State-Value Function">
        {`Vπ(s) = 𝔼π[ Gₜ | sₜ = s ]
       = 𝔼π[ rₜ + γ·rₜ₊₁ + γ²·rₜ₊₂ + ... | sₜ = s ]

  "Expected return when starting in state s and following policy π."`}
      </MathFormula>

      <ExplanationBox title="Action-Value Function Q(s, a)">
        <p>
          The <strong>action-value function Q&pi;(s, a)</strong> is even more useful for learning. It
          answers: &quot;If I&apos;m in state s, I take action a right now, and then I follow policy &pi;
          for all future steps — how much total return do I expect?&quot;
        </p>
        <p>
          The key difference from V: Q also conditions on the first action a, which might differ from
          what &pi; would have chosen. This lets the agent compare actions head-to-head in the same state.
        </p>
      </ExplanationBox>

      <MathFormula label="Action-Value Function (Q-function)">
        {`Qπ(s, a) = 𝔼π[ Gₜ | sₜ = s, aₜ = a ]

  "Expected return when taking action a in state s, then following π."

  Relationship:  Vπ(s) = Σ π(a|s) · Qπ(s, a)
                         a
  (State value is the average Q-value under the policy.)`}
      </MathFormula>

      <ExplanationBox title="Grid-World Intuition">
        <p>
          Imagine colouring every cell of our 5 &times; 5 maze by its V value under a good policy:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          V values (approximate, γ = 0.9):
          <br /><br />
          4.5 &nbsp;5.0 &nbsp;5.6 &nbsp;6.2 &nbsp;6.9<br />
          5.0 &nbsp;5.6 &nbsp;6.2 &nbsp;6.9 &nbsp;7.7<br />
          5.6 &nbsp;6.2 &nbsp;6.9 &nbsp;[P] &nbsp;8.6<br />
          6.2 &nbsp;6.9 &nbsp;7.7 &nbsp;8.6 &nbsp;9.6<br />
          6.9 &nbsp;7.7 &nbsp;8.6 &nbsp;9.6 &nbsp;[G]
        </p>
        <p>
          Values increase smoothly toward the goal (bottom-right) and the pit region is avoided by
          good paths curving around it. A cell&apos;s value is high not because it gives a big
          immediate reward — most cells give only −0.1 — but because it puts the agent in a position
          to reach the +10 goal quickly.
        </p>
        <p>
          This is the key insight: <strong>value functions look ahead</strong>. They fold the entire
          future into a single number per state. Once you have good value estimates, good decisions
          follow automatically — always move to the highest-value neighbouring cell.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Q Is More Useful Than V for Learning">
        <p>
          With V(s) alone, to decide on an action the agent needs to know how the environment will
          transition — &quot;if I go RIGHT from (1,2), where do I end up?&quot; That requires a model
          of the environment.
        </p>
        <p>
          With Q(s, a), the agent can pick the best action with a simple lookup:
          choose a* = argmax<sub>a</sub> Q(s, a). No environment model required. This is why
          model-free algorithms like Q-learning work directly with Q rather than V.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Initialising the Q-table takes a single NumPy call. Every entry starts at 0 — the agent
          begins with no knowledge and will fill in the values through experience.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="qlearning.py"
        caption="The Q-table is a 25x4 NumPy array of zeros — one row per state, one column per action."
        code={`# ---------------------------------------------------------------------------
# Q-TABLE INITIALISATION
# ---------------------------------------------------------------------------

# Q[s, a] holds the agent's current estimate of the expected discounted
# return when taking action a in state s, then acting optimally afterward.
#
# Shape: (N_STATES, N_ACTIONS) = (25, 4)
#   rows  -> states  0..24  (the 25 grid cells)
#   cols  -> actions 0..3   (UP, DOWN, LEFT, RIGHT)
#
# We initialise everything to 0.0 -- an optimistic but neutral starting point.
# The learning algorithm will overwrite these as the agent explores.

Q = np.zeros((N_STATES, N_ACTIONS), dtype=np.float64)

# Quick sanity check: the table has the right shape
assert Q.shape == (25, 4), "Q-table must be 25 states x 4 actions"

# At the start, all actions in all states look equally worthless (Q=0).
# The agent has no preference yet -- it might as well pick randomly.
print("Initial Q-table shape:", Q.shape)     # (25, 4)
print("All zeros?", np.all(Q == 0))          # True

# ---------------------------------------------------------------------------
# READING AND WRITING THE Q-TABLE
# ---------------------------------------------------------------------------

# To look up Q(s, a): index with both the state and action integers directly.
s = rc_to_state(1, 2)   # state 7 = cell (1,2)
a = RIGHT                # action 3

current_q = Q[s, a]     # reads Q[(1,2), RIGHT] -- currently 0.0

# To find the best action in a state: take the argmax across the action axis.
best_action  = np.argmax(Q[s])    # returns 0 (ties broken by first index)
best_q_value = np.max(Q[s])       # returns 0.0 (all tied at zero initially)

# After training, np.argmax(Q[s]) will point to the direction most likely
# to lead the agent toward the goal -- that is the learned policy.`}
      />
    </div>
  );
}
