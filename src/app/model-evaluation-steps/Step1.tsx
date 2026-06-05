'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Why Accuracy Is Not Enough">
        <p>
          Imagine you build a model to detect a rare disease that affects 1% of the population.
          Your model&apos;s strategy: always predict &quot;healthy.&quot; It achieves <strong>99% accuracy</strong> — yet
          it has never correctly identified a single sick patient.
        </p>
        <p>
          Accuracy looked great. The model is useless. This is the core problem that model evaluation
          exists to solve: a single number can hide everything that matters.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Good Evaluation Actually Means">
        <p>
          Good evaluation asks the right questions for the task at hand:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Are the errors costly?</strong> Missing a cancer diagnosis vs. flagging a harmless email as spam are very different failures.</li>
          <li><strong>Are the probabilities trustworthy?</strong> A model that says &quot;90% chance of rain&quot; should be right about 90% of the time — not 50%.</li>
          <li><strong>Does it generalise?</strong> A model memorising the training set is not useful in production.</li>
          <li><strong>Where does it fail?</strong> Knowing <em>which</em> examples the model gets wrong is often more valuable than an overall score.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Our Two Running Examples">
        <p>
          Throughout this course we will evaluate two models side by side so every concept has
          a concrete home.
        </p>
        <p>
          <strong>Example A — Disease Classifier.</strong> A binary classifier that reads a patient&apos;s
          blood-panel results and outputs a probability (0–1) that the patient has a particular
          disease. Ground truth: 1 = has disease, 0 = healthy.
        </p>
        <p>
          <strong>Example B — House-Price Regressor.</strong> A regression model that predicts the
          sale price of a house in thousands of dollars based on features like square footage,
          number of bedrooms, and neighbourhood. Ground truth: the actual recorded sale price.
        </p>
        <p>
          By the end of this course you will know exactly which metrics to reach for — and why —
          for both of these models and for any model you build in the future.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Road Ahead">
        <p>
          We will cover the course in three parts:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Part 1 — Metrics:</strong> Regression loss functions (MSE, MAE, RMSE), log loss and cross-entropy, the confusion matrix (precision, recall, F1), and ROC curves with AUC.</li>
          <li><strong>Part 2 — Validation &amp; Diagnosis:</strong> Cross-validation, the bias-variance tradeoff and learning curves, and finally calibration plus systematic error analysis.</li>
        </ul>
        <p>
          Every module uses the same two examples so you can see each concept from two angles at once.
          Let&apos;s get started.
        </p>
      </ExplanationBox>
    </div>
  );
}
