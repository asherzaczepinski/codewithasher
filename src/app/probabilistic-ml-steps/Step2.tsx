'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Problem with Joint Distributions">
        <p>
          Suppose you have 30 binary random variables — say, 30 symptoms a patient might or might
          not have. The full joint distribution P(X1, X2, ..., X30) has 2^30 entries, about one
          billion numbers. Storing, estimating, and reasoning over that table is completely
          intractable.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The solution is to exploit <strong>conditional independence</strong> — the observation
          that most variables do not directly depend on all the others. If we can identify which
          dependencies actually exist, we can represent the joint distribution as a product of
          small, manageable pieces.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Conditional Independence">
        <p>
          Two variables X and Y are <strong>conditionally independent given Z</strong> — written
          X &perp; Y | Z — if knowing Z makes X and Y irrelevant to each other:
        </p>
      </ExplanationBox>

      <MathFormula label="Conditional Independence">
        P(X, Y | Z) = P(X | Z) &times; P(Y | Z)
      </MathFormula>

      <ExplanationBox title="A Medical Example">
        <p>
          Consider three variables: Disease (D), Symptom A (cough), and Symptom B (fever).
          In general, cough and fever are correlated because they share a common cause: the disease.
          But if you already know whether the patient has the disease, observing their cough tells
          you nothing extra about their fever. Formally:
        </p>
        <p style={{ marginTop: '0.75rem', fontStyle: 'italic' }}>
          Cough &perp; Fever | Disease
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This lets us factor the joint: P(D, Cough, Fever) = P(D) &times; P(Cough | D) &times; P(Fever | D).
          Instead of 2^3 = 8 numbers, we need only 1 + 2 + 2 = 5. The savings scale dramatically
          as the number of variables grows.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Chain Rule of Probability">
        <p>
          Even without any independence assumptions, the chain rule lets us write any joint
          distribution as a product of conditionals. For variables X1, X2, X3:
        </p>
      </ExplanationBox>

      <MathFormula label="Chain Rule (3 variables)">
        P(X1, X2, X3) = P(X1) &times; P(X2 | X1) &times; P(X3 | X1, X2)
      </MathFormula>

      <ExplanationBox title="How Generative Models Use the Chain Rule">
        <p>
          A <strong>generative model</strong> defines a joint distribution P(X1, ..., Xn) by
          specifying how each variable is generated from its parents. It applies the chain rule, but
          then uses conditional independence to simplify each factor — dropping variables that the
          model declares irrelevant given the ones already conditioned on.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          The result is a factorized joint distribution: a product of small conditional probability
          tables (or functions) that is easy to store, estimate from data, and reason about.
        </p>
      </ExplanationBox>

      <WorkedExample title="Factorizing a Small Joint Distribution">
        <p>
          We have three binary variables: Rain (R), Umbrella (U), Wet Ground (W).
          We assert these conditional independences:
        </p>
        <ul style={{ lineHeight: '1.9', marginBottom: '1rem' }}>
          <li>Umbrella depends only on Rain: U &perp; W | R</li>
          <li>Wet Ground depends only on Rain: W &perp; U | R</li>
          <li>Rain has no parents — it is drawn from its marginal distribution.</li>
        </ul>

        <CalcStep number={1}>
          Write the full chain rule: P(R, U, W) = P(R) &times; P(U | R) &times; P(W | R, U)
        </CalcStep>
        <CalcStep number={2}>
          Apply the conditional independence W &perp; U | R to simplify the last factor:
          P(W | R, U) = P(W | R)
        </CalcStep>
        <CalcStep number={3}>
          Final factorization: P(R, U, W) = P(R) &times; P(U | R) &times; P(W | R)
        </CalcStep>
        <CalcStep number={4}>
          Count parameters. R is binary: 1 free number. P(U | R) has 2 rows &times; 1 free number = 2.
          P(W | R) likewise = 2. Total: 5 numbers instead of 2^3 - 1 = 7.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          This factorized form is exactly what a Bayesian network (next module) makes precise with
          a directed graph. Each conditional independence assumption corresponds to a missing edge
          in that graph.
        </p>
      </WorkedExample>
    </div>
  );
}
