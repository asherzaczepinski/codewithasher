'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Welcome to Advanced Reinforcement Learning">
        <p>
          You&apos;ve already seen the essentials: an <strong>agent</strong> lives in an{' '}
          <strong>environment</strong>, takes <strong>actions</strong>, and receives{' '}
          <strong>rewards</strong>. The agent&apos;s goal is to find a <strong>policy</strong>
          — a mapping from states to actions — that maximises cumulative reward. It estimates
          how good states (or state-action pairs) are via <strong>value functions</strong>,
          and it learns by trial-and-error using Q-learning, epsilon-greedy exploration, and
          discount factors that make future rewards worth a little less than immediate ones.
          That one paragraph is your recap; everything else in this course goes deeper.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Balancing a Pole">
        <p>
          Throughout this course we train an agent to balance a pole on a moving cart —
          the classic <strong>CartPole</strong> control task. The state is four numbers:
          cart position, cart velocity, pole angle, and pole angular velocity. The agent
          picks one of two discrete actions each timestep: push left or push right. It earns
          +1 for every timestep the pole stays upright, and the episode ends when the pole
          tips past 12 degrees or the cart leaves the track.
        </p>
        <p>
          It&apos;s simple enough to reason about exactly, complex enough to showcase every
          algorithm we cover, and it scales naturally to continuous-action variants when we
          reach policy gradients.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Map of RL Methods">
        <p>
          Every RL algorithm fits into one of three families:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Value-based</strong> — learn a value function (Q or V), then act
            greedily. Examples: Q-learning, SARSA, DQN. Work best with discrete actions.
          </li>
          <li>
            <strong>Policy-based</strong> — directly parameterise and optimise the policy.
            Examples: REINFORCE, PPO. Handle continuous actions naturally, but can be noisy.
          </li>
          <li>
            <strong>Actor-Critic</strong> — combine both: a policy (actor) chooses actions,
            a value function (critic) guides learning. Examples: A2C, PPO (yes, PPO fits
            here too), SAC. The dominant family in modern deep RL.
          </li>
        </ul>
        <p>
          There is also a growing world beyond these three: imitation learning, offline RL,
          multi-agent RL, and model-based RL. We cover the most important ideas in the final
          module.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          <strong>Part 1 &mdash; Value-Based Methods</strong> builds the mathematical
          foundation: the formal Markov Decision Process, the Bellman equation, dynamic
          programming when we know the model, then temporal-difference methods
          (SARSA and Q-learning) when we don&apos;t.
        </p>
        <p>
          <strong>Part 2 &mdash; Policy-Based and Beyond</strong> covers policy gradients
          and the REINFORCE objective, actor-critic methods (A2C/PPO at an intuitive level),
          deep RL with function approximation (DQN replay buffers, target networks), the
          multi-armed bandit problem as a lens on exploration, and finally the frontiers:
          imitation learning, offline RL, and multi-agent settings.
        </p>
        <p>
          Each module builds directly on the last. By the end you&apos;ll understand not just{' '}
          <em>what</em> modern RL algorithms do, but <em>why</em> each design decision
          exists and what problem it solves.
        </p>
      </ExplanationBox>
    </div>
  );
}
