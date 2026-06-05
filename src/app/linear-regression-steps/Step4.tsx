'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The Goal: Minimize MSE">
        <p>
          We have a model ŷ = w · x + b and a way to measure its error (MSE). The question is:
          how do we find the specific values of w and b that make MSE as small as possible?
        </p>
        <p>
          One approach is to imagine MSE as a landscape of hills and valleys. The floor of the
          deepest valley is the combination of w and b that gives the lowest possible error. We
          want to roll a ball downhill until it settles at the bottom. That is exactly what{' '}
          <strong>gradient descent</strong> does.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What a Gradient Tells Us">
        <p>
          A gradient is the slope of the MSE surface with respect to a parameter. It tells us two
          things:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Direction:</strong> if the gradient is positive, MSE rises as the parameter
            increases — so we should decrease the parameter to go downhill.
          </li>
          <li>
            <strong>Magnitude:</strong> a steeper slope means we are far from the bottom and can
            take a bigger step. A gentle slope means we are close and should step carefully.
          </li>
        </ul>
        <p>
          We compute the gradient of MSE with respect to w (written ∂MSE/∂w) and with respect to
          b (written ∂MSE/∂b). Calculus gives us closed-form expressions for both:
        </p>
      </ExplanationBox>

      <MathFormula label="Gradient of MSE with respect to w">
        ∂MSE/∂w = (−2/n) · Σᵢ xᵢ · (yᵢ − ŷᵢ)
      </MathFormula>

      <MathFormula label="Gradient of MSE with respect to b">
        ∂MSE/∂b = (−2/n) · Σᵢ (yᵢ − ŷᵢ)
      </MathFormula>

      <ExplanationBox title="The Update Rule">
        <p>
          Each training step, we move w and b a small amount in the direction that lowers the
          MSE. The size of that step is controlled by the <strong>learning rate</strong> α
          (a small number like 0.0001). We subtract the gradient because we want to go
          <em> downhill</em>:
        </p>
      </ExplanationBox>

      <MathFormula label="Parameter update (one step)">
        w ← w − α · (∂MSE/∂w){'\n'}
        b ← b − α · (∂MSE/∂b)
      </MathFormula>

      <ExplanationBox title="Repeat Until Convergence">
        <p>
          We keep repeating these updates — compute gradients, step downhill — until the MSE
          stops changing meaningfully. At that point the ball has reached the valley floor and we
          have found (approximately) the best w and b.
        </p>
        <p>
          Because MSE for linear regression is a smooth bowl shape (a <em>convex</em> function),
          gradient descent is guaranteed to find the true global minimum, not just a local dip.
          This is one of the nicest mathematical properties of linear regression.
        </p>
      </ExplanationBox>

      <WorkedExample title="One Gradient Descent Update">
        <p>
          We start with w = 100 and b = 0, α = 0.00001. We use the same four houses (sizes in
          sq ft, prices in dollars). First let&apos;s compute all predictions and residuals:
        </p>

        <CalcStep number={1}>
          House A (x=1000, y=200 000): ŷ = 100·1000 + 0 = 100 000. Residual = 200 000 − 100 000 = 100 000.
        </CalcStep>
        <CalcStep number={2}>
          House B (x=1500, y=275 000): ŷ = 100·1500 + 0 = 150 000. Residual = 275 000 − 150 000 = 125 000.
        </CalcStep>
        <CalcStep number={3}>
          House C (x=2000, y=360 000): ŷ = 100·2000 + 0 = 200 000. Residual = 360 000 − 200 000 = 160 000.
        </CalcStep>
        <CalcStep number={4}>
          House D (x=2500, y=430 000): ŷ = 100·2500 + 0 = 250 000. Residual = 430 000 − 250 000 = 180 000.
        </CalcStep>
        <CalcStep number={5}>
          ∂MSE/∂w = (−2/4) · [1000·100 000 + 1500·125 000 + 2000·160 000 + 2500·180 000]
          = −0.5 · [100 000 000 + 187 500 000 + 320 000 000 + 450 000 000]
          = −0.5 · 1 057 500 000 = −528 750 000.
        </CalcStep>
        <CalcStep number={6}>
          ∂MSE/∂b = (−2/4) · [100 000 + 125 000 + 160 000 + 180 000]
          = −0.5 · 565 000 = −282 500.
        </CalcStep>
        <CalcStep number={7}>
          Update w: w ← 100 − 0.00001 · (−528 750 000) = 100 + 5 287.5 = 5 387.5.
          (A large first step — we started far from the optimum.)
        </CalcStep>
        <CalcStep number={8}>
          Update b: b ← 0 − 0.00001 · (−282 500) = 0 + 2.825 = 2.825.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          After one step, w jumped toward a much better value. In practice we would use a much
          smaller learning rate or normalize the inputs first. The key insight is that the
          gradient told us exactly which direction to move, and we moved there. Repeat this
          thousands of times and w and b converge to the values that minimize MSE.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We now add a <code>train</code> function that loops over many gradient-descent steps,
          using <code>predict</code> and <code>mean_squared_error</code> from the earlier modules.
          After training, w and b should be close to 150 and 50 000 — the values we hand-picked
          earlier, now <em>learned automatically from the data</em>.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="linear_regression.py"
        caption="The training loop: gradient descent runs predict → measure → nudge w and b, thousands of times, until the loss stops falling."
        code={`# ── continuing linear_regression.py ──────────────────────────────────────────
# We now have predict() and mean_squared_error() from earlier modules.
# This function LEARNS w and b from data instead of us guessing them.

def train(X, y, lr=1e-8, epochs=10_000):
    # X      : 1-D array of input features (house sizes)
    # y      : 1-D array of true prices
    # lr     : learning rate — how big a step to take each iteration.
    #          Too large -> overshoots and diverges; too small -> learns very slowly.
    # epochs : how many gradient-descent steps to run
    n = len(X)

    # Start with w=0 and b=0 — the model knows nothing yet.
    w = 0.0
    b = 0.0

    for epoch in range(epochs):
        preds     = predict(X, w, b)         # forward pass: compute all ŷ values
        residuals = y - preds                # how wrong we are at each house

        # Gradient of MSE w.r.t. w:  dL/dw = (-2/n) * sum(x_i * residual_i)
        # The negative sign means a positive gradient -> MSE rises as w rises
        # -> we subtract it to go downhill.
        dw = (-2 / n) * (X * residuals).sum()

        # Gradient of MSE w.r.t. b:  dL/db = (-2/n) * sum(residual_i)
        # Same idea but b does not multiply x, so no X factor here.
        db = (-2 / n) * residuals.sum()

        w = w - lr * dw   # step w in the downhill direction
        b = b - lr * db   # step b in the downhill direction

        # Print a progress update every 1000 steps so we can watch convergence.
        if epoch % 1_000 == 0:
            loss = mean_squared_error(preds, y)
            print(f"epoch {epoch:>6}  loss={loss:>15,.0f}  w={w:.2f}  b={b:.2f}")

    return w, b   # return the learned parameters


# ── Run training on our 4-house dataset ──────────────────────────────────────
sizes   = np.array([1000.0, 1500.0, 2000.0, 2500.0])
actuals = np.array([200_000.0, 275_000.0, 360_000.0, 430_000.0])

w_learned, b_learned = train(sizes, actuals, lr=1e-8, epochs=10_000)
print(f"Learned: w={w_learned:.2f}  b={b_learned:.2f}")
# After enough steps: w ~ 150, b ~ 50000  (the values we guessed by hand!)
# Gradient descent found them automatically just by following the slope of MSE.`}
      />
    </div>
  );
}
