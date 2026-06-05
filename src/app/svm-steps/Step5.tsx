'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="When Data Is Messy">
        <p>
          The hard-margin SVM assumes the two classes are perfectly linearly separable — no Setosa
          flower ever lands in Versicolor territory. Real datasets are rarely that clean. Measurement
          noise, labelling errors, and genuine overlap between classes mean some points will be on
          the wrong side no matter how you draw the boundary.
        </p>
        <p>
          If we insist on zero margin violations the SVM will either fail to find a solution
          entirely, or find one with a vanishingly thin margin that overfit to the noise. Neither
          outcome is useful.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Slack Variables: Allowing Violations">
        <p>
          The <strong>soft-margin SVM</strong> introduces a <strong>slack variable</strong>{' '}
          ξ_i (xi sub i) for every training point. The slack measures how much that point violates
          the margin constraint:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>ξ_i = 0 — the point is outside the street (no violation).</li>
          <li>0 &lt; ξ_i ≤ 1 — the point is inside the street but on the correct side of the boundary.</li>
          <li>ξ_i &gt; 1 — the point is on the wrong side of the boundary (a true misclassification).</li>
        </ul>
        <p>
          A small amount of slack is acceptable. What we want to avoid is large slack — points that
          land far on the wrong side. The soft-margin objective penalises total slack so the SVM keeps
          violations as small as possible.
        </p>
      </ExplanationBox>

      <MathFormula label="Soft-Margin Objective">
        Minimize   (1/2) ||w||² + C · Σ ξ_i
        {'\n'}
        Subject to  y_i (w · x_i + b) ≥ 1 − ξ_i  and  ξ_i ≥ 0
      </MathFormula>

      <ExplanationBox title="The C Parameter: Strict vs. Forgiving">
        <p>
          <strong>C</strong> is the single most important knob in a soft-margin SVM. It controls
          the trade-off between two competing goals:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Large C</strong> — violations are expensive. The SVM fights hard to keep every
            point outside the street, even if that means a narrower margin. You get a classifier
            that is strict and fits the training data tightly. Risk: it may overfit to noise.
          </li>
          <li>
            <strong>Small C</strong> — violations are cheap. The SVM accepts more margin
            violations in exchange for a wider street. You get a classifier that is more forgiving
            and generalises better to new data. Risk: too small and you allow too many mistakes.
          </li>
        </ul>
        <p>
          When C → ∞ the soft margin becomes the hard margin: no violation is ever acceptable.
          When C → 0 the margin becomes infinitely wide and the classifier ignores the data entirely.
          The right C sits somewhere in between, typically found by cross-validation.
        </p>
      </ExplanationBox>

      <WorkedExample title="Interpreting Slack in Our Flower Example">
        <p>
          Suppose three flowers land awkwardly close to or across the boundary after training:
        </p>

        <CalcStep number={1}>
          Flower A (Setosa): y_i = −1, w · x_i + b = −0.7.
          Constraint requires ≤ −1, so violation = 1 − 0.7 = 0.3. Slack ξ_A = 0.3.
          Inside the street but correctly labelled.
        </CalcStep>
        <CalcStep number={2}>
          Flower B (Versicolor): y_i = +1, w · x_i + b = +0.1.
          Constraint requires ≥ +1, so violation = 1 − 0.1 = 0.9. Slack ξ_B = 0.9.
          Inside the street, still correctly labelled.
        </CalcStep>
        <CalcStep number={3}>
          Flower C (Setosa): y_i = −1, w · x_i + b = +0.5.
          y_i × output = −1 × 0.5 = −0.5. Violation = 1 − (−0.5) = 1.5. Slack ξ_C = 1.5.
          This flower is on the Versicolor side — a true misclassification.
        </CalcStep>
        <CalcStep number={4}>
          Total penalty added to the objective: C × (0.3 + 0.9 + 1.5) = C × 2.7.
          With C = 1 that costs 2.7 extra units; with C = 10 it costs 27 extra units.
          High C makes the SVM work much harder to eliminate these violations.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The soft-margin SVM accepts Flowers A and B as tolerable slip-through cases and flags
          Flower C as an expensive misclassification. By tuning C you decide how much that cost
          matters relative to the benefit of a wider margin.
        </p>
      </WorkedExample>
    </div>
  );
}
