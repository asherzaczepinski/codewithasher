'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Why Raw Features Often Do Not Work Directly">
        <p>
          Most ML algorithms are sensitive to the numerical scale of their inputs. If <em>sqft</em>{' '}
          ranges from 320 to 8,400 while <em>bedrooms</em> ranges from 1 to 8, a model may
          treat <em>sqft</em> as more important simply because its numbers are bigger — not because
          it actually predicts price better. Preprocessing fixes this.
        </p>
        <p>
          Beyond scale, ML models cannot handle raw strings like &quot;Eastside&quot; or
          &quot;Westwood&quot; — they need numbers. And text features like email bodies need to
          be transformed into numerical representations before any algorithm can use them.
          Preprocessing covers all of this.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Min-Max Normalization">
        <p>
          <strong>Min-max normalization</strong> (also called min-max scaling) transforms a
          feature so that its values fall in the range [0, 1]. The minimum of the training set
          maps to 0, the maximum maps to 1, and everything else scales linearly in between.
        </p>
        <p>
          It is a good default when the feature does not have extreme outliers and you want
          values bounded to a known range.
        </p>
      </ExplanationBox>

      <MathFormula label="Min-Max Normalization">
        x_scaled = (x - x_min) / (x_max - x_min)
      </MathFormula>

      <WorkedExample title="Normalizing sqft">
        <p>
          In Alex&apos;s training set, <em>sqft</em> ranges from 320 to 8,400.
          She needs to normalize a new house with sqft = 1,400.
        </p>
        <CalcStep number={1}>x = 1,400; x_min = 320; x_max = 8,400</CalcStep>
        <CalcStep number={2}>Numerator: 1,400 - 320 = 1,080</CalcStep>
        <CalcStep number={3}>Denominator: 8,400 - 320 = 8,080</CalcStep>
        <CalcStep number={4}>x_scaled = 1,080 / 8,080 = 0.134</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A house of 1,400 sqft maps to 0.134 — near the low end of the range, which is correct.
          A house of 8,400 sqft would map to 1.0; a house of 320 sqft would map to 0.0.
        </p>
      </WorkedExample>

      <ExplanationBox title="Standardization (Z-Score Scaling)">
        <p>
          <strong>Standardization</strong> transforms a feature so it has mean 0 and standard
          deviation 1. Unlike min-max normalization, it does not bound values to [0, 1] — an
          outlier far from the mean will still land far from 0 after standardization.
        </p>
        <p>
          Standardization is preferred when the feature has outliers (which would compress all
          other values into a tiny range under min-max), or when the algorithm assumes
          approximately Gaussian inputs (logistic regression, SVMs, neural networks often
          benefit from this assumption).
        </p>
      </ExplanationBox>

      <MathFormula label="Standardization (Z-Score)">
        x_scaled = (x - mean) / std
      </MathFormula>

      <WorkedExample title="Standardizing sale_price">
        <p>
          In the training set, <em>sale_price</em> has mean $287,000 and standard deviation $94,000.
          What is the standardized value for a house that sold at $389,000?
        </p>
        <CalcStep number={1}>x = 389,000; mean = 287,000; std = 94,000</CalcStep>
        <CalcStep number={2}>Numerator: 389,000 - 287,000 = 102,000</CalcStep>
        <CalcStep number={3}>x_scaled = 102,000 / 94,000 = 1.085</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          A z-score of 1.085 means this house sold for about 1.1 standard deviations above the
          average. A z-score near 0 is an average house; above 2 or below -2 is unusual.
        </p>
      </WorkedExample>

      <ExplanationBox title="Critical Rule: Fit on Train, Transform Everywhere">
        <p>
          Whether you use normalization or standardization, the statistics that define the
          transformation (min/max, or mean/std) must be computed on the <strong>training set
          only</strong>. You then apply those same statistics to normalize or standardize the
          validation and test sets.
        </p>
        <p>
          If you compute statistics on the full dataset including test data, you leak test
          information into your preprocessing — a form of data leakage. The test set must be
          treated as if it does not exist until final evaluation.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Categorical Encoding: One-Hot and Ordinal">
        <p>
          The <em>neighborhood</em> feature takes values like &quot;Eastside,&quot;
          &quot;Westwood,&quot; and &quot;Downtown.&quot; ML models need numbers. Two main
          approaches:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>One-hot encoding</strong> — create one binary column per category. A house
            in Eastside gets [1, 0, 0]; a Westwood house gets [0, 1, 0]; a Downtown house gets
            [0, 0, 1]. There is no implied ordering or distance between categories. This is the
            right choice when the categories have no meaningful order. Downside: if there are
            hundreds of neighborhoods, you get hundreds of new columns (called the
            &quot;high-cardinality&quot; problem).
          </li>
          <li>
            <strong>Ordinal encoding</strong> — assign each category an integer (Eastside = 0,
            Westwood = 1, Downtown = 2). Compact, but implies an ordering that may not exist.
            Use this only when the order is genuinely meaningful (e.g., quality ratings like
            Poor = 0, Fair = 1, Good = 2, Excellent = 3).
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Text Preprocessing Basics">
        <p>
          For Alex&apos;s spam classifier, the input is an email body — raw text. Before any
          model can use it, the text needs to be transformed into numbers. A standard pipeline:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Lowercasing</strong> — &quot;FREE&quot; and &quot;free&quot; should be the
            same word. Converting everything to lowercase is almost always the right first step.
          </li>
          <li>
            <strong>Tokenization</strong> — splitting the text into individual words (tokens).
            &quot;Win a free prize!&quot; becomes [&quot;win&quot;, &quot;a&quot;,
            &quot;free&quot;, &quot;prize&quot;].
          </li>
          <li>
            <strong>Removing stop words</strong> — very common words like &quot;a,&quot;
            &quot;the,&quot; &quot;is&quot; carry little information and can be removed to reduce
            noise.
          </li>
          <li>
            <strong>Bag of Words / TF-IDF</strong> — convert the token list into a numerical
            vector. In a bag-of-words representation, each position in the vector corresponds to
            a word in the vocabulary, and the value is how many times that word appeared.
            TF-IDF (Term Frequency-Inverse Document Frequency) weights words by how distinctive
            they are — common words get downweighted even if they appear often.
          </li>
        </ul>
        <p>
          Modern deep learning approaches (transformers) learn their own text representations
          end-to-end, bypassing most of these steps. But for classical ML classifiers, this
          pipeline is still standard and works well.
        </p>
      </ExplanationBox>
    </div>
  );
}
