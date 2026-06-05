'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Graphs as a Language for Independence">
        <p>
          A <strong>Bayesian network</strong> (also called a belief network or directed graphical
          model) is a directed acyclic graph (DAG) where every node represents a random variable
          and every directed edge represents a direct probabilistic dependency. The graph encodes
          a set of conditional independence assumptions, and those assumptions determine how the
          joint distribution factorizes.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The key insight: <em>the absence of an edge is as informative as the presence of one.</em>
          If there is no edge from X to Y, then Y is independent of X given Y&apos;s other parents.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Factorization Rule">
        <p>
          Given a Bayesian network with nodes X1, ..., Xn and each node Xi having a set of
          parents pa(Xi) in the graph, the joint distribution factorizes as:
        </p>
      </ExplanationBox>

      <MathFormula label="Bayesian Network Factorization">
        P(X1, ..., Xn) = &prod;(i=1 to n) P(Xi | pa(Xi))
      </MathFormula>

      <ExplanationBox title="Reading Independence from the Graph">
        <p>
          Three structural patterns determine whether two nodes are independent given a set of
          observed nodes:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Chain:</strong> A &rarr; B &rarr; C. Observing B blocks the path; A &perp; C | B.
          </li>
          <li>
            <strong>Fork:</strong> A &larr; B &rarr; C. Observing B blocks the path; A &perp; C | B.
          </li>
          <li>
            <strong>Collider (v-structure):</strong> A &rarr; B &larr; C. The path is blocked
            when B is <em>unobserved</em> — but observing B (or any of its descendants)
            <em>opens</em> the path, making A and C dependent. This is called explaining away.
          </li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          The general algorithm that uses these rules to determine independence in any network is
          called <strong>d-separation</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Disease-Alarm Network">
        <p>
          Consider a small network with four binary variables:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Burglary (B)</strong> — did a burglary occur? P(B=1) = 0.001</li>
          <li><strong>Earthquake (E)</strong> — did an earthquake occur? P(E=1) = 0.002</li>
          <li><strong>Alarm (A)</strong> — did the alarm go off? Depends on B and E.</li>
          <li><strong>JohnCalls (J)</strong> — John calls if he hears the alarm. Depends on A.</li>
        </ul>
        <p style={{ marginTop: '0.75rem' }}>
          Graph edges: B &rarr; A, E &rarr; A, A &rarr; J.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Factorization: P(B, E, A, J) = P(B) &times; P(E) &times; P(A | B, E) &times; P(J | A).
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Notice B &perp; E (no edge between them, no observed descendant). But once we
          observe that the alarm went off (A=1), B and E become dependent — if we know it
          was a burglary, that reduces the probability it was also an earthquake. This is
          explaining away, arising from the collider structure B &rarr; A &larr; E.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing a Joint Probability">
        <p>
          Use the factorization to compute P(B=1, E=0, A=1, J=1).
          Assume the following conditional probabilities:
        </p>
        <ul style={{ lineHeight: '1.9', marginBottom: '1rem' }}>
          <li>P(B=1) = 0.001</li>
          <li>P(E=0) = 1 &minus; 0.002 = 0.998</li>
          <li>P(A=1 | B=1, E=0) = 0.94 (alarm usually fires when there&apos;s a burglary)</li>
          <li>P(J=1 | A=1) = 0.90 (John usually calls when alarm fires)</li>
        </ul>

        <CalcStep number={1}>
          Write the factorization: P(B,E,A,J) = P(B) &times; P(E) &times; P(A | B, E) &times; P(J | A)
        </CalcStep>
        <CalcStep number={2}>
          Substitute values: 0.001 &times; 0.998 &times; 0.94 &times; 0.90
        </CalcStep>
        <CalcStep number={3}>
          0.001 &times; 0.998 = 0.000998
        </CalcStep>
        <CalcStep number={4}>
          0.000998 &times; 0.94 = 0.000938
        </CalcStep>
        <CalcStep number={5}>
          0.000938 &times; 0.90 &approx; 0.000845
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The joint probability of this specific configuration is about 0.085%. This looks small,
          but the Bayesian network allows us to compute it efficiently from just five small tables
          rather than a giant 2^4 joint table. Querying for any marginal or conditional just
          requires summing out the unwanted variables from these factored terms.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The code below encodes the Burglary-Earthquake-Alarm-JohnCalls network as dictionaries
          and computes joint probabilities and a simple posterior using the factorization rule.
          Summing out variables (marginalization) is done with explicit Python loops so you can
          see exactly what is happening.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="alarm_network.py"
        caption="Bayesian network inference for the classic Alarm network: computing joint probabilities and a posterior by enumeration."
        code={`# ── Network parameters ───────────────────────────────────────────────────────
# Each variable is binary: 0 = False, 1 = True.

# Prior probabilities (root nodes have no parents)
p_burglary  = {0: 0.999, 1: 0.001}  # burglaries are rare
p_earthquake = {0: 0.998, 1: 0.002}  # earthquakes are rarer

# P(Alarm=1 | Burglary, Earthquake)
# Key order: (burglary_val, earthquake_val) -> P(alarm=1)
# The alarm is most likely when both causes are present.
p_alarm_given_be = {
    (0, 0): 0.001,  # neither cause    -> alarm almost never fires
    (0, 1): 0.290,  # only earthquake  -> some chance of alarm
    (1, 0): 0.940,  # only burglary    -> alarm very likely
    (1, 1): 0.950,  # both             -> alarm almost certain
}

# P(JohnCalls=1 | Alarm)
# John usually calls when he hears the alarm, rarely otherwise.
p_john_given_alarm = {0: 0.05, 1: 0.90}

def p_alarm(b, e, a):
    # Look up P(A=a | B=b, E=e) from the CPT.
    # If a=0, take the complement of the stored P(A=1|...) entry.
    p_a1 = p_alarm_given_be[(b, e)]
    return p_a1 if a == 1 else 1 - p_a1

def joint(b, e, a, j):
    # Full factorization: P(B,E,A,J) = P(B) * P(E) * P(A|B,E) * P(J|A)
    # This is the Bayesian network equation -- only four small tables needed.
    return (p_burglary[b]
            * p_earthquake[e]
            * p_alarm(b, e, a)
            * (p_john_given_alarm[a] if j == 1 else 1 - p_john_given_alarm[a]))

# ── Spot-check: the worked example above ─────────────────────────────────────
# P(B=1, E=0, A=1, J=1) should be ~0.000845
print(f"P(B=1,E=0,A=1,J=1) = {joint(1, 0, 1, 1):.6f}")

# ── Compute a posterior by enumeration ───────────────────────────────────────
# Question: given that John called (J=1), what is P(Burglary=1)?
# By Bayes rule: P(B=1|J=1) = P(B=1, J=1) / P(J=1)
# We get P(B=1,J=1) and P(J=1) by summing out E and A.

def marginal_b_j(b_val, j_val):
    # Marginalize over all combinations of E and A.
    total = 0.0
    for e in [0, 1]:
        for a in [0, 1]:
            total += joint(b_val, e, a, j_val)
    return total

p_b1_j1 = marginal_b_j(1, 1)   # P(B=1, J=1)
p_b0_j1 = marginal_b_j(0, 1)   # P(B=0, J=1)
p_j1    = p_b1_j1 + p_b0_j1    # P(J=1) -- sum over all B values

# Posterior: fraction of P(J=1) mass that comes from B=1 configurations.
p_b1_given_j1 = p_b1_j1 / p_j1

print(f"P(J=1)              = {p_j1:.6f}")
print(f"P(B=1 | J=1)        = {p_b1_given_j1:.4f}")
# Interpretation: hearing John call raises the burglary probability
# from 0.1 % (prior) to about 28 % (posterior) -- a large update.
`}
      />
    </div>
  );
}
