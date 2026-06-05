'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Logarithms Are the Inverse of Exponentials">
        <p>
          If exponentials ask &quot;what do I get when I raise a base to this power?&quot;,
          logarithms ask the reverse: &quot;what power do I need to get this number?&quot;
        </p>

        <MathFormula label="Definition of logarithm">
          log_b(x) = y &nbsp;&nbsp;means&nbsp;&nbsp; b^y = x
        </MathFormula>

        <p>
          Example: log₂(8) = 3 because 2³ = 8. In ML we almost exclusively use the{' '}
          <strong>natural logarithm</strong>, written ln(x) or log(x), which uses base e. So
          ln(e²) = 2, and ln(1) = 0 because e⁰ = 1.
        </p>
        <p>
          One hard constraint: <strong>you can only take the log of a positive number</strong>.
          log(0) is negative infinity; log of a negative number is undefined. This matters a lot
          in ML — any time you compute a log, you need to ensure the input is strictly positive.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Three Log Rules">
        <p>
          These three rules let you simplify and manipulate logarithms. Memorise them — they appear
          constantly in deriving ML loss functions.
        </p>

        <MathFormula label="Product rule">
          log(a · b) = log(a) + log(b)
        </MathFormula>

        <MathFormula label="Quotient rule">
          log(a / b) = log(a) − log(b)
        </MathFormula>

        <MathFormula label="Power rule">
          log(a^n) = n · log(a)
        </MathFormula>

        <p>
          Together they let us turn products into sums and exponents into multiplications — two
          transformations that simplify both algebra and numerical computation enormously.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why ML Uses Logarithms">
        <p>
          <strong>Log-likelihood.</strong> The probability of observing an entire training dataset
          is the product of the probability of each individual example. Products of many small
          probabilities quickly underflow to zero (a computer stores 0.0001^10000 as exactly
          0). Taking the log turns that product into a sum, which is both numerically stable and
          easier to maximise with calculus.
        </p>

        <MathFormula label="Log-likelihood (product becomes sum)">
          log P(data) = log(p₁ · p₂ · ... · p_n) = log(p₁) + log(p₂) + ... + log(p_n)
        </MathFormula>

        <p>
          <strong>Binary cross-entropy loss.</strong> The standard loss for binary classifiers
          (logistic regression, the output neuron of a neural network) is:
        </p>

        <MathFormula label="Binary cross-entropy">
          L = −[y · log(p) + (1 − y) · log(1 − p)]
        </MathFormula>

        <p>
          Here y is the true label (0 or 1) and p is the model&apos;s predicted probability. When
          y = 1, only the first term survives: L = −log(p). If p is close to 1 (correct and
          confident), log(p) ≈ 0, so the loss is near zero. If p is close to 0 (wrong and
          confident), log(p) → −∞, so the loss is enormous — exactly the penalty we want.
        </p>

        <p>
          <strong>Numerical stability.</strong> Rather than computing softmax and then log(softmax),
          frameworks use the &quot;log-sum-exp&quot; trick to combine both steps in a numerically
          stable way. This avoids the overflow that happens when e^(z_i) is astronomically large.
        </p>
      </ExplanationBox>

      <WorkedExample title="Simplifying with Log Rules">
        <p>
          Simplify: log(x² · y / z³)
        </p>
        <CalcStep number={1}>Apply the product rule to x² · y: log(x²) + log(y) + log(1/z³)</CalcStep>
        <CalcStep number={2}>Apply the quotient rule to 1/z³: − log(z³)</CalcStep>
        <CalcStep number={3}>Apply the power rule: 2·log(x) + log(y) − 3·log(z)</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Result: <strong>2 log(x) + log(y) − 3 log(z)</strong>. The original expression had
          products and powers; now it is a simple weighted sum of logs — far easier to differentiate
          when optimising a likelihood.
        </p>
      </WorkedExample>

      <WorkedExample title="Cross-Entropy Loss on One Example">
        <p>
          True label y = 1. Model predicts p = 0.9. Compute the binary cross-entropy loss.
        </p>
        <CalcStep number={1}>Formula: L = −[y · log(p) + (1 − y) · log(1 − p)]</CalcStep>
        <CalcStep number={2}>Since y = 1, the second term is (1 − 1) · log(...) = 0</CalcStep>
        <CalcStep number={3}>L = −log(0.9) ≈ −(−0.105) = 0.105</CalcStep>
        <p style={{ marginTop: '0.75rem' }}>
          Now suppose the model predicts p = 0.1 (wrong and confident):
        </p>
        <CalcStep number={4}>L = −log(0.1) ≈ −(−2.303) = 2.303</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A confident wrong answer is penalised <strong>22 times more</strong> than a confident
          correct answer. This large gradient drives the model strongly toward the truth — the log
          scale amplifies errors in exactly the right direction.
        </p>
      </WorkedExample>

    </div>
  );
}
