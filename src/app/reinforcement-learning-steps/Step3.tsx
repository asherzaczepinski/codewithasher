'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="What Is a State?">
        <p>
          A <strong>state</strong> is everything the agent knows about the current situation that is
          relevant for deciding what to do next. It is the environment&apos;s snapshot handed to the agent
          at each timestep.
        </p>
        <p>
          The state must capture enough information that the best action depends only on the state —
          not on how you got there. This is called the <strong>Markov property</strong>: the future is
          independent of the past given the present state. RL algorithms assume this holds (or approximate it).
        </p>
        <p>
          States can be simple or rich:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Grid-world</strong>: the agent&apos;s (row, column) position — just two integers.</li>
          <li><strong>Atari game</strong>: the last four video frames stacked together — ~33,000 pixel values.</li>
          <li><strong>Robot arm</strong>: joint angles, velocities, and sensor readings — dozens of floats.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The State Space">
        <p>
          The <strong>state space</strong> S is the set of all possible states. In our grid-world, every
          cell is a state, giving us 25 states total (a 5 &times; 5 grid). We can write them as:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          S = &#123;(0,0), (0,1), (0,2), (0,3), (0,4),<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(1,0), (1,1), ..., (4,4)&#125;
        </p>
        <p>
          Two of these states are <strong>terminal</strong>: (4,4) the goal and (2,3) the pit. The
          episode ends the moment the agent enters a terminal state.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Is an Action?">
        <p>
          An <strong>action</strong> is a choice the agent makes. The <strong>action space</strong> A
          is the set of all choices available to the agent. In our grid-world, the agent can move in
          four directions from any non-wall cell:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          A = &#123; UP, DOWN, LEFT, RIGHT &#125;
        </p>
        <p>
          If the agent tries to move into a wall (off the grid edge), it stays in place and still pays
          the −0.1 step cost. This is intentional — bumping walls should be discouraged.
        </p>
      </ExplanationBox>

      <MathFormula label="State and Action Spaces">
        {`State space:   S = {s₁, s₂, ..., sₙ}    (n = 25 for our 5×5 grid)
Action space:  A = {a₁, a₂, ..., aₖ}    (k = 4: UP, DOWN, LEFT, RIGHT)`}
      </MathFormula>

      <ExplanationBox title="Concrete Example: One Timestep">
        <p>
          Suppose the agent is at cell (1, 2) — row 1, column 2, somewhere in the middle-left area.
          The state is simply <strong>s = (1, 2)</strong>.
        </p>
        <p>
          The agent chooses action <strong>DOWN</strong>. The environment transitions to the new state
          <strong> s&apos; = (2, 2)</strong> and returns reward <strong>r = −0.1</strong> (just a regular step,
          no goal or pit). The agent notes this (s, a, r, s&apos;) tuple and uses it for learning.
        </p>
        <p>
          If instead the agent had chosen <strong>RIGHT</strong> twice and then <strong>DOWN</strong>,
          it would have arrived at (2, 3) — the pit — and received r = −10 with the episode ending immediately.
          Same starting position, different sequence of actions, drastically different outcome.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          The constants and helper functions below extend the environment from Step 2.
          They show exactly how states and actions are represented as plain integers,
          and demonstrate calling <code>step</code> to execute one (s, a, r, s&apos;) transition.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="qlearning.py"
        caption="States are flat integers 0-24; actions are integers 0-3. One call to step() produces a full (s, a, r, s') tuple."
        code={`# ---------------------------------------------------------------------------
# STATES AND ACTIONS  (extends the GridWorld from Step 2)
# ---------------------------------------------------------------------------

# The 25 states of our 5x5 grid are numbered 0 to 24, row-major:
#
#   (0,0)=0   (0,1)=1   (0,2)=2   (0,3)=3   (0,4)=4
#   (1,0)=5   (1,1)=6   (1,2)=7   ...
#   ...                                       (4,4)=24
#
# Keeping states as integers (not tuples) means we can use them
# directly as array indices into the Q-table later.

# Actions are also plain integers. The meaning is fixed by DELTAS:
#   0 = UP     (-1 row)
#   1 = DOWN   (+1 row)
#   2 = LEFT   (-1 col)
#   3 = RIGHT  (+1 col)
UP, DOWN, LEFT, RIGHT = 0, 1, 2, 3

# ---------------------------------------------------------------------------
# DEMO: trace through one concrete (s, a, r, s') transition
# ---------------------------------------------------------------------------

start_state = rc_to_state(1, 2)    # agent is at row=1, col=2 -> state 7
action      = DOWN                  # the agent decides to move down

next_state, reward, done = step(start_state, action)
# step() returns:
#   next_state = rc_to_state(2, 2) = 12   (moved one row down)
#   reward     = -0.1                      (ordinary step, not goal or pit)
#   done       = False                     (episode continues)

print(f"s={start_state}  a={action}(DOWN)  r={reward}  s'={next_state}  done={done}")
# Output: s=7  a=1(DOWN)  r=-0.1  s'=12  done=False

# If the agent had moved RIGHT twice from (1,2) and then DOWN it would
# reach the pit at state 13 and get r=-10 with done=True.
pit_demo, pit_r, pit_done = step(rc_to_state(2, 2), RIGHT)
# pit_demo = 13 (the pit), pit_r = -10.0, pit_done = True`}
      />
    </div>
  );
}
