'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// Locked toy numbers. Query for "is" was built last step: q = W_Q · is = [1.6, 0.1, 0.0].
// Keys (for the toy) are the raw embeddings.
const QUERY: [number, number, number] = [1.6, 0.1, 0.0];
const KEYS: { word: string; vec: [number, number, number] }[] = [
  { word: 'The', vec: [0.1, 0.0, 0.9] },
  { word: 'sky', vec: [1.0, 0.7, 0.0] },
  { word: 'is',  vec: [0.1, 0.2, 0.8] },
];
const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);

function ScoreBars() {
  const scores = KEYS.map(k => dot(QUERY, k.vec));
  const max = Math.max(...scores);
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.2rem', fontSize: 13, color: '#64748b' }}>
        Query for <strong>&ldquo;is&rdquo;</strong> = [1.6, 0.1, 0.0]. Score it against every word&apos;s key:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: '1rem' }}>
        {KEYS.map((k, i) => (
          <div key={k.word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 34, fontWeight: 700, fontSize: 14, color: '#334155' }}>{k.word}</span>
            <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#94a3b8', width: 96 }}>
              [{k.vec.map(n => n.toFixed(1)).join(', ')}]
            </span>
            <div style={{ flex: 1, height: 18, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(scores[i] / max) * 100}%`, background: scores[i] === max ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)' }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: '#1e293b', width: 44, textAlign: 'right' }}>{scores[i].toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '1.1rem 0 0', fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
        One score towers over the others. The query asked <em>&ldquo;where is my subject?&rdquo;</em> and{' '}
        <strong>sky</strong> answered loudest — exactly the word we would need to look at to guess what
        comes after &ldquo;The sky is.&rdquo;
      </p>
    </div>
  );
}

export default function Step12() {
  return (
    <div>
      <ExplanationBox title="The Score Is Just a Dot Product">
        <p>
          Last step, the word <strong>&ldquo;is&rdquo;</strong> produced a <strong>query</strong> — a
          little vector that encodes the question it is asking of the sentence:{' '}
          <code>q = [1.6, 0.1, 0.0]</code>, a vector pointing almost entirely along the topic axis
          (&ldquo;find my subject&rdquo;). Every word, meanwhile, produced a <strong>key</strong> — an
          advertisement of what it offers. For our toy we are using each word&apos;s embedding as its key.
        </p>
        <p>
          To decide how much &ldquo;is&rdquo; should attend to each word, we measure how well the query
          lines up with that word&apos;s key. We already have the perfect tool for &ldquo;how well do two
          vectors line up&rdquo; — the <strong>dot product</strong> from Part 2. That is the entire
          scoring rule:
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#ede9fe', borderRadius: 8 }}>
          <code style={{ fontSize: 14, color: '#4c1d95' }}>score(is, word) = query(is) · key(word)</code>
        </div>
      </ExplanationBox>

      <WorkedExample title="Scoring &ldquo;is&rdquo; Against Every Word">
        <p>The query is [1.6, 0.1, 0.0]. We dot it against each key, one coordinate-product at a time:</p>
        <CalcStep number={1}>
          vs <strong>The</strong> [0.1, 0.0, 0.9]: (1.6 × 0.1) + (0.1 × 0.0) + (0.0 × 0.9) = 0.16 + 0 + 0 = <strong>0.16</strong>
        </CalcStep>
        <CalcStep number={2}>
          vs <strong>sky</strong> [1.0, 0.7, 0.0]: (1.6 × 1.0) + (0.1 × 0.7) + (0.0 × 0.0) = 1.60 + 0.07 + 0 = <strong>1.67</strong>
        </CalcStep>
        <CalcStep number={3}>
          vs <strong>is</strong> [0.1, 0.2, 0.8]: (1.6 × 0.1) + (0.1 × 0.2) + (0.0 × 0.8) = 0.16 + 0.02 + 0 = <strong>0.18</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Three numbers: <strong>0.16, 1.67, 0.18</strong>. The score for <strong>sky</strong> is roughly
          ten times the others. Notice <em>why</em>: the query points along the topic axis, and only sky
          has any topic content (its first coordinate is 1.0). &ldquo;The&rdquo; and &ldquo;is&rdquo; are
          almost pure grammar words, so the topic-seeking query barely registers them.
        </p>
      </WorkedExample>

      <ExplanationBox title="See the Gap">
        <ScoreBars />
        <p>
          This is the moment attention earns its name. Back in Part 2 we found that &ldquo;The&rdquo; and
          &ldquo;is&rdquo; had a cosine similarity of <strong>0.97</strong> — nearly identical as raw
          vectors — which was useless for prediction. The learned query matrix fixed that: by reshaping
          &ldquo;is&rdquo; into a question about topics, the model made it ignore its look-alike
          &ldquo;The&rdquo; and lock onto &ldquo;sky&rdquo; instead.
        </p>
      </ExplanationBox>

      <ExplanationBox title="These Are Raw Scores — Not Done Yet">
        <p>
          0.16, 1.67, 0.18 tell us the <em>ranking</em>, but they are not yet usable weights: they do not
          sum to anything meaningful, and one of them could have been negative. We want to turn them into
          clean percentages that add up to 100% — &ldquo;is&rdquo; spends 100% of its attention,
          distributed across the words. The function that does that is <strong>softmax</strong>, and it is
          next.
        </p>
        <p>
          (There is also a subtle problem waiting: in a real model with 768-dimensional vectors, dot
          products get large enough to break softmax. We will hit that two steps from now and fix it with
          a single division.)
        </p>
      </ExplanationBox>
    </div>
  );
}
