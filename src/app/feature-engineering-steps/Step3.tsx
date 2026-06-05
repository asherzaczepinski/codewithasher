'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="The Problem with Raw Categories">
        <p>
          Most models speak numbers, not words. The contract_type column in our churn dataset
          contains the strings &quot;Month-to-Month&quot;, &quot;One-Year&quot;, and
          &quot;Two-Year&quot;. Before a model can use this column you must convert it to numbers
          — and <em>how</em> you do that matters a great deal.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One-Hot Encoding">
        <p>
          <strong>One-hot encoding</strong> creates one binary column per category. If the category
          applies to a row, its column gets a 1; all others get 0. It is the safest default because
          it imposes no ordering on the categories.
        </p>
        <p>
          For contract_type with three values you get three columns:
          is_month_to_month, is_one_year, is_two_year. A month-to-month subscriber becomes
          (1, 0, 0).
        </p>
        <p>
          <strong>When to use it:</strong> nominal categories (no natural order) with a manageable
          number of distinct values — typically fewer than 20 to 50. Above that threshold the
          feature matrix grows wide and sparse, which hurts many algorithms.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Ordinal Encoding">
        <p>
          <strong>Ordinal encoding</strong> maps each category to an integer that preserves a
          meaningful order. Contract length has a natural order — month-to-month is shorter than
          one-year, which is shorter than two-year — so ordinal encoding is sensible here:
          Month-to-Month → 0, One-Year → 1, Two-Year → 2.
        </p>
        <p>
          <strong>When to use it:</strong> only when the categories genuinely have a rank order
          and the gaps between ranks are roughly equal. If you ordinally encode a column like
          &quot;city&quot; where the order is arbitrary, the model will incorrectly assume
          City 2 is closer to City 3 than to City 0.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Target Encoding">
        <p>
          <strong>Target encoding</strong> replaces each category with the mean of the target
          variable for rows belonging to that category. It packs predictive signal directly into a
          single column and handles high-cardinality categories (like postal codes or product IDs)
          that would explode the column count with one-hot encoding.
        </p>
        <p>
          The risk is <strong>target leakage</strong>: if you compute the mean using the same rows
          you later evaluate on, the model sees the answer embedded in a feature. Always compute
          target encoding means on the training set only, then apply the same mapping to validation
          and test rows.
        </p>
        <p>
          A smoothing term blends each category&apos;s mean with the global mean, shrinking
          estimates for rare categories toward a safer default.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Hashing Trick">
        <p>
          When a categorical column has tens of thousands of unique values — think user IDs or
          free-text tags — even target encoding is fragile and one-hot encoding is impossible.
          The <strong>hashing trick</strong> maps each category to one of B fixed buckets using a
          hash function. You choose B (say, 512), and the result is always a B-wide binary vector,
          regardless of how many unique categories exist.
        </p>
        <p>
          The trade-off is <em>hash collisions</em>: two different categories may land in the
          same bucket. In practice, choosing B large enough makes collisions rare, and the
          compression benefit outweighs the small information loss at scale.
        </p>
      </ExplanationBox>

      <WorkedExample title="One-Hot Encoding + Target Encoding Side by Side">
        <p>
          We have 4 churn training rows with contract_type and whether they churned (1 = yes).
        </p>
        <CalcStep number={1}>
          Raw data: [Month-to-Month, churn=1], [One-Year, churn=0],
          [Month-to-Month, churn=1], [Two-Year, churn=0]
        </CalcStep>
        <CalcStep number={2}>
          One-hot result — Month-to-Month row: is_mtm=1, is_1yr=0, is_2yr=0
        </CalcStep>
        <CalcStep number={3}>
          One-hot result — One-Year row: is_mtm=0, is_1yr=1, is_2yr=0
        </CalcStep>
        <CalcStep number={4}>
          Target-encoding churn mean per contract: Month-to-Month → (1+1)/2 = 1.0,
          One-Year → 0/1 = 0.0, Two-Year → 0/1 = 0.0
        </CalcStep>
        <CalcStep number={5}>
          Target-encoded column values: Month-to-Month rows get 1.0; One-Year row gets 0.0;
          Two-Year row gets 0.0 — a single column that already encodes the full churn signal.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          One-hot gives the model freedom to assign independent weights to each contract type.
          Target encoding delivers pre-computed signal in one column but requires careful
          out-of-fold computation to avoid leakage.
        </p>
      </WorkedExample>
    </div>
  );
}
