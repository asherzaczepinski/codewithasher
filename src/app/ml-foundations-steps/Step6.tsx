'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Look Before You Leap">
        <p>
          EDA — <strong>Exploratory Data Analysis</strong> — is the practice of thoroughly
          understanding your data before building any model. It sounds obvious, but it is the
          step most beginners skip, and skipping it almost always costs time later.
        </p>
        <p>
          The goal is simple: develop an accurate mental model of what your data actually looks
          like — not what you assume it looks like. In practice that means looking at the
          distribution of every feature, checking for anomalies, understanding relationships
          between features and the target, and discovering quality problems early when they are
          cheap to fix.
        </p>
        <p>
          All EDA should be done on the <strong>training set only</strong>. Looking at the
          validation or test sets during exploration risks leaking information and inflating your
          sense of how hard the problem is.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Summary Statistics: The First Pass">
        <p>
          The first thing Alex does after loading her training set is print a summary: count,
          mean, standard deviation, minimum, 25th percentile, median, 75th percentile, and
          maximum for every numerical feature.
        </p>
        <p>
          This one table reveals a lot. For the house dataset:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <em>sqft</em> mean: 1,650. Min: 320. Max: 8,400. The max is more than five times the
            mean — there are likely some very large outliers.
          </li>
          <li>
            <em>sale_price</em> mean: $287,000. Median: $251,000. Mean is substantially above
            median, which signals a right-skewed distribution — a small number of very expensive
            homes are pulling the average up.
          </li>
          <li>
            <em>bedrooms</em> min: 0. That is suspicious — a house with zero bedrooms? Either
            it&apos;s a studio coded as 0, or it&apos;s a data entry error. Alex flags it for
            investigation.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Distributions and Visualizations">
        <p>
          Summary statistics compress information; plots reveal it. For each numerical feature,
          Alex plots a histogram (to see the shape of the distribution) and a scatter plot against
          the target (to see whether there is a relationship).
        </p>
        <p>
          Key things to look for in distributions:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Skewness</strong> — a long tail on one side. Skewed features often benefit from a log transform before modeling.</li>
          <li><strong>Bimodality</strong> — two distinct humps can indicate two subpopulations that should be handled separately.</li>
          <li><strong>Clumping at boundaries</strong> — values piling up at 0 or at a maximum often indicate a sensor cap or a default value substituted for missing data.</li>
        </ul>
        <p>
          In scatter plots of feature vs. target, Alex is looking for correlation. If <em>sqft</em>
          vs. <em>sale_price</em> shows a clear upward trend, that feature is likely to be useful.
          If <em>lot_size</em> shows a random cloud, it may be less useful — or may need
          transformation to reveal its relationship.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Correlations Between Features">
        <p>
          A correlation matrix shows, for every pair of features, how strongly they move together.
          Values near 1 or -1 mean a strong linear relationship; values near 0 mean little linear
          relationship.
        </p>
        <p>
          Alex finds that <em>sqft</em> and <em>bedrooms</em> are highly correlated (0.82). That
          makes sense — bigger houses have more bedrooms. Including two features that are nearly
          identical (called <strong>multicollinearity</strong>) can make some models less stable.
          It does not necessarily hurt performance, but it is worth knowing.
        </p>
        <p>
          The correlation of each feature with the <em>sale_price</em> target is especially
          useful: it gives a quick ranking of which features are most predictive. Alex finds
          that <em>sqft</em> has the highest correlation with price (0.71), followed by
          <em>bedrooms</em> (0.58) and <em>year_built</em> (0.41).
        </p>
      </ExplanationBox>

      <WorkedExample title="Handling Missing Data">
        <p>
          Alex finds that 4% of rows have a missing value in <em>lot_size</em>. There are two
          main strategies:
        </p>
        <CalcStep number={1}>
          <strong>Drop rows with missing values.</strong> Simple but wastes data. If 4% of 3,500 training examples are missing lot_size, dropping them loses 140 examples. Acceptable if the fraction is tiny and the missing rows are not systematically different from the rest.
        </CalcStep>
        <CalcStep number={2}>
          <strong>Impute — fill in a substitute value.</strong> Common choices: the median of the training set (robust to outliers), the mean, or a model-predicted value. Alex uses the training median and flags imputed rows with a new binary feature called <em>lot_size_was_missing</em> so the model can learn whether missingness itself is informative.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Crucially, the imputation value (the median) must be computed on the training set only and
          then applied to validation and test. Computing it on the full dataset would be leakage.
        </p>
      </WorkedExample>

      <ExplanationBox title="Outliers: When to Worry and When Not To">
        <p>
          An outlier is a value that is far from the bulk of the distribution. They are not
          always errors — the 8,400 sqft house might be a genuine mansion. But they can be:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Data entry errors</strong> — a price of $2,000,000 when all others are under $500,000 might be a typo (missing a digit, or dollar amount entered in thousands).</li>
          <li><strong>Rare but real</strong> — the model should be evaluated on whether it handles these well, not whether they were quietly removed.</li>
          <li><strong>Genuinely out-of-scope</strong> — if Alex&apos;s app is only for residential homes, commercial properties in the dataset are legitimately out of scope and should be filtered.</li>
        </ul>
        <p>
          The decision to remove or cap an outlier must be documented and applied consistently
          to training, validation, and test. Selectively removing outliers from the test set to
          make metrics look better is a form of data manipulation.
        </p>
      </ExplanationBox>

    </div>
  );
}
