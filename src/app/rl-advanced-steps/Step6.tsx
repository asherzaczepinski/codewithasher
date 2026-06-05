'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Function Approximation: Replacing the Table">
        <p>
          A Q-table stores one value per (state, action) pair. CartPole with four continuous
          state variables has infinitely many states — a table is impossible. The solution is
          to approximate Q with a <strong>neural network</strong> Q(s, a; theta) that takes a
          state as input and outputs Q-values for every action simultaneously. The network
          generalises: after seeing state s it can predict sensible Q-values for nearby
          states it has never visited.
        </p>
        <p>
          This is called <strong>Deep Q-Networks (DQN)</strong>, and it comes with two
          engineering tricks that make training stable — tricks that would not be needed with
          a simple table.
        </p>
      </ExplanationBox>

      <ExplanationBox title="DQN Trick 1: Experience Replay">
        <p>
          When a network trains on consecutive experience (s1, a1, r1, s2), (s2, a2, r2, s3)
          ..., successive samples are highly correlated. Neural networks trained on correlated
          data forget earlier patterns — a phenomenon called <strong>catastrophic
          forgetting</strong>. DQN breaks the correlation by storing all transitions in a
          large <strong>replay buffer</strong> and sampling a random mini-batch at each update.
          The network sees a diverse mixture of past and recent experience rather than a
          temporally correlated stream.
        </p>
      </ExplanationBox>

      <ExplanationBox title="DQN Trick 2: Target Network">
        <p>
          In standard Q-learning the target is R + gamma * max Q(s&apos;, a&apos;; theta). But if
          theta is the same network you are updating, the target moves every step. Chasing a
          moving target is like trying to hit a pigeon that flies when you shoot. DQN keeps a
          separate <strong>target network</strong> with weights theta_minus, copied from the
          main network every few thousand steps and frozen between copies. The target becomes
          R + gamma * max Q(s&apos;, a&apos;; theta_minus) — a stable reference for many updates in a row.
        </p>
      </ExplanationBox>

      <MathFormula label="DQN Loss (mean squared TD error)">
        L(theta) = E[(R + gamma * max Q(s&apos;,a&apos;; theta_minus) - Q(s,a; theta))^2]
      </MathFormula>

      <ExplanationBox title="The Exploration Problem">
        <p>
          All the algorithms so far assume the agent can try actions and see results.
          But how much should it explore? Too much exploration wastes time on suboptimal
          actions; too little traps the agent in a local optimum. Epsilon-greedy is the
          simplest solution: with probability epsilon pick randomly, otherwise pick greedily.
          Epsilon is often annealed — large at first, shrinking as the agent learns. This
          works but is undirected: every unexplored action is equally likely regardless of
          how promising it looks.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Multi-Armed Bandits: Exploration Without State">
        <p>
          The <strong>multi-armed bandit</strong> problem strips away state entirely: an agent
          repeatedly pulls one of k slot-machine arms, each with an unknown reward
          distribution, and tries to maximise total reward. There is no transition, no
          next state — just action and reward. It isolates the exploration-exploitation
          tradeoff in its purest form and gives us principled algorithms for it.
        </p>
        <p>
          <strong>UCB (Upper Confidence Bound)</strong> picks the arm that maximises the
          estimated mean reward <em>plus</em> an exploration bonus that grows with how rarely
          the arm has been tried. It formalises the idea: &quot;prefer arms you are uncertain
          about, because they might be better than they look.&quot;
        </p>
        <p>
          <strong>Thompson Sampling</strong> takes a Bayesian approach: maintain a posterior
          distribution over each arm&apos;s reward probability, sample one value from each
          posterior, then pull the arm with the highest sample. Over time the posteriors
          sharpen, exploration naturally concentrates on promising arms.
        </p>
      </ExplanationBox>

      <MathFormula label="UCB Action Selection">
        a(t) = argmax over a: [Q_hat(a) + c * sqrt(ln(t) / N(a))]
      </MathFormula>

      <WorkedExample title="UCB on a 3-Arm Bandit">
        <p>
          We have 3 arms. After 10 total pulls: arm 1 tried 4 times with mean reward 0.5,
          arm 2 tried 5 times with mean 0.6, arm 3 tried 1 time with mean 0.8. Use c = 1.
          Which arm does UCB choose at pull 11?
        </p>

        <CalcStep number={1}>
          Exploration bonus for arm 1: sqrt(ln(10) / 4) = sqrt(2.303 / 4) = sqrt(0.576) &asymp; 0.759.
          UCB score: 0.5 + 0.759 = 1.259.
        </CalcStep>
        <CalcStep number={2}>
          Exploration bonus for arm 2: sqrt(ln(10) / 5) = sqrt(2.303 / 5) = sqrt(0.461) &asymp; 0.679.
          UCB score: 0.6 + 0.679 = 1.279.
        </CalcStep>
        <CalcStep number={3}>
          Exploration bonus for arm 3: sqrt(ln(10) / 1) = sqrt(2.303) &asymp; 1.518.
          UCB score: 0.8 + 1.518 = 2.318.
        </CalcStep>
        <CalcStep number={4}>
          Arm 3 wins. Even though arm 2 has a higher observed mean, arm 3 has only been
          tried once — the UCB bonus is huge. We explore arm 3 because our uncertainty about
          it is high enough that it could be the best arm.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          These bandit algorithms generalise to full RL: UCB-style bonuses appear in
          intrinsic motivation research and curiosity-driven exploration. The intuition
          — explore what you are uncertain about — scales from a slot machine to a robot.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The code below runs UCB action selection for many pulls and includes a comment
          block explaining how Thompson Sampling would replace the UCB score computation.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="bandit_ucb.py"
        caption="UCB action selection over three arms, with a comment on Thompson Sampling."
        code={`import numpy as np

# ------------------------------------------------------------------ #
# Multi-Armed Bandit -- 3 arms, each with a hidden Bernoulli reward    #
# The agent does not know these true probabilities; it must learn them. #
# ------------------------------------------------------------------ #

np.random.seed(42)

n_arms = 3
# True (hidden) reward probabilities -- the agent never sees these directly
true_probs = np.array([0.3, 0.5, 0.8])   # arm 2 is actually best

# ------------------------------------------------------------------ #
# Tracking variables -- updated after each pull                        #
# ------------------------------------------------------------------ #

counts       = np.zeros(n_arms)   # N(a): how many times each arm has been pulled
sum_rewards  = np.zeros(n_arms)   # total reward collected from each arm
q_hat        = np.zeros(n_arms)   # Q_hat(a): running mean reward estimate

# Exploration constant -- higher c means more exploration
# c=1 is a common default; tune it to balance exploration vs exploitation
c = 1.0

n_rounds = 200   # total number of pulls (budget)
total_reward = 0.0

for t in range(1, n_rounds + 1):

    # ---------------------------------------------------------------- #
    # UCB ACTION SELECTION                                               #
    # Score = estimated mean + exploration bonus                         #
    # Bonus = c * sqrt(ln(t) / N(a)) -- shrinks as N(a) grows,         #
    # grows as t grows (we become more confident others are suboptimal) #
    # ---------------------------------------------------------------- #

    # Force each arm to be tried at least once (exploration bonus is infinite
    # when N(a)=0 because we divide by zero; handle this first)
    untried = np.where(counts == 0)[0]
    if len(untried) > 0:
        chosen_arm = untried[0]   # try untried arms in order
    else:
        # Exploration bonus for each arm
        exploration_bonus = c * np.sqrt(np.log(t) / counts)

        # UCB score = mean estimate + bonus
        # Arms pulled rarely have a large bonus -- we are uncertain about them
        ucb_scores = q_hat + exploration_bonus

        # Choose the arm with the highest UCB score
        chosen_arm = int(np.argmax(ucb_scores))

    # Pull the chosen arm -- observe a stochastic reward
    reward = float(np.random.rand() < true_probs[chosen_arm])  # 1 or 0

    # Update tracking statistics
    counts[chosen_arm]      += 1
    sum_rewards[chosen_arm] += reward
    q_hat[chosen_arm]        = sum_rewards[chosen_arm] / counts[chosen_arm]

    total_reward += reward

# ------------------------------------------------------------------ #
# THOMPSON SAMPLING (described, not executed -- same interface)        #
# Instead of computing a UCB score, Thompson Sampling maintains a      #
# Beta(alpha, beta) posterior over each arm's reward probability.      #
# alpha = 1 + successes, beta = 1 + failures                          #
# At each step: sample one value from each arm's posterior, then pull  #
# the arm whose sample is highest.                                     #
#                                                                      #
# thompson_action = np.argmax([                                        #
#     np.random.beta(1 + sum_rewards[a], 1 + counts[a] - sum_rewards[a])  #
#     for a in range(n_arms)                                           #
# ])                                                                   #
#                                                                      #
# As the agent accumulates data, the Beta posteriors sharpen around    #
# the true probabilities -- exploration naturally concentrates on the  #
# arms that are still uncertain AND promising.                         #
# ------------------------------------------------------------------ #

print("Final pull counts :", counts)          # arm 2 should dominate
print("Estimated means   :", q_hat.round(3))  # should approach [0.3, 0.5, 0.8]
print(f"Total reward collected: {total_reward:.0f} / {n_rounds}")

# Regret = reward if we always pulled the best arm - actual reward
best_possible = true_probs.max() * n_rounds
regret = best_possible - total_reward
print(f"Cumulative regret : {regret:.1f}")    # lower is better; UCB is sublinear O(log t)`}
      />
    </div>
  );
}
