'use client';

import ExplanationBox from '@/components/ExplanationBox';

const TIMELINE = [
  { year: '2013', co: 'Google', thing: 'Word2Vec', desc: 'First large-scale learned word embeddings — the exact skip-gram network from last tab.' },
  { year: '2015', co: 'Gmail', thing: 'Smart Reply', desc: 'Suggests replies by embedding your email and matching response vectors.' },
  { year: '2016', co: 'Google', thing: 'Search (RankBrain)', desc: 'Uses embeddings to understand queries it has never seen before.' },
  { year: '2018', co: 'Google', thing: 'BERT', desc: 'Embeddings start depending on context — "bank" shifts near "river" vs "loan."' },
  { year: '2019', co: 'YouTube', thing: 'Recommendations', desc: 'Videos become vectors; recommending = finding nearest neighbours.' },
  { year: '2022+', co: 'Everyone', thing: 'LLMs', desc: 'GPT, Gemini, Claude all open with an embedding layer doing exactly this.' },
];

export default function Step8() {
  return (
    <div>
      <ExplanationBox title="This Isn't a Toy — It Has Been Shipping for a Decade">
        <p>
          The little network you just trained is not a teaching gimmick invented for this course. Learned
          word vectors arrived well before ChatGPT: a Google team published <strong>Word2Vec</strong> in
          2013 — the exact skip-gram setup from the last tab — and trained it on billions of web pages. It
          was the first popular proof that the geometry really carries meaning.
        </p>
        <p>
          The headline demo, which we&apos;ll mention exactly once because it is overused: take the vectors
          and do arithmetic on them. <em>king &minus; man + woman</em> lands right next to{' '}
          <em>queen</em>. The direction that means &ldquo;male → female&rdquo; turned out to be a consistent
          step you could <em>add</em> — and nobody designed that direction; it fell out of counting context.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Decade of Quiet Use">
        <p>
          Since then the same idea — turn things into vectors, judge them by closeness — has been running
          inside products you use every day:
        </p>
        <div style={{ margin: '1rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {TIMELINE.map(item => (
            <div key={item.year} style={{ padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: '#ede9fe', padding: '1px 7px', borderRadius: 4 }}>{item.year}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{item.thing}</span>
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3 }}>{item.co}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p>
          It is the same move every time, and it is not limited to words: embed songs and &ldquo;similar
          music&rdquo; is just nearby vectors; embed products and &ldquo;you might also like&rdquo; is a
          nearest-neighbour lookup. An LLM&apos;s embedding layer is this exact trick, sitting at the very
          front of the machine.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Go See Real Ones Yourself">
        <div style={{ padding: '16px 20px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>🔭</span>
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#0369a1', fontSize: 15 }}>See 10,000 real word vectors</p>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              The <strong>TensorFlow Embedding Projector</strong> loads actual pre-trained vectors and draws
              them as a 3-D point cloud — the same kind of space you just trained, only far bigger. Each dot
              is a word. Rotate it and countries clump together, animals clump together, verbs drift from
              nouns. Click a word to draw lines to its nearest neighbours. Nobody labelled any of it; it all
              fell out of predicting context — exactly like your toy did.
            </p>
            <a href="https://projector.tensorflow.org" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '7px 16px', background: '#0284c7', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Open the TF Embedding Projector →
            </a>
          </div>
        </div>
      </ExplanationBox>

      <ExplanationBox title="Where We&apos;re Headed">
        <p>
          So now we truly have it: every token is a point in space, learned entirely from the company it
          keeps, with a decade of real systems to prove it works. The obvious next job is to{' '}
          <strong>measure</strong> that closeness. Is <code>The</code> really as close to <code>is</code> as
          it looks? The workhorse tool for &ldquo;how aligned are two vectors&rdquo; is the{' '}
          <strong>dot product</strong> — the single most-used operation inside an entire LLM. It gets the
          whole next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
