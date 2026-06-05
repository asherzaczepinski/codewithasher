'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="How Good Is Our Model Really?">
        <p>
          We know how to train a model that minimises MSE on the data we give it. But the whole
          point is to predict prices for <em>new</em> houses — houses the model has never seen.
          A model can look fantastic on training data and be useless in the real world. To catch
          this, we need honest evaluation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="R²: The Fraction of Variance Explained">
        <p>
          MSE tells us the average squared error in dollar² units, which is hard to interpret
          without context. <strong>R²</strong> (R-squared, also called the coefficient of
          determination) puts the error on a 0-to-1 scale that is easy to read at a glance.
        </p>
        <p>
          The key idea: how much of the variation in prices does our model actually capture?
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>R² = 1.0 → the model explains all variation; every prediction is exact.</li>
          <li>R² = 0.0 → the model explains nothing; it is no better than predicting the mean price for every house.</li>
          <li>R² = 0.85 → the model explains 85 % of the variation in prices — a solid result.</li>
        </ul>
      </ExplanationBox>

      <MathFormula label="R² formula">
        R² = 1 − (SS_res / SS_tot){'\n'}
        SS_res = Σᵢ (yᵢ − ŷᵢ)²{'\n'}
        SS_tot = Σᵢ (yᵢ − ȳ)²
      </MathFormula>

      <ExplanationBox title="Reading the Formula">
        <p>
          <strong>SS_res</strong> (sum of squared residuals) is the total squared error of our
          model — the numerator of MSE multiplied by n.
        </p>
        <p>
          <strong>SS_tot</strong> (total sum of squares) is the total squared deviation of the
          prices around their mean ȳ. It represents the variation a trivial &quot;always predict
          the mean&quot; model would leave unexplained.
        </p>
        <p>
          The ratio SS_res / SS_tot tells us the fraction of variation our model <em>fails</em> to
          explain. Subtracting from 1 gives the fraction it <em>does</em> explain.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Train/Test Split: Honest Evaluation">
        <p>
          If we evaluate the model on the same data we trained it on, we are not measuring
          real-world performance — we are measuring memorisation. The honest approach is to hold
          out a portion of the data (typically 20 %) before training begins. The model never sees
          this <strong>test set</strong> during training; we measure R² on it only at the very end.
        </p>
        <p>
          A common workflow:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Training set (80 %)</strong> — used to fit w and b.</li>
          <li><strong>Test set (20 %)</strong> — used once, at the end, to report real performance.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Underfitting and Overfitting">
        <p>
          <strong>Underfitting</strong> — the model is too simple to capture the real pattern.
          Both training error and test error are high. With linear regression, underfitting happens
          when the true relationship is curved and a straight line cannot follow it.
        </p>
        <p>
          <strong>Overfitting</strong> — the model memorises quirks of the training data that do
          not generalise. Training error is very low but test error is much higher. With linear
          regression and many features this happens when we have very few data points: the line
          threads through every training point perfectly but predicts poorly on new ones.
        </p>
        <p>
          The solution to overfitting is <strong>regularisation</strong> — adding a penalty to the
          cost function that discourages large weights. The two most common forms are:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Ridge (L2)</strong> — adds λ · Σ wᵢ² to the MSE, shrinking all weights toward
            zero smoothly.
          </li>
          <li>
            <strong>Lasso (L1)</strong> — adds λ · Σ |wᵢ|, which pushes some weights all the way
            to zero, effectively removing irrelevant features.
          </li>
        </ul>
        <p>
          λ (lambda) controls the strength of the penalty. A larger λ means more shrinkage.
          Choosing the right λ is done by evaluating on a validation set (a slice of the training
          data withheld during fitting) or by cross-validation.
        </p>
      </ExplanationBox>

      <WorkedExample title="Computing R² for Our Four Houses">
        <p>
          Using w = 150, b = 50 000, and our four houses:
          actual prices are 200 000, 275 000, 360 000, 430 000.
        </p>

        <CalcStep number={1}>
          Mean price: ȳ = (200 000 + 275 000 + 360 000 + 430 000) / 4 = 1 265 000 / 4 = 316 250.
        </CalcStep>
        <CalcStep number={2}>
          SS_tot: (200 000−316 250)² + (275 000−316 250)² + (360 000−316 250)² + (430 000−316 250)²
          = (−116 250)² + (−41 250)² + (43 750)² + (113 750)²
          = 13 514 062 500 + 1 701 562 500 + 1 914 062 500 + 12 939 062 500
          = 30 068 750 000.
        </CalcStep>
        <CalcStep number={3}>
          SS_res (from Module 3, squared residuals): 0 + 0 + 100 000 000 + 25 000 000 = 125 000 000.
        </CalcStep>
        <CalcStep number={4}>
          R² = 1 − (125 000 000 / 30 068 750 000) = 1 − 0.00416 ≈ 0.996.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          R² ≈ <strong>0.996</strong>. Our simple w=150, b=50 000 line explains 99.6 % of the
          price variation in this dataset — an excellent fit. In a real project with noisy data
          you would be happy with R² above 0.85. This result confirms that for our four houses the
          linear model is essentially perfect.
        </p>
        <p>
          You have now seen the complete picture: define the model, measure error with MSE, minimise
          it with gradient descent or the Normal Equation, extend to many features with dot products,
          and evaluate honestly with R² on a held-out test set. That is linear regression from first
          principles.
        </p>
      </WorkedExample>
    </div>
  );
}
