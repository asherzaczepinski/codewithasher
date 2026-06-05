'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="A Real Goal Is Not Yet an ML Problem">
        <p>
          Alex&apos;s manager says: &quot;We want to help buyers know how much a house is worth.&quot;
          That is a real goal. But it is not yet an ML problem. Before writing a single line of
          code, Alex has to answer four questions precisely:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>What exactly do we want the model to <strong>predict</strong>?</li>
          <li>What <strong>inputs</strong> will it receive at prediction time?</li>
          <li>How do we measure whether it <strong>succeeds</strong>?</li>
          <li>Is this <strong>regression</strong> or <strong>classification</strong>?</li>
        </ul>
        <p>
          Skipping this step is the single most common reason first ML projects fail. You can
          build a technically correct model that answers the wrong question.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Regression vs Classification — The Fundamental Fork">
        <p>
          Every supervised ML problem falls into one of two buckets based on the type of output
          you want.
        </p>
        <p>
          <strong>Regression</strong> — the output is a continuous number. There is no discrete
          list of possible answers; the model outputs a value anywhere on the real number line
          (or some subset of it). Predicting house prices is regression: the answer could be
          $189,000 or $312,750 or any other dollar amount.
        </p>
        <p>
          <strong>Classification</strong> — the output is a category chosen from a fixed set.
          Classifying an email is classification: the answer is exactly one of two options,
          &quot;spam&quot; or &quot;not spam.&quot; A model diagnosing a skin lesion picks from
          a fixed list of conditions. A model recognizing handwritten digits outputs one of
          ten possible classes (0 through 9).
        </p>
        <p>
          This distinction matters because the two problems use different loss functions, different
          output layers, and are evaluated with different metrics. Getting it wrong from the start
          means rebuilding from scratch.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Choosing the Target">
        <p>
          The <strong>target</strong> (also called the label or output) is the specific quantity
          you want the model to learn to predict. Choosing the right target is harder than it
          sounds.
        </p>
        <p>
          For Alex&apos;s house price project, there are actually several candidate targets:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li><strong>The raw sale price in dollars</strong> — straightforward, but house prices span a huge range and are skewed (a few very expensive homes pull the average up). Models often struggle with heavily skewed targets.</li>
          <li><strong>The log of the sale price</strong> — a common transformation that compresses the range and makes the distribution more symmetric. Many practitioners predict log(price) and then exponentiate the output.</li>
          <li><strong>Price per square foot</strong> — normalizes by size, which might be more useful for comparing different houses.</li>
        </ul>
        <p>
          Alex chooses to predict the raw sale price for simplicity, and notes that log-transforming
          the target is an improvement worth trying later. The point is that this is a
          <em> deliberate decision</em>, not an afterthought.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Does Success Look Like?">
        <p>
          Before training, decide how you will measure whether the model is good enough to use.
          This is your <strong>success metric</strong>, and it should be chosen to match the
          business goal — not just what is mathematically convenient.
        </p>
        <p>
          For the house price model (regression), a natural metric is <strong>Mean Absolute
          Error (MAE)</strong>: on average, how many dollars off is the prediction? If buyers
          are comfortable with predictions accurate to within $15,000, then a model with MAE of
          $12,000 is a success and one with MAE of $40,000 is not.
        </p>
        <p>
          For the spam classifier (classification), a natural metric is <strong>accuracy</strong>:
          what fraction of emails are classified correctly? But accuracy alone can be misleading —
          if only 1% of emails are spam, a model that calls everything &quot;not spam&quot; would
          have 99% accuracy while being completely useless. Alex also tracks <strong>precision</strong>
          (of emails flagged spam, how many actually are?) and <strong>recall</strong> (of all
          actual spam, how many did we catch?).
        </p>
        <p>
          Defining success upfront keeps the project honest. It also tells you when to stop
          iterating.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Inputs Will Be Available at Prediction Time?">
        <p>
          A critical constraint that is easy to overlook: the model can only use information that
          will genuinely be available when it makes a prediction. For Alex&apos;s house price
          model, the final sale price is obviously not available at prediction time — that is what
          we are trying to predict. But neither is anything that requires knowing the answer first.
        </p>
        <p>
          Alex will have: square footage, number of bedrooms and bathrooms, neighborhood, year
          built, lot size, and perhaps recent sale prices of comparable homes nearby. These are
          all observable before a sale.
        </p>
        <p>
          This constraint connects directly to data leakage — a danger we cover in depth in the
          Data Splits module. For now, the principle is simple: <strong>if you would not have
          this information in the real world at the moment of prediction, do not use it as an
          input.</strong>
        </p>
      </ExplanationBox>
    </div>
  );
}
