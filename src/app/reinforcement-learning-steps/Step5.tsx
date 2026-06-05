'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Reward vs Return">
        <p>
          A <strong>reward</strong> r is the immediate signal the agent gets after one action — the
          score for that single step. But acting well means maximising reward across the <em>entire
          episode</em>, not just the next move.
        </p>
        <p>
          The <strong>return</strong> G is the total accumulated reward from a given timestep onward.
          It is what the agent really cares about. If the agent is at step t, the return is the sum
          of all future rewards:
        </p>
      </ExplanationBox>

      <MathFormula label="Undiscounted Return">
        {`Gₜ = rₜ + rₜ₊₁ + rₜ₊₂ + ... + rᴛ
  where T is the final timestep of the episode.`}
      </MathFormula>

      <ExplanationBox title="Why We Discount Future Rewards">
        <p>
          Summing rewards equally sounds reasonable, but there&apos;s a problem: a reward right now is
          more certain than a reward far in the future. In an ongoing (non-episodic) task, the sum
          could also grow without bound.
        </p>
        <p>
          We fix both issues with a <strong>discount factor &gamma;</strong> (gamma), a number between
          0 and 1. Each future reward is multiplied by &gamma; raised to the power of how many steps
          away it is. A reward two steps away is worth &gamma;&sup2; of its face value. Rewards far in the
          future shrink to near zero.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>&gamma; close to 0</strong> — short-sighted: only the immediate next reward matters.</li>
          <li><strong>&gamma; close to 1</strong> — far-sighted: future rewards are almost as valuable as immediate ones.</li>
          <li><strong>Typical value: &gamma; = 0.9 or 0.99</strong> for most problems.</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Discounted Return">
        {`Gₜ = rₜ + γ·rₜ₊₁ + γ²·rₜ₊₂ + γ³·rₜ₊₃ + ...

     = Σ  γᵏ · rₜ₊ₖ   (summed from k=0 to T-t)
       k=0`}
      </MathFormula>

      <ExplanationBox title="Setting Up the Worked Example">
        <p>
          Our agent starts at (0,0) and takes a short 5-step path through the grid before reaching
          the goal. Here is the reward sequence it receives:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          Step 0: r₀ = −0.1 &nbsp;(regular move)<br />
          Step 1: r₁ = −0.1 &nbsp;(regular move)<br />
          Step 2: r₂ = −0.1 &nbsp;(regular move)<br />
          Step 3: r₃ = −0.1 &nbsp;(regular move)<br />
          Step 4: r₄ = +10 &nbsp;&nbsp;(reached goal!)
        </p>
        <p>
          We&apos;ll compute the return G₀ — the total discounted reward from the very first step —
          using <strong>&gamma; = 0.9</strong>.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing Discounted Return G₀ (γ = 0.9)">
        <p>We apply the formula: G₀ = r₀ + γ·r₁ + γ²·r₂ + γ³·r₃ + γ⁴·r₄</p>

        <CalcStep number={1}>γ⁰ · r₀ = 1.0 × (−0.1) = −0.1000</CalcStep>
        <CalcStep number={2}>γ¹ · r₁ = 0.9 × (−0.1) = −0.0900</CalcStep>
        <CalcStep number={3}>γ² · r₂ = 0.81 × (−0.1) = −0.0810</CalcStep>
        <CalcStep number={4}>γ³ · r₃ = 0.729 × (−0.1) = −0.0729</CalcStep>
        <CalcStep number={5}>γ⁴ · r₄ = 0.6561 × 10 = +6.5610</CalcStep>
        <CalcStep number={6}>G₀ = −0.1000 − 0.0900 − 0.0810 − 0.0729 + 6.5610 = +6.2171</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The agent&apos;s return is <strong>+6.22</strong>. The big goal reward (+10) is discounted to
          +6.56 because it arrives 4 steps in the future. The tiny step penalties barely dent the total.
          A longer path to the goal would discount the +10 further, giving a smaller return — which is
          exactly what pushes the agent to find shorter routes.
        </p>
      </WorkedExample>

      <ExplanationBox title="Return Is the True Objective">
        <p>
          The agent&apos;s job is to choose actions that <strong>maximise G</strong>. This single idea
          unifies everything in RL. Whether we&apos;re computing value functions, training a neural
          network, or evaluating a policy, we are always asking: &quot;how much return does this lead to?&quot;
        </p>
      </ExplanationBox>
    </div>
  );
}
