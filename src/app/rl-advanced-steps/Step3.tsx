'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
          Q-learning changes one thing: instead of using the Q-value of the action the agent{' '}
          <em>will</em> take next, it uses the Q-value of the <em>best</em> action available
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

    </div>
  );
}
