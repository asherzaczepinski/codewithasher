'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="The One Hyperparameter You Must Choose">
        <p>
          KNN has essentially one dial you turn: <strong>k</strong>, the number of neighbors
          that vote. Everything else is determined by your data. Getting k right is the
          difference between a model that generalizes well and one that either memorizes noise
          or misses real patterns entirely.
        </p>
      </ExplanationBox>

      <ExplanationBox title="k = 1: Maximum Sensitivity">
        <p>
          With k&nbsp;=&nbsp;1, the single closest neighbor decides everything. If that neighbor
          happens to be a mislabeled point, an outlier, or just a noisy measurement, the
          prediction is wrong — no other vote can override it.
        </p>
        <p>
          The resulting decision boundary is extremely <strong>jagged</strong>: every training
          point gets its own little &quot;territory&quot; around it. On the training set,
          1-NN achieves perfect accuracy (a point&apos;s nearest neighbor is itself), but it
          <em> overfits</em> — it captures the noise of the training data rather than the
          underlying signal.
        </p>
        <ul style={{ lineHeight: '1.9', marginTop: '0.5rem' }}>
          <li>Training accuracy: <strong>100%</strong> (always)</li>
          <li>Test accuracy: <strong>highly variable</strong>, often poor on noisy data</li>
          <li>Decision boundary: <strong>extremely jagged</strong></li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Large k: Maximum Smoothness">
        <p>
          As k grows, more neighbors vote and individual noisy points are outvoted. The
          decision boundary becomes <strong>smoother</strong> and more stable. But push k too
          high and the algorithm starts ignoring genuine local structure — it&apos;s asking
          neighbors from the far side of the dataset to weigh in on a very local question.
        </p>
        <p>
          In the extreme, k&nbsp;=&nbsp;N (every training point votes) always predicts the
          majority class in the entire dataset, regardless of where the new point lands. That
          is <em>underfitting</em> — the model is too simple to capture the pattern.
        </p>
        <ul style={{ lineHeight: '1.9', marginTop: '0.5rem' }}>
          <li>Training accuracy: <strong>decreases</strong> as k rises</li>
          <li>Test accuracy: <strong>peaks somewhere in the middle</strong></li>
          <li>Decision boundary: <strong>smooth and stable</strong></li>
        </ul>
      </ExplanationBox>

      <MathFormula label="The Bias–Variance Trade-off for k">
        Small k → low bias, high variance (overfits noise){'\n'}
        Large k → high bias, low variance (underfits structure)
      </MathFormula>

      <ExplanationBox title="Practical Rules for Choosing k">
        <p>
          <strong>1. Use cross-validation.</strong> Try k&nbsp;=&nbsp;1, 3, 5, 7, … and measure
          validation accuracy at each value. The k that maximizes validation accuracy is your
          best choice — don&apos;t guess.
        </p>
        <p>
          <strong>2. Prefer odd k for binary classification.</strong> With two classes (apple vs
          orange), an even k can produce a tie — three apple votes vs three orange votes. An
          odd k guarantees one class wins outright. For multi-class problems, a tie is still
          possible but less frequent.
        </p>
        <p>
          <strong>3. A common starting heuristic: k&nbsp;=&nbsp;√N.</strong> If you have 100
          training examples, try k&nbsp;≈&nbsp;10 as an initial guess, then tune from there.
          It&apos;s not magic — just a reasonable starting point.
        </p>
        <p>
          <strong>4. Scale matters.</strong> The &quot;right&quot; k depends on how densely
          labeled examples are packed in feature space, which itself depends on dataset size
          and the number of features. More data generally lets you afford a larger k.
        </p>
      </ExplanationBox>
    </div>
  );
}
