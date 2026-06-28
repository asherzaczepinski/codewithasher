'use client';

import { useEffect, useRef, useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// ─── A tiny ~100-word corpus with three obvious topics + function words ──────────
const CORPUS = [
  'the sky is blue',
  'the sun is bright',
  'a cloud is in the sky',
  'the sky is grey',
  'the sun is in the sky',
  'the sea is blue',
  'a wave is in the sea',
  'the ocean is deep',
  'fish are in the water',
  'the wave is in the water',
  'the dog is a pet',
  'a cat is a pet',
  'the dog runs',
  'the cat is furry',
  'the dog barks',
  'pets are furry',
  'the sky is blue',
  'the ocean is blue',
  'the sun is bright',
  'fish are in the sea',
];

const SENTENCES = CORPUS.map(s => s.split(' '));
const VOCAB: string[] = [];
for (const s of SENTENCES) for (const w of s) if (!VOCAB.includes(w)) VOCAB.push(w);
const WORD2I: Record<string, number> = {};
VOCAB.forEach((w, i) => { WORD2I[w] = i; });
const WORD_COUNT = SENTENCES.reduce((a, s) => a + s.length, 0);

// window-2 skip-gram pairs: every (center, nearby) co-occurrence
const PAIRS: [number, number][] = [];
const WINDOW = 2;
for (const s of SENTENCES) {
  for (let i = 0; i < s.length; i++) {
    for (let j = Math.max(0, i - WINDOW); j <= Math.min(s.length - 1, i + WINDOW); j++) {
      if (i !== j) PAIRS.push([WORD2I[s[i]], WORD2I[s[j]]]);
    }
  }
}

// colour each word by its topic — for the eye only; the model never sees these labels
const THEME: Record<string, string> = {
  the: '#94a3b8', is: '#94a3b8', a: '#94a3b8', in: '#94a3b8', are: '#94a3b8',
  sky: '#2563eb', sun: '#2563eb', cloud: '#2563eb', bright: '#2563eb', grey: '#2563eb',
  sea: '#0891b2', wave: '#0891b2', ocean: '#0891b2', deep: '#0891b2', fish: '#0891b2', water: '#0891b2',
  dog: '#d97706', cat: '#d97706', pet: '#d97706', pets: '#d97706', runs: '#d97706', barks: '#d97706', furry: '#d97706',
  blue: '#7c3aed',
};
const colorOf = (w: string) => THEME[w] || '#64748b';

// deterministic RNG so the run is reproducible (no Math.random)
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sigmoid = (x: number) => (x > 30 ? 1 : x < -30 ? 0 : 1 / (1 + Math.exp(-x)));

function freshState() {
  const rng = mulberry32(42);
  const pos = VOCAB.map(() => [(rng() - 0.5) * 0.4, (rng() - 0.5) * 0.4]);
  return { rng, pos };
}

const LR = 0.08, K_NEG = 4, DECAY = 0.0015, CLAMP = 3.5, PER_FRAME = 150, MAX_ITERS = 9000;

function EmbeddingTrainer() {
  const stateRef = useRef<{ rng: () => number; pos: number[][] } | null>(null);
  if (stateRef.current === null) stateRef.current = freshState();
  const [iter, setIter] = useState(0);
  const [running, setRunning] = useState(false);

  function applyPair(pos: number[][], i: number, j: number, label: number) {
    const vi = pos[i], vj = pos[j];
    const dot = vi[0] * vj[0] + vi[1] * vj[1];
    const g = sigmoid(dot) - label; // dLoss/d(dot)
    const gi0 = g * vj[0], gi1 = g * vj[1];
    const gj0 = g * vi[0], gj1 = g * vi[1];
    vi[0] -= LR * gi0; vi[1] -= LR * gi1;
    vj[0] -= LR * gj0; vj[1] -= LR * gj1;
  }

  function trainBatch(steps: number) {
    const { rng, pos } = stateRef.current!;
    const randInt = (n: number) => Math.floor(rng() * n);
    for (let s = 0; s < steps; s++) {
      const [i, j] = PAIRS[randInt(PAIRS.length)];
      applyPair(pos, i, j, 1); // a real co-occurrence: pull together
      for (let k = 0; k < K_NEG; k++) {
        const n = randInt(VOCAB.length);
        if (n !== i && n !== j) applyPair(pos, i, n, 0); // random non-neighbour: push apart
      }
    }
    for (const v of pos) {
      v[0] *= 1 - DECAY; v[1] *= 1 - DECAY;
      v[0] = Math.max(-CLAMP, Math.min(CLAMP, v[0]));
      v[1] = Math.max(-CLAMP, Math.min(CLAMP, v[1]));
    }
  }

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const loop = () => {
      trainBatch(PER_FRAME);
      setIter(n => {
        const next = n + PER_FRAME;
        if (next >= MAX_ITERS) { setRunning(false); return MAX_ITERS; }
        return next;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = () => { stateRef.current = freshState(); setIter(0); setRunning(false); };

  const pos = stateRef.current.pos;
  const SIZE = 340, PAD = 26;
  let maxAbs = 0.5;
  for (const v of pos) maxAbs = Math.max(maxAbs, Math.abs(v[0]), Math.abs(v[1]));
  const scale = (SIZE / 2 - PAD) / maxAbs;
  const px = (x: number) => SIZE / 2 + x * scale;
  const py = (y: number) => SIZE / 2 - y * scale;

  const neighbours = (word: string, k: number) => {
    const a = pos[WORD2I[word]];
    return VOCAB
      .map((w, i) => ({ w, d: Math.hypot(pos[i][0] - a[0], pos[i][1] - a[1]) }))
      .filter(o => o.w !== word)
      .sort((x, y) => x.d - y.d)
      .slice(0, k)
      .map(o => o.w);
  };

  const progress = Math.min(100, Math.round((iter / MAX_ITERS) * 100));

  return (
    <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.8rem', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
        Every word starts as a random dot — pure noise, no meaning. Press <strong>Train</strong> and the
        only rule running is: <em>words that share a context get pulled together, random pairs get pushed
        apart.</em> Watch the topics sort themselves out.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ width: '100%', maxWidth: 340, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, flexShrink: 0 }}>
          {pos.map((v, i) => (
            <g key={VOCAB[i]}>
              <circle cx={px(v[0])} cy={py(v[1])} r={4} fill={colorOf(VOCAB[i])} opacity={0.9} />
              <text x={px(v[0]) + 6} y={py(v[1]) + 3.5} fontSize={10.5} fontWeight={600} fill={colorOf(VOCAB[i])}>{VOCAB[i]}</text>
            </g>
          ))}
        </svg>
        <div style={{ flex: 1, minWidth: 190 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setRunning(r => !r)}
              style={{ padding: '7px 16px', fontSize: 13, fontWeight: 600, color: '#fff', background: '#7c3aed', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              {running ? 'Pause' : iter >= MAX_ITERS ? 'Done' : iter > 0 ? 'Resume' : 'Train ▶'}
            </button>
            <button onClick={() => { if (!running) { trainBatch(PER_FRAME * 4); setIter(n => Math.min(MAX_ITERS, n + PER_FRAME * 4)); } }}
              disabled={running || iter >= MAX_ITERS}
              style={{ padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#5b21b6', background: '#fff', border: '1px solid #c4b5fd', borderRadius: 8, cursor: running || iter >= MAX_ITERS ? 'default' : 'pointer', opacity: running || iter >= MAX_ITERS ? 0.4 : 1 }}>
              Step
            </button>
            <button onClick={reset}
              style={{ padding: '7px 14px', fontSize: 13, fontWeight: 600, color: '#64748b', background: '#fff', border: '1px solid #cbd5e1', borderRadius: 8, cursor: 'pointer' }}>
              Reset
            </button>
          </div>
          <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#a78bfa,#7c3aed)', transition: 'width 0.1s' }} />
          </div>
          <p style={{ margin: '0 0 12px', fontSize: 11, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
            {iter.toLocaleString()} updates
          </p>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6 }}>
              nearest to <strong style={{ color: colorOf('sky') }}>sky</strong>:{' '}
              {neighbours('sky', 3).map(w => <span key={w} style={{ color: colorOf(w), fontWeight: 600 }}>{w} </span>)}
            </div>
            <div style={{ marginBottom: 6 }}>
              nearest to <strong style={{ color: colorOf('ocean') }}>ocean</strong>:{' '}
              {neighbours('ocean', 3).map(w => <span key={w} style={{ color: colorOf(w), fontWeight: 600 }}>{w} </span>)}
            </div>
            <div>
              nearest to <strong style={{ color: colorOf('dog') }}>dog</strong>:{' '}
              {neighbours('dog', 3).map(w => <span key={w} style={{ color: colorOf(w), fontWeight: 600 }}>{w} </span>)}
            </div>
          </div>
        </div>
      </div>
      <p style={{ margin: '0.9rem 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
        At the start the &ldquo;nearest&rdquo; lists are random junk. After training, <strong>sky</strong>
        &apos;s neighbours are sun / cloud / blue, and <strong>dog</strong>&apos;s are cat / pet / barks —
        purely because those words kept the same company. Nobody labelled a single dot.
      </p>
    </div>
  );
}

// ─── Static schematic of the skip-gram network that produces the embeddings ──────
function SkipGramDiagram() {
  const inputs = [
    { w: 'the', on: false }, { w: 'sky', on: true }, { w: 'is', on: false }, { w: 'blue', on: false }, { w: 'dog', on: false },
  ];
  const outputs = [
    { w: 'blue', p: 0.31 }, { w: 'sun', p: 0.24 }, { w: 'cloud', p: 0.18 }, { w: 'is', p: 0.12 }, { w: 'dog', p: 0.03 },
  ];
  const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' };
  const arrow: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11, minWidth: 70, gap: 2 };
  return (
    <div style={{ margin: '1.5rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
        {/* input one-hot */}
        <div style={col}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>input word</div>
          {inputs.map(n => (
            <div key={n.w} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 30, textAlign: 'right', fontSize: 11, fontWeight: 600, color: n.on ? '#5b21b6' : '#cbd5e1' }}>{n.w}</span>
              <span style={{ width: 22, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: n.on ? '#7c3aed' : '#eef2f7', color: n.on ? '#fff' : '#94a3b8' }}>{n.on ? 1 : 0}</span>
            </div>
          ))}
        </div>

        <div style={arrow}><span style={{ fontWeight: 700, color: '#7c3aed' }}>W</span><span>embedding</span><span>matrix</span><span style={{ fontSize: 16 }}>→</span></div>

        {/* hidden = sky's row */}
        <div style={col}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>sky&apos;s vector</div>
          {[1.0, 0.7, 0.0].map((v, i) => (
            <span key={i} style={{ width: 44, height: 22, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'monospace', fontWeight: 700, background: '#ede9fe', color: '#4c1d95' }}>{v.toFixed(1)}</span>
          ))}
        </div>

        <div style={arrow}><span style={{ fontWeight: 700, color: '#0891b2' }}>W&prime;</span><span>context</span><span>matrix</span><span style={{ fontSize: 16 }}>→</span></div>

        {/* output softmax over context words */}
        <div style={col}>
          <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>P(nearby word)</div>
          {outputs.map(o => (
            <div key={o.w} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 32, textAlign: 'right', fontSize: 11, fontWeight: 600, color: colorOf(o.w) }}>{o.w}</span>
              <div style={{ width: 60, height: 12, background: '#eef2f7', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${o.p * 100 / 0.31}%`, background: colorOf(o.w) }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ margin: '1rem 0 0', fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
        Feed in one word, ask the network to predict the words <em>around</em> it. The arrows are two grids
        of weights, <strong style={{ color: '#7c3aed' }}>W</strong> and <strong style={{ color: '#0891b2' }}>W&prime;</strong> —
        exactly the kind of weight matrices from the neural-network course. The clever part:{' '}
        <strong>row number 6766 of W <em>is</em> sky&apos;s embedding.</strong> Training the network to
        predict context automatically trains those rows into the vectors we use.
      </p>
    </div>
  );
}

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Let's Actually Watch One Learn">
        <p>
          We keep saying the embeddings are &ldquo;learned from context.&rdquo; That is easy to say and easy
          to not believe. So let&apos;s build a real one and watch it happen. Below is a tiny corpus — about{' '}
          <strong>{WORD_COUNT} words</strong> across {SENTENCES.length} toy sentences, with{' '}
          <strong>{VOCAB.length} unique words</strong> falling into three obvious topics (sky, sea, animals)
          plus the usual glue words.
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12.5, color: '#475569', lineHeight: 1.9, columns: 2 }}>
          {CORPUS.map((s, i) => <div key={i}>{s}</div>)}
        </div>
        <p>
          Each word gets just <strong>two</strong> numbers to start (so we can plot it on a flat graph), set
          to random noise. The model cannot see our topic colours — it only sees which words sit next to
          which.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Meaning Is Literally Co-occurrence Counting">
        <p>
          Here is the entire learning rule, and it is dumber than you&apos;d expect: go through the corpus,
          and for every pair of words that appear within a couple of slots of each other, nudge their two
          dots a little <strong>closer</strong>. To stop everything collapsing into one blob, also pick a few
          random word pairs that <em>didn&apos;t</em> occur together and nudge those a little{' '}
          <strong>apart</strong>. That is it. Repeat thousands of times.
        </p>
        <p>
          Notice what the rule is made of: nothing but <strong>how often words appear near each other</strong>.
          No grammar, no definitions, no labels. Press Train and watch random static resolve into topics —
          sky-words drift into one clump, sea-words into another, animals into a third, and the glue words
          (the, is, a) pool together because they sit beside everything:
        </p>
        <EmbeddingTrainer />
        <p>
          The word <strong style={{ color: '#7c3aed' }}>blue</strong> is the tell. It floats{' '}
          <em>between</em> the sky and sea clumps, because it genuinely keeps both kinds of company
          (&ldquo;the sky is blue,&rdquo; &ldquo;the ocean is blue&rdquo;). The geometry recorded a real
          fact about the word, and all it ever counted was neighbours.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Actual Network Doing It">
        <p>
          Our demo nudged dots directly to keep things visual. A real model gets the <em>same</em> result
          through a small neural network — the one Word2Vec made famous — and it is built from exactly the
          pieces you already know. The job: given a word, predict the words likely to appear around it.
        </p>
        <SkipGramDiagram />
        <p>
          Trace it left to right. The input word is a <strong>one-hot</strong> column — all zeros except a
          single 1 marking which word it is. Multiplying that by the weight matrix{' '}
          <strong style={{ color: '#7c3aed' }}>W</strong> simply <em>selects one row</em> — and that row is
          the word&apos;s embedding. The second matrix{' '}
          <strong style={{ color: '#0891b2' }}>W&prime;</strong> turns that little vector into a score for
          every word in the vocabulary, and a <strong>softmax</strong> (the same one from the rain network)
          squashes the scores into probabilities of being a nearby word.
        </p>
      </ExplanationBox>

      <ExplanationBox title="It's the Same Loop From the Neural-Network Course">
        <p>
          Nothing here is new machinery — it is <strong>predict → measure → adjust</strong>, the loop you
          already ran, pointed at text:
        </p>
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { n: '1', title: 'Predict', desc: 'Feed in "sky"; the network outputs a probability for every word being a neighbour — at first, random nonsense', tc: '#15803d', bg: '#bbf7d0' },
            { n: '2', title: 'Measure', desc: 'The real neighbours were "blue", "sun", "cloud". How little probability did the network give them? That gap is the loss', tc: '#c2410c', bg: '#fed7aa' },
            { n: '3', title: 'Adjust', desc: 'Backprop nudges every weight in W and W\' — including sky\'s row — to make the true neighbours a bit likelier next time', tc: '#6d28d9', bg: '#e9d5ff' },
            { n: '↺', title: 'Repeat', desc: 'Over the whole corpus, thousands of times. Words with the same neighbours get pushed to the same rows of W, all on their own', tc: '#334155', bg: '#e2e8f0' },
          ].map(s => (
            <div key={s.n} style={{ display: 'flex', gap: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.bg, color: s.tc, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.n}</div>
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
          When training stops, we throw the network away and <strong>keep the rows of W</strong> — that table
          of vectors is the embedding. A real model trains it on billions of sentences with hundreds of
          numbers per word, but the recipe is the toy you just watched: predict the company, measure the
          miss, nudge the weights.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You Just Trained an Embedding">
        <p>
          That is the whole story of where embedding numbers come from: not typed in, not defined, but{' '}
          <strong>discovered</strong> — pulled into place by nothing more than which words keep each other
          company, through the same <strong>predict → measure → adjust</strong> loop you already knew. And
          this is no toy we cooked up for the course: the very same trick has been quietly running real
          products for over a decade. That story — and a way to go explore real trained vectors yourself —
          is the next tab.
        </p>
      </ExplanationBox>
    </div>
  );
}
