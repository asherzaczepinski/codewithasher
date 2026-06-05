'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Why Time Deserves Special Treatment">
        <p>
          A timestamp is one of the most information-dense raw columns in a dataset, yet a raw
          Unix epoch number (e.g. 1748563200) is nearly useless as a feature — models cannot
          generalise across the arbitrary scale of epoch values. We need to extract meaningful
          structure from time.
        </p>
        <p>
          In our churn dataset each customer has a subscription_start date and a last_activity
          timestamp. We can mine both for rich signal.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Calendar Features">
        <p>
          The simplest time features are calendar components extracted directly from a timestamp:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>day_of_week</strong> — 0 to 6 (Monday to Sunday)</li>
          <li><strong>month</strong> — 1 to 12</li>
          <li><strong>quarter</strong> — 1 to 4</li>
          <li><strong>is_weekend</strong> — binary flag</li>
          <li><strong>days_since_signup</strong> — a recency feature derived by subtracting
            subscription_start from today</li>
        </ul>
        <p>
          These are fast to compute and often surprisingly powerful. Churn, for example, frequently
          spikes at contract renewal months, so <em>months_since_renewal</em> can be a top feature.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Cyclical Encoding">
        <p>
          Calendar features have a problem: month 12 and month 1 are adjacent on the calendar
          (December and January), but a raw integer encoding treats them as the furthest apart
          (12 vs 1, a gap of 11). The same issue applies to days of the week and hours of the day.
        </p>
        <p>
          <strong>Cyclical encoding</strong> fixes this by mapping each value onto a circle using
          sine and cosine:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>month_sin = sin(2&pi; &times; month / 12)</li>
          <li>month_cos = cos(2&pi; &times; month / 12)</li>
        </ul>
        <p>
          December (month 12) and January (month 1) now map to nearly identical (sin, cos) pairs,
          correctly reflecting their proximity.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Lag Features and Rolling Windows">
        <p>
          When rows represent events ordered in time — such as monthly customer activity snapshots
          — the past is often the best predictor of the future.
        </p>
        <p>
          A <strong>lag feature</strong> shifts a column backward by k time steps, so the value
          from k periods ago appears alongside the current row. If a customer made 5 support calls
          last month and 8 this month, the lag-1 feature captures the trajectory.
        </p>
        <p>
          A <strong>rolling window</strong> aggregates a column over the past k steps — mean,
          max, standard deviation, etc. A rolling 3-month mean of support calls smooths out
          one-off spikes and reveals sustained trends.
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px' }}>
          df[&apos;calls_lag1&apos;] = df[&apos;support_calls&apos;].shift(1)<br />
          df[&apos;calls_roll3_mean&apos;] = df[&apos;support_calls&apos;].rolling(3).mean()
        </p>
      </ExplanationBox>

      <ExplanationBox title="Missing Values — Indicators and Imputation">
        <p>
          Real datasets are rarely complete. How you handle missing values is itself a feature
          engineering decision.
        </p>
        <p>
          <strong>Missing-value indicator:</strong> before imputing, add a binary column
          (e.g. days_since_call_missing = 1) to tell the model that the value was absent.
          Missingness is often informative — a customer with no recorded support calls might have
          had zero calls, or might have called through an untracked channel.
        </p>
        <p>
          <strong>Imputation strategies:</strong>
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>Mean / median:</strong> fast and safe for numerical columns with
            missing-at-random data. Median is more robust to outliers.</li>
          <li><strong>Mode:</strong> appropriate for categorical columns.</li>
          <li><strong>Forward fill / backward fill:</strong> for time-ordered data, carry the
            last known value forward rather than using a global average — this respects the
            temporal structure.</li>
          <li><strong>Model-based imputation:</strong> train a small regression model to predict
            the missing column from the other columns. Most accurate but slowest.</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Leakage Warning for Time Series">
        <p>
          Time series data has a trap that flat tabular data does not: <strong>temporal
          leakage</strong>. If you compute a rolling mean over all rows — past and future — before
          splitting train and test sets, your training features will contain information from the
          future. The model appears to perform brilliantly in validation but fails completely in
          production.
        </p>
        <p>
          The rule: always split by time first (e.g. train on months 1–18, test on months 19–24),
          then compute lag and rolling features using only the training period for fitting. Apply
          the same windows to the test set using only data available up to each test row&apos;s
          timestamp.
        </p>
      </ExplanationBox>
    </div>
  );
}
