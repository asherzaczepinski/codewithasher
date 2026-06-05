'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Extraction vs Selection">
        <p>
          Feature <em>selection</em> picks a subset of the original columns and discards the rest.
          Feature <em>extraction</em> transforms the original columns into an entirely new, smaller
          set of columns — ones that may not correspond to any single original variable but that
          capture the most important variation in the data.
        </p>
        <p>
          Think of it this way: selection chooses which rooms of a house to keep; extraction
          rebuilds the house in a more compact floor plan that preserves the rooms you spent the
          most time in.
        </p>
        <p>
          Extraction is especially valuable when you have many correlated columns (e.g. hundreds
          of survey items that all measure &quot;customer satisfaction&quot;) or when the input is
          inherently high-dimensional (raw text, pixels, audio).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Principal Component Analysis (PCA)">
        <p>
          <strong>PCA</strong> is the classic extraction method for numerical data. It finds
          directions in the feature space — called <strong>principal components</strong> — along
          which the data varies the most, and projects every data point onto those directions.
        </p>
        <p>
          Each component is a weighted combination of all original features. The first component
          captures the most variance, the second captures the most of the remaining variance while
          being uncorrelated with the first, and so on.
        </p>
        <p>
          For our churn dataset, if monthly_charges, total_spend, and annual_revenue are all
          highly correlated, PCA might collapse them into a single &quot;billing intensity&quot;
          component that retains nearly all their information in one column.
        </p>
      </ExplanationBox>

      <MathFormula label="PCA projection (data matrix X, components matrix W)">
        Z = X &middot; W   where each column of W is a unit-length principal component direction
      </MathFormula>

      <ExplanationBox title="Embeddings as Feature Extraction">
        <p>
          For categorical columns with very high cardinality — thousands of product IDs, millions
          of user IDs — one-hot encoding is impractical and target encoding is fragile. The modern
          answer is an <strong>embedding</strong>: each category is mapped to a dense vector of
          real numbers (typically 8 to 256 dimensions) that is <em>learned</em> by the model.
        </p>
        <p>
          Categories that appear in similar contexts end up with similar embedding vectors. A
          product embedding might place &quot;running shoes&quot; and &quot;trail runners&quot;
          close together because customers who bought one often bought the other.
        </p>
        <p>
          In practice you can pre-train embeddings on a large dataset (e.g. using a language model
          for text categories) or learn them end-to-end as part of your main model. Once trained,
          you extract the embedding vector for each row and use those dense columns as features.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How Much to Compress?">
        <p>
          For PCA, a common heuristic is to keep enough components to explain 90–95% of the total
          variance. You can plot the <strong>explained variance ratio</strong> against the number
          of components (a &quot;scree plot&quot;) and look for the elbow — the point where adding
          one more component stops buying much variance.
        </p>
        <p>
          For embeddings, dimension is usually chosen empirically: start with the fourth root of
          the number of unique categories as a rough guide, then tune on a validation set. A
          customer-ID embedding for 10,000 users might start at around 10 dimensions.
        </p>
        <p>
          Both methods trade a small amount of information for large gains in training speed,
          reduced overfitting, and better generalisation — especially when data is limited.
        </p>
      </ExplanationBox>
    </div>
  );
}
