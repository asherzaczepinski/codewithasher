'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Two Sources of Error">
        <p>
          Every model&apos;s error on new data can be decomposed into three parts: <strong>bias</strong>,
          <strong>variance</strong>, and irreducible noise. Understanding the first two tells you
          exactly why your model is failing and exactly what to do about it.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Bias:</strong> systematic error from wrong assumptions in the model. A linear model applied to a curved relationship will always be wrong in the same direction regardless of how much data you feed it. High bias means the model is too simple — it <em>underfits</em>.</li>
          <li><strong>Variance:</strong> sensitivity to small fluctuations in the training data. A very complex model memorises noise in the training set, so its predictions swing wildly with different training samples. High variance means the model is too complex — it <em>overfits</em>.</li>
          <li><strong>Irreducible noise:</strong> randomness inherent in the problem (e.g. two patients with identical blood panels but different outcomes). No model can eliminate this.</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Bias-Variance Decomposition (Expected Error)">
        Expected Error = Bias² + Variance + Irreducible Noise
      </MathFormula>

      <ExplanationBox title="Overfitting — High Variance">
        <p>
          An overfit model has <strong>low training error and high validation error</strong>. It has
          learned the training data so well — including its noise and quirks — that it generalises
          poorly to new examples.
        </p>
        <p>
          Symptoms on a learning curve (training and validation loss plotted against training
          set size or training iterations):
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Training loss is much lower than validation loss — a large gap between the two curves.</li>
          <li>Validation loss may plateau or even rise as training continues, while training loss keeps falling.</li>
        </ul>
        <p>
          <strong>Fixes for overfitting:</strong> more training data, regularisation (L1/L2, dropout),
          simpler model architecture, early stopping.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Underfitting — High Bias">
        <p>
          An underfit model has <strong>high training error and high validation error</strong>.
          Both losses are large and close together — the model has not learned the training data
          well, let alone generalised beyond it.
        </p>
        <p>
          Symptoms on a learning curve:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>Both training and validation loss are high and plateau near the same value.</li>
          <li>Adding more training data does not meaningfully improve either curve — the bottleneck is model capacity, not data quantity.</li>
        </ul>
        <p>
          <strong>Fixes for underfitting:</strong> more complex model architecture, more features,
          fewer regularisation constraints, more training iterations.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Reading Learning Curves">
        <p>
          A <strong>learning curve</strong> plots model performance (loss or metric) on the y-axis
          as a function of either training set size or training epoch on the x-axis. Two lines
          appear: one for the training set, one for the validation set.
        </p>
        <p>
          How to read them:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Large gap, training much better:</strong> overfitting. Apply regularisation or get more data.</li>
          <li><strong>Both curves high and close together:</strong> underfitting. Try a more powerful model.</li>
          <li><strong>Both curves low and converging:</strong> good fit. If both are acceptably low, you are done.</li>
          <li><strong>Validation loss rises after an initial fall:</strong> the model has gone past its best epoch. Use early stopping or save the checkpoint from the bottom of the validation curve.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="The Tradeoff in Practice">
        <p>
          Bias and variance pull in opposite directions. Making a model more flexible reduces
          bias (it can capture more complex patterns) but increases variance (it is more sensitive
          to the training sample). The sweet spot — the model complexity that minimises total
          error on new data — is found by watching the validation curve, not the training curve.
        </p>
        <p>
          For our house-price regressor: a single linear model may have high bias (house prices
          depend non-linearly on square footage). A 100-leaf decision tree may memorise individual
          houses and have high variance. A gradient-boosted ensemble with appropriate depth limits
          finds the middle ground.
        </p>
        <p>
          For our disease classifier: a logistic regression is quick to train and low-variance but
          may miss non-linear interactions between biomarkers (high bias). A deep neural network
          trained on only 200 patients may overfit spectacularly. Cross-validated regularised
          logistic regression or a shallow gradient-boosted classifier is often the right balance
          at this data scale.
        </p>
      </ExplanationBox>
    </div>
  );
}
