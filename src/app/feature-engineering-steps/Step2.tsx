'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Why Create New Features at All?">
        <p>
          Raw columns rarely tell the full story. A model seeing &quot;monthly charges = $85&quot;
          and &quot;account age = 3 months&quot; separately cannot easily discover that a customer
          who has paid $255 total in 3 months is very different from one who has paid $255 over
          24 months — yet that difference might be the strongest churn signal in the dataset.
        </p>
        <p>
          Feature creation surfaces relationships that would otherwise require the model to learn
          a complex, multi-step interaction on its own — which it may never do with limited data.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Interaction Terms">
        <p>
          An <strong>interaction term</strong> is the product (or ratio, or difference) of two
          existing columns. It lets a linear model capture the idea that the effect of one variable
          depends on another.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>total_spend</strong> = monthly_charges &times; account_age_months
          </li>
          <li>
            <strong>charge_per_call</strong> = monthly_charges / (support_calls + 1)
            — a high charge with many support calls is a very different risk profile than a high
            charge with no calls.
          </li>
          <li>
            <strong>calls_per_month</strong> = support_calls / account_age_months
            — rate matters more than raw count.
          </li>
        </ul>
        <p>
          The &quot;+ 1&quot; in the denominator is a common trick to avoid division by zero
          without distorting values much when the denominator is large.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Polynomial Features">
        <p>
          Sometimes the relationship between a feature and the target is curved rather than
          straight. <strong>Polynomial features</strong> add powers of existing columns so a
          linear model can fit those curves.
        </p>
        <p>
          For a single feature x, degree-2 polynomial features give us x and x&sup2;. For two
          features x and y, degree-2 expansion gives x, y, x&sup2;, xy, and y&sup2;.
        </p>
      </ExplanationBox>

      <MathFormula label="Degree-2 polynomial expansion (two features x, y)">
        (x, y) → (x, y, x&sup2;, x&middot;y, y&sup2;)
      </MathFormula>

      <WorkedExample title="Polynomial Feature Example">
        <p>
          Suppose we suspect churn rate curves upward with monthly charges: modest bills are fine,
          but very high bills dramatically increase churn. We add a squared term.
        </p>
        <CalcStep number={1}>
          Original feature: monthly_charges = 85
        </CalcStep>
        <CalcStep number={2}>
          Squared feature: monthly_charges_sq = 85 &times; 85 = 7225
        </CalcStep>
        <CalcStep number={3}>
          The model can now learn a coefficient for monthly_charges_sq that captures the
          accelerating effect of higher bills without forcing a straight-line relationship.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Be careful with polynomial features: degree-3 or higher with many columns
          explodes the feature count and risks overfitting. Always pair them with regularisation
          or feature selection.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          The code below shows how to build interaction terms by hand and then use
          sklearn&apos;s <strong>PolynomialFeatures</strong> to generate all degree-2
          combinations automatically.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="features.py"
        caption="Crafting interaction terms manually, then using PolynomialFeatures for the full degree-2 expansion."
        code={`import pandas as pd
from sklearn.preprocessing import PolynomialFeatures

# ── Sample churn data ──────────────────────────────────────────────────────
# Each row is one customer with three raw numeric columns.
df = pd.DataFrame({
    "monthly_charges":    [85, 45, 120, 30],
    "account_age_months": [3,  24,  12,  36],
    "support_calls":      [5,   1,   8,   0],
})

# ── Hand-crafted interaction terms ─────────────────────────────────────────

# total_spend captures how much the customer has paid over their lifetime.
# A high monthly charge over a short tenure is a very different risk profile
# from the same charge spread over two years.
df["total_spend"] = df["monthly_charges"] * df["account_age_months"]

# Dividing by (support_calls + 1) avoids ZeroDivisionError while keeping
# the scale reasonable when call counts are large.
# A premium customer who never calls support is low-churn risk;
# one paying the same and calling 8 times is very high risk.
df["charge_per_call"] = df["monthly_charges"] / (df["support_calls"] + 1)

# Rate is more meaningful than raw count: someone on the platform 3 months
# with 5 calls is much more frustrated than someone with 5 calls over 3 years.
df["calls_per_month"] = df["support_calls"] / df["account_age_months"]

print("After hand-crafted features:")
print(df[["total_spend", "charge_per_call", "calls_per_month"]])

# ── Automated degree-2 expansion with PolynomialFeatures ──────────────────

# Select the two columns we want to expand.
# include_bias=False omits the constant 1 column sklearn adds by default.
# interaction_only=False means we also get squared terms (x^2, y^2).
poly = PolynomialFeatures(degree=2, include_bias=False, interaction_only=False)

# Fit and transform: returns a NumPy array, so we wrap it in a DataFrame
# and give the columns descriptive names from poly.get_feature_names_out().
raw_cols = ["monthly_charges", "account_age_months"]
expanded = poly.fit_transform(df[raw_cols])
feature_names = poly.get_feature_names_out(raw_cols)

df_poly = pd.DataFrame(expanded, columns=feature_names)

# The resulting columns will be:
#   monthly_charges, account_age_months,   <- originals kept
#   monthly_charges^2,                     <- squared term
#   monthly_charges account_age_months,    <- cross term (same as total_spend)
#   account_age_months^2                   <- squared term
print("Polynomial feature names:", list(feature_names))
print(df_poly)
`}
      />

      <ExplanationBox title="Domain-Driven Features">
        <p>
          The most valuable features often come from subject-matter knowledge, not automated
          expansion. For our churn dataset, a domain expert might suggest:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>is_month_to_month</strong> — a binary flag derived from the contract_type
            column. Month-to-month customers are far easier to churn; a simple flag encodes this
            business insight cleanly.
          </li>
          <li>
            <strong>days_since_last_call</strong> — if the dataset includes a call log timestamp,
            deriving recency is more informative than the raw date.
          </li>
          <li>
            <strong>high_support_user</strong> — a binary flag for customers with more than
            3 support calls per month, capturing a known churn risk segment.
          </li>
        </ul>
        <p>
          Domain features translate business logic directly into the model, which is often faster
          and more reliable than hoping the algorithm discovers the same pattern from scratch.
        </p>
      </ExplanationBox>
    </div>
  );
}
