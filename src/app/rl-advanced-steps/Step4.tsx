'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="A Different Idea: Optimise the Policy Directly">
        <p>
          Value-based methods learn Q, then extract a policy by acting greedily. Policy
          gradient methods flip this: they represent the policy explicitly as a parameterised
          function — usually a neural network with weights theta — and directly optimise
          those weights to maximise expected return. There is no Q-table at all.
        </p>
        <p>
          The policy is written <strong>pi(a | s; theta)</strong>, which reads: the
          probability of taking action a from state s, given parameters theta. For CartPole
          we might output two probabilities — one for push-left, one for push-right — that
          always sum to 1.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Parameterise the Policy?">
        <p>
          There are two big wins. First, policy gradients handle <strong>continuous
          action spaces</strong> naturally: output a Gaussian distribution over a continuous
          torque or force, and sample from it. Trying to be greedy over an infinite action
          space with a Q-table is impossible.
        </p>
        <p>
          Second, the policy can be <strong>stochastic by design</strong>. In some games a
          deterministic policy is exploitable — think rock-paper-scissors. A stochastic
          policy can be optimal in a way no deterministic policy can match.
        </p>
      </ExplanationBox>

      <MathFormula label="Policy Gradient Objective (maximise)">
        J(theta) = E[tau ~ pi_theta] [ SUM over t: R(t) ]
      </MathFormula>

      <ExplanationBox title="The Policy Gradient Theorem">
        <p>
          Differentiating J with respect to theta gives a surprisingly clean result: the
          gradient of the expected return equals the expected value of the gradient of the
          log-probability of the trajectory, weighted by the return. This is the policy
          gradient theorem, and it gives us something we can actually compute from samples.
        </p>
      </ExplanationBox>

      <MathFormula label="Policy Gradient Theorem (REINFORCE estimator)">
        grad J(theta) = E[ SUM over t: grad log pi(a(t)|s(t); theta) * G(t) ]
      </MathFormula>

      <ExplanationBox title="REINFORCE: The Algorithm">
        <p>
          REINFORCE is the simplest policy gradient algorithm. For each episode:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Run the policy to collect a full trajectory.</li>
          <li>Compute the return G(t) at each timestep (sum of future discounted rewards).</li>
          <li>
            For each timestep, nudge theta in the direction of
            grad log pi(a(t)|s(t); theta) * G(t).
          </li>
        </ul>
        <p>
          Intuitively: if the episode went well (high G), increase the probability of the
          actions you took. If it went poorly (low G), decrease them.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Variance and Baselines">
        <p>
          The REINFORCE estimator is <strong>unbiased</strong> — on average it points in the
          right direction — but it has <strong>very high variance</strong>. One lucky episode
          can push the gradient estimate wildly off. The fix is a <strong>baseline</strong>:
          subtract some state-dependent value b(s) from G(t) before multiplying. A common
          choice is V(s(t)), the estimated state value. The modified estimator
          G(t) - V(s(t)) is called the <strong>advantage</strong> and tells the agent not
          just how good the return was in absolute terms, but how much better it was than
          expected. This does not introduce bias (the baseline cancels in expectation) but
          dramatically reduces variance — which is exactly what actor-critic methods exploit.
        </p>
      </ExplanationBox>

      <WorkedExample title="REINFORCE Update for CartPole">
        <p>
          The agent runs one CartPole episode and survives for 3 timesteps with rewards
          R1 = 1, R2 = 1, R3 = 1 (then falls). Use gamma = 0.99 and alpha = 0.01.
          Focus on timestep t = 1. The policy network outputs
          P(push-right | s1) = 0.7, and the agent took push-right.
        </p>

        <CalcStep number={1}>
          Compute return from t=1: G(1) = 1 + 0.99 * 1 + 0.99^2 * 1 = 1 + 0.99 + 0.9801 = 2.9701.
        </CalcStep>
        <CalcStep number={2}>
          Log-probability of the action taken: log(0.7) &asymp; -0.357.
        </CalcStep>
        <CalcStep number={3}>
          Gradient contribution at t=1: grad log pi * G(1) = grad(-0.357) * 2.9701.
        </CalcStep>
        <CalcStep number={4}>
          The gradient of log pi with respect to theta for a softmax policy is
          (1 - 0.7) = 0.3 for the &quot;push-right&quot; output logit.
          Scaled: 0.3 * 2.9701 = 0.891.
        </CalcStep>
        <CalcStep number={5}>
          Parameter update: theta &larr; theta + alpha * 0.891 = theta + 0.00891.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The probability of pushing right in s1 increases because the episode had a
          positive return. Sum contributions from all three timesteps to get the full
          gradient and apply one gradient ascent step.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The numpy sketch below implements one full REINFORCE episode: collect a
          trajectory, compute discounted returns, then apply the gradient ascent update
          for every timestep.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="reinforce.py"
        caption="REINFORCE policy gradient update — log-prob times return, gradient ascent."
        code={`import numpy as np

# ------------------------------------------------------------------ #
# Minimal numpy sketch of REINFORCE (no deep-learning framework)       #
# Policy: a linear softmax over two actions (push-left, push-right)   #
# ------------------------------------------------------------------ #

n_actions  = 2
n_features = 4   # CartPole state has 4 dimensions
alpha      = 0.01  # learning rate for gradient ascent
gamma      = 0.99  # discount factor

# Policy weights: shape (n_features, n_actions)
# theta[i, a] is the weight connecting feature i to action a's logit
theta = np.zeros((n_features, n_actions))

def softmax(logits):
    # Subtract max for numerical stability before exponentiating
    logits = logits - np.max(logits)
    exp    = np.exp(logits)
    return exp / exp.sum()  # probabilities sum to 1

def select_action(state):
    # Compute action probabilities via a linear layer + softmax
    logits = state @ theta          # dot product: (4,) @ (4,2) => (2,)
    probs  = softmax(logits)        # convert logits to a probability distribution
    action = np.random.choice(n_actions, p=probs)  # sample -- policy is stochastic
    return action, probs

# ------------------------------------------------------------------ #
# Step 1 -- collect one episode trajectory                             #
# ------------------------------------------------------------------ #

# Pretend we ran the environment and recorded these (for illustration)
states  = [np.array([0.02, -0.01, 0.03, 0.04]),   # s0
           np.array([0.03,  0.18, 0.02, -0.23]),   # s1
           np.array([0.06,  0.37, -0.01, -0.50])]  # s2
actions = [1, 1, 0]   # actions taken at each timestep (push-right, push-right, push-left)
rewards = [1.0, 1.0, 1.0]  # CartPole: +1 every step the pole stays up

# ------------------------------------------------------------------ #
# Step 2 -- compute the discounted return G(t) for each timestep       #
# G(t) = R(t) + gamma*R(t+1) + gamma^2*R(t+2) + ...                  #
# We compute this backwards so we only need one pass through rewards.  #
# ------------------------------------------------------------------ #

T = len(rewards)
returns = np.zeros(T)
G = 0.0
for t in reversed(range(T)):
    G = rewards[t] + gamma * G   # accumulate discounted reward from the end
    returns[t] = G

# Normalise returns to reduce variance -- subtract mean, divide by std
# This is a common trick; it does not change the direction of the gradient,
# only its scale, but it greatly stabilises training.
returns = (returns - returns.mean()) / (returns.std() + 1e-8)

# ------------------------------------------------------------------ #
# Step 3 -- gradient ascent on J(theta) = E[log pi(a|s) * G(t)]       #
# For each timestep we compute the gradient of log pi and scale by G.  #
# ------------------------------------------------------------------ #

grad_theta = np.zeros_like(theta)  # accumulate gradients across the episode

for t in range(T):
    s = states[t]
    a = actions[t]
    G_t = returns[t]

    logits = s @ theta
    probs  = softmax(logits)

    # Gradient of log pi(a|s) with respect to theta for a softmax policy:
    # d/d_theta log pi(a|s) = s * (1[a==a'] - pi(a'|s)) for each action a'
    # For the taken action a, the gradient of the logit weight is s * (1 - p_a).
    # For all other actions a', it is s * (0 - p_a') = -s * p_a'.
    grad_log_pi = np.outer(s, -probs)         # start: -s * p for all actions
    grad_log_pi[:, a] += s                    # add s for the action that was taken

    # Weight the gradient by the return -- good episodes reinforce taken actions
    grad_theta += grad_log_pi * G_t

# Apply one gradient ASCENT step (note the + sign -- we maximise J)
theta = theta + alpha * grad_theta

print("Updated theta (first row):", theta[0])
# A positive update on column 1 (push-right) means we increased its probability
# in states where push-right led to a positive return.`}
      />
    </div>
  );
}
