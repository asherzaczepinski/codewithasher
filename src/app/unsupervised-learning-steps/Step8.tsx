'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

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

      <ExplanationBox title="In Python">
        <p>
          The snippet below shows two complementary approaches: (1) manual support/confidence
          calculation that mirrors the Apriori logic, and (2) sklearn&apos;s
          <code> TruncatedSVD</code> for sparse matrix factorization — the same idea that
          powers recommendation engines.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="associations_mf_demo.py"
        caption="Manual association-rule metrics clarify the math; TruncatedSVD shows how matrix factorization fills in missing ratings."
        code={`import numpy as np
from sklearn.decomposition import TruncatedSVD

# ---- Part 1: Association Rule Metrics (Apriori-style) ----

# Encode each transaction as a frozenset of item names.
transactions = [
    frozenset(["boots", "water_bottle"]),
    frozenset(["boots", "backpack"]),
    frozenset(["boots", "water_bottle", "backpack"]),
    frozenset(["tent", "sleeping_bag"]),
    frozenset(["water_bottle"]),
    frozenset(["boots"]),
    frozenset(["boots", "water_bottle", "tent"]),
    frozenset(["sleeping_bag", "tent"]),
    frozenset(["backpack"]),
    frozenset(["water_bottle", "backpack"]),
]

n = len(transactions)   # total number of transactions

def support(itemset):
    # Fraction of transactions that contain ALL items in itemset.
    count = sum(1 for t in transactions if itemset.issubset(t))
    return count / n

antecedent = frozenset(["boots"])
consequent = frozenset(["water_bottle"])
both       = antecedent | consequent   # union of the two sets

sup_A    = support(antecedent)
sup_B    = support(consequent)
sup_AB   = support(both)

# Confidence: given A is bought, how often is B also bought?
confidence = sup_AB / sup_A

# Lift: how much more likely is B given A, vs. B in any random transaction?
# Lift > 1 means the items are positively correlated.
lift = confidence / sup_B

print(f"Support(boots)         = {sup_A:.2f}")
print(f"Support(water_bottle)  = {sup_B:.2f}")
print(f"Support(both)          = {sup_AB:.2f}")
print(f"Confidence             = {confidence:.3f}")
print(f"Lift                   = {lift:.3f}")


# ---- Part 2: Matrix Factorization with TruncatedSVD ----

# User-item matrix (rows = users, columns = items).
# 0 means the user has not purchased/rated the item (missing, not zero preference).
R = np.array([
    [5, 4, 0, 0, 1],
    [4, 0, 0, 1, 2],
    [0, 0, 3, 4, 0],
    [0, 1, 4, 5, 0],
    [0, 0, 5, 4, 0],
], dtype=float)

# TruncatedSVD keeps only the top k singular values/vectors --
# much faster than full SVD and designed for sparse matrices.
# n_components: the rank k of the latent-factor representation.
k = 2
svd = TruncatedSVD(n_components=k, random_state=42)

# fit_transform gives us the user embeddings (U * Sigma), shape (users, k).
user_embeddings = svd.fit_transform(R)

# svd.components_ is Vt: item embeddings, shape (k, items).
item_embeddings = svd.components_

# Reconstruct the full matrix: predicted rating for every (user, item) pair.
R_approx = user_embeddings @ item_embeddings
print("Reconstructed ratings (rounded):")
print(R_approx.round(1))
# For user 0, column 2 was 0 (not purchased).
# R_approx[0, 2] is now a predicted preference score -- use this to rank
# unrated items and surface the top recommendations for that user.
`}
      />
    </div>
  );
}
