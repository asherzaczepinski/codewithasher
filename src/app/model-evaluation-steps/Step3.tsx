'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Why Squared Error Does Not Work for Classifiers">
        <p>
          A classifier does not output a single price — it outputs a <em>probability</em>. Given a
          blood panel, our disease model might say: &quot;there is a 0.87 probability this patient
          has the disease.&quot; We need a loss function that evaluates <em>probabilities</em>, not
          just the final yes/no decision.
        </p>
        <p>
          If we just measured whether the final prediction (round to 0 or 1) was correct, we would
          treat &quot;0.51 → predicted positive, correct&quot; the same as &quot;0.99 → predicted positive,
          correct&quot; — even though the first model is barely more confident than a coin flip.
          A probability-aware loss rewards confidence that is well-placed and punishes
          overconfidence that is wrong.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Log Loss (Binary Cross-Entropy)">
        <p>
          For a binary classifier (two classes: disease / no disease), the standard loss is
          called <strong>log loss</strong> or <strong>binary cross-entropy</strong>. For each
          example, it takes the log of the probability assigned to the <em>correct</em> class.
          Logs of numbers between 0 and 1 are negative, so we negate the result to get a
          positive loss. We then average over all examples.
        </p>
        <p>
          Key intuition: if the model assigns probability 1.0 to the correct class the
          contribution is −log(1) = 0 — perfect, no loss. If it assigns 0.5 (complete
          uncertainty), the contribution is −log(0.5) ≈ 0.69. If it assigns 0.01 to the
          correct class (almost certain about the wrong answer), the contribution is
          −log(0.01) ≈ 4.6 — a huge penalty. The loss is <em>non-linear</em>: being wrong
          with high confidence is punished far more than being wrong with low confidence.
        </p>
      </ExplanationBox>

      <MathFormula label="Binary Cross-Entropy (Log Loss)">
        Log Loss = −(1/n) × sum of [y_i × log(p_i) + (1 − y_i) × log(1 − p_i)]
      </MathFormula>

      <ExplanationBox title="Reading the Formula">
        <p>
          For each example i, only one of the two terms is active:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>If <strong>y_i = 1</strong> (positive example): the loss is −log(p_i). This penalises low predicted probability for a positive.</li>
          <li>If <strong>y_i = 0</strong> (negative example): the loss is −log(1 − p_i). This penalises high predicted probability when the true label is negative.</li>
        </ul>
        <p>
          The formula neatly handles both cases in one expression. p_i is always the model&apos;s
          predicted probability that example i belongs to class 1.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Categorical Cross-Entropy (Multi-Class)">
        <p>
          When there are more than two classes (e.g. classifying a tumour as one of five
          subtypes), the extension is <strong>categorical cross-entropy</strong>. The model now
          outputs a probability for each class (a softmax vector that sums to 1). For each
          example, we take the negative log of the probability assigned to the <em>true</em> class.
        </p>
      </ExplanationBox>

      <MathFormula label="Categorical Cross-Entropy">
        CE = −(1/n) × sum over i of sum over classes k of [y_ik × log(p_ik)]
      </MathFormula>

      <ExplanationBox title="Why Calibration Matters">
        <p>
          Cross-entropy naturally rewards <strong>calibrated probabilities</strong>. A calibrated
          model that says &quot;70% chance of disease&quot; is right about 70% of the time when it gives
          that score. An uncalibrated model might say &quot;70%&quot; but actually be right only 40% of
          the time. Cross-entropy punishes the uncalibrated model even if its hard predictions
          (after thresholding) are the same — because the confidence it expressed was
          unjustified.
        </p>
        <p>
          This is why cross-entropy is the standard training loss for classifiers. Models that
          minimise it are pushed toward probability estimates that <em>mean something</em>.
        </p>
      </ExplanationBox>

      <WorkedExample title="Log Loss for Four Patients">
        <p>
          Our disease classifier produced the following predicted probabilities and true labels
          for four patients. We will compute the individual contributions and the final log loss.
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', margin: '0.75rem 0' }}>
          Patient A: true = 1, predicted p = 0.90<br />
          Patient B: true = 1, predicted p = 0.60<br />
          Patient C: true = 0, predicted p = 0.15<br />
          Patient D: true = 0, predicted p = 0.80
        </p>

        <CalcStep number={1}>Patient A (true = 1): loss = −log(0.90) ≈ 0.105 — high confidence, correct → small penalty</CalcStep>
        <CalcStep number={2}>Patient B (true = 1): loss = −log(0.60) ≈ 0.511 — moderate confidence, correct → medium penalty</CalcStep>
        <CalcStep number={3}>Patient C (true = 0): loss = −log(1 − 0.15) = −log(0.85) ≈ 0.163 — low predicted probability for positive, true label is negative → small penalty</CalcStep>
        <CalcStep number={4}>Patient D (true = 0): loss = −log(1 − 0.80) = −log(0.20) ≈ 1.609 — model was 80% confident this patient had the disease but they did not → large penalty</CalcStep>
        <CalcStep number={5}>Average log loss = (0.105 + 0.511 + 0.163 + 1.609) / 4 = 2.388 / 4 ≈ 0.597</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Patient D dominates the loss entirely. The model was confidently wrong about a healthy
          patient — exactly the situation cross-entropy is designed to penalise. If we only
          measured accuracy, all four predictions would be &quot;correct&quot; (A, B above 0.5; C, D
          below 0.5) and we would have missed this serious miscalibration.
        </p>
      </WorkedExample>

    </div>
  );
}
