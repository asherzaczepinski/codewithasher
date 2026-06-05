'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="You Are Like Your Neighbors">
        <p>
          Imagine you move to a new neighborhood and someone asks: &quot;Do you like spicy food?&quot;
          You have no idea yet — but you look around and notice that every single person on your
          block loves spicy food. A reasonable guess? You probably will too.
        </p>
        <p>
          That&apos;s the entire philosophy behind <strong>K-Nearest Neighbors (KNN)</strong>: to
          classify or predict something unknown, look at the <em>k</em> most similar examples you
          already know, and let their answers guide yours.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Lazy Learner">
        <p>
          Most machine learning algorithms have a <strong>training phase</strong> — a period where
          they study the data and build an internal model (weights, decision trees, cluster
          centroids). KNN skips all of that. It simply stores every labeled example and waits.
        </p>
        <p>
          All the real work happens at <strong>prediction time</strong>. When you hand KNN a new
          point, it scans through every stored example, measures how close they are, grabs the
          nearest <em>k</em>, and returns the majority answer. This is called
          &quot;instance-based&quot; or &quot;lazy&quot; learning — lazy because it defers
          computation until it absolutely needs to do it.
        </p>
        <p>
          The trade-off: training is instant (just save the data), but each prediction can be
          slow if the dataset is large. We&apos;ll return to that later.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Fruit Classification">
        <p>
          Throughout this course we classify fruits as either an <strong>apple</strong> or an{' '}
          <strong>orange</strong> using two features:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Weight (g)</strong> — how heavy the fruit is (e.g., 150&nbsp;g vs 280&nbsp;g)
          </li>
          <li>
            <strong>Sweetness (0–10)</strong> — a taster&apos;s rating of sweetness
          </li>
        </ul>
        <p>
          Our labeled dataset has five fruits we already know. We&apos;ll use it to classify an
          unknown fruit in every worked example ahead:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.75rem' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Fruit</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Weight (g)</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Sweetness</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Label</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['A', '170', '7', 'Apple'],
              ['B', '160', '6', 'Apple'],
              ['C', '270', '4', 'Orange'],
              ['D', '280', '5', 'Orange'],
              ['E', '175', '8', 'Apple'],
            ].map(([id, w, s, label]) => (
              <tr key={id}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{id}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{w}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{label}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '0.75rem' }}>
          Our mystery fruit has <strong>weight = 180 g</strong> and{' '}
          <strong>sweetness = 7</strong>. Is it an apple or an orange? By the end of the next
          module you&apos;ll be able to answer that with exact numbers.
        </p>
      </ExplanationBox>
    </div>
  );
}
