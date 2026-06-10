'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="The Wisdom of Crowds">
        <p>
          In 1906, statistician Francis Galton watched 800 villagers at a county fair guess the weight
          of an ox. No single person was right — but the <em>average</em> of all guesses was 1,207 lbs,
          just one pound off the true weight of 1,208 lbs. The crowd beat every individual expert.
        </p>
        <p>
          Ensemble methods apply the exact same idea to machine learning: train many models, combine
          their predictions, and consistently outperform any single model. This is not a trick —
          it is one of the most reliable results in all of applied ML.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Predicting Loan Default">
        <p>
          Throughout this course we will use a Kaggle-style tabular dataset of 10,000 loan applications.
          Each row has features like <strong>annual income</strong>, <strong>debt-to-income ratio</strong>,{' '}
          <strong>credit score</strong>, <strong>loan amount</strong>, and <strong>employment length</strong>.
          The target is binary: did the borrower default (1) or repay (0)?
        </p>
        <p>
          A single decision tree achieves about 72% accuracy on the held-out test set. By the end of
          this course, ensembles will push that to <strong>88%+ AUC</strong> — without collecting a
          single extra data point.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Bagging</strong> (Module 2): Random Forest reaches 81% AUC.</li>
          <li><strong>Gradient Boosting</strong> (Module 5): XGBoost reaches 88% AUC.</li>
          <li><strong>Stacking</strong> (Module 7): a meta-model squeezes out a final gain.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Bias and Variance: Why One Tree Is Not Enough">
        <p>
          Every model makes two kinds of errors. <strong>Bias</strong> is systematic error — the model
          is wrong in the same direction every time because it is too simple to capture the true pattern.
          <strong>Variance</strong> is sensitivity error — the model is correct on average but wildly
          different on different training sets because it has memorised noise.
        </p>
        <p>
          A single deep decision tree has <em>low bias</em> (it fits the training data almost perfectly)
          but <em>high variance</em> (change a handful of training rows and the whole tree changes).
          Ensembles are powerful because the two families attack these two problems differently:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Bagging</strong> trains many high-variance models in parallel and averages them.
            Averaging cancels out variance while keeping bias roughly the same.
          </li>
          <li>
            <strong>Boosting</strong> trains models sequentially, each one correcting the errors of the
            last. This drives down bias, and careful regularisation keeps variance in check.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="The Bias-Variance Decomposition">
        Expected Error = Bias&#178; + Variance + Irreducible Noise
      </MathFormula>

      <ExplanationBox title="Two Families, One Goal">
        <p>
          <strong>Bagging</strong> (Bootstrap AGGregatING) — resample the training data, train independent
          models, combine by majority vote or averaging. Covered in Part 1.
        </p>
        <p>
          <strong>Boosting</strong> — train models one after another, where each new model focuses on
          the examples the previous models got wrong. Covered in Part 2.
        </p>
        <p>
          Both families produce an <em>ensemble</em>: a single prediction system made of many constituent
          models (called <strong>base learners</strong> or <strong>weak learners</strong>). Even if each
          base learner is only slightly better than random chance, their combination can be very strong —
          this theoretical guarantee is the foundation of boosting theory.
        </p>
      </ExplanationBox>
    </div>
  );
}
