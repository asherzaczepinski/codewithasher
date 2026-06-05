'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Problem with Pure Policy Gradients">
        <p>
          REINFORCE waits until the episode ends, then computes returns. If CartPole runs
          for 500 steps, the gradient estimate is based on 500 noisy, correlated samples.
          The variance is enormous. More importantly, you can&apos;t use REINFORCE at all in
          continuing tasks with no episode boundary.
        </p>
        <p>
          The solution is to replace the Monte Carlo return G(t) with a learned estimate of
          &quot;how good is this state?&quot; — a <strong>critic</strong>. The agent becomes
          a two-headed creature: an <strong>actor</strong> (the policy) that chooses actions,
          and a <strong>critic</strong> (a value network) that evaluates them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Advantage Function">
        <p>
          The advantage A(s, a) answers the question: how much better is action a than the
          average action from state s? If A &gt; 0, this action was better than expected —
          increase its probability. If A &lt; 0, it was worse — decrease it.
        </p>
        <p>
          The simplest practical estimate of the advantage uses the one-step TD error from
          the critic:
        </p>
      </ExplanationBox>

      <MathFormula label="Advantage estimate (one-step TD)">
        A(s(t), a(t)) &asymp; R(t+1) + gamma * V(s(t+1)) - V(s(t))
      </MathFormula>

      <MathFormula label="Actor-Critic Policy Update">
        theta &larr; theta + alpha_actor * grad log pi(a(t)|s(t); theta) * A(s(t), a(t))
      </MathFormula>

      <MathFormula label="Critic Value Update (minimise TD error)">
        w &larr; w - alpha_critic * (V_w(s(t)) - [R(t+1) + gamma * V_w(s(t+1))]) * grad V_w(s(t))
      </MathFormula>

      <ExplanationBox title="A2C and PPO at Intuition Level">
        <p>
          <strong>A2C (Advantage Actor-Critic)</strong> runs N parallel workers collecting
          experience simultaneously, averages their gradients, and applies a single update.
          Parallelism decorrelates the data and stabilises training — the same idea behind
          experience replay in DQN, but achieved through concurrency instead of a buffer.
        </p>
        <p>
          <strong>PPO (Proximal Policy Optimization)</strong> adds one more idea: it clips
          the policy update so the new policy cannot be too different from the old one.
          Without this guard, a single bad batch of data can push the policy off a cliff that
          is hard to recover from. The clipped objective keeps updates &quot;proximal&quot;
          — close to the current policy — trading a little learning speed for a lot of
          stability. PPO is the de-facto default for deep RL in 2024 because it is simple,
          robust, and works across a huge range of tasks.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Actor-Critic Dominates Modern Deep RL">
        <p>
          Pure policy gradients (REINFORCE) have high variance and need full episodes.
          Pure value-based methods (DQN) struggle with continuous actions and can be brittle.
          Actor-Critic methods get the best of both worlds:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>The actor directly represents a (possibly stochastic, continuous) policy.</li>
          <li>The critic reduces variance by providing a baseline at every step — not just at episode end.</li>
          <li>Both networks share intermediate representations when designed well, improving data efficiency.</li>
          <li>PPO&apos;s clipping makes training reliable enough to scale to robotics and game playing.</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="Actor-Critic Step for CartPole">
        <p>
          At timestep t the agent is in state s(t), takes push-right (probability 0.65),
          earns R = 1.0, and lands in s(t+1). The critic estimates V(s(t)) = 4.20 and
          V(s(t+1)) = 5.10. Use gamma = 0.99, alpha_actor = 0.01, alpha_critic = 0.05.
        </p>

        <CalcStep number={1}>
          Compute the TD target: R + gamma * V(s(t+1)) = 1.0 + 0.99 * 5.10 = 1.0 + 5.049 = 6.049.
        </CalcStep>
        <CalcStep number={2}>
          Compute the advantage: A = 6.049 - 4.20 = 1.849.
          (Action was better than the critic expected.)
        </CalcStep>
        <CalcStep number={3}>
          Actor update direction for the push-right logit: grad log pi = (1 - 0.65) = 0.35.
          Scaled: 0.35 * 1.849 = 0.647.
          Apply: theta &larr; theta + 0.01 * 0.647 &rarr; push-right probability increases.
        </CalcStep>
        <CalcStep number={4}>
          Critic TD error: V(s(t)) - target = 4.20 - 6.049 = -1.849.
          Update: w &larr; w - 0.05 * (-1.849) * grad V = w + 0.092 * grad V.
          The critic raises V(s(t)) toward 6.049.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Both updates happen after every single step — not at the end of the episode.
          This is the key efficiency gain over pure REINFORCE.
        </p>
      </WorkedExample>
    </div>
  );
}
