'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="How Data Is Organized">
        <p>
          ML datasets almost always arrive as a table. Each <strong>row</strong> is one
          independent observation — one past house sale, one email, one patient visit. Rows are
          also called <strong>examples</strong>, <strong>samples</strong>, or{' '}
          <strong>instances</strong>. Each <strong>column</strong> is one piece of information
          measured for that observation. Columns are called <strong>features</strong> (or
          sometimes <strong>attributes</strong> or <strong>covariates</strong>).
        </p>
        <p>
          Alex&apos;s house dataset might look like this:
        </p>
        <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f0f4ff' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'left' }}>sqft</th>
                <th style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'left' }}>bedrooms</th>
                <th style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'left' }}>neighborhood</th>
                <th style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'left' }}>year_built</th>
                <th style={{ border: '1px solid #ccc', padding: '8px 12px', textAlign: 'left' }}>sale_price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>1400</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>3</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>Eastside</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>1998</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>$245,000</td>
              </tr>
              <tr style={{ background: '#fafafa' }}>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>2100</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>4</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>Westwood</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>2005</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>$389,000</td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>980</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>2</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>Eastside</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>1975</td>
                <td style={{ border: '1px solid #ccc', padding: '8px 12px' }}>$198,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '0.75rem' }}>
          The first four columns are <strong>features</strong>. The last column —
          <em>sale_price</em> — is the <strong>label</strong> (also called the <strong>target</strong>).
          It is the thing we are trying to predict.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Features: What the Model Sees">
        <p>
          Features are the inputs the model uses to make its prediction. Choosing good features
          is one of the highest-leverage things you can do in an ML project — a simple model with
          excellent features will almost always outperform a complex model with poor features.
        </p>
        <p>
          Features come in two broad types:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Numerical features</strong> — numbers that can be used directly in arithmetic.
            Square footage (1400), year built (1998), and number of bedrooms (3) are all numerical.
          </li>
          <li>
            <strong>Categorical features</strong> — values from a finite set of categories.
            Neighborhood (&quot;Eastside,&quot; &quot;Westwood&quot;) is categorical. So is the
            spam label (&quot;spam,&quot; &quot;not spam&quot;). Most ML models require categorical
            features to be converted into numbers before training — we cover how in the Preprocessing
            module.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Labels: What the Model Learns to Predict">
        <p>
          In supervised learning, every training example carries a <strong>label</strong> — the
          known correct answer that the model is trained to produce. For Alex&apos;s house dataset,
          the label is <em>sale_price</em>. For the spam dataset, the label is a binary flag:
          1 for spam, 0 for not spam.
        </p>
        <p>
          The label is only available in the training data. At deployment, Alex receives a house
          description and no label — the whole point is that the model predicts the label for
          new examples it has never seen.
        </p>
      </ExplanationBox>

      <MathFormula label="Feature Matrix X and Label Vector y">
        X: matrix of shape (n_samples, n_features) — each row is one example, each column is one feature.
        y: vector of length n_samples — the label for each example.
        Goal: learn a function f such that f(X_i) ≈ y_i for all examples i.
      </MathFormula>

      <ExplanationBox title="Thinking in Matrices">
        <p>
          The notation X and y is universal in ML. When Alex loads her house dataset, the result
          is:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>X</strong> — a matrix with one row per house and one column per feature. If
            there are 5,000 past sales and 4 features, X has shape (5000, 4). X[i] is the feature
            vector for house i.
          </li>
          <li>
            <strong>y</strong> — a vector with one entry per house: the sale price. y[i] is the
            actual price house i sold for.
          </li>
        </ul>
        <p>
          Training a model means finding a function f where f(X[i]) is close to y[i] for every
          row i in the training set — and, crucially, for rows the model has never seen before.
          That generalization to new data is what separates a useful model from a memorized lookup
          table.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Feature Engineering: Making Features More Useful">
        <p>
          Raw columns are not always the best features. <strong>Feature engineering</strong> is
          the craft of creating new features from existing ones that make patterns easier for
          the model to learn.
        </p>
        <p>
          A few examples from Alex&apos;s house dataset:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <em>age</em> = current year minus <em>year_built</em>. A model often learns
            &quot;older houses are cheaper&quot; more easily from a direct age number than from
            computing it implicitly from a year.
          </li>
          <li>
            <em>price_per_sqft</em> of nearby recent sales is a strong signal — houses rarely
            diverge much from their neighbors.
          </li>
          <li>
            For the email classifier: the <em>number of capital letters</em> or the{' '}
            <em>presence of certain trigger words</em> can be derived features that help the
            model distinguish spam.
          </li>
        </ul>
        <p>
          Good feature engineering requires domain knowledge and curiosity. It remains one of the
          most human-driven — and most impactful — parts of the ML workflow.
        </p>
      </ExplanationBox>
    </div>
  );
}
