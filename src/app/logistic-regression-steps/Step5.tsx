'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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

      <ExplanationBox title="In Python">
        <p>
          We add binary_cross_entropy to our growing file. NumPy&apos;s np.log is the natural
          logarithm (base e), which is what the formula requires. A tiny clip prevents
          log(0) from blowing up to negative infinity.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="logistic_regression.py"
        caption="np.clip is essential — log(0) is undefined, and the model can output exact 0 or 1 in edge cases."
        code={`import numpy as np

# --- sigmoid, predict_proba, predict defined in earlier steps ---
def sigmoid(z):
    return 1 / (1 + np.exp(-z))

# binary_cross_entropy measures how wrong our predictions are, averaged over the dataset.
# y_true : 1-D array of true labels (each is 0 or 1)
# y_pred : 1-D array of predicted probabilities (each is between 0 and 1)
def binary_cross_entropy(y_true, y_pred):
    # Guard against log(0): clamp every prediction to [1e-15, 1 - 1e-15].
    # This changes the math by an invisibly tiny amount but keeps numerics stable.
    y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)

    # For each example:
    #   if y_true = 1 -> loss = -log(y_pred)       (penalise underconfident "spam" calls)
    #   if y_true = 0 -> loss = -log(1 - y_pred)   (penalise overconfident "spam" calls)
    # The single formula below handles both cases simultaneously using broadcasting.
    per_example_loss = -(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

    # Average over all N examples to get a single scalar that summarises total error.
    return np.mean(per_example_loss)

# --- Reproduce the worked example: two emails ---
y_true = np.array([1.0, 0.0])    # Email A is spam; Email B is not spam
y_pred = np.array([0.87, 0.72])  # Model's predicted probabilities

loss = binary_cross_entropy(y_true, y_pred)
print(f"Average loss: {loss:.3f}")   # -> ~0.706

# Sanity check individual losses:
# Email A: -log(0.87) ~ 0.139  (small — model was right and confident)
# Email B: -log(1 - 0.72) = -log(0.28) ~ 1.273  (large — model was confidently wrong)
print(-np.log(0.87))          # -> ~0.139
print(-np.log(1 - 0.72))     # -> ~1.273`}
      />
    </div>
  );
}
