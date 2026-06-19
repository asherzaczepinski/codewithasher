'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

// ─── helpers ──────────────────────────────────────────────────────────────────
const dot2 = (a: [number,number], b: [number,number]) => a[0]*b[0]+a[1]*b[1];
const mag2 = (a: [number,number]) => Math.hypot(a[0], a[1]);
const cos2 = (a: [number,number], b: [number,number]) => dot2(a,b)/(mag2(a)*mag2(b)||1);
const sub2 = (a: [number,number], b: [number,number]): [number,number] => [a[0]-b[0],a[1]-b[1]];
const add2 = (a: [number,number], b: [number,number]): [number,number] => [a[0]+b[0],a[1]+b[1]];

// ─── Vector example ───────────────────────────────────────────────────────────
const VEC_EXAMPLES = [
  { word: 'king',   nums: [0.24, -0.87, 0.51, 0.03, -0.44, 0.72, -0.18, 0.95] },
  { word: 'queen',  nums: [0.22, -0.85, 0.48, -0.01, -0.41, 0.70, -0.15, 0.92] },
  { word: 'pizza',  nums: [-0.63, 0.41, -0.72, 0.88, 0.19, -0.54, 0.37, -0.28] },
  { word: 'italy',  nums: [-0.61, 0.38, -0.69, 0.85, 0.22, -0.51, 0.34, -0.25] },
];

function VectorExample() {
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.75rem', fontSize: 13, color: '#64748b' }}>
        Each word is stored as a list of numbers (here showing the first 8 of 768):
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VEC_EXAMPLES.map(ex => (
          <div key={ex.word} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ width: 48, fontWeight: 700, fontSize: 13, color: '#334155', flexShrink: 0 }}>{ex.word}</span>
            <span style={{ color: '#94a3b8', fontSize: 16, flexShrink: 0 }}>→</span>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {ex.nums.map((v, i) => (
                <span key={i} style={{ padding: '2px 7px', borderRadius: 5, fontSize: 11, fontFamily: 'monospace', background: v > 0 ? '#dbeafe' : '#fee2e2', color: v > 0 ? '#1d4ed8' : '#b91c1c' }}>
                  {v.toFixed(2)}
                </span>
              ))}
              <span style={{ fontSize: 11, color: '#94a3b8' }}>… 760 more</span>
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin: '0.75rem 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        Notice <strong>king</strong> and <strong>queen</strong> have nearly identical numbers — they appear in similar contexts so training pushed their vectors together. <strong>pizza</strong> and <strong>italy</strong> are also close to each other, but far from king/queen. The model figured all of this out on its own — no one typed these numbers in by hand.
      </p>
    </div>
  );
}

// ─── Analogy demo ─────────────────────────────────────────────────────────────
const EMB2: Record<string, [number, number]> = {
  king: [0.9, 0.8], queen: [0.9, -0.8], man: [0.3, 0.7], woman: [0.3, -0.7],
  italy: [-0.8, 0.5], mexico: [-0.8, -0.6], pizza: [0.7, 0.5], taco: [0.7, -0.6],
  japan: [-0.6, 0.7], sushi: [0.6, 0.7], france: [-0.7, 0.6], bread: [0.5, 0.6],
};

const ANALOGIES = [
  { label: 'king − man + woman', a: 'king',  minus: 'man',   plus: 'woman',  expected: 'queen'  },
  { label: 'italy − pizza + taco', a: 'italy', minus: 'pizza', plus: 'taco',   expected: 'mexico' },
  { label: 'japan − sushi + taco', a: 'japan', minus: 'sushi', plus: 'taco',   expected: 'mexico' },
];

function AnalogyDemo() {
  const [idx, setIdx] = useState(0);
  const an = ANALOGIES[idx];
  const target = add2(sub2(EMB2[an.a], EMB2[an.minus]), EMB2[an.plus]);
  const ranked = Object.keys(EMB2).filter(w => w !== an.a && w !== an.minus && w !== an.plus)
    .map(w => ({ w, sim: cos2(target, EMB2[w]) })).sort((a,b)=>b.sim-a.sim);
  const best = ranked[0];
  return (
    <div style={{ margin: '1.5rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {ANALOGIES.map((a, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid', cursor: 'pointer', fontSize: 13, background: idx===i ? '#7c3aed' : '#fff', color: idx===i ? '#fff' : '#334155', borderColor: idx===i ? '#7c3aed' : '#cbd5e1' }}>{a.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: '1rem', fontSize: 16 }}>
        <span style={{ padding: '4px 12px', background: '#ede9fe', color: '#5b21b6', borderRadius: 6, fontWeight: 600 }}>{an.a}</span>
        <span style={{ color: '#dc2626', fontWeight: 700 }}>−</span>
        <span style={{ padding: '4px 12px', background: '#fee2e2', color: '#b91c1c', borderRadius: 6, fontWeight: 600 }}>{an.minus}</span>
        <span style={{ color: '#059669', fontWeight: 700 }}>+</span>
        <span style={{ padding: '4px 12px', background: '#dcfce7', color: '#15803d', borderRadius: 6, fontWeight: 600 }}>{an.plus}</span>
        <span style={{ color: '#64748b', fontWeight: 700 }}>=</span>
        <span style={{ padding: '4px 12px', background: best.w===an.expected ? '#fef9c3' : '#f1f5f9', color: '#92400e', borderRadius: 6, fontWeight: 700, fontSize: 17 }}>≈ {best.w} {best.w===an.expected ? '✓' : '?'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {ranked.slice(0, 4).map(r => (
          <div key={r.w} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 72, fontSize: 13, fontWeight: 500, color: '#334155' }}>{r.w}</span>
            <div style={{ flex: 1, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.max(0,r.sim)*100}%`, background: 'linear-gradient(90deg,#a78bfa,#7c3aed)' }} />
            </div>
            <span style={{ fontSize: 12, color: '#64748b', width: 36, textAlign: 'right' }}>{r.sim.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function Step4() {
  return (
    <div>
      <ExplanationBox title="What Even Is a Vector?">
        <p>
          A <strong>vector</strong> is just a list of numbers — that&apos;s it. <code>[0.24, -0.87, 0.51]</code> is a 3-D vector. Real word embeddings have <strong>768, 1024, or 4096</strong> numbers per word. Each number is a coordinate that places the word somewhere in that space.
        </p>
        <p>
          Two properties are all that matter: <strong>direction</strong> (which way it points — what the word <em>means</em>) and <strong>magnitude</strong> (how long it is — how strongly it expresses that meaning).
        </p>
        <VectorExample />
      </ExplanationBox>

      <ExplanationBox title="Dimensions Are Learned Features">
        <p>
          In the neural network course, <em>we</em> chose the inputs: temperature and humidity, two
          hand-picked features that we knew mattered for rain. An embedding is the same idea with the
          choosing removed. Each of the 768 numbers is a feature of the word — but{' '}
          <strong>the model invents the features itself</strong> during training.
        </p>
        <p>
          One dimension might end up loosely tracking &quot;how royal is this word,&quot; another
          &quot;is this food,&quot; another something no human has a name for. Usually the meaning is
          smeared across many dimensions at once and no single one is readable on its own. That&apos;s
          fine — what matters is the geometry: <strong>words used similarly end up near each other</strong>,
          whatever the individual coordinates mean.
        </p>
      </ExplanationBox>

      <ExplanationBox title="This Isn't New — Google Has Been Doing This for Over a Decade">
        <p>
          Word embeddings didn&apos;t start with ChatGPT. A Google team published <strong>Word2Vec</strong> in 2013 — a model that learned exactly these kinds of vectors by training on billions of web pages. It was the first time anyone showed that <em>king − man + woman ≈ queen</em> actually worked in practice.
        </p>
        <div style={{ margin: '1rem 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { year: '2013', co: 'Google', thing: 'Word2Vec', desc: 'First large-scale word embeddings. The king/queen analogy paper.' },
            { year: '2015', co: 'Google', thing: 'Smart Reply', desc: 'Gmail suggests short replies by embedding your email and matching response vectors.' },
            { year: '2016', co: 'Google', thing: 'Search ranking', desc: 'RankBrain starts using embeddings to understand search queries that have never been seen before.' },
            { year: '2018', co: 'Google', thing: 'BERT', desc: 'Embeddings now depend on context — "bank" next to "river" gets a different vector than "bank" next to "loan."' },
            { year: '2019', co: 'YouTube', thing: 'Recommendations', desc: 'Videos are embedded as vectors. Recommending a video = finding nearest neighbors in that space.' },
            { year: '2022+', co: 'Everyone', thing: 'LLMs', desc: 'GPT-4, Gemini, Claude — all start with an embedding layer doing exactly what you just learned.' },
          ].map(item => (
            <div key={item.year} style={{ padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', background: '#ede9fe', padding: '1px 7px', borderRadius: 4 }}>{item.year}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>{item.thing}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 3 }}>{item.co}</div>
              <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px' }}>
          Every time Google Search understands a weird query you typed, every time YouTube knows what video you&apos;re in the mood for, every time Gmail finishes your sentence — embeddings are doing the work underneath.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Embedding Space — Explore It">
        <p>A token ID like 5789 is just a name tag — arbitrary, meaningless as a number. The model immediately swaps it for a <strong>vector</strong> that places the word somewhere in a high-dimensional meaning space. During training, words that appear in similar contexts get nudged together.</p>
        <div style={{ padding: '16px 20px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>🔭</span>
          <div>
            <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#0369a1', fontSize: 15 }}>See the real thing — 10,000 word vectors</p>
            <p style={{ margin: '0 0 10px', fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              The <strong>TensorFlow Embedding Projector</strong> loads actual pre-trained Word2Vec embeddings and renders them as a 3-D point cloud — the same kind of space inside real models. Each dot is a word. Rotate the cloud and you&apos;ll see countries cluster together, animals cluster together, verbs drift apart from nouns. Click any word to draw lines to its nearest neighbors. Nobody hand-labeled any of this — it emerged purely from predicting text.
            </p>
            <a href="https://projector.tensorflow.org" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', padding: '7px 16px', background: '#0284c7', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              Open TF Embedding Projector →
            </a>
          </div>
        </div>
      </ExplanationBox>

      <ExplanationBox title="How Does the Model Learn These Numbers?">
        <p>
          When training starts, <strong>every single embedding vector is random garbage</strong> — just noise. The model has no idea what &ldquo;pizza&rdquo; means. Then the training loop runs:
        </p>
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '1', title: 'Read a sentence', desc: 'e.g. "I ate pizza in Italy"', color: '#f0f9ff', border: '#bae6fd', tc: '#0369a1' },
            { n: '2', title: 'Make a prediction', desc: 'Given "I ate pizza in _____", predict the next word', color: '#f0fdf4', border: '#bbf7d0', tc: '#15803d' },
            { n: '3', title: 'Measure the error', desc: 'The answer was "Italy" — how wrong was the prediction?', color: '#fff7ed', border: '#fed7aa', tc: '#c2410c' },
            { n: '4', title: 'Nudge the numbers', desc: 'Backpropagation adjusts every number in every vector by a tiny amount to make that prediction a little less wrong', color: '#faf5ff', border: '#e9d5ff', tc: '#6d28d9' },
            { n: '↺', title: 'Repeat ~500 billion times', desc: 'After enough repetitions, "pizza" and "Italy" end up near each other because they kept appearing in the same context', color: '#f8fafc', border: '#e2e8f0', tc: '#334155' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.border, color: s.tc, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.n}</div>
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
          Nobody typed in a single number. The model <strong>discovered</strong> that pizza and Italy are related entirely by noticing they appear together millions of times in text. The numbers are the model&apos;s internal representation of that pattern.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Vector Arithmetic: Meaning You Can Do Math On">
        <p>Because meaning is encoded as direction in geometric space, you can do arithmetic on concepts:</p>
        <MathFormula label="Analogy as arithmetic">king − man + woman ≈ queen</MathFormula>
        <p style={{ marginTop: '0.75rem' }}>Subtract the &ldquo;maleness&rdquo; direction, add the &ldquo;femaleness&rdquo; direction, land near &ldquo;queen.&rdquo; Try it:</p>
        <AnalogyDemo />
        <p>
          That &quot;≈&quot; hides a question, though. The arithmetic lands <em>near</em> queen — but
          what does &quot;near&quot; mean for two lists of 768 numbers? We need a way to{' '}
          <strong>measure</strong> how similar two vectors are. That measurement is the single most-used
          operation inside an LLM, so it gets the whole next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
