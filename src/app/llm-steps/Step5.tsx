'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// ─── Our running specimen: the three tokens of "The sky is" ─────────────────────
// dims = [TOPIC (how much it is about the sky), BRIGHT (visual / colour),
//         GRAMMAR (how much it is a function word)]
const TOY: { word: string; id: number; nums: [number, number, number] }[] = [
  { word: 'The', id: 464,  nums: [0.1, 0.0, 0.9] },
  { word: 'sky', id: 6766, nums: [1.0, 0.7, 0.0] },
  { word: 'is',  id: 318,  nums: [0.1, 0.2, 0.8] },
];

const DIM_LABELS = ['dim 1', 'dim 2', 'dim 3'];

function EmbeddingTable() {
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.9rem', fontSize: 13, color: '#64748b' }}>
        The embedding table is just a lookup: token ID in, a row of numbers out. Here is our toy
        table, with a tiny <strong>3 numbers per word</strong> (real models store 768, 1024, or more):
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TOY.map(t => (
          <div key={t.word} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ width: 38, fontWeight: 700, fontSize: 14, color: '#334155', flexShrink: 0 }}>{t.word}</span>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8', width: 64, flexShrink: 0 }}>id {t.id}</span>
            <span style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0 }}>→</span>
            <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
              {t.nums.map((v, i) => (
                <span key={i} title={DIM_LABELS[i]} style={{ padding: '3px 9px', borderRadius: 5, fontSize: 13, fontFamily: 'monospace', fontWeight: 600, background: v > 0 ? '#dbeafe' : '#f1f5f9', color: v > 0 ? '#1d4ed8' : '#64748b' }}>
                  {v.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin: '0.9rem 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        Three numbers means every calculation in this course fits on a napkin — but the math is{' '}
        <em>identical</em> to what runs inside GPT-4. These exact three vectors come back in every
        step from here on.
      </p>
    </div>
  );
}

function VectorBars() {
  const max = 1.0;
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.9rem', fontSize: 13, color: '#64748b' }}>
        The same three vectors as bars. Each word is a <strong>point</strong> in a 3-dimensional space —
        these bars are its coordinates along each axis:
      </p>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {TOY.map(t => (
          <div key={t.word} style={{ flex: 1, minWidth: 140 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#5b21b6', marginBottom: 8 }}>{t.word}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {t.nums.map((v, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#94a3b8', width: 38 }}>{DIM_LABELS[i]}</span>
                  <div style={{ flex: 1, height: 10, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(v / max) * 100}%`, background: 'linear-gradient(90deg,#a78bfa,#7c3aed)' }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b', width: 26, textAlign: 'right' }}>{v.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="A Token ID Means Nothing as a Number">
        <p>
          Tokenization turned <strong>&ldquo;The sky is&rdquo;</strong> into a list of token IDs:
          something like <code>464, 6766, 318</code>. But those numbers are just <em>name tags</em>.
          Token 6766 is not &ldquo;bigger&rdquo; or &ldquo;more&rdquo; than token 464 in any meaningful
          way — the IDs are arbitrary positions in a dictionary. If you fed them straight into a network
          that multiplies and adds, it would conclude that <code>is</code> (318) is roughly half of{' '}
          <code>The</code> (464), which is nonsense.
        </p>
        <p>
          So the very first thing a model does is throw the ID away and replace it with something that{' '}
          <em>does</em> carry meaning: a <strong>vector</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What a Vector Is">
        <p>
          A <strong>vector</strong> is just a list of numbers — that is the whole definition.{' '}
          <code>[0.1, 0.2, 0.8]</code> is a 3-dimensional vector. You can picture it as an arrow from the
          origin to a point in space, or simply as a row of coordinates. Two things about a vector will
          matter for the rest of the course:
        </p>
        <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Direction</strong> — which way the arrow points. This is what we will treat as the word&apos;s <em>meaning</em>.</li>
          <li><strong>Magnitude</strong> — how long the arrow is. Roughly, how strongly the word expresses that meaning.</li>
        </ul>
        <p>
          The jump from &ldquo;a word&rdquo; to &ldquo;a point in space&rdquo; is the single most
          important idea in Part 2. Once words are points, <em>similar words sit close together</em>, and
          closeness is something a computer can measure with arithmetic.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Embedding Lookup">
        <p>
          The model keeps a giant table called the <strong>embedding matrix</strong>: one row per token
          in its vocabulary, each row a learned vector. &ldquo;Embedding a token&rdquo; just means{' '}
          <strong>looking up its row</strong>. ID in, vector out. No math, just a table read.
        </p>
        <EmbeddingTable />
        <p>
          So &ldquo;The sky is&rdquo; — three IDs — becomes three vectors. From here on we never talk
          about the words again; the model only ever sees these numbers.
        </p>
        <VectorBars />
      </ExplanationBox>

      <WorkedExample title="Our Three Vectors, Written Out">
        <p>Memorize these — every later step plugs them in:</p>
        <CalcStep number={1}>The = [0.1, 0.0, 0.9]</CalcStep>
        <CalcStep number={2}>sky = [1.0, 0.7, 0.0]</CalcStep>
        <CalcStep number={3}>is&nbsp;&nbsp;= [0.1, 0.2, 0.8]</CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Glance at them and you might already spot something: <strong>The</strong> and <strong>is</strong>{' '}
          look alike (both small, both big in the last slot), while <strong>sky</strong> points a
          completely different way. Hold that thought — in two steps we will turn &ldquo;look alike&rdquo;
          into an exact number.
        </p>
      </WorkedExample>

      <ExplanationBox title="But Where Do the Numbers Come From?">
        <p>
          A fair objection: those numbers look made up. Who decided <code>sky</code> gets a{' '}
          <code>1.0</code> in the first slot? The honest answer is that <strong>nobody did</strong> — the
          model invents every one of them during training, and each slot ends up standing for a feature
          the model found useful. That is the whole of the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
