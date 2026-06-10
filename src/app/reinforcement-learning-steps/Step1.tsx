'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Learning by Doing">
        <p>
          Think about how you learned to ride a bike. Nobody handed you a manual
          with labeled examples — &quot;lean left 12 degrees, pedal at 60 rpm.&quot;
          You just tried things, fell over, adjusted, and eventually your brain
          figured out what works. That&apos;s <strong>reinforcement learning</strong> in a nutshell.
        </p>
        <p>
          An RL agent learns entirely through <strong>trial and error</strong>. It takes
          actions, observes what happens, receives a reward signal — positive for good
          outcomes, negative for bad ones — and gradually improves. No teacher providing
          correct answers. Just experience.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Where RL Shows Up">
        <p>
          Reinforcement learning is behind some of the most striking AI achievements of
          the past decade:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Atari games</strong> — DeepMind&apos;s DQN agent learned to play dozens
            of Atari games at superhuman level, starting from nothing but raw pixels and
            the game score as reward.
          </li>
          <li>
            <strong>AlphaGo &amp; AlphaZero</strong> — defeated world champions at Go, a game
            so complex that brute-force search is impossible. AlphaZero learned chess,
            shogi, and Go entirely by playing itself.
          </li>
          <li>
            <strong>Robotics</strong> — robots learn to walk, grasp objects, and navigate
            physical environments by trying movements and receiving feedback from sensors.
          </li>
          <li>
            <strong>Language model fine-tuning</strong> — RLHF (Reinforcement Learning from
            Human Feedback) is how models like ChatGPT are trained to be helpful and
            harmless after initial pre-training.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="How RL Differs from Supervised Learning">
        <p>
          In <strong>supervised learning</strong>, you provide labeled training data: thousands
          of (input, correct answer) pairs. The model learns to match inputs to outputs.
          It&apos;s like studying with an answer key.
        </p>
        <p>
          In <strong>reinforcement learning</strong>, there is no answer key. Instead:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>The agent makes decisions over time, not just one prediction.</li>
          <li>Feedback is a scalar <strong>reward</strong>, not a correct label.</li>
          <li>Rewards can be <strong>delayed</strong> — a move in chess only pays off twenty
            moves later. The agent must figure out which past actions deserve credit.</li>
          <li>The agent&apos;s own actions <strong>shape the future</strong> data it sees —
            unlike supervised learning, where the training set is fixed.</li>
        </ul>
        <p>
          This makes RL both more powerful and much harder than supervised learning. But it
          is the natural framework for any problem that involves <em>sequential decision-making
          in an uncertain world</em>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Running Example: The Grid-World Maze">
        <p>
          Throughout this course we will use one concrete, visual example: an agent navigating
          a small <strong>5 &times; 5 grid-world</strong>. The agent starts in the top-left corner
          and must find its way to a <strong>goal cell</strong> (bottom-right) while avoiding a{' '}
          <strong>pit</strong> that ends the episode with a large penalty.
        </p>
        <p>
          The grid is simple enough to reason about by hand, but it contains all the
          ingredients of a real RL problem: states, actions, rewards, delayed consequences,
          and a policy to learn. Every concept we introduce will be grounded in this maze.
        </p>
      </ExplanationBox>
    </div>
  );
}
