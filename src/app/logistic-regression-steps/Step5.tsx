'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Why Not Use Mean Squared Error?">
        <p>
          In linear regression we minimise MSE — the average squared difference between
          predictions and true values. Why not use the same loss for logistic regression?
        </p>
        <p>
          The problem is that when you compose MSE with the sigmoid, the resulting loss surface
          is full of shallow regions where the gradient is nearly zero. This means gradient descent
          stalls — especially early in training when the model is making confidently wrong predictions.
          We call this the <strong>vanishing gradient problem</strong>.
        </p>
        <p>
          We need a loss function that screams loudly when the model is confidently wrong and barely
          whispers when the model is already doing well. Log loss does exactly that.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Binary Cross-Entropy Loss">
        <p>
          For a single training example with true label y (either 0 or 1) and predicted
          probability ŷ = σ(z):
        </p>
      </ExplanationBox>

      <MathFormula label="Log loss (binary cross-entropy)">
        L = −[y · log(ŷ) + (1 − y) · log(1 − ŷ)]
      </MathFormula>

      <ExplanationBox title="Intuition: Two Cases">
        <p>
          The formula collapses into one of two branches depending on the true label:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>True label y = 1 (spam):</strong> loss = −log(ŷ). If ŷ = 0.99 → loss ≈ 0.01 (tiny).
            If ŷ = 0.01 → loss ≈ 4.6 (huge). The model is punished severely for saying &quot;1% spam&quot;
            when it really was spam.
          </li>
          <li>
            <strong>True label y = 0 (not spam):</strong> loss = −log(1 − ŷ). If ŷ = 0.01 → loss ≈ 0.01 (tiny).
            If ŷ = 0.99 → loss ≈ 4.6 (huge). Confidently calling a legitimate email spam is harshly penalised.
          </li>
        </ul>
        <p>
          This asymmetric harshness on confident mistakes is what makes log loss so effective for
          classification. It comes directly from information theory — specifically from the idea of
          how surprised you should be by the true outcome given your prediction.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Average Over the Dataset">
        <p>
          In practice, we average the loss over all N training examples:
        </p>
      </ExplanationBox>

      <MathFormula label="Total cross-entropy loss">
        J = −(1/N) Σ [yᵢ · log(ŷᵢ) + (1 − yᵢ) · log(1 − ŷᵢ)]
      </MathFormula>

      <WorkedExample title="Computing Loss for Two Predictions">
        <p>
          Two emails. True labels and predicted probabilities:
        </p>
        <CalcStep number={1}>
          Email A: true label y = 1 (spam), predicted ŷ = 0.87
        </CalcStep>
        <CalcStep number={2}>
          Loss A = −log(0.87) ≈ −(−0.1393) = <strong>0.139</strong> — small, the model was right and fairly confident.
        </CalcStep>
        <CalcStep number={3}>
          Email B: true label y = 0 (not spam), predicted ŷ = 0.72
        </CalcStep>
        <CalcStep number={4}>
          Loss B = −log(1 − 0.72) = −log(0.28) ≈ −(−1.2730) = <strong>1.273</strong> — large, the model wrongly leaned toward spam.
        </CalcStep>
        <CalcStep number={5}>
          Average loss J = (0.139 + 1.273) / 2 = <strong>0.706</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Email B dominates the loss because the model was confidently wrong. Training will
          push the weights in the direction that reduces this loss — making the model less
          eager to call legitimate emails spam.
        </p>
      </WorkedExample>

    </div>
  );
}
