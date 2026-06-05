'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="The Fundamental Tension">
        <p>
          Here is the dilemma at the heart of every RL agent: to learn which actions are good, you
          have to <em>try</em> actions. But to perform well, you should take the action you currently
          believe is best. These two goals pull in opposite directions.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Exploitation</strong> — always pick the action with the highest estimated Q-value.
            Fast reward, but you may never discover that an untried action is even better.
          </li>
          <li>
            <strong>Exploration</strong> — try random or unfamiliar actions to gather new information.
            Sometimes costly in the short run, but necessary to find the true optimum.
          </li>
        </ul>
        <p>
          An agent that only exploits gets trapped in a local optimum. An agent that only explores
          never uses what it learned. The challenge is striking the right balance — and shifting
          that balance intelligently as training progresses.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The ε-Greedy Strategy">
        <p>
          The simplest practical solution is <strong>&epsilon;-greedy</strong> (&epsilon; = epsilon).
          The agent flips a weighted coin at each step:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>With probability <strong>&epsilon;</strong>: take a <em>random</em> action (explore).</li>
          <li>With probability <strong>1 − &epsilon;</strong>: take the action with the highest Q-value (exploit).</li>
        </ul>
        <p>
          For example, with &epsilon; = 0.1 the agent explores 10% of the time and exploits 90%.
          This ensures the agent keeps testing alternatives even after it thinks it has found a good
          policy — essential because the Q-table estimates are noisy, especially early in training.
        </p>
      </ExplanationBox>

      <MathFormula label="ε-Greedy Action Selection">
        {`At each step, sample u ~ Uniform(0, 1):

  if u < ε:   a = random action from A           (explore)
  else:        a = argmax Q(s, a)                 (exploit)
                    a

  ε ∈ [0, 1]  controls the exploration rate.`}
      </MathFormula>

      <ExplanationBox title="Decaying ε Over Time">
        <p>
          Early in training the Q-table is full of zeros and guesses — exploration is crucial because
          the agent doesn&apos;t know anything yet. Later, the estimates become reliable and the agent
          should commit to what it has learned.
        </p>
        <p>
          The standard fix is to <strong>decay &epsilon;</strong> over time: start with a high value
          (e.g. &epsilon; = 1.0, fully random) and reduce it episode by episode until it reaches a small
          floor (e.g. &epsilon;_min = 0.01). A common schedule is multiplicative decay:
        </p>
      </ExplanationBox>

      <MathFormula label="Decaying ε Schedule">
        {`After each episode:   ε ← max(ε_min,  ε × ε_decay)

  Example: ε_start = 1.0,  ε_decay = 0.995,  ε_min = 0.01

  Episode   1:  ε = 1.000   (nearly all exploration)
  Episode 100:  ε = 0.606
  Episode 500:  ε = 0.082
  Episode 920:  ε = 0.010   (floor reached — mostly exploitation)`}
      </MathFormula>

      <WorkedExample title="ε-Greedy Decision in the Grid-World">
        <p>
          The agent is at state s = (0, 2). The current Q-values are:
          Q(UP) = −1.2, Q(DOWN) = 3.1, Q(LEFT) = 1.4, Q(RIGHT) = 2.8. ε = 0.1.
        </p>

        <CalcStep number={1}>Sample u = 0.07 from Uniform(0, 1).</CalcStep>
        <CalcStep number={2}>Check: u = 0.07 &lt; ε = 0.10 → explore!</CalcStep>
        <CalcStep number={3}>Pick a random action uniformly from &#123;UP, DOWN, LEFT, RIGHT&#125;. Random pick: LEFT.</CalcStep>
        <CalcStep number={4}>Agent moves LEFT to (0, 1) even though DOWN has the highest Q-value (3.1).</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          In 90% of visits to this state the agent would have chosen DOWN (the greedy best), collecting
          reliable reward. But this time exploration kicked in. Perhaps the Q-value for LEFT is
          underestimated — this visit will generate a real experience and update Q(s, LEFT) with
          fresh data. Over many such explorations the table becomes more accurate.
        </p>
      </WorkedExample>

      <ExplanationBox title="Beyond the Q-Table: Deep RL">
        <p>
          The Q-table works beautifully for small state spaces like our 25-cell grid. But Atari games
          have roughly 10<sup>68</sup> possible screen states — a table would be impossibly large.
        </p>
        <p>
          <strong>Deep Q-Networks (DQN)</strong>, introduced by DeepMind in 2015, replace the table
          with a neural network that takes a state as input and outputs Q-values for every action.
          The network generalises across similar-looking states rather than memorising each one.
          The update rule is the same Bellman equation — but now we perform gradient descent on the
          neural network weights instead of updating a table cell.
        </p>
        <p>
          Everything you have learned in this course — the interaction loop, states and actions, the
          policy, discounted return, value functions, Q-learning, and ε-greedy exploration — carries
          over directly to DQN and every modern RL algorithm. The concepts scale; only the function
          approximator changes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What You Now Know">
        <p>
          You have covered the complete foundation of reinforcement learning:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>The agent-environment loop: state → action → reward → next state.</li>
          <li>States and actions, and how they define the problem.</li>
          <li>Policies: the strategy that maps states to actions.</li>
          <li>Return and discounting: why γ makes future rewards worth less.</li>
          <li>Value functions V(s) and Q(s,a): estimating expected return.</li>
          <li>Q-learning: the Bellman update that drives learning from experience.</li>
          <li>Exploration vs exploitation and the ε-greedy strategy.</li>
        </ul>
        <p>
          These ideas sit at the core of AlphaGo, DQN, robotics controllers, and the RLHF systems
          behind modern language models. You now have the vocabulary and intuition to read those papers
          and understand what is actually happening.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          This final snippet completes <code>qlearning.py</code>. It adds epsilon-greedy action
          selection and wires it into the full training loop with decaying epsilon — replacing the
          greedy-only loop from Step 7 with one that balances exploration and exploitation throughout training.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="qlearning.py"
        caption="Epsilon-greedy action selection with decaying epsilon — the complete Q-learning agent for the grid-world."
        code={`# ---------------------------------------------------------------------------
# EPSILON-GREEDY EXPLORATION WITH DECAYING EPSILON
# ---------------------------------------------------------------------------

EPSILON_START = 1.0    # begin fully random -- the agent knows nothing yet
EPSILON_MIN   = 0.01   # never go below 1% exploration even when well-trained
EPSILON_DECAY = 0.995  # multiply epsilon by this after every episode
                       # after ~920 episodes: 1.0 * 0.995^920 ~ 0.01 (floor hit)

def choose_action(Q, state, epsilon):
    # Epsilon-greedy action selection.
    #
    # With probability epsilon we pick a RANDOM action -- exploration.
    #   This forces the agent to try paths it has not seen much,
    #   correcting underestimates in the Q-table.
    #
    # With probability (1 - epsilon) we pick the GREEDY action -- exploitation.
    #   argmax selects the action with the highest current Q-value estimate.
    #
    # As epsilon decays toward 0, the agent gradually shifts from exploring
    # to trusting (and exploiting) what it has learned.

    if np.random.random() < epsilon:
        return np.random.randint(N_ACTIONS)   # explore: uniformly random action
    else:
        return int(np.argmax(Q[state]))       # exploit: best known action

# ---------------------------------------------------------------------------
# COMPLETE TRAINING LOOP (replaces the greedy loop from Step 7)
# ---------------------------------------------------------------------------

Q       = np.zeros((N_STATES, N_ACTIONS), dtype=np.float64)  # fresh Q-table
epsilon = EPSILON_START

episode_returns = []

for episode in range(N_EPISODES):
    state   = 0       # reset to start state (0,0) each episode
    rewards = []

    for _ in range(MAX_STEPS):
        # Choose action with epsilon-greedy -- exploration fades each episode
        action = choose_action(Q, state, epsilon)

        # Step the environment and get the transition
        next_state, reward, done = step(state, action)

        # Q-learning update: pull Q[state, action] toward the Bellman target
        q_update(Q, state, action, reward, next_state)

        rewards.append(reward)
        state = next_state

        if done:
            break

    # Decay epsilon after each episode -- less random as training matures
    epsilon = max(EPSILON_MIN, epsilon * EPSILON_DECAY)

    episode_returns.append(sum(rewards))

# ---------------------------------------------------------------------------
# EXTRACT AND DISPLAY THE LEARNED POLICY
# ---------------------------------------------------------------------------

ACTION_NAMES = {UP: "^", DOWN: "v", LEFT: "<", RIGHT: ">"}

print("Learned policy (greedy w.r.t. final Q-table):")
for row in range(ROWS):
    line = ""
    for col in range(COLS):
        s = rc_to_state(row, col)
        if s == GOAL_STATE:
            line += " G "   # goal cell
        elif s == PIT_STATE:
            line += " P "   # pit cell
        else:
            best_a = int(np.argmax(Q[s]))
            line += f" {ACTION_NAMES[best_a]} "   # arrow for greedy action
    print(line)

# A well-trained agent prints arrows that curve around the pit
# and point toward the goal -- the optimal path emerges from
# pure trial-and-error via the Q-learning update rule.`}
      />
    </div>
  );
}
