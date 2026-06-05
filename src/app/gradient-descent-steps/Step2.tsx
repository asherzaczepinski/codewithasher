'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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

    </div>
  );
}
