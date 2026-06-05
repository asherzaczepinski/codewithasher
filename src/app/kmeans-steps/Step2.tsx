'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Supervised Learning: Learning From Labels">
        <p>
          In <strong>supervised learning</strong> every training example comes with a correct answer
          attached — the label. A spam filter learns from thousands of emails that a human has
          already marked &quot;spam&quot; or &quot;not spam.&quot; A house-price model learns from
          listings where the actual sale price is known.
        </p>
        <p>
          The algorithm&apos;s job is simple to state: find the pattern that maps inputs to labels
          as accurately as possible. The labels are the teacher.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>Email classification — input: email text; label: spam / not spam</li>
          <li>Image recognition — input: pixel values; label: &quot;cat&quot; / &quot;dog&quot;</li>
          <li>Price prediction — input: house features; label: sale price</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Unsupervised Learning: No Labels, No Problem">
        <p>
          <strong>Unsupervised learning</strong> strips the labels away entirely. You hand the
          algorithm raw data — just the inputs — and ask it to discover whatever structure is hiding
          inside.
        </p>
        <p>
          There is no &quot;right answer&quot; baked into the data. The algorithm has to figure out
          on its own whether any meaningful groupings, patterns, or relationships exist.
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Clustering</strong> — find natural groups of similar points (our topic)</li>
          <li><strong>Dimensionality reduction</strong> — compress many features down to a few that capture most of the variation</li>
          <li><strong>Density estimation</strong> — learn the underlying distribution of the data</li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="Why Unsupervised Matters">
        <p>
          Labels are expensive. Getting a human to label every training example takes time and money
          — and for many datasets it&apos;s simply impossible. No one has labeled every web page,
          every genomic sequence, or every customer transaction.
        </p>
        <p>
          Unsupervised methods can extract enormous value from raw, unlabeled data. Clustering in
          particular answers the question: <em>which points are so similar to each other, and so
          different from everything else, that they probably belong to the same natural group?</em>
        </p>
        <p>
          K-means is the most widely used clustering algorithm in the world precisely because it
          answers that question with a beautifully simple two-step loop — which we&apos;ll build up
          piece by piece starting with the next module.
        </p>
      </ExplanationBox>
    </div>
  );
}
