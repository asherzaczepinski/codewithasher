'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="What This Course Is About">
        <p>
          Most machine learning problems start with labeled data — examples where someone has already
          told the algorithm the right answer. But what do you do when you have no labels at all?
          Just raw data, and a question: <em>is there any hidden structure here?</em>
        </p>
        <p>
          That&apos;s exactly where <strong>clustering</strong> comes in. Clustering algorithms scan
          through unlabeled data and automatically group similar points together — no human
          annotation required.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Customer Segments">
        <p>
          Throughout this course we&apos;ll work with one concrete scenario: a small shop wants to
          understand its customers. For each customer we record two numbers:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Annual spend</strong> — how much money they spend per year (in hundreds of dollars)</li>
          <li><strong>Visit frequency</strong> — how many times they visit per month</li>
        </ul>
        <p>
          Nobody has labeled these customers &quot;loyal,&quot; &quot;occasional,&quot; or
          &quot;high-value.&quot; We just have the numbers. K-means will discover natural groupings
          on its own — and by the end of this course, you&apos;ll be able to run it by hand on a
          small dataset.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What Clustering Is Good For">
        <p>
          Clustering shows up everywhere data exists without ready-made categories:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Customer segmentation</strong> — group buyers by behavior so you can target each segment differently</li>
          <li><strong>Document grouping</strong> — sort thousands of articles into topics without reading them all</li>
          <li><strong>Anomaly detection</strong> — points that don&apos;t fit any cluster are outliers worth investigating</li>
          <li><strong>Image compression</strong> — replace millions of pixel colors with a small palette of cluster centers</li>
          <li><strong>Biology</strong> — group genes or cells by expression patterns to find new subtypes</li>
        </ul>
        <p>
          The key idea is always the same: <em>let the algorithm find the groups; don&apos;t impose
          them up front.</em>
        </p>
      </ExplanationBox>

      <ExplanationBox title="What We'll Build">
        <p>
          By the end of this course you&apos;ll understand K-means from first principles — not just
          &quot;it groups similar things together,&quot; but exactly <em>how</em> it decides what
          &quot;similar&quot; means, how it finds group centers, how it updates them, and how it
          knows when to stop. You&apos;ll trace through every step by hand on our customer dataset.
        </p>
      </ExplanationBox>
    </div>
  );
}
