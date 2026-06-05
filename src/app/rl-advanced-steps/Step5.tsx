'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows a single actor-critic step: compute the advantage
          using the one-step TD error, then update both the actor and the critic.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="actor_critic.py"
        caption="One actor-critic update step: advantage = r + gamma*V(s2) - V(s); actor and critic updated."
        code={`import numpy as np

# ------------------------------------------------------------------ #
# Minimal numpy sketch of a one-step Actor-Critic                      #
# Actor  -- linear softmax policy, weights theta (4 x 2)              #
# Critic -- linear value function, weights w (4,)                      #
# ------------------------------------------------------------------ #

n_actions   = 2
n_features  = 4
alpha_actor  = 0.01   # actor learning rate -- policy updates
alpha_critic = 0.05   # critic learning rate -- value updates (usually larger)
gamma        = 0.99   # discount factor

# Initialise weights -- in practice these would be neural network parameters
theta = np.zeros((n_features, n_actions))  # actor: maps state -> action logits
w     = np.zeros(n_features)               # critic: maps state -> scalar value V(s)

def softmax(logits):
    logits = logits - np.max(logits)       # numerical stability
    exp = np.exp(logits)
    return exp / exp.sum()

def critic_value(state, w):
    # Linear value function: V(s) = w . s
    # A neural network would replace this dot product with a forward pass
    return float(w @ state)

def actor_critic_step(s, a, reward, s_next, done):
    # -------------------------------------------------------------- #
    # CRITIC STEP                                                      #
    # Compute the TD target and advantage -- both use the critic       #
    # -------------------------------------------------------------- #

    V_s      = critic_value(s, w)       # critic estimate of current state
    V_s_next = critic_value(s_next, w)  # critic estimate of next state

    # If s_next is terminal (done=True), its value is 0 by definition
    td_target = reward + gamma * V_s_next * (1.0 - float(done))

    # Advantage: how much better was this action than the critic expected?
    # Positive advantage => action was better than average => increase probability
    # Negative advantage => action was worse than average  => decrease probability
    advantage = td_target - V_s

    # Critic update: minimise squared TD error via gradient descent
    # Gradient of (V(s) - target)^2 with respect to w is 2*(V(s)-target)*s
    # We drop the 2 (absorbed into alpha_critic) and move in descent direction
    w_grad = advantage * s    # gradient of V(s)=w.s with respect to w is just s
    w[:] += alpha_critic * w_grad  # ascent toward target (advantage is signed)

    # -------------------------------------------------------------- #
    # ACTOR STEP                                                       #
    # Use the advantage as a signed weight on the log-prob gradient    #
    # -------------------------------------------------------------- #

    logits = s @ theta
    probs  = softmax(logits)

    # Gradient of log pi(a|s) for a softmax policy (same derivation as REINFORCE)
    grad_log_pi = np.outer(s, -probs)   # initialise to -s*p for all actions
    grad_log_pi[:, a] += s              # correct the taken action column

    # Scale gradient by advantage and step in the ascent direction
    # If advantage > 0, we raise the probability of action a
    # If advantage < 0, we lower it -- the sign does the right thing automatically
    theta[:] += alpha_actor * grad_log_pi * advantage

    return advantage  # return for logging

# ------------------------------------------------------------------ #
# Example: one transition matching the worked example above            #
# ------------------------------------------------------------------ #

s      = np.array([0.10, 0.03, -0.02, 0.15])   # current CartPole state
a      = 1                                        # push-right
reward = 1.0
s_next = np.array([0.12, 0.23, -0.05, -0.10])   # next state
done   = False

# Seed the critic so the example shows the numbers from the worked example
# V(s) should read ~4.20 and V(s_next) ~5.10 with appropriate w
w = np.linalg.lstsq(
    np.vstack([s, s_next]),
    np.array([4.20, 5.10]),
    rcond=None
)[0]

adv = actor_critic_step(s, a, reward, s_next, done)
print(f"Advantage (TD error): {adv:.4f}")  # should be close to +1.849
print(f"Critic updated w: {w}")
print(f"Actor theta[:,1] (push-right weights): {theta[:, 1]}")
# Positive values in theta[:,1] mean the policy now prefers push-right more`}
      />
    </div>
  );
}
