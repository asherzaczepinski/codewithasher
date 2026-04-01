'use client';

import MathFormula from '@/components/MathFormula';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';


export default function Step17() {
  return (
    <div>

      <ExplanationBox title="What Is a Derivative?">
        <p>
          A derivative tells you <strong>how fast something is changing</strong>. If y = f(x),
          then the derivative dy/dx tells you: &quot;if I increase x by a tiny amount, how much does y change?&quot;
        </p>
        <p>
          For neural networks, we care about: &quot;if I change this weight by a tiny amount, how much
          does the loss change?&quot; If we know that, we can adjust weights to reduce loss!
        </p>
        <p>
          A positive derivative means increasing the input increases the output.
          A negative derivative means increasing the input decreases the output.
          The magnitude tells us how sensitive the output is to the input.
        </p>
      </ExplanationBox>

      <MathFormula label="The Core Question">
        ∂Loss/∂weight = &quot;How much does loss change when we tweak this weight?&quot;
      </MathFormula>

      <ExplanationBox title="Derivatives We Need">
        <p>
          For our network, we need derivatives of two functions:
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>1. Sigmoid derivative:</strong> How does sigmoid&apos;s output change with its input?
        </p>
        <div className="math-formula" style={{ margin: '1rem 0' }}>
          d/dz[sigmoid(z)] = sigmoid(z) × (1 - sigmoid(z))
        </div>
        <p>
          This beautiful formula means we can compute the derivative using just the output!
          If s = sigmoid(z), then the derivative is s × (1 - s).
        </p>
        <p style={{ marginTop: '1rem' }}>
          <strong>2. MSE derivative:</strong> How does loss change with prediction?
        </p>
        <div className="math-formula" style={{ margin: '1rem 0' }}>
          d/dp[(p - t)²] = 2 × (p - t)
        </div>
        <p>
          This comes from the power rule: the derivative of x² is 2x.
        </p>
      </ExplanationBox>

      <WorkedExample title="Why These Derivatives Matter">
        <p>Let&apos;s trace through an example. Say our prediction is 0.7 but target is 1.0:</p>

        <CalcStep number={1}>MSE derivative = 2 × (0.7 - 1.0) = 2 × (-0.3) = -0.6</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The negative sign tells us: <em>prediction is too low</em>. To reduce loss,
          we need to increase the prediction. If we had pred=1.3 and target=1.0:
        </p>

        <CalcStep number={2}>MSE derivative = 2 × (1.3 - 1.0) = 2 × (0.3) = 0.6</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Positive sign means: <em>prediction is too high</em>. We need to decrease it.
          The derivative is our compass pointing toward improvement!
        </p>
      </WorkedExample>

      <ExplanationBox title="The Sigmoid Derivative Shape">
        <p>
          The sigmoid derivative has an interesting shape - it&apos;s largest in the middle
          and smallest at the extremes:
        </p>
        <div style={{
          background: 'var(--bg-tertiary)',
          padding: '1rem',
          borderRadius: '8px',
          fontFamily: 'monospace',
          marginTop: '1rem'
        }}>
          <pre style={{ background: 'transparent', padding: 0 }}>
{`Derivative
0.25|     *****
    |    *     *
0.1 |   *       *
    |  *         *
0.0 |**           **
    +------|------|------> z
         -2     0     2`}
          </pre>
        </div>
        <p style={{ marginTop: '1rem' }}>
          At z=0, the derivative is 0.25 (maximum). At z=±5, it&apos;s nearly 0.
          This means sigmoid &quot;saturates&quot; at extremes - small changes in z cause
          almost no change in output. This can slow down learning (the &quot;vanishing gradient&quot; problem).
        </p>
      </ExplanationBox>

      <p>
        <strong>Rain example:</strong> Our Cool Moisture neuron had z = −0.6, so sigmoid(−0.6) ≈ 0.354.
        The sigmoid derivative at that point: 0.354 × (1 − 0.354) = 0.354 × 0.646 ≈ 0.229. This means
        a small change in z would change the neuron&apos;s confidence by about 23% of that change — the neuron
        is in a sensitive zone where adjusting weights actually moves the confidence meaningfully.
      </p>

      <WorkedExample title="Computing Sigmoid Derivative">
        <p>For our Cool Moisture neuron at z = −0.6:</p>

        <CalcStep number={1}>sigmoid(−0.6) ≈ 0.354</CalcStep>
        <CalcStep number={2}>derivative = 0.354 × (1 − 0.354)</CalcStep>
        <CalcStep number={3}>derivative = 0.354 × 0.646 ≈ 0.229</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          This tells us: at z=−0.6, a small increase in z causes the sigmoid output
          to increase by about 0.229 times that amount.
        </p>
      </WorkedExample>

      <ExplanationBox title="The Power of Derivatives">
        <p>
          You now have the mathematical tools to answer: &quot;which direction should I adjust
          this value to reduce error?&quot; But there&apos;s a problem: our network has many layers,
          and we need to know how the <em>final</em> loss depends on weights in <em>earlier</em>
          layers.
        </p>
        <p>
          This is where the <strong>chain rule</strong> comes in. It tells us how to
          combine derivatives when functions are composed (like layers in a network).
          That&apos;s the next step!
        </p>
      </ExplanationBox>

    </div>
  );
}
