'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="The Q-Table">
        <p>
          For small state and action spaces we can store every Q(s, a) value in a table — one row per
          state, one column per action. At the start, we initialise every entry to 0 (the agent knows
          nothing). As the agent explores and collects experience, it updates the table. Over many
          episodes the table converges toward the true optimal Q-values.
        </p>
        <p>
          In our grid-world the Q-table has 25 rows (one per cell) and 4 columns (UP, DOWN, LEFT,
          RIGHT). That&apos;s 100 numbers to learn — very manageable.
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UP &nbsp;&nbsp; DOWN &nbsp; LEFT &nbsp; RIGHT<br />
          (0,0): &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp; 0<br />
          (0,1): &nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp; 0 &nbsp;&nbsp;&nbsp;&nbsp; 0<br />
          &nbsp;&nbsp;...&nbsp;&nbsp; &nbsp;(all zeros at the start)
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Q-Learning Update Rule">
        <p>
          After every step the agent performs one table update. The idea is elegant: the current
          Q-value should equal the reward just received <em>plus</em> the discounted value of the
          best action available in the next state. If our current estimate is wrong, we nudge it
          a little in the right direction. The learning rate &alpha; controls how big each nudge is.
        </p>
      </ExplanationBox>

      <MathFormula label="Q-Learning Update Rule">
        {`Q(s, a)  ←  Q(s, a) + α · [ r + γ · max Q(s', a') − Q(s, a) ]
                                       a'

  α  = learning rate (how fast we update, typically 0.1 – 0.5)
  γ  = discount factor (how much we value future rewards)
  r  = reward received after taking action a in state s
  s' = next state reached after taking action a
  max Q(s', a') = best Q-value available in the next state
   a'`}
      </MathFormula>

      <ExplanationBox title="Unpacking the Update">
        <p>
          The term in square brackets is called the <strong>TD error</strong> (Temporal Difference error):
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px' }}>
          TD error = r + γ · max Q(s&apos;, a&apos;) − Q(s, a)
        </p>
        <p>
          <strong>r + &gamma; &middot; max Q(s&apos;, a&apos;)</strong> is our <em>target</em> — what we
          think Q(s, a) should be, based on fresh information. <strong>Q(s, a)</strong> is our current
          estimate. The difference tells us how wrong we were. We move Q(s, a) a fraction &alpha; of
          the way toward the target.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>TD error &gt; 0: the outcome was better than expected — raise Q(s, a).</li>
          <li>TD error &lt; 0: the outcome was worse than expected — lower Q(s, a).</li>
          <li>TD error = 0: our estimate was exactly right — no update needed.</li>
        </ul>
      </ExplanationBox>

      <WorkedExample title="One Q-Learning Update: Concrete Numbers">
        <p>
          The agent is at state s = (1, 2). It takes action RIGHT, landing in s&apos; = (1, 3)
          and receiving reward r = −0.1. We use α = 0.5 and γ = 0.9.
        </p>
        <p>
          Current Q-table entries at s&apos; = (1, 3): Q(s&apos;, UP) = 0, Q(s&apos;, DOWN) = 2.0,
          Q(s&apos;, LEFT) = 0, Q(s&apos;, RIGHT) = 4.5.
        </p>
        <p>Current Q-value to update: Q((1,2), RIGHT) = 1.0</p>

        <CalcStep number={1}>Identify the best Q-value in s&apos; = (1,3): max Q(s&apos;, a&apos;) = max(0, 2.0, 0, 4.5) = 4.5</CalcStep>
        <CalcStep number={2}>Compute discounted future value: γ · max Q(s&apos;, a&apos;) = 0.9 × 4.5 = 4.05</CalcStep>
        <CalcStep number={3}>Compute the Q-learning target: r + γ · max Q(s&apos;, a&apos;) = −0.1 + 4.05 = 3.95</CalcStep>
        <CalcStep number={4}>Compute the TD error: target − current = 3.95 − 1.0 = 2.95</CalcStep>
        <CalcStep number={5}>Scale by learning rate: α × TD error = 0.5 × 2.95 = 1.475</CalcStep>
        <CalcStep number={6}>Update: Q((1,2), RIGHT) = 1.0 + 1.475 = 2.475</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Q((1,2), RIGHT) rose from <strong>1.0 to 2.475</strong>. The agent discovered that
          going RIGHT from (1,2) leads to a state with a very high Q-value (4.5 for RIGHT in (1,3)),
          so it now believes moving right from (1,2) is a better idea than it did before. Repeat
          this update thousands of times across all states and the table converges to the
          optimal Q-values — and the optimal policy falls out for free.
        </p>
      </WorkedExample>

      <ExplanationBox title="Extracting the Policy from Q">
        <p>
          Once the Q-table is well-trained, extracting the optimal policy is trivial. For every
          state s, simply pick the action with the highest Q-value:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px' }}>
          &pi;*(s) = argmax Q(s, a)
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; a
        </p>
        <p>
          No further learning needed. The agent just looks up each state and follows the arrow pointing
          to the highest Q-value neighbour.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The update rule is a single line of arithmetic. The training loop wraps it in episodes,
          calling <code>step()</code> to generate experience and applying the update after each transition.
          The agent&apos;s action selection here is temporarily greedy (always argmax); epsilon-greedy
          exploration is added in Step 8.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="qlearning.py"
        caption="The Q-learning update rule and training loop — the core of the algorithm."
        code={`# ---------------------------------------------------------------------------
# Q-LEARNING: UPDATE RULE + TRAINING LOOP
# ---------------------------------------------------------------------------

ALPHA        = 0.5    # learning rate -- how far we step toward each new target
                      # 0 = never update, 1 = overwrite completely; 0.1-0.5 is typical
N_EPISODES   = 500    # number of full episodes to train for
MAX_STEPS    = 200    # safety cap so one bad episode cannot loop forever

def q_update(Q, s, a, r, s2):
    # Apply the Bellman-based Q-learning update to a single (s,a,r,s') tuple.
    #
    # target = r + gamma * max_a' Q[s', a']
    #   This is our best current estimate of what Q[s,a] SHOULD be:
    #   the immediate reward plus discounted value of the best next action.
    #
    # TD_error = target - Q[s, a]
    #   Positive -> we were too pessimistic; raise Q[s,a].
    #   Negative -> we were too optimistic; lower Q[s,a].
    #   Zero     -> our estimate was already perfect; no change.
    #
    # We nudge Q[s,a] by alpha * TD_error -- a small fraction of the error.

    target   = r + GAMMA * np.max(Q[s2])   # Bellman target using best next-state value
    td_error = target - Q[s, a]            # how wrong our current estimate is
    Q[s, a]  = Q[s, a] + ALPHA * td_error  # nudge toward the target

    return Q   # Q is also modified in-place (numpy array); returning for clarity

# ---------------------------------------------------------------------------
# TRAINING LOOP -- episode by episode
# ---------------------------------------------------------------------------

episode_returns = []   # track total undiscounted reward per episode for plotting

for episode in range(N_EPISODES):
    state   = 0            # always start in the top-left corner, state 0 = (0,0)
    rewards = []           # collect per-step rewards to compute return at the end

    for _ in range(MAX_STEPS):
        # GREEDY action selection: pick the action with the highest Q-value.
        # (Step 8 replaces this with epsilon-greedy to balance exploration.)
        action = int(np.argmax(Q[state]))

        # Take the action; environment returns the transition
        next_state, reward, done = step(state, action)

        # Apply the Q-learning update for this (s, a, r, s') experience
        q_update(Q, state, action, reward, next_state)

        rewards.append(reward)
        state = next_state   # advance to the next state

        if done:
            break   # episode finished (goal or pit reached)

    episode_returns.append(sum(rewards))

# After 500 episodes the Q-table has seen thousands of transitions.
# np.argmax(Q[s]) in any state now gives a near-optimal action.
print(f"Mean return (last 50 episodes): {np.mean(episode_returns[-50:]):.2f}")
# Early training: mean near -10 (often falls in pit)
# Late training:  mean near  +6 (reliably reaches goal via short path)`}
      />
    </div>
  );
}
