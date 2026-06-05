'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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

    </div>
  );
}
