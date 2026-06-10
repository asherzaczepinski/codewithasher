'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="Learning Without a Teacher">
        <p>
          In supervised learning every training example comes with a label — &quot;spam&quot; or
          &quot;not spam,&quot; &quot;cat&quot; or &quot;dog.&quot; The model learns to predict
          those labels. But most data in the world arrives <em>without labels</em>. Labeling
          is expensive, slow, and sometimes impossible. Unsupervised learning is how we
          extract knowledge from that vast unlabeled majority.
        </p>
        <p>
          Instead of predicting a target, an unsupervised algorithm asks a simpler question:{' '}
          <strong>what patterns, groups, or structure live inside this data?</strong> The
          answer can be just as valuable as any prediction.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: An Unlabeled Customer Dataset">
        <p>
          Throughout this course we work with one concrete scenario. Imagine a retailer
          that has collected purchase histories, browsing behavior, and demographic signals
          for 50,000 customers. Nobody has gone through and tagged each customer as
          &quot;bargain hunter&quot; or &quot;luxury buyer.&quot; The data simply sits there,
          unlabeled, full of potential structure.
        </p>
        <p>
          Every algorithm we study will be illustrated by what it reveals — or fails to
          reveal — in this customer dataset.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Unsupervised Learning Can Find">
        <p>
          There are four broad things unsupervised methods hunt for:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Groups (clusters)</strong> — customers who behave similarly enough to
            treat as a segment. Useful for targeted marketing, recommendation engines, and
            product design.
          </li>
          <li>
            <strong>Low-dimensional structure</strong> — the data may live in 200 dimensions
            (one per product category purchased) but the meaningful variation might be
            captured in just 5. Dimensionality reduction finds those 5.
          </li>
          <li>
            <strong>Anomalies</strong> — the one customer out of 50,000 whose behavior is
            so unusual it could be fraud, a data-entry error, or a genuinely interesting
            outlier worth investigating.
          </li>
          <li>
            <strong>Associations</strong> — rules like &quot;customers who buy hiking boots
            also tend to buy water bottles.&quot; These co-occurrence patterns power
            market-basket analysis and recommendation systems.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Course Roadmap">
        <p>
          This course covers the full landscape of unsupervised learning across two parts:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Part 1 — Clustering:</strong> centroid methods (k-means recap and
            k-medoids), hierarchical clustering and DBSCAN, and probabilistic soft
            clustering with Gaussian Mixture Models and the EM algorithm.
          </li>
          <li>
            <strong>Part 2 — Reducing and Discovering Structure:</strong> PCA and the
            Singular Value Decomposition that underlies it, nonlinear visualization with
            t-SNE and UMAP, anomaly detection methods, and finally association rule mining
            plus matrix factorization for recommendations.
          </li>
        </ul>
        <p>
          Separate dedicated courses on k-means and PCA already exist on this platform;
          here we recap each in one focused paragraph and then push well beyond them.
          No supervised-learning background is assumed — only a comfort with basic algebra.
        </p>
      </ExplanationBox>
    </div>
  );
}
