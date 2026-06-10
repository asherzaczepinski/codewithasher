'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Turning Conditional Probability Around">
        <p>
          In conditional probability we computed P(A | B) — the chance of A given B.
          But often we want to go in the <em>reverse</em> direction: we observe B and want to
          know the probability of the underlying cause A.
        </p>
        <p>
          A doctor sees a positive test result (B) and wants to know: what is the probability the
          patient actually has the disease (A)? A spam filter sees a suspicious word (B) and asks:
          what is the probability this email is spam (A)? This reverse reasoning is exactly what{' '}
          <strong>Bayes&apos; Theorem</strong> provides.
        </p>
      </ExplanationBox>

      <MathFormula label="Bayes' Theorem">
        P(A | B) = P(B | A) · P(A) / P(B)
      </MathFormula>

      <ExplanationBox title="Prior, Likelihood, and Posterior">
        <p>
          Each term in Bayes&apos; Theorem has a name and a role:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>P(A) — Prior.</strong> Your belief about A <em>before</em> seeing the
            evidence B. If 1 in 1,000 people has a rare disease, P(disease) = 0.001 is the prior.
            This encodes what you knew before running the test.
          </li>
          <li>
            <strong>P(B | A) — Likelihood.</strong> How probable is the evidence B if A is true?
            If the test is 99% sensitive, P(positive test | disease) = 0.99.
          </li>
          <li>
            <strong>P(B) — Marginal probability of evidence.</strong> The total probability that
            B happens, averaging over all ways it could occur (disease or no disease).
            It normalises the result so the posterior is a valid probability.
          </li>
          <li>
            <strong>P(A | B) — Posterior.</strong> Your updated belief about A <em>after</em>{' '}
            seeing B. This is the answer you wanted.
          </li>
        </ul>
        <p>
          The update flows: <em>prior belief</em> + <em>new evidence</em> = <em>posterior belief</em>.
          That is Bayesian reasoning in one sentence.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Base Rates Matter So Much">
        <p>
          The single most surprising lesson in Bayesian reasoning is the power of the prior.
          Even a highly accurate test can produce mostly false positives when the base rate of
          the condition is very low. This is called the <strong>base rate fallacy</strong>, and
          ignoring it leads to catastrophically wrong conclusions in medicine, security, and ML.
        </p>
        <p>
          Let&apos;s work through the classic medical test example to see this concretely.
        </p>
      </ExplanationBox>

      <WorkedExample title="The Medical Test: A Surprising Result">
        <p>
          A disease affects 1 in 1,000 people (prevalence = 0.1%). A test for this disease is
          99% accurate in both directions: if you have the disease it gives a positive result
          99% of the time (sensitivity = 0.99), and if you do <em>not</em> have the disease it
          gives a negative result 99% of the time (specificity = 0.99, so false positive rate = 0.01).
          You test positive. What is the probability you actually have the disease?
        </p>
        <p>
          Most people guess around 99%. The real answer is striking.
        </p>

        <CalcStep number={1}>
          Define events. D = &quot;has disease,&quot; + = &quot;tests positive.&quot;
          Prior: P(D) = 0.001. P(no D) = 0.999.
        </CalcStep>
        <CalcStep number={2}>
          Likelihood of testing positive given disease: P(+ | D) = 0.99.
        </CalcStep>
        <CalcStep number={3}>
          Likelihood of testing positive given no disease (false positive rate): P(+ | no D) = 0.01.
        </CalcStep>
        <CalcStep number={4}>
          Compute P(+) using the law of total probability:
          P(+) = P(+ | D)·P(D) + P(+ | no D)·P(no D).
        </CalcStep>
        <CalcStep number={5}>
          P(+) = (0.99 × 0.001) + (0.01 × 0.999) = 0.00099 + 0.00999 = 0.01098.
        </CalcStep>
        <CalcStep number={6}>
          Apply Bayes&apos; Theorem:
          P(D | +) = P(+ | D) · P(D) / P(+) = (0.99 × 0.001) / 0.01098.
        </CalcStep>
        <CalcStep number={7}>
          P(D | +) = 0.00099 / 0.01098 ≈ 0.0902 ≈ 9%.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Even with a 99% accurate test, a positive result only means a 9% chance of having the
          disease. Why? Because the disease is so rare (prior = 0.1%) that even the 1% false
          positive rate generates far more false positives than true positives across the population.
          For every 1,000 people tested, roughly 1 true positive and about 10 false positives will
          test positive. The false positives drown out the true ones.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          This is not a flaw in the test — it is an inescapable consequence of a low base rate.
          The only cure is either a higher-prevalence population (test only high-risk patients)
          or a more specific test with a lower false positive rate. Bayes&apos; Theorem tells you
          exactly which lever to pull.
        </p>
      </WorkedExample>

      <ExplanationBox title="Bridge to Machine Learning: Naive Bayes">
        <p>
          Bayes&apos; Theorem is not just a statistics curiosity — it directly powers ML algorithms.
          The <strong>Naive Bayes classifier</strong> applies Bayes&apos; Theorem to classify
          data points (emails, documents, medical records) by computing:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '8px 0' }}>
          P(class | features) ∝ P(features | class) · P(class)
        </p>
        <p>
          For each candidate class (spam / not-spam), it computes the likelihood of seeing all
          the observed features given that class, multiplies by the prior probability of that
          class, and picks the class with the highest posterior. The &quot;naive&quot; part is
          assuming each feature is independent given the class — allowing the likelihoods to be
          multiplied together (the AND rule from Module 3).
        </p>
        <p>
          More broadly, the prior-to-posterior update is the backbone of <strong>Bayesian
          neural networks</strong>, probabilistic graphical models, and any ML system that
          maintains calibrated uncertainty — which is every good production ML system.
          You now have the mathematical foundations to understand all of them.
        </p>
      </ExplanationBox>
    </div>
  );
}
