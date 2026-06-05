'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="What Is a Policy?">
        <p>
          A <strong>policy</strong> is the agent&apos;s strategy — the rule it uses to decide which action
          to take in any given state. Think of it as the agent&apos;s brain. Everything the agent has learned
          about the environment is encoded in its policy.
        </p>
        <p>
          Formally, a policy is written as <strong>&pi;</strong> (the Greek letter pi). Given the
          current state s, the policy tells the agent what to do.
        </p>
      </ExplanationBox>

      <MathFormula label="Deterministic Policy">
        {`π(s) = a
  For every state s, the policy maps directly to a single action a.`}
      </MathFormula>

      <ExplanationBox title="Deterministic vs Stochastic Policies">
        <p>
          A <strong>deterministic policy</strong> maps each state to exactly one action. Every time
          the agent finds itself in state s, it does the same thing. In our grid-world, a deterministic
          policy might say:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          &pi;(0,0) = RIGHT &nbsp; &pi;(0,1) = RIGHT &nbsp; &pi;(0,2) = DOWN<br />
          &pi;(1,2) = DOWN &nbsp;&nbsp; &pi;(2,2) = DOWN &nbsp;&nbsp; &pi;(3,2) = RIGHT<br />
          ... and so on for every cell.
        </p>
        <p>
          A <strong>stochastic policy</strong> instead outputs a <em>probability distribution</em> over
          actions. It says &quot;take UP with 70% chance, RIGHT with 30% chance&quot; rather than committing
          to one action. Stochastic policies are useful when randomness helps with exploration or when
          the environment itself is uncertain.
        </p>
      </ExplanationBox>

      <MathFormula label="Stochastic Policy">
        {`π(a | s) = probability of taking action a when in state s

  Example: π(RIGHT | (0,0)) = 0.7,  π(DOWN | (0,0)) = 0.3`}
      </MathFormula>

      <ExplanationBox title="The Goal: Finding the Optimal Policy">
        <p>
          Not all policies are equal. A random policy that stumbles around the maze earns far less
          reward than one that navigates efficiently to the goal. The fundamental objective of every
          RL algorithm is to find the <strong>optimal policy &pi;*</strong> — the one that maximizes
          the agent&apos;s total reward over time.
        </p>
        <p>
          &quot;Total reward over time&quot; is the key phrase. We don&apos;t just care about the
          immediate reward from the next step. We care about the <em>long-run</em> consequences of
          our choices. A good chess move might sacrifice a piece now to win the game twenty moves later.
          The optimal policy accounts for this.
        </p>
        <p>
          In our grid-world, the optimal policy is the set of arrows at every cell that guides the
          agent to the goal as quickly as possible while steering well clear of the pit. We don&apos;t
          hand the agent this map — it has to discover it through experience.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why the Policy Is Everything">
        <p>
          Once you have the optimal policy, you&apos;re done. The agent never needs to think again —
          just look up the current state, read off the action, and execute. All of the hard learning
          work is baked into &pi;*.
        </p>
        <p>
          This is why different RL algorithms can look so different on the surface but share the same
          goal: some methods (like Q-learning, coming up soon) find the policy indirectly by first
          estimating which actions are valuable; others (like policy gradient methods) search for the
          optimal policy directly. Both roads lead to &pi;*.
        </p>
      </ExplanationBox>
    </div>
  );
}
