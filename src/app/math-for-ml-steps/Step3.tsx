'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="What Is an Exponential Function?">
        <p>
          In a linear function, you <em>add</em> a fixed amount each step. In an exponential
          function, you <em>multiply</em> by a fixed amount each step. That difference in behavior
          is enormous: exponential growth is what makes compound interest, viral spread, and
          neural network activations tick.
        </p>

        <MathFormula label="General exponential function">
          f(x) = a · b^x &nbsp;&nbsp;(base b &gt; 0, b ≠ 1)
        </MathFormula>

        <p>
          If b &gt; 1 the function grows; if 0 &lt; b &lt; 1 it decays toward zero. The key
          property: the <em>rate of change is proportional to the current value</em>. The bigger
          you are, the faster you grow.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Number e">
        <p>
          One base is special above all others: <strong>e ≈ 2.71828</strong>. It is the unique
          base for which the derivative of b^x equals b^x itself — the function is its own rate
          of change. This self-referential property makes e the natural choice whenever calculus is
          involved, which in ML is everywhere.
        </p>

        <MathFormula label="The natural exponential">
          f(x) = e^x &nbsp;&nbsp;&nbsp; d/dx [e^x] = e^x
        </MathFormula>

        <p>
          e arises naturally from compound interest taken to the limit: if you compound 100%
          annual interest continuously, after one year £1 becomes £e. It is not a human invention
          — it emerges from the structure of continuous growth itself.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Key Properties of Exponents">
        <p>
          These rules apply to any base but are especially useful with e:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Product rule:</strong> e^a · e^b = e^(a+b)</li>
          <li><strong>Quotient rule:</strong> e^a / e^b = e^(a−b)</li>
          <li><strong>Power rule:</strong> (e^a)^b = e^(a·b)</li>
          <li><strong>Zero exponent:</strong> e^0 = 1</li>
          <li><strong>Negative exponent:</strong> e^(−x) = 1 / e^x</li>
        </ul>
        <p>
          The negative exponent rule is the one you will use most: the sigmoid function is built
          entirely from e^(−x), and softmax involves a sum of e^(z_i) values.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why e Appears Everywhere in ML">
        <p>
          <strong>Sigmoid activation:</strong> σ(z) = 1 / (1 + e^(−z)). For any input z — even
          enormous ones like −1000 or +1000 — σ outputs a number between 0 and 1. This makes it
          perfect for expressing probabilities or neuron firing rates.
        </p>

        <MathFormula label="Sigmoid">
          σ(z) = 1 / (1 + e^(−z))
        </MathFormula>

        <p>
          <strong>Softmax:</strong> Used in multi-class classifiers to turn a vector of raw scores
          (z₁, z₂, ..., z_k) into a probability distribution that sums to 1. Each output is
          e^(z_i) divided by the sum of all e^(z_j). Exponentials guarantee every value is
          positive; the division normalizes them to sum to 1.
        </p>

        <MathFormula label="Softmax for class i">
          softmax(z)_i = e^(z_i) / (e^(z₁) + e^(z₂) + ... + e^(z_k))
        </MathFormula>

        <p>
          <strong>Learning rate decay:</strong> To prevent overshooting during training, the
          learning rate is often decayed exponentially each epoch: lr_t = lr_0 · e^(−λt). This
          ensures large updates early and fine-grained updates later.
        </p>
      </ExplanationBox>

      <WorkedExample title="Evaluating Sigmoid">
        <p>
          Compute the sigmoid of z = 2 and z = −2.
        </p>
        <CalcStep number={1}>For z = 2: compute e^(−2) ≈ 0.1353</CalcStep>
        <CalcStep number={2}>σ(2) = 1 / (1 + 0.1353) = 1 / 1.1353 ≈ 0.88</CalcStep>
        <CalcStep number={3}>For z = −2: compute e^(−(−2)) = e^2 ≈ 7.389</CalcStep>
        <CalcStep number={4}>σ(−2) = 1 / (1 + 7.389) = 1 / 8.389 ≈ 0.12</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Notice the symmetry: σ(z) and σ(−z) add up to 1. A strong positive z pushes the output
          toward 1 (&quot;very likely&quot;); a strong negative z pushes it toward 0 (&quot;very
          unlikely&quot;). This is exactly what we want for a binary classifier.
        </p>
      </WorkedExample>

      <WorkedExample title="Softmax for 3 Classes">
        <p>
          A classifier outputs raw scores z₁ = 2, z₂ = 1, z₃ = 0.5. Find the softmax probabilities.
        </p>
        <CalcStep number={1}>Compute each exponential: e^2 ≈ 7.389 &nbsp; e^1 ≈ 2.718 &nbsp; e^0.5 ≈ 1.649</CalcStep>
        <CalcStep number={2}>Sum: 7.389 + 2.718 + 1.649 = 11.756</CalcStep>
        <CalcStep number={3}>P(class 1) = 7.389 / 11.756 ≈ 0.629</CalcStep>
        <CalcStep number={4}>P(class 2) = 2.718 / 11.756 ≈ 0.231</CalcStep>
        <CalcStep number={5}>P(class 3) = 1.649 / 11.756 ≈ 0.140</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Total: 0.629 + 0.231 + 0.140 = 1.000. The softmax preserved the ranking of the raw
          scores but converted them into a valid probability distribution.
        </p>
      </WorkedExample>
    </div>
  );
}
