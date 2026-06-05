'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Garbage In, Garbage Out">
        <p>
          Every machine learning model is only as good as the data it receives. Feed it raw, poorly
          structured inputs and even the most sophisticated algorithm will produce unreliable
          predictions. This idea has a name: <strong>&quot;garbage in, garbage out.&quot;</strong>
        </p>
        <p>
          Feature engineering is the craft of transforming raw data into informative inputs — the
          signal a model actually needs to learn from. It sits between data collection and model
          training, and it is often the single biggest lever you have for improving performance.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Our Two Running Examples">
        <p>
          Throughout this course we work with two concrete datasets so every technique stays
          grounded in reality.
        </p>
        <p>
          <strong>Tabular dataset — Customer Churn:</strong> Each row is a telecom subscriber.
          The columns include account age, monthly charges, number of support calls, contract
          type (month-to-month / one-year / two-year), and whether the customer eventually
          cancelled their subscription. Our goal is to predict churn before it happens.
        </p>
        <p>
          <strong>Text dataset — Product Reviews:</strong> Each row is a customer review of a
          product, labelled positive or negative. Our goal is to classify sentiment. This dataset
          lets us practise features that only exist in natural language.
        </p>
        <p>
          By the end of this course you&apos;ll have a feature-engineering toolkit you can apply to
          any new dataset — tabular, text, time series, or image.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Feature Engineering Covers">
        <p>
          The field breaks into three overlapping activities:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Feature Creation</strong> — inventing new columns from existing ones.
            For example, combining &quot;monthly charges&quot; and &quot;account age&quot; into
            &quot;total spend&quot;, or extracting the day-of-week from a timestamp.
          </li>
          <li>
            <strong>Feature Selection</strong> — deciding which columns to keep and which to
            discard. Irrelevant columns add noise; redundant columns waste compute and can confuse
            regularised models.
          </li>
          <li>
            <strong>Feature Extraction</strong> — automatically deriving compact representations
            from high-dimensional inputs, such as reducing 10,000 TF-IDF text dimensions down to
            50 principal components, or learning an embedding for each product category.
          </li>
        </ul>
        <p>
          Each activity is covered in its own module. Let&apos;s begin.
        </p>
      </ExplanationBox>
    </div>
  );
}
