'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Equation of a Line">
        <p>
          You may have seen the equation of a line written as <em>y = mx + c</em> in school. In
          machine learning, the exact same idea is written with different letters to make the role
          of each piece explicit:
        </p>
      </ExplanationBox>

      <MathFormula label="The Linear Model">
        ŷ = w · x + b
      </MathFormula>

      <ExplanationBox title="What Each Letter Means">
        <p>
          <strong>x</strong> is the <em>input feature</em> — the thing we know. In our example,
          x is the size of the house in square feet.
        </p>
        <p>
          <strong>ŷ</strong> (read &quot;y-hat&quot;) is the <em>predicted output</em> — what our
          model guesses the price will be. The hat symbol reminds us it is a prediction, not the
          real answer.
        </p>
        <p>
          <strong>w</strong> is the <em>weight</em> (also called the slope). It tells us how many
          dollars the predicted price goes up for every additional square foot. If w = 150, adding
          one square foot adds $150 to the predicted price. This is the single most important
          number the model must learn.
        </p>
        <p>
          <strong>b</strong> is the <em>bias</em> (also called the intercept). It is the predicted
          price when x = 0. Physically, a house with zero square feet does not exist, but
          mathematically b shifts the whole line up or down so it can pass through the data as
          closely as possible.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why a Straight Line?">
        <p>
          A straight line is the simplest relationship between two numbers. If we doubled the size
          of a house, we might reasonably expect roughly double the price. That proportional
          relationship is exactly what a line captures.
        </p>
        <p>
          Not every real-world relationship is linear, but for house prices versus size it is a
          surprisingly good approximation — and it gives us all the machinery we need to understand
          more complex models later.
        </p>
      </ExplanationBox>

      <WorkedExample title="Predicting a Price Step by Step">
        <p>
          Suppose our model has learned the values <strong>w = 150</strong> and{' '}
          <strong>b = 50 000</strong>. Let&apos;s predict the price of a 1 400 sq ft house.
        </p>

        <CalcStep number={1}>Write the model: ŷ = w · x + b</CalcStep>
        <CalcStep number={2}>Plug in our weight and bias: ŷ = 150 · x + 50 000</CalcStep>
        <CalcStep number={3}>Plug in the house size: ŷ = 150 · 1 400 + 50 000</CalcStep>
        <CalcStep number={4}>Multiply: 150 × 1 400 = 210 000</CalcStep>
        <CalcStep number={5}>Add the bias: ŷ = 210 000 + 50 000 = 260 000</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Our model predicts <strong>$260 000</strong> for a 1 400 sq ft house.
        </p>
        <p>
          Notice that <em>every prediction is just multiplication and addition</em>. The hard part
          is not computing ŷ — it is finding the right values of w and b in the first place. That
          is what the next two modules are about.
        </p>
      </WorkedExample>
    </div>
  );
}
