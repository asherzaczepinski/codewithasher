'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// ─── Our running specimen: the three tokens of "The sky is" ─────────────────────
// dims = [TOPIC (how much it is about the sky), BRIGHT (visual / colour),
//         GRAMMAR (how much it is a function word)]
const TOY: { word: string; nums: [number, number, number]; color: string }[] = [
  { word: 'The', nums: [0.1, 0.0, 0.9], color: '#2563eb' },
  { word: 'sky', nums: [1.0, 0.7, 0.0], color: '#7c3aed' },
  { word: 'is',  nums: [0.1, 0.2, 0.8], color: '#0891b2' },
];

const DIM_LABELS = ['TOPIC', 'BRIGHT', 'GRAMMAR'];
const DIM_BLURBS = [
  'how much the word is about the sky / the subject',
  'visual brightness and colour',
  'how much it is a plumbing word — a, the, is, of',
];

// ─── Interactive: project the three words onto any two learned axes ──────────────
function GeometryPlot() {
  const [xDim, setXDim] = useState(0); // TOPIC
  const [yDim, setYDim] = useState(2); // GRAMMAR

  const W = 320, H = 280, pad = 44;
  const plotW = W - pad * 2, plotH = H - pad * 2;
  // axes run 0 → 1 (all our coordinates live in that range)
  const sx = (v: number) => pad + v * plotW;
  const sy = (v: number) => H - pad - v * plotH;

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.75rem', fontSize: 13, color: '#64748b' }}>
        Pick which two learned features to use as the floor and the wall, then watch where each word
        lands. <strong>Geometry is meaning:</strong> words that behave alike sit near each other.
      </p>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: '0.9rem' }}>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>horizontal axis</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DIM_LABELS.map((d, i) => (
              <button key={i} onClick={() => setXDim(i)} disabled={i === yDim}
                style={{ padding: '5px 11px', borderRadius: 6, border: '1px solid', cursor: i === yDim ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, opacity: i === yDim ? 0.35 : 1, background: xDim === i ? '#7c3aed' : '#fff', color: xDim === i ? '#fff' : '#334155', borderColor: xDim === i ? '#7c3aed' : '#cbd5e1' }}>{d}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>vertical axis</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {DIM_LABELS.map((d, i) => (
              <button key={i} onClick={() => setYDim(i)} disabled={i === xDim}
                style={{ padding: '5px 11px', borderRadius: 6, border: '1px solid', cursor: i === xDim ? 'not-allowed' : 'pointer', fontSize: 12, fontWeight: 600, opacity: i === xDim ? 0.35 : 1, background: yDim === i ? '#7c3aed' : '#fff', color: yDim === i ? '#fff' : '#334155', borderColor: yDim === i ? '#7c3aed' : '#cbd5e1' }}>{d}</button>
            ))}
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto', background: '#fff', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#cbd5e1" strokeWidth={1.5} />
        <line x1={pad} y1={H - pad} x2={pad} y2={pad} stroke="#cbd5e1" strokeWidth={1.5} />
        <text x={W - pad} y={H - pad + 22} fontSize={11} fontWeight={700} fill="#64748b" textAnchor="end">{DIM_LABELS[xDim]} →</text>
        <text x={pad - 8} y={pad - 6} fontSize={11} fontWeight={700} fill="#64748b" textAnchor="start">↑ {DIM_LABELS[yDim]}</text>
        {TOY.map(t => {
          const cx = sx(t.nums[xDim]); const cy = sy(t.nums[yDim]);
          return (
            <g key={t.word}>
              <line x1={pad} y1={cy} x2={cx} y2={cy} stroke={t.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.35} />
              <line x1={cx} y1={H - pad} x2={cx} y2={cy} stroke={t.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.35} />
              <circle cx={cx} cy={cy} r={8} fill={t.color} />
              <text x={cx + 12} y={cy + 4} fontSize={13} fontWeight={700} fill={t.color}>{t.word}</text>
            </g>
          );
        })}
      </svg>
      <p style={{ margin: '0.9rem 0 0', fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
        Put <strong>GRAMMAR</strong> on one axis and <strong>The</strong> and <strong>is</strong> pile up
        in the same corner — both are pure plumbing words. Switch an axis to <strong>TOPIC</strong> and{' '}
        <strong>sky</strong> shoots away on its own. Same three words, different story depending on which
        learned feature you look along.
      </p>
    </div>
  );
}

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="Nobody Typed These Numbers In">
        <p>
          Last step we looked up three vectors — <code>The = [0.1, 0.0, 0.9]</code>,{' '}
          <code>sky = [1.0, 0.7, 0.0]</code>, <code>is = [0.1, 0.2, 0.8]</code> — and ended on a nagging
          question: where did the numbers come from? The answer is that{' '}
          <strong>the model invented every one of them</strong>. No engineer decided that{' '}
          <code>sky</code> deserves a <code>1.0</code> in the first slot. The embedding table is{' '}
          <em>learned</em>, the same way the weights in the neural-network course were learned: start from
          random noise, then nudge.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Dimension Is a Feature the Model Found Useful">
        <p>
          In the neural-network course <em>we</em> hand-picked the inputs — temperature, humidity — because
          we already knew they mattered for rain. An embedding removes the hand-picking. Each slot in the
          vector is a <strong>feature</strong>, but the model decides for itself which features are worth
          having. We have been labelling our three slots like this:
        </p>
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DIM_LABELS.map((d, i) => (
            <div key={d} style={{ display: 'flex', gap: 12, alignItems: 'baseline', padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: '#5b21b6', width: 84, flexShrink: 0 }}>{d}</span>
              <span style={{ fontSize: 13, color: '#475569' }}>{DIM_BLURBS[i]}</span>
            </div>
          ))}
        </div>
        <p>
          Be honest about those labels, though: they are <em>our</em> after-the-fact reading. The model
          never writes &ldquo;TOPIC&rdquo; anywhere. In a real 768-dimension embedding most features have no
          tidy name at all — meaning is smeared across many slots at once. We picked three clean,
          nameable axes only so the arithmetic stays on a napkin. What actually matters is not the label on
          a slot but the <strong>geometry</strong>: where each word ends up relative to the others.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Geometry Is Meaning">
        <p>
          Once words are points in space, &ldquo;similar&rdquo; stops being fuzzy and becomes{' '}
          <strong>close together</strong>. Drag the axes below and watch our three words rearrange — who
          clusters and who stands apart depends entirely on which learned feature you measure along.
        </p>
        <GeometryPlot />
        <p>
          This is the punchline of embeddings: the model packs a word&apos;s behaviour into coordinates, and
          then closeness in those coordinates <em>is</em> similarity in meaning. The next two steps turn
          &ldquo;close&rdquo; into an exact number you can compute by hand.
        </p>
      </ExplanationBox>

      <WorkedExample title="Reading Our Learned Vectors">
        <p>
          With the labels in mind, our three rows almost narrate themselves. Read each one slot by slot:
        </p>
        <CalcStep number={1}>
          <strong>sky</strong> = [<strong>1.0</strong>, 0.7, 0.0]: maxed-out TOPIC, a healthy dose of
          BRIGHT, basically zero GRAMMAR. A content word, all about its subject.
        </CalcStep>
        <CalcStep number={2}>
          <strong>The</strong> = [0.1, 0.0, <strong>0.9</strong>]: almost no TOPIC or BRIGHT, huge
          GRAMMAR. A pure plumbing word.
        </CalcStep>
        <CalcStep number={3}>
          <strong>is</strong> = [0.1, 0.2, <strong>0.8</strong>]: also tiny TOPIC, also big GRAMMAR —
          its profile looks a lot like <strong>The</strong>&apos;s.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Eyeballing it, <strong>The</strong> and <strong>is</strong> are near-twins while{' '}
          <strong>sky</strong> lives somewhere else entirely. That matches the geometry plot above — and in
          the next step we stop eyeballing and prove it with a single multiplication-and-sum.
        </p>
      </WorkedExample>

      <ExplanationBox title="So How Are These Numbers Actually Learned?">
        <p>
          When training begins, <strong>every embedding is random noise</strong> — the model has no idea
          what <code>sky</code> means. Then it runs the exact same loop you saw in the neural-network
          course, billions of times, over ordinary text:
        </p>
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '1', title: 'Read some text', desc: 'e.g. "The sky is blue" — endless sentences like it', tc: '#0369a1', bg: '#bae6fd' },
            { n: '2', title: 'Predict the next word', desc: 'Given "The sky is ___", make a guess from the current (still-bad) vectors', tc: '#15803d', bg: '#bbf7d0' },
            { n: '3', title: 'Measure how wrong it was', desc: 'Compare the guess to the word that actually came next', tc: '#c2410c', bg: '#fed7aa' },
            { n: '4', title: 'Nudge every number', desc: 'Backpropagation shifts each coordinate in each vector a hair, so the next guess is a little less wrong', tc: '#6d28d9', bg: '#e9d5ff' },
            { n: '↺', title: 'Repeat for ~all of the internet', desc: 'Words that keep showing up in the same slots drift together; the features emerge on their own', tc: '#334155', bg: '#e2e8f0' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.bg, color: s.tc, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
                {s.n !== '↺' && <div style={{ width: 2, flex: 1, background: '#e2e8f0', minHeight: 16 }} />}
              </div>
              <div style={{ padding: '4px 0 16px 12px' }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: s.tc }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6, background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, padding: '10px 14px' }}>
          It is the same <strong>predict → measure → adjust</strong> loop, just run on text instead of
          weather. The numbers in our table are the frozen result of that loop: a compressed map of how the
          word <code>sky</code> behaves across everything the model ever read.
        </p>
      </ExplanationBox>

      <ExplanationBox title="This Isn&apos;t New — and You Can Go See It">
        <p>
          Learned word vectors did not arrive with ChatGPT. A Google team published{' '}
          <strong>Word2Vec</strong> back in 2013, training these same kinds of vectors on billions of web
          pages. It was the first popular demonstration that the geometry really carries meaning — the
          famous (and we will only mention it once) result that{' '}
          <em>king &minus; man + woman</em> lands near <em>queen</em>. The idea has been quietly running
          inside Google products for over a decade:
        </p>
        <div style={{ margin: '1rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { year: '2013', co: 'Google', thing: 'Word2Vec', desc: 'First large-scale learned word embeddings.' },
            { year: '2015', co: 'Gmail', thing: 'Smart Reply', desc: 'Suggests replies by embedding your email and matching response vectors.' },
            { year: '2016', co: 'Google', thing: 'Search (RankBrain)', desc: 'Uses embeddings to understand queries it has never seen before.' },
            { year: '2018', co: 'Google', thing: 'BERT', desc: 'Embeddings start depending on context — "bank" shifts near "river" vs "loan."' },
            { year: '2019', co: 'YouTube', thing: 'Recommendations', desc: 'Videos become vectors; recommending = finding nearest neighbours.' },
            { year: '2022+', co: 'Everyone', thing: 'LLMs', desc: 'GPT, Gemini, Claude all open with an embedding layer doing exactly this.' },
          ].map(item => (
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
        <div style={{ padding: '16px 20px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>🔭</span>
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#0369a1', fontSize: 15 }}>See 10,000 real word vectors</p>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              The <strong>TensorFlow Embedding Projector</strong> loads actual pre-trained vectors and draws
              them as a 3-D point cloud — the same kind of space hiding inside real models, just bigger than
              our toy. Each dot is a word. Rotate it and countries clump together, animals clump together,
              verbs drift from nouns. Click a word to draw lines to its nearest neighbours. Nobody labelled
              any of it; it all fell out of predicting text.
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
          We now have three points in space and a claim that closeness means similarity. The obvious next
          job is to <strong>measure</strong> it. Is <code>The</code> really as close to <code>is</code> as
          it looks? The workhorse tool for &ldquo;how aligned are two vectors&rdquo; is the{' '}
          <strong>dot product</strong> — and it is the single most-used operation inside an entire LLM. It
          gets the whole next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
