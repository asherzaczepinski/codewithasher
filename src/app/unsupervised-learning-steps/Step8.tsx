'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="Association Rule Mining">
        <p>
          Imagine scanning 50,000 customer receipts. Which products tend to appear together?
          <strong> Association rule mining</strong> finds rules of the form
          &quot;if a customer buys X, they often also buy Y.&quot; The classic application is
          market-basket analysis, but the same machinery applies to web clickstreams,
          medical co-diagnoses, and playlist generation.
        </p>
        <p>
          A rule is written as: antecedent (A) implies consequent (B), or A =&gt; B.
          Three metrics determine whether a rule is useful:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Support</strong> — the fraction of all transactions that contain both
            A and B. Low support means the combination is too rare to act on.
          </li>
          <li>
            <strong>Confidence</strong> — of all transactions containing A, the fraction
            that also contain B. High confidence means the rule fires reliably.
          </li>
          <li>
            <strong>Lift</strong> — confidence divided by the baseline probability of B.
            Lift &gt; 1 means A and B co-occur more than chance; lift = 1 means they are
            independent. Lift is the key metric: a high-confidence rule with lift near 1
            is useless because B was already likely without A.
          </li>
        </ul>
      </ExplanationBox>

      <MathFormula label="Association rule metrics">
        Support(A =&gt; B) = count(A and B) / total transactions
        Confidence(A =&gt; B) = Support(A and B) / Support(A)
        Lift(A =&gt; B) = Confidence(A =&gt; B) / Support(B)
      </MathFormula>

      <WorkedExample title="Computing Lift for a Product Pair">
        <p>
          Dataset: 10,000 transactions. We examine the rule:
          &quot;hiking boots =&gt; water bottle.&quot;
        </p>
        <CalcStep number={1}>
          Transactions with hiking boots: 800. Support(boots) = 800 / 10000 = 0.08
        </CalcStep>
        <CalcStep number={2}>
          Transactions with water bottles: 2000. Support(bottle) = 2000 / 10000 = 0.20
        </CalcStep>
        <CalcStep number={3}>
          Transactions with both: 300. Support(boots and bottle) = 300 / 10000 = 0.03
        </CalcStep>
        <CalcStep number={4}>
          Confidence(boots =&gt; bottle) = 0.03 / 0.08 = 0.375
          (37.5% of boot buyers also buy a water bottle)
        </CalcStep>
        <CalcStep number={5}>
          Lift = 0.375 / 0.20 = 1.875
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Lift of 1.875 means boot buyers are 87.5% more likely to buy a water bottle than
          a random customer. This rule is actionable: show a water bottle recommendation on
          the boots product page. The Apriori or FP-Growth algorithms automate finding all
          such rules above a chosen support and confidence threshold.
        </p>
      </WorkedExample>

      <ExplanationBox title="Matrix Factorization for Recommendations">
        <p>
          The customer-product purchase matrix is sparse — most customers buy only a tiny
          fraction of all products. <strong>Matrix factorization</strong> fills in the gaps
          by decomposing the matrix into two low-rank factor matrices.
        </p>
        <p>
          If the full matrix R has shape (users x items), we approximate it as:
        </p>
      </ExplanationBox>

      <MathFormula label="Matrix factorization">
        R ≈ P * Q^T    where P has shape (users x k) and Q has shape (items x k)
      </MathFormula>

      <ExplanationBox title="Latent Factors">
        <p>
          Each row of P is a <strong>user embedding</strong> — a k-dimensional vector
          capturing that user&apos;s latent preferences (e.g., &quot;prefers outdoor gear,&quot;
          &quot;values premium brands&quot;). Each row of Q is an <strong>item embedding</strong>
          capturing the item&apos;s latent profile. The predicted rating for user u and
          item i is simply the dot product of their embedding vectors: P_u dot Q_i.
        </p>
        <p>
          The embeddings are learned by minimizing the reconstruction error on observed
          entries — typically with stochastic gradient descent or alternating least squares.
          After training, we recommend to user u the items i with the highest P_u dot Q_i
          among items u has not yet purchased.
        </p>
        <p>
          This is the engine behind Netflix, Spotify, and Amazon recommendations. SVD
          (from the previous module) provides a clean closed-form matrix factorization
          when the matrix is fully observed; for sparse observed-only matrices,
          gradient-based factorization is used instead.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Topic Modeling with LDA">
        <p>
          <strong>Latent Dirichlet Allocation (LDA)</strong> applies the matrix-factorization
          idea to text. Each document is modeled as a mixture of latent topics, and each
          topic is a distribution over words. LDA discovers both the topics and each
          document&apos;s topic proportions simultaneously, using a Bayesian generative model
          fit with variational inference or Gibbs sampling. In a corpus of customer reviews,
          LDA might automatically discover topics like &quot;shipping complaints,&quot;
          &quot;product quality praise,&quot; and &quot;price sensitivity&quot; without
          any human labeling — the same unsupervised spirit that runs through this entire course.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Wrapping Up: The Unsupervised Toolkit">
        <p>
          You have now surveyed the full landscape of unsupervised learning. The key insight
          is that all these methods share one goal: <strong>find structure the data itself
          reveals</strong>, without relying on human-provided labels.
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Clustering</strong> (k-means, k-medoids, hierarchical, DBSCAN, GMM) — group similar points.
          </li>
          <li>
            <strong>Dimensionality reduction</strong> (PCA/SVD, t-SNE, UMAP) — compress to meaningful low-dimensional representations.
          </li>
          <li>
            <strong>Anomaly detection</strong> (distance, LOF, Isolation Forest, autoencoders) — find the unusual.
          </li>
          <li>
            <strong>Association and factorization</strong> (Apriori, FP-Growth, matrix factorization, LDA) — discover co-occurrence patterns and latent factors.
          </li>
        </ul>
        <p>
          No method is universally best. The choice depends on data geometry, dataset size,
          interpretability requirements, and whether you expect overlapping groups, arbitrary
          shapes, outliers, or latent factors. Understanding all of them — which you now
          do — is what lets you pick the right tool for each new dataset you encounter.
        </p>
      </ExplanationBox>

    </div>
  );
}
