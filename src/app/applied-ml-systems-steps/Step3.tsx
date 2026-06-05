'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="What Makes These Domains Structurally Different">
        <p>
          Time series, recommender systems, search ranking, and fraud detection all look like
          classification or regression on the surface. But each has a structural property that
          changes everything about how you collect data, choose metrics, and evaluate models.
          Ignoring these properties is how most applied ML projects fail quietly.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Time-Series Forecasting">
        <p>
          <strong>Typical task:</strong> predict a future value — tomorrow&apos;s electricity demand,
          next week&apos;s product sales, the number of API requests in the next five minutes.
        </p>
        <p>
          <strong>What makes it unique: temporal order.</strong> In an image dataset, shuffling
          the training examples is fine — a dog photo from 2020 and one from 2023 are equally
          valid. In a time series, shuffling destroys the signal. The model must respect causality:
          it can only use information available before the forecast point. This means your train/val
          split must be a time cut, never a random split. Evaluating on randomly held-out timesteps
          lets the model cheat by interpolating between future data points it has already seen.
        </p>
        <p>
          <strong>Data:</strong> sequences of (timestamp, value) pairs, often with multiple
          correlated series (multivariate time series). Common features include lags (the value
          N steps ago), rolling statistics (mean, variance over a trailing window), and calendar
          features (hour of day, day of week, is-holiday).
        </p>
        <p>
          <strong>Core models:</strong> classical ARIMA and Exponential Smoothing work well for
          stationary series with few data points. For large datasets, gradient-boosted trees with
          lag features (LightGBM, XGBoost) are often the most practical choice. Deep learning
          models (N-BEATS, Temporal Fusion Transformer, PatchTST) outperform on complex
          multivariate series with thousands of correlated streams.
        </p>
        <p>
          <strong>Key metric:</strong> MAPE (mean absolute percentage error) is intuitive but
          breaks when the true value is near zero. MAE and RMSE are safer. For probabilistic
          forecasts, use pinball loss or CRPS.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Recommender Systems">
        <p>
          <strong>Typical task:</strong> rank items (products, videos, songs, articles) for a
          user based on their past behavior and the behavior of similar users.
        </p>
        <p>
          <strong>What makes it unique: implicit feedback.</strong> Users rarely tell you what
          they dislike. You observe clicks, purchases, watch time, and scrolls — all positive
          signals, or at best ambiguous ones. A user who did not click on a product might have
          never seen it, seen it and been uninterested, or seen it and planned to buy it later.
          This is the fundamental challenge of collaborative filtering: learning from the absence
          of interaction.
        </p>
        <p>
          <strong>Data:</strong> a sparse user-item interaction matrix. With 10 million users and
          1 million items, the full matrix has 10 trillion cells but only millions of observed
          interactions — a sparsity of 99.999%+. The cold-start problem arises when a new user or
          new item has no interactions at all.
        </p>
        <p>
          <strong>Core models:</strong> matrix factorization (learned user and item embeddings
          whose dot product predicts affinity), two-tower neural networks (separate encoders for
          user and item, trained with in-batch negatives), and session-based models (Transformers
          over the recent interaction sequence for short-session contexts).
        </p>
      </ExplanationBox>

      <ExplanationBox title="Search Ranking">
        <p>
          <strong>Typical task:</strong> given a query and a candidate set of documents or products,
          order them so the most relevant result appears first.
        </p>
        <p>
          <strong>What makes it unique: ranking metrics, not accuracy.</strong> The model&apos;s job
          is not to predict a binary relevant/not-relevant label — it&apos;s to produce a ranking
          where relevant items appear before irrelevant ones. This requires metrics like NDCG
          (Normalized Discounted Cumulative Gain), which rewards putting relevant items at the top
          of the list.
        </p>
        <MathFormula label="NDCG at k">
          NDCG@k = DCG@k / IDCG@k, where DCG@k = sum over i from 1 to k of: rel_i / log2(i + 1)
        </MathFormula>
        <p>
          In practice, ranking is implemented in stages: a fast retrieval step (ANN search, BM25)
          reduces a corpus of millions to hundreds of candidates, then a more expensive re-ranking
          model (LambdaMART, a cross-encoder Transformer) scores those candidates carefully.
          Training uses pairwise or listwise losses that directly optimize ranking quality.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Fraud Detection">
        <p>
          <strong>Typical task:</strong> classify a transaction as fraudulent or legitimate in
          real time (typically under 100 ms) at the point of payment.
        </p>
        <p>
          <strong>What makes it unique: extreme class imbalance.</strong> Fraud rates are often
          0.1% to 1% of transactions. A model that predicts &quot;not fraud&quot; for everything achieves
          99%+ accuracy — and is completely useless. Precision and recall on the fraud class are
          the meaningful metrics, with the operating point chosen by the business based on
          acceptable false-positive rates (blocking legitimate customers is costly).
        </p>
        <p>
          <strong>Handling imbalance:</strong> oversampling the minority class (SMOTE), undersampling
          the majority class, or using a weighted loss function (penalize false negatives more than
          false positives). The right choice depends on how much data you have and how severe the
          imbalance is.
        </p>
        <p>
          <strong>Feature engineering matters enormously here.</strong> Raw transaction features
          (amount, merchant, time) are weak signals alone. Aggregated behavioral features — the
          number of transactions in the past hour for this card, the velocity of spend across
          merchants, whether the device IP matches the card&apos;s country — dramatically improve
          detection. This is why fraud detection is as much a feature engineering problem as a
          modelling problem.
        </p>
      </ExplanationBox>
    </div>
  );
}
