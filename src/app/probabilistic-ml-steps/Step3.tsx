'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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

    </div>
  );
}
