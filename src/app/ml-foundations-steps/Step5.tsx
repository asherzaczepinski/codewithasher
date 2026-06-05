'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Why You Cannot Train and Test on the Same Data">
        <p>
          Suppose Alex trains her house price model on all 5,000 examples she has, then checks
          how accurate it is on those same 5,000 examples. The model might report an error of
          nearly zero — but that tells her nothing useful.
        </p>
        <p>
          The problem is that the model has <em>already seen</em> every one of those houses.
          It could have simply memorized the prices rather than learning any generalizable
          pattern. Memorization looks like perfect performance on training data and collapses
          completely on any new house Alex tries to price.
        </p>
        <p>
          To get an honest estimate of how well the model will perform in the real world, you
          must evaluate it on data it has never seen during training. This is the entire reason
          we hold data back.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Three Splits and Their Roles">
        <p>
          Standard practice divides the dataset into three non-overlapping subsets:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Training set</strong> — the data the model actually learns from. All weight
            updates, all pattern discovery happens using only these examples. Typically 60–80% of
            the total data.
          </li>
          <li>
            <strong>Validation set</strong> — held out during training, used to compare different
            models or hyperparameter choices (e.g., &quot;should I use 50 trees or 200 trees?&quot;).
            Because you look at validation performance to make decisions, the validation set
            indirectly influences the final model. Typically 10–20%.
          </li>
          <li>
            <strong>Test set</strong> — touched exactly <em>once</em>, at the very end, after
            all model selection is complete. This gives a truly honest estimate of real-world
            performance. If you peek at it earlier or use it to make any choices, it is
            contaminated. Typically 10–20%.
          </li>
        </ul>
        <p>
          A common split for 5,000 examples: 3,500 training, 750 validation, 750 test.
        </p>
      </ExplanationBox>

      <WorkedExample title="Alex&apos;s Split in Practice">
        <p>
          Alex has 5,000 labeled house sales. Here is how she splits them before touching any
          model code:
        </p>
        <CalcStep number={1}>Shuffle the dataset with a fixed random seed (42) so the split is reproducible.</CalcStep>
        <CalcStep number={2}>Take the first 3,500 rows as the training set. The model will see only these rows during learning.</CalcStep>
        <CalcStep number={3}>Take the next 750 rows as the validation set. Used to tune the number of features, learning rate, and model type.</CalcStep>
        <CalcStep number={4}>Take the remaining 750 rows as the test set. Locked away until the final evaluation. Alex does not look at test-set performance until she has picked her final model.</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          This procedure is set up before any exploration or modeling. Doing it afterward
          risks unconsciously using test data to guide decisions.
        </p>
      </WorkedExample>

      <ExplanationBox title="What Is Data Leakage?">
        <p>
          <strong>Data leakage</strong> is when information from outside the training set
          (usually from the future, from the labels, or from the held-out sets) sneaks into the
          training process. The result is a model that looks excellent during development and
          fails badly in production.
        </p>
        <p>
          Leakage is insidious because it is invisible in training metrics. Everything looks great
          right up until deployment.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Concrete Ways Leakage Sneaks In">
        <p>
          These are the most common traps, and every one of them has burned real projects:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Scaling on the full dataset before splitting.</strong> If Alex computes the
            mean and standard deviation of <em>sqft</em> across all 5,000 houses and uses those
            to normalize, the training set normalization is contaminated by information from
            the test set. Fix: fit the scaler on training data only, then apply to validation and
            test.
          </li>
          <li>
            <strong>Future information in a time-series context.</strong> If houses are ordered
            by sale date and Alex randomly shuffles before splitting, some training examples will
            be from the future relative to some test examples. The model can learn patterns (like
            a market boom) that it could not possibly know at the time of prediction. Fix: for
            time-series data, always split chronologically.
          </li>
          <li>
            <strong>The target leaks through a feature.</strong> Imagine adding a feature
            &quot;assessed property value&quot; that the city updates shortly after each sale by
            referencing the sale price. This feature contains the answer. Fix: audit every feature
            for causal direction — does this feature exist before the label is revealed?
          </li>
          <li>
            <strong>Duplicate rows across splits.</strong> If the same house sale appears in both
            training and test, the model has seen that example. Fix: deduplicate before splitting.
          </li>
          <li>
            <strong>Using the test set to pick between models.</strong> Even without explicit
            score-based selection, if a developer sees test results and continues iterating,
            the test set has influenced the model. Fix: treat the test set as a write-once
            oracle — evaluate once, report, done.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Cross-Validation: Getting More From Less Data">
        <p>
          When data is scarce, a single validation split wastes too much. <strong>k-fold
          cross-validation</strong> makes every example serve as both training and validation
          data at different times.
        </p>
        <p>
          The dataset is divided into k equal folds (commonly k = 5 or 10). The model is trained
          k times: each time, one fold is held out as validation and the other k-1 folds form the
          training set. The k validation scores are averaged for a single, low-variance estimate
          of performance.
        </p>
        <p>
          A separate test set is still held out across all folds — cross-validation replaces the
          validation set, not the test set.
        </p>
      </ExplanationBox>
    </div>
  );
}
