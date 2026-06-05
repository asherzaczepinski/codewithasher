'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Learning Without a Model: Bootstrapping">
        <p>
          Dynamic programming requires knowing P and R. In real problems — including CartPole
          with a physics simulator — we can <em>sample</em> transitions but we don&apos;t
          have an explicit table of probabilities. Temporal-Difference (TD) learning bridges
          this gap by doing something elegant: it <strong>bootstraps</strong>, using its own
          current value estimates as targets rather than waiting for a full episode to finish.
        </p>
        <p>
          The key insight is the <strong>TD error</strong>: the difference between what the
          agent expected and what it actually got plus what it now estimates the next state is
          worth. The agent nudges its value estimate toward that TD error by a small step size
          alpha.
        </p>
      </ExplanationBox>

      <MathFormula label="TD Error (delta)">
        delta = R(t+1) + gamma * V(s(t+1)) - V(s(t))
      </MathFormula>

      <MathFormula label="TD(0) value update">
        V(s(t)) &larr; V(s(t)) + alpha * delta
      </MathFormula>

      <ExplanationBox title="SARSA: On-Policy TD Control">
        <p>
          SARSA learns the <strong>action-value function Q(s, a)</strong> rather than V, so
          it can directly improve the policy. It is called SARSA because each update uses the
          tuple (State, Action, Reward, next-State, next-Action) — the agent takes action a
          from state s, lands in s&apos;, and then <em>actually selects</em> the next action
          a&apos; under the current (possibly exploratory) policy before updating. Because the
          target includes the action the agent will truly take, SARSA is <strong>on-policy</strong>:
          it learns the value of the policy it is actually following, exploration included.
        </p>
      </ExplanationBox>

      <MathFormula label="SARSA update rule">
        Q(s,a) &larr; Q(s,a) + alpha * [R + gamma * Q(s&apos;,a&apos;) - Q(s,a)]
      </MathFormula>

      <ExplanationBox title="Q-Learning: Off-Policy TD Control">
        <p>
          Q-learning changes one thing: instead of using the Q-value of the action the agent
          <em> will</em> take next, it uses the Q-value of the <em>best</em> action available
          in s&apos; — the greedy maximum. This makes Q-learning <strong>off-policy</strong>:
          the target is always the value of the optimal policy, regardless of how exploratory
          the agent&apos;s actual behaviour is. The agent can wander and explore freely; the
          update always aims at the optimal Q*. This separation of behaviour policy
          (exploratory) from target policy (greedy) is extremely powerful — you can even
          learn from data collected by a different agent or from replayed past experience.
        </p>
      </ExplanationBox>

      <MathFormula label="Q-Learning update rule">
        Q(s,a) &larr; Q(s,a) + alpha * [R + gamma * max(Q(s&apos;, a&apos;)) - Q(s,a)]
      </MathFormula>

      <ExplanationBox title="Side-by-Side Comparison">
        <p>
          The only difference is in the target: SARSA uses Q(s&apos;, a&apos;) where a&apos;
          is the action actually taken; Q-learning uses max Q(s&apos;, a&apos;). In a safe
          environment they converge to the same optimal policy. In a dangerous environment
          (think a cliff-walking grid) SARSA learns a safer path because it accounts for
          occasional exploratory slips; Q-learning learns the theoretically optimal (but
          riskier) path because it always imagines perfect greedy behaviour.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Update Step for CartPole Q-Table">
        <p>
          Suppose we discretise the CartPole state into 4 bins per dimension — 256 bins
          total — and maintain a Q-table. At timestep t the agent is in state s = bin 42,
          takes action a = 1 (push right), earns reward R = 1.0, and lands in state
          s&apos; = bin 87. The current estimates are Q(42, 1) = 3.20 and
          max Q(87, *) = 4.50. Use alpha = 0.1, gamma = 0.99.
        </p>

        <CalcStep number={1}>
          Compute the TD target: R + gamma * max Q(s&apos;) = 1.0 + 0.99 * 4.50 = 1.0 + 4.455 = 5.455.
        </CalcStep>
        <CalcStep number={2}>
          Compute the TD error: delta = 5.455 - 3.20 = 2.255.
        </CalcStep>
        <CalcStep number={3}>
          Apply the Q-learning update: Q(42, 1) &larr; 3.20 + 0.1 * 2.255 = 3.20 + 0.2255 = 3.426.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Now repeat with SARSA: the agent uses epsilon-greedy and happens to select
          a&apos; = 0 (push left) in s&apos; = 87. Suppose Q(87, 0) = 3.80. The SARSA
          target is 1.0 + 0.99 * 3.80 = 4.762.
        </p>

        <CalcStep number={4}>
          SARSA TD error: 4.762 - 3.20 = 1.562.
        </CalcStep>
        <CalcStep number={5}>
          SARSA update: Q(42, 1) &larr; 3.20 + 0.1 * 1.562 = 3.356.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Q-learning pushed Q(42,1) higher because it optimistically assumes the agent will
          always pick the best next action. SARSA is more conservative because it accounts
          for the chance the agent explores.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Both update rules are placed side by side so you can see the single difference:
          SARSA uses the action the agent actually picks next; Q-learning uses the greedy max.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="sarsa_vs_qlearning.py"
        caption="SARSA (on-policy) and Q-learning (off-policy) update rules shown side by side."
        code={`import numpy as np

# ------------------------------------------------------------------ #
# Shared setup -- a small discretised Q-table for CartPole             #
# ------------------------------------------------------------------ #

n_states  = 256   # 4 bins per dimension => 4^4 = 256 discrete states
n_actions = 2     # push-left (0) or push-right (1)

Q = np.zeros((n_states, n_actions))  # initialise all Q-values to zero

alpha = 0.1   # learning rate -- how much we trust each new experience
gamma = 0.99  # discount factor -- future rewards count slightly less
epsilon = 0.1 # exploration rate for epsilon-greedy action selection

def epsilon_greedy(Q, state, epsilon):
    # With probability epsilon pick a random action (explore)
    if np.random.rand() < epsilon:
        return np.random.randint(n_actions)
    # Otherwise pick the action with the highest Q-value (exploit)
    return int(np.argmax(Q[state]))

# ------------------------------------------------------------------ #
# SARSA -- ON-POLICY                                                   #
# The update target uses Q(s', a') where a' is the action we will     #
# actually take next under the current (possibly exploratory) policy.  #
# ------------------------------------------------------------------ #

def sarsa_update(Q, s, a, reward, s_next, a_next):
    # TD target: immediate reward + discounted Q of the NEXT (s, a) pair
    # a_next was already sampled from the behaviour policy -- could be exploratory
    td_target = reward + gamma * Q[s_next, a_next]

    # TD error: how far our current estimate is from the bootstrapped target
    td_error  = td_target - Q[s, a]

    # Nudge Q(s, a) toward the target by a small step alpha
    Q[s, a] += alpha * td_error
    # Key insight: because a_next came from epsilon-greedy, SARSA learns the
    # value of the exploratory policy itself -- it is on-policy.
    return Q

# ------------------------------------------------------------------ #
# Q-LEARNING -- OFF-POLICY                                             #
# The update target uses max Q(s', *) -- the best possible next action #
# regardless of what the agent will actually do next.                  #
# ------------------------------------------------------------------ #

def qlearning_update(Q, s, a, reward, s_next):
    # TD target: reward + discounted value of the BEST action in s_next
    # This is always the greedy max -- no matter how the agent explores
    td_target = reward + gamma * np.max(Q[s_next])

    # TD error and update are identical in form to SARSA ...
    td_error  = td_target - Q[s, a]
    Q[s, a] += alpha * td_error
    # ... but the target is off-policy: it always imagines perfect greedy behaviour.
    # This lets Q-learning learn from data collected by ANY behaviour policy.
    return Q

# ------------------------------------------------------------------ #
# Example: one step demonstrating the difference in target values      #
# ------------------------------------------------------------------ #

s       = 42    # current discretised state
a       = 1     # action taken: push-right
reward  = 1.0   # CartPole gives +1 every timestep the pole stays up
s_next  = 87    # next state after the transition

# Seed Q-table with illustrative values so the difference is visible
Q[s, a]    = 3.20
Q[s_next]  = np.array([3.80, 4.50])  # Q(87, push-left)=3.80, Q(87, push-right)=4.50

# SARSA picks the next action NOW (before updating)
a_next_sarsa = epsilon_greedy(Q, s_next, epsilon=0.3)  # might pick 0 or 1
print(f"SARSA next action sampled: {a_next_sarsa} -- Q target uses this value")

Q_sarsa = sarsa_update(Q.copy(), s, a, reward, s_next, a_next_sarsa)
Q_ql    = qlearning_update(Q.copy(), s, a, reward, s_next)

print(f"Q(42,1) after SARSA      : {Q_sarsa[s, a]:.4f}")  # uses Q(87, a_next)
print(f"Q(42,1) after Q-learning : {Q_ql[s, a]:.4f}")     # uses max Q(87,*) = 4.50
# Q-learning is always >= SARSA target because max >= any single action value`}
      />
    </div>
  );
}
