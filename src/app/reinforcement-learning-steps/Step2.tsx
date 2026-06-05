'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Core Loop">
        <p>
          Every reinforcement learning problem has the same heartbeat — a cycle that repeats
          at every timestep:
        </p>
        <ol style={{ lineHeight: '2' }}>
          <li>The <strong>agent</strong> observes the current <strong>state</strong> of the environment.</li>
          <li>Based on that state, the agent chooses an <strong>action</strong>.</li>
          <li>The <strong>environment</strong> responds: it transitions to a new state and hands
            the agent a <strong>reward</strong>.</li>
          <li>The agent observes the new state, and the cycle repeats.</li>
        </ol>
        <p>
          That&apos;s it. Everything in RL — from simple table-lookup to deep neural networks —
          is a strategy for making step 2 better over time.
        </p>
      </ExplanationBox>

      <MathFormula label="The Interaction Loop (formal)">
        {`At each timestep t:
  Agent receives state  sₜ
  Agent selects action  aₜ
  Environment returns   rₜ  and next state  sₜ₊₁`}
      </MathFormula>

      <ExplanationBox title="Agent vs Environment">
        <p>
          The boundary between <strong>agent</strong> and <strong>environment</strong> is important.
          The agent is whatever is making decisions — the algorithm, the neural network, the lookup
          table. The environment is everything else: the game engine, the physical world, the simulator.
        </p>
        <p>
          The agent can only influence the world through its <em>actions</em>. It cannot reach inside
          the environment and change things directly. All it can do is observe, act, and learn from the
          reward signal that comes back.
        </p>
        <p>
          The reward is designed by us — the humans building the system. Getting the reward right is
          one of the most important (and tricky) parts of applying RL. Too sparse and the agent never
          learns; too dense and it learns to game the metric instead of solving the real problem.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Grid-World: Introducing Our Agent">
        <p>
          In our 5 &times; 5 maze, the cells are labelled by (row, column) starting at (0,0) in the
          top-left. The layout looks like this:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '14px', borderRadius: '6px', lineHeight: '1.8' }}>
          S . . . .<br />
          . . . . .<br />
          . . . P .<br />
          . . . . .<br />
          . . . . G
        </p>
        <p>
          <strong>S</strong> = start (0,0) &nbsp;&nbsp; <strong>G</strong> = goal (4,4)
          &nbsp;&nbsp; <strong>P</strong> = pit (2,3)
        </p>
        <p>
          At every timestep the agent is sitting in some cell. It observes that cell, picks a
          direction to move, and the environment tells it what reward it gets and where it ends up.
          Stepping into the goal gives <strong>+10</strong>. Stepping into the pit gives <strong>−10</strong>
          and ends the episode. Every other step gives <strong>−0.1</strong> (a small cost to encourage
          finding the goal quickly).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Episodes">
        <p>
          An <strong>episode</strong> is one full run through the problem — from the start state until
          the agent reaches a terminal state (the goal or the pit). After each episode the environment
          resets and the agent tries again.
        </p>
        <p>
          Over many episodes the agent accumulates experience: which actions in which states led to
          high rewards. That accumulated experience is what lets it improve. Early episodes look like
          random wandering; later episodes look like efficient navigation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="In Python">
        <p>
          Here is the GridWorld environment we will build on throughout this course. It encodes the
          5&times;5 maze, the reward rules, and the transition logic inside a single <code>step</code> function
          that every later snippet will call.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="qlearning.py"
        caption="The GridWorld environment: step(state, action) drives the agent-environment loop."
        code={`import numpy as np

# ---------------------------------------------------------------------------
# GRID-WORLD ENVIRONMENT
# A 5x5 maze. States are integers 0-24, laid out row-major:
#   state = row * 5 + col   so (row=1, col=2) -> state 7
# ---------------------------------------------------------------------------

ROWS, COLS = 5, 5
N_STATES   = ROWS * COLS   # 25 cells total
N_ACTIONS  = 4             # 0=UP  1=DOWN  2=LEFT  3=RIGHT

GOAL_STATE  = 4 * 5 + 4   # cell (4,4) -> state 24
PIT_STATE   = 2 * 5 + 3   # cell (2,3) -> state 13

# Reward values the environment hands back each step
REWARD_GOAL =  10.0   # big positive for reaching the goal
REWARD_PIT  = -10.0   # big negative for falling in the pit
REWARD_STEP =  -0.1   # small cost on every other move (encourages speed)

# Row/col deltas for each action index
DELTAS = {
    0: (-1,  0),   # UP    -- row decreases
    1: ( 1,  0),   # DOWN  -- row increases
    2: ( 0, -1),   # LEFT  -- col decreases
    3: ( 0,  1),   # RIGHT -- col increases
}

def state_to_rc(state):
    # Decode a flat state integer back to (row, col) coordinates
    return divmod(state, COLS)   # same as (state // COLS, state % COLS)

def rc_to_state(row, col):
    # Encode (row, col) coordinates into a flat state integer
    return row * COLS + col

def step(state, action):
    # -----------------------------------------------------------------------
    # Core transition function: given the current state and an action,
    # return (next_state, reward, done).
    #
    # 'done' is True when the episode should end (goal or pit reached).
    # -----------------------------------------------------------------------

    row, col = state_to_rc(state)
    dr, dc   = DELTAS[action]          # how this action moves the agent

    # Clamp to grid boundaries -- bumping a wall keeps the agent in place
    new_row = max(0, min(ROWS - 1, row + dr))
    new_col = max(0, min(COLS - 1, col + dc))

    next_state = rc_to_state(new_row, new_col)

    # Assign reward based on where the agent landed
    if next_state == GOAL_STATE:
        return next_state, REWARD_GOAL, True    # episode ends: success
    elif next_state == PIT_STATE:
        return next_state, REWARD_PIT,  True    # episode ends: failure
    else:
        return next_state, REWARD_STEP, False   # keep going`}
      />
    </div>
  );
}
