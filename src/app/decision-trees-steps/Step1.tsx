'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step1() {
  return (
    <div>
      <ExplanationBox title="You Already Think in Decision Trees">
        <p>
          Every morning you make decisions by asking a chain of yes/no questions. Should I carry an
          umbrella? You might think: <em>Is it cloudy?</em> If yes &rarr; <em>Did the forecast say rain?</em>{' '}
          If yes &rarr; take the umbrella. That chain of questions is a decision tree — you just
          didn&apos;t call it that.
        </p>
        <p>
          A decision tree in machine learning works the same way. It learns a sequence of
          questions from labeled data, then uses those questions to classify or predict new examples.
          No black box, no mysterious transformations — just a flowchart you can read and reason about.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Trees Are Special: Interpretability">
        <p>
          Most powerful models — neural networks, support vector machines — give you a prediction
          with no explanation. Decision trees give you a <strong>path</strong>: every prediction
          traces a root-to-leaf route you can inspect, audit, and explain to a non-technical
          stakeholder.
        </p>
        <p>
          That matters enormously in medicine, finance, and law, where &quot;the model said so&quot;
          is not a sufficient answer. A doctor needs to know <em>which</em> patient feature triggered
          the high-risk flag. A decision tree delivers that for free.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Running Example: Play Tennis?">
        <p>
          Throughout this course we use a classic toy dataset: should you play tennis today? Each
          row records the weather conditions and whether tennis was played.
        </p>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Day</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Outlook</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Humidity</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Wind</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Play Tennis?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['D1', 'Sunny', 'High', 'Weak', 'No'],
                ['D2', 'Sunny', 'High', 'Strong', 'No'],
                ['D3', 'Overcast', 'High', 'Weak', 'Yes'],
                ['D4', 'Rain', 'High', 'Weak', 'Yes'],
                ['D5', 'Rain', 'Normal', 'Weak', 'Yes'],
                ['D6', 'Rain', 'Normal', 'Strong', 'No'],
                ['D7', 'Overcast', 'Normal', 'Strong', 'Yes'],
                ['D8', 'Sunny', 'Normal', 'Weak', 'Yes'],
              ].map(([day, outlook, humidity, wind, play]) => (
                <tr key={day}>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{day}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{outlook}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{humidity}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{wind}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', fontWeight: 'bold', color: play === 'Yes' ? '#16a34a' : '#dc2626' }}>{play}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: '1rem' }}>
          Eight days, three features (Outlook, Humidity, Wind), one binary label. By the end of
          Part 1 you&apos;ll have built a tree from scratch that correctly classifies every row.
          By Part 2 you&apos;ll understand why a forest of hundreds of such trees is even better.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What We Cover">
        <p>
          <strong>Part 1 — Growing a Tree</strong> digs into the mechanics: how each node picks
          the best question (splits), how we measure &quot;best&quot; using Gini impurity and
          entropy, how information gain chooses between candidate splits, and how the tree grows
          recursively until it can perfectly classify the training data.
        </p>
        <p>
          <strong>Part 2 — From Trees to Forests</strong> confronts the big problem with single
          trees — they overfit — and shows how random forests fix it by averaging hundreds of
          deliberately different trees trained on random subsets of data and features.
        </p>
      </ExplanationBox>
    </div>
  );
}
