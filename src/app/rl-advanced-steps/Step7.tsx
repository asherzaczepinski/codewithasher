'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Learning from Demonstrations: Imitation Learning">
        <p>
          Sometimes designing a reward function is harder than simply showing the agent what
          to do. A surgeon, a racing driver, or a factory robot operator can demonstrate the
          desired behaviour. <strong>Imitation learning</strong> extracts a policy from those
          demonstrations without ever needing a reward signal.
        </p>
        <p>
          The simplest approach is <strong>Behavioral Cloning (BC)</strong>: treat the
          demonstrations as a supervised learning dataset of (state, action) pairs and train
          a policy network to predict the expert&apos;s action given a state. BC is fast and
          works surprisingly well when demonstrations are plentiful and cover the entire
          state space the agent will encounter.
        </p>
        <p>
          The classic failure mode is <strong>covariate shift</strong>: the learner makes a
          small mistake, lands in a state the expert never visited, and has no guidance —
          errors compound. <strong>DAgger (Dataset Aggregation)</strong> fixes this by
          letting the learner run, querying the expert for corrections on the states the
          learner actually visits, and adding those (state, expert-action) pairs to the
          training set iteratively. This closes the distribution gap: the policy is trained
          on states it will actually see.
        </p>
      </ExplanationBox>

      <MathFormula label="Behavioral Cloning Objective">
        min over theta: E[(s,a) ~ D_expert] [-log pi(a | s; theta)]
      </MathFormula>

      <ExplanationBox title="Offline RL: Learning from a Fixed Dataset">
        <p>
          <strong>Offline RL</strong> (also called batch RL) goes further: the agent learns
          entirely from a pre-collected dataset of transitions — logs from a previous policy,
          a human operator, or a mix of many sources — without any online interaction with
          the environment. This is crucial in domains where exploration is expensive or
          dangerous: clinical medicine, industrial control, autonomous vehicles.
        </p>
        <p>
          The central challenge is <strong>distribution shift</strong>. Standard Q-learning
          asks &quot;what is the best action in state s?&quot; and may assign high Q-values
          to actions never seen in the dataset. When deployed, the agent takes those actions
          and ends up in states where the Q-estimates are completely unreliable — a feedback
          loop of increasingly wrong predictions.
        </p>
        <p>
          Modern offline RL algorithms add a <strong>conservatism penalty</strong>: they
          discourage the policy from selecting actions far outside the dataset distribution.
          Methods like <strong>CQL (Conservative Q-Learning)</strong> penalise Q-values on
          out-of-distribution actions during training, keeping the learned policy close to
          what the data can actually support.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Multi-Agent RL: Many Agents, Many Interests">
        <p>
          All of the algorithms so far assume a single agent. <strong>Multi-Agent RL
          (MARL)</strong> studies systems where multiple agents act simultaneously, each
          with its own observations and rewards. The environment for each agent is
          non-stationary because the other agents are also learning and changing.
        </p>
        <p>
          The two extremes are <strong>cooperation</strong> — agents share a reward and
          must coordinate (robot teams, traffic signal control, multi-player cooperative
          games) — and <strong>competition</strong> — agents have opposing rewards and
          must outmanoeuvre each other (poker, StarCraft, economic simulations). Many
          real systems sit in between: partially cooperative, partially competitive.
        </p>
        <p>
          A common architecture is <strong>Centralised Training with Decentralised
          Execution (CTDE)</strong>: during training, a centralised critic can see all
          agents&apos; observations and actions; at deployment, each agent acts using only
          its own local observations. This is how QMIX and MAPPO work in cooperative
          settings.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Real-World Applications">
        <p>
          These three frontiers are not academic curiosities — they underpin some of the most
          impressive real-world RL deployments:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Robotics</strong> — robot manipulation policies are often pre-trained via
            imitation on human teleoperation demonstrations, then fine-tuned with RL.
          </li>
          <li>
            <strong>Recommendation systems</strong> — offline RL learns from logged user
            interaction data without A/B testing every new policy on live users.
          </li>
          <li>
            <strong>Game AI</strong> — OpenAI Five (Dota 2) and AlphaStar (StarCraft II) use
            multi-agent self-play, where agents compete against past versions of themselves
            to continuously improve.
          </li>
          <li>
            <strong>Language models</strong> — RLHF (Reinforcement Learning from Human
            Feedback) is an offline-style imitation + RL pipeline: first clone human
            preferences, then fine-tune with RL to maximise a learned reward model.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Where to Go Next">
        <p>
          You&apos;ve now covered the full arc of modern RL: from the formal MDP and dynamic
          programming, through temporal-difference methods, policy gradients, actor-critic
          architectures, deep RL engineering tricks, principled exploration, and finally the
          frontiers of imitation, offline, and multi-agent learning.
        </p>
        <p>
          The natural next steps are model-based RL (learn a world model, plan inside it),
          hierarchical RL (learn options and sub-goals), and RL fine-tuning of large
          pre-trained models. Each of those fields builds directly on everything you just
          learned — and the Bellman equation, the policy gradient theorem, and the
          bias-variance tradeoff you encountered in this course will appear in all of them.
        </p>
        <p>
          Congratulations on completing <strong>Advanced Reinforcement Learning</strong>.
        </p>
      </ExplanationBox>
    </div>
  );
}
