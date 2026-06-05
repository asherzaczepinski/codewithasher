'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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
    </div>
  );
}
