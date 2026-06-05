'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="What Is a Cost Function?">
        <p>
          A <strong>cost function</strong> (also called a <strong>loss function</strong>)
          is a mathematical ruler that measures how wrong a model&apos;s predictions are.
          Feed it the model&apos;s predictions and the true answers, and it spits out a
          single number — the <em>cost</em>.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Cost = 0</strong> — every prediction is exactly right.</li>
          <li><strong>Cost is large</strong> — predictions are badly off.</li>
        </ul>
        <p>
          The model&apos;s job during training is to drive this number toward zero by
          adjusting its internal parameters (weights and biases).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Mean Squared Error — The Classic Example">
        <p>
          The most common cost function for regression problems is <strong>Mean Squared
          Error (MSE)</strong>. Suppose we have <em>n</em> training examples. For each
          example we compute the error (prediction minus true value), square it so negative
          and positive errors don&apos;t cancel, then average over all examples.
        </p>
      </ExplanationBox>

      <MathFormula label="Mean Squared Error (MSE)">
        MSE = (1/n) × Σ (prediction_i − true_i)²
      </MathFormula>

      <ExplanationBox title="Why Square the Error?">
        <p>
          Two reasons. First, squaring makes every term positive, so a prediction that is
          +3 off and one that is −3 off both count equally — they don&apos;t cancel each
          other out in the average.
        </p>
        <p>
          Second, squaring <em>punishes large errors more than small ones</em>. An error
          of 2 contributes 4 to the sum; an error of 10 contributes 100. This pushes the
          model to fix its worst mistakes first, which is usually what we want.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Bowl Shape — Why This Is Optimizable">
        <p>
          Here&apos;s the key geometric fact: when you plot MSE as a function of a single
          parameter, the result is a <strong>parabola</strong> — a smooth U-shaped bowl
          with one unique minimum at the bottom.
        </p>
        <p>
          Imagine placing a marble anywhere on the inside of that bowl. No matter where you
          drop it, it will always roll down to the same lowest point. There are no false
          bottoms, no traps, no plateaus — just one global minimum. This is exactly why
          MSE is such a convenient starting point: the optimization landscape is perfectly
          well-behaved.
        </p>
        <p>
          Our entire goal is to find that lowest point. Gradient descent is how we get there.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing MSE by Hand">
        <p>
          Suppose our model makes predictions on three training examples and we know the
          true values:
        </p>
        <CalcStep number={1}>True values: 3, 7, 5</CalcStep>
        <CalcStep number={2}>Model predictions: 2, 8, 4</CalcStep>
        <CalcStep number={3}>Errors (prediction − true): (2−3)=−1, (8−7)=+1, (4−5)=−1</CalcStep>
        <CalcStep number={4}>Squared errors: (−1)²=1, (+1)²=1, (−1)²=1</CalcStep>
        <CalcStep number={5}>Sum of squared errors: 1+1+1 = 3</CalcStep>
        <CalcStep number={6}>MSE = (1/3) × 3 = 1.0</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A cost of <strong>1.0</strong>. Not terrible, but not zero. Gradient descent
          will now look at this number and figure out which direction to nudge the
          model&apos;s parameters to bring it closer to 0.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          Here&apos;s what the cost function looks like as real Python. We define two
          functions: one that computes MSE for a model with multiple predictions, and one
          that wraps a simple <code>f(x) = x**2</code> bowl — the toy problem we&apos;ll
          descend in the next steps. Rich comments explain every decision.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="gradient_descent.py"
        caption="MSE cost for a real model, plus a simple x-squared bowl we will descend step by step."
        code={`import numpy as np

# ─── Part 1: MSE cost function ────────────────────────────────────────────────
#
# This is the "ruler" that measures how wrong our model is.
# predictions: a numpy array of values our model produced
# targets:     a numpy array of the correct (true) values
# Both arrays must have the same length.

def mse_cost(predictions, targets):
    # Step 1 – compute the error for every training example at once.
    # numpy subtraction is element-wise, so this gives us an array of errors.
    errors = predictions - targets

    # Step 2 – square every error.
    # Squaring does two things:
    #   (a) makes negatives positive so +3 and -3 count the same
    #   (b) punishes large errors disproportionately (2->4, 10->100)
    squared_errors = errors ** 2

    # Step 3 – average over all n examples to get a single scalar cost.
    # np.mean divides the sum of squared errors by the number of examples.
    cost = np.mean(squared_errors)

    return cost   # a single float; lower is better; 0.0 is perfect


# Quick sanity check — should print 1.0 (matches our hand calculation above)
predictions = np.array([2.0, 8.0, 4.0])
targets      = np.array([3.0, 7.0, 5.0])
print("MSE:", mse_cost(predictions, targets))   # -> 1.0


# ─── Part 2: the toy bowl f(x) = x^2 ─────────────────────────────────────────
#
# For the next several steps we will descend this simple one-dimensional bowl.
# It is the perfect teaching example because:
#   - it has one global minimum at x = 0 (cost = 0)
#   - its derivative f'(x) = 2x is easy to compute by hand
#   - the parabola shape mirrors real MSE landscapes

def f(x):
    # The cost at position x.  This is what we want to drive to zero.
    return x ** 2

def grad_f(x):
    # The derivative (slope) of x^2 is 2x.
    # Positive x -> positive slope -> we are to the right of the minimum.
    # Negative x -> negative slope -> we are to the left of the minimum.
    return 2 * x


# Verify: at x=4, cost=16, slope=8 (matches the worked example above)
x0 = 4.0
print("f(4)  =", f(x0))       # -> 16.0
print("f'(4) =", grad_f(x0))  # -> 8.0`}
      />
    </div>
  );
}
