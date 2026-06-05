'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Beyond Two Classes">
        <p>
          Logistic regression with a single sigmoid handles binary problems perfectly — spam vs. not spam,
          pass vs. fail. But what if we have <strong>more than two classes</strong>? Imagine classifying
          emails into three buckets: <em>spam</em>, <em>promotions</em>, and <em>primary inbox</em>.
        </p>
        <p>
          We need an output that assigns a probability to each class such that all probabilities are
          positive and they sum to exactly 1. The <strong>softmax function</strong> does this.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Softmax Function">
        <p>
          Instead of one score z, we compute a separate score zₖ for each class k using its
          own weight vector. Then softmax converts the entire vector of scores into a probability
          distribution:
        </p>
      </ExplanationBox>

      <MathFormula label="Softmax for class k (out of K classes)">
        P(class k) = e^(zₖ) / Σⱼ e^(zⱼ)
      </MathFormula>

      <ExplanationBox title="Why Exponentiate?">
        <p>
          Raw scores can be negative, and probabilities must be positive. Raising e to the power of
          each score maps everything to a positive number. Dividing by the sum of all such exponentials
          forces the outputs to sum to 1 — making it a genuine probability distribution.
        </p>
        <p>
          Notice that when K = 2, softmax reduces to the sigmoid:
          P(class 1) = e^(z₁) / (e^(z₁) + e^(z₀)) = 1 / (1 + e^(z₀−z₁)) = σ(z₁ − z₀).
          Softmax is the general case; sigmoid is the special binary case.
        </p>
        <p>
          Softmax also <strong>amplifies differences</strong>. If one class has a score much higher
          than the others, softmax pushes its probability close to 1 while the others collapse toward 0.
          This is useful: a confident model should dominate, and softmax makes that happen naturally.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Training with Softmax: Categorical Cross-Entropy">
        <p>
          The loss for multiclass classification extends binary cross-entropy. For a single example
          with true class c:
        </p>
      </ExplanationBox>

      <MathFormula label="Categorical cross-entropy loss">
        L = −log(P(true class c))
      </MathFormula>

      <ExplanationBox title="Putting It All Together">
        <p>
          The full multiclass logistic regression pipeline:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Compute K raw scores — one per class — using K separate weight vectors.</li>
          <li>Apply softmax to get K probabilities that sum to 1.</li>
          <li>Predict the class with the highest probability.</li>
          <li>Measure error with categorical cross-entropy.</li>
          <li>Update all weight vectors with gradient descent.</li>
        </ul>
        <p>
          This is exactly how the output layer of a neural network works. The course on neural
          networks builds directly on what you&apos;ve learned here — every output neuron uses
          softmax or sigmoid, and the same cross-entropy loss drives training.
        </p>
      </ExplanationBox>

      <WorkedExample title="Softmax on Three Email Categories">
        <p>
          Our classifier produces three raw scores for a new email:
          z_spam = 2.1, z_promotions = 0.8, z_primary = −0.3.
        </p>
        <CalcStep number={1}>
          Exponentiate each score: e^2.1 ≈ 8.166, e^0.8 ≈ 2.226, e^(−0.3) ≈ 0.741
        </CalcStep>
        <CalcStep number={2}>
          Sum of exponentials: 8.166 + 2.226 + 0.741 = <strong>11.133</strong>
        </CalcStep>
        <CalcStep number={3}>
          P(spam) = 8.166 / 11.133 ≈ <strong>0.733</strong>
        </CalcStep>
        <CalcStep number={4}>
          P(promotions) = 2.226 / 11.133 ≈ <strong>0.200</strong>
        </CalcStep>
        <CalcStep number={5}>
          P(primary) = 0.741 / 11.133 ≈ <strong>0.067</strong>
        </CalcStep>
        <CalcStep number={6}>
          Check: 0.733 + 0.200 + 0.067 = <strong>1.000</strong> ✓
        </CalcStep>
        <CalcStep number={7}>
          Prediction: spam (highest probability). Loss = −log(0.733) ≈ <strong>0.311</strong>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The model is 73.3% confident this is spam, with a 20% chance it&apos;s promotional and
          only 6.7% chance it belongs in the primary inbox. Gradient descent will adjust all
          three weight vectors to improve this prediction on the next training pass.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          You now have the complete picture of logistic regression — from raw scores to probabilities,
          from decisions to training, from binary to multiclass. These same ideas are the foundation
          of every modern classifier, including the output layers of deep neural networks.
        </p>
      </WorkedExample>

    </div>
  );
}
