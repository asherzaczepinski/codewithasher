'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Naive Idea: Fit a Line">
        <p>
          The simplest approach to spam classification is to fit a straight line through
          the training data, where spam emails are labeled <strong>1</strong> and
          legitimate emails are labeled <strong>0</strong>. Then, for any new email,
          we read off the line&apos;s predicted value and round to the nearest integer.
        </p>
        <p>
          A linear model produces a score using the familiar formula:
        </p>
      </ExplanationBox>

      <MathFormula label="Linear score">
        score = w₁x₁ + w₂x₂ + b
      </MathFormula>

      <ExplanationBox title="Problem 1: Outputs Are Unbounded">
        <p>
          A linear function can output <em>any</em> real number: −47, 0.3, 812. But a probability must
          live in the range <strong>[0, 1]</strong>. A raw score of 5.2 or −3.8 has no meaningful
          interpretation as a probability. We&apos;d have to clamp the output, and clamping is a
          hack — it breaks the math we need for training.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Problem 2: Sensitive to Outliers">
        <p>
          Imagine we have a clear spam cluster and a clear legitimate cluster, and a linear model
          that separates them well. Now add one very extreme spam email with 200 suspicious words.
          The best-fit line <em>tilts toward that outlier</em> to reduce its error, dragging the
          decision boundary away from where it should be — and suddenly many genuine spam emails
          get misclassified. Probabilities produced by a clamped linear model are badly calibrated
          and fragile.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Problem 3: The Rounding Step Kills Gradients">
        <p>
          Training requires us to compute how much the loss changes when we nudge a weight
          (a derivative). If we round the output to 0 or 1, the &quot;function&quot; is a
          staircase — flat everywhere, with vertical jumps at the threshold. The derivative
          is zero almost everywhere and undefined at the jumps. Gradient descent cannot
          learn from that.
        </p>
        <p>
          We need an output that is <strong>smooth</strong>, <strong>bounded in (0, 1)</strong>,
          and <strong>differentiable everywhere</strong>. That is exactly what the sigmoid
          function provides.
        </p>
      </ExplanationBox>

      <WorkedExample title="Seeing the Breakdown">
        <p>
          Suppose a linear model learned weights w₁ = 0.4, w₂ = 0.3, b = −1.0 for our
          spam example. Let&apos;s evaluate it on three emails:
        </p>
        <CalcStep number={1}>
          Legitimate email: x₁ = 1, x₂ = 0 → score = 0.4(1) + 0.3(0) − 1.0 = <strong>−0.6</strong>
        </CalcStep>
        <CalcStep number={2}>
          Borderline email: x₁ = 3, x₂ = 2 → score = 0.4(3) + 0.3(2) − 1.0 = <strong>1.0</strong>
        </CalcStep>
        <CalcStep number={3}>
          Heavy spam: x₁ = 20, x₂ = 10 → score = 0.4(20) + 0.3(10) − 1.0 = <strong>10.0</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A score of 10.0 is meaningless as a probability. We can&apos;t tell the user &quot;I&apos;m
          1000% sure this is spam.&quot; We need something that compresses any score into (0, 1) —
          enter the sigmoid.
        </p>
      </WorkedExample>
    </div>
  );
}
