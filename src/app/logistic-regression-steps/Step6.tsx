'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Goal: Minimise the Loss">
        <p>
          We have a loss function J that measures how wrong the model is. Training means
          finding weights w₁, w₂ and bias b that make J as small as possible. We do this
          with <strong>gradient descent</strong>: repeatedly nudge each parameter in the
          direction that reduces the loss.
        </p>
        <p>
          To nudge intelligently we need to know the gradient — how much the loss changes
          when we change each weight by a tiny amount.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Gradient — A Beautifully Clean Result">
        <p>
          When you apply calculus to the cross-entropy loss composed with the sigmoid, something
          remarkable happens: the sigmoid&apos;s derivative and the log&apos;s derivative cancel each
          other out. The gradient of the loss with respect to each weight wⱼ collapses to:
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient of loss w.r.t. weight wⱼ">
        ∂J/∂wⱼ = (1/N) Σ (ŷᵢ − yᵢ) · xᵢⱼ
      </MathFormula>

      <ExplanationBox title="Reading the Gradient">
        <p>
          The term (ŷᵢ − yᵢ) is the <strong>prediction error</strong> for example i — how far off
          the model was. We multiply it by the feature value xᵢⱼ and average across all examples.
          This is identical in form to linear regression&apos;s gradient, which is one reason logistic
          regression is so approachable.
        </p>
        <p>
          The gradient for the bias b is the same but without the xᵢⱼ factor (since b isn&apos;t
          multiplied by any feature):
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient of loss w.r.t. bias b">
        ∂J/∂b = (1/N) Σ (ŷᵢ − yᵢ)
      </MathFormula>

      <ExplanationBox title="The Update Rule">
        <p>
          We move each parameter a small step opposite to the gradient. The learning rate α
          controls the step size — too large and we overshoot; too small and training is slow.
        </p>
      </ExplanationBox>

      <MathFormula label="Weight update">
        wⱼ ← wⱼ − α · (∂J/∂wⱼ)
      </MathFormula>

      <MathFormula label="Bias update">
        b ← b − α · (∂J/∂b)
      </MathFormula>

      <ExplanationBox title="The Training Loop">
        <p>
          In practice, training repeats this cycle many times:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Forward pass:</strong> compute z = w·x + b for all examples, apply σ to get ŷ.</li>
          <li><strong>Compute loss:</strong> calculate J using cross-entropy.</li>
          <li><strong>Backward pass:</strong> compute gradients ∂J/∂wⱼ and ∂J/∂b.</li>
          <li><strong>Update:</strong> subtract α times each gradient from the corresponding parameter.</li>
          <li><strong>Repeat</strong> until the loss stops decreasing or a maximum number of iterations is reached.</li>
        </ul>
        <p>
          Each full pass through all training data is called an <strong>epoch</strong>.
          After many epochs the weights settle into values that separate spam from legitimate
          email as cleanly as a straight-line boundary can.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Gradient Descent Step">
        <p>
          We have two training emails, current weights w₁ = 0.4, w₂ = 0.3, b = −1.0,
          learning rate α = 0.1.
        </p>
        <CalcStep number={1}>
          Email A: x₁=5, x₂=3, y=1 → z = 0.4(5)+0.3(3)−1 = 1.9 → ŷ ≈ 0.870 → error = 0.870−1 = −0.130
        </CalcStep>
        <CalcStep number={2}>
          Email B: x₁=1, x₂=0, y=0 → z = 0.4(1)+0.3(0)−1 = −0.6 → ŷ ≈ 0.354 → error = 0.354−0 = 0.354
        </CalcStep>
        <CalcStep number={3}>
          ∂J/∂w₁ = [(−0.130)(5) + (0.354)(1)] / 2 = [−0.65 + 0.354] / 2 = −0.296 / 2 = <strong>−0.148</strong>
        </CalcStep>
        <CalcStep number={4}>
          ∂J/∂w₂ = [(−0.130)(3) + (0.354)(0)] / 2 = −0.390 / 2 = <strong>−0.195</strong>
        </CalcStep>
        <CalcStep number={5}>
          ∂J/∂b = [(−0.130) + (0.354)] / 2 = 0.224 / 2 = <strong>0.112</strong>
        </CalcStep>
        <CalcStep number={6}>
          Update: w₁ = 0.4 − 0.1(−0.148) = <strong>0.415</strong>
        </CalcStep>
        <CalcStep number={7}>
          Update: w₂ = 0.3 − 0.1(−0.195) = <strong>0.320</strong>
        </CalcStep>
        <CalcStep number={8}>
          Update: b = −1.0 − 0.1(0.112) = <strong>−1.011</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The weights for x₁ and x₂ both increased slightly — the model learned that more
          suspicious words and more exclamation marks are stronger spam signals. After
          thousands more steps like this the model converges to its optimal parameters.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          This is the payoff: a complete train() function that ties together every building
          block from Steps 3–5. After training, our spam classifier is ready to use.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="logistic_regression.py"
        caption="The entire logistic regression training loop in under 30 lines — every piece built up from previous steps."
        code={`import numpy as np

# ---- Building blocks from earlier steps ----

def sigmoid(z):
    # Squash any score into (0, 1) — our probability engine
    return 1 / (1 + np.exp(-z))

def binary_cross_entropy(y_true, y_pred):
    y_pred = np.clip(y_pred, 1e-15, 1 - 1e-15)
    return np.mean(-(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred)))

# ---- The training loop ----

# train() learns the best weights and bias for a dataset using gradient descent.
# X       : 2-D array of shape (N, num_features) — one row per training example
# y       : 1-D array of shape (N,) — true labels (0 or 1)
# lr      : learning rate alpha — step size per gradient update
# epochs  : how many full passes through the training data to make
def train(X, y, lr=0.1, epochs=1000):
    N, num_features = X.shape

    # Start with weights of zero and bias of zero.
    # Gradient descent will push them toward useful values.
    w = np.zeros(num_features)
    b = 0.0

    for epoch in range(epochs):
        # --- Forward pass: compute probabilities for all N examples at once ---
        # X @ w is matrix-vector multiplication: one dot product per row (much faster than a loop)
        z     = X @ w + b          # shape (N,) — one raw score per example
        y_hat = sigmoid(z)         # shape (N,) — one probability per example

        # --- Loss: how wrong are we right now? ---
        loss = binary_cross_entropy(y, y_hat)

        # --- Backward pass: compute gradients ---
        # The gradient simplifies beautifully: error * feature.
        # (y_hat - y) is the prediction error; @ X.T averages over all examples.
        error    = y_hat - y                        # shape (N,)
        grad_w   = (X.T @ error) / N               # shape (num_features,)
        grad_b   = np.mean(error)                   # scalar

        # --- Update: take a step opposite to the gradient ---
        w -= lr * grad_w
        b -= lr * grad_b

        # Print progress every 100 epochs so we can watch loss shrink
        if epoch % 100 == 0:
            print(f"Epoch {epoch:4d}  loss={loss:.4f}  w={w}  b={b:.4f}")

    return w, b

# ---- Spam training data (features from earlier examples) ----
# Each row: [suspicious_word_count, exclamation_mark_count]
X_train = np.array([
    [1, 0],   # legitimate email
    [5, 3],   # spam email
    [2, 1],   # borderline (label: not spam)
    [8, 5],   # heavy spam
])
y_train = np.array([0, 1, 0, 1])   # 0 = not spam, 1 = spam

w_learned, b_learned = train(X_train, y_train, lr=0.1, epochs=500)
print("Learned weights:", w_learned)
print("Learned bias:   ", b_learned)

# --- Classify a new email with the trained model ---
x_new = np.array([5, 3])
prob  = sigmoid(np.dot(w_learned, x_new) + b_learned)
label = 1 if prob >= 0.5 else 0
print(f"New email — P(spam)={prob:.3f}, predicted class={label}")`}
      />
    </div>
  );
}
