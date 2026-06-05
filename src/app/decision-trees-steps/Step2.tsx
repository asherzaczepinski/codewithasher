'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Nodes Ask Questions">
        <p>
          A decision tree is a binary tree where every <strong>internal node</strong> asks exactly
          one question about exactly one feature. The answer — yes or no, left or right — sends each
          example down a branch until it reaches a <strong>leaf node</strong>, which gives the final
          prediction.
        </p>
        <p>
          There are two flavors of question, depending on the feature type:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Categorical feature</strong> — &quot;Is Outlook = Sunny?&quot; The split groups
            all Sunny examples one way, everything else the other way.
          </li>
          <li>
            <strong>Numeric feature</strong> — &quot;Is Humidity &gt; 75?&quot; The split uses a
            threshold; examples at or below go left, examples above go right.
          </li>
        </ul>
      </ExplanationBox>

      <ExplanationBox title="How a Split Partitions the Dataset">
        <p>
          Think of the full training set as a bucket of colored balls — green for &quot;Play Tennis:
          Yes&quot; and red for &quot;Play Tennis: No.&quot; A split dumps the bucket through a
          sieve: each ball lands in the left child bucket or the right child bucket based on its
          feature value.
        </p>
        <p>
          After the split we have two sub-buckets. Each sub-bucket contains a mix of colors, but
          ideally a <em>purer</em> mix than the original. A <strong>pure</strong> bucket holds only
          one color — it means the question perfectly separated that class from the rest. A pure
          leaf needs no further splitting; we already know the answer.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Splitting Our Tennis Dataset on Outlook">
        <p>
          Let&apos;s try the question <strong>&quot;Is Outlook = Sunny?&quot;</strong> on all
          8 training examples:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: '#fef9c3', borderRadius: '8px', padding: '12px' }}>
            <strong>Left branch — Outlook IS Sunny (3 examples)</strong>
            <ul style={{ marginTop: '8px', lineHeight: '1.8' }}>
              <li>D1: No</li>
              <li>D2: No</li>
              <li>D8: Yes</li>
            </ul>
            <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Mix: 2 No, 1 Yes — not pure.</p>
          </div>
          <div style={{ background: '#dcfce7', borderRadius: '8px', padding: '12px' }}>
            <strong>Right branch — Outlook is NOT Sunny (5 examples)</strong>
            <ul style={{ marginTop: '8px', lineHeight: '1.8' }}>
              <li>D3: Yes</li>
              <li>D4: Yes</li>
              <li>D5: Yes</li>
              <li>D6: No</li>
              <li>D7: Yes</li>
            </ul>
            <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>Mix: 4 Yes, 1 No — not pure, but better.</p>
          </div>
        </div>
        <p style={{ marginTop: '1rem' }}>
          The right branch is mostly &quot;Yes&quot; — we&apos;ve already learned something useful.
          The left branch still needs more questions. That&apos;s how a tree grows: keep splitting
          impure nodes until every leaf is pure (or we hit a stopping rule).
        </p>
      </ExplanationBox>

      <MathFormula label="What the tree is searching for">
        Best split = the question that maximizes purity of the two child groups
      </MathFormula>

      <ExplanationBox title="The Goal: Maximize Purity, Minimize Confusion">
        <p>
          A perfect split sends all &quot;Yes&quot; examples to one child and all &quot;No&quot;
          examples to the other. In practice that rarely happens on the first split, so we need a
          number that measures <em>how impure</em> a group is. Lower impurity = better split.
        </p>
        <p>
          Two standard impurity measures — Gini impurity and entropy — each capture this idea
          slightly differently. Next up, we derive both from scratch and compute them by hand on
          our tennis data.
        </p>
      </ExplanationBox>
    </div>
  );
}
