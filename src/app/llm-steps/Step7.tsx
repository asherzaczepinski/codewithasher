'use client';

import type { CSSProperties, ReactNode } from 'react';
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
const WORD_COUNT = SENTENCES.reduce((a, s) => a + s.length, 0);

// co-occurrence: for each word, tally which other words sit within a couple of slots of it
const WINDOW = 2;
const NEIGH: Record<string, Record<string, number>> = {};
for (const s of SENTENCES) {
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    NEIGH[c] = NEIGH[c] || {};
    for (let j = Math.max(0, i - WINDOW); j <= Math.min(s.length - 1, i + WINDOW); j++) {
      if (i !== j) NEIGH[c][s[j]] = (NEIGH[c][s[j]] || 0) + 1;
    }
  }
}
// unique neighbours of a word, most-frequent first (deterministic order)
const neighboursOf = (w: string) =>
  Object.entries(NEIGH[w] || {}).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(e => e[0]);
const sharedNeighbours = (a: string, b: string) => {
  const nb = new Set(neighboursOf(b));
  return neighboursOf(a).filter(w => nb.has(w));
};
const GLUE = new Set(['the', 'is', 'a', 'in', 'are']);

// colour each word by its topic — for the eye only; the model never sees these labels
const THEME: Record<string, string> = {
  the: '#94a3b8', is: '#94a3b8', a: '#94a3b8', in: '#94a3b8', are: '#94a3b8',
  sky: '#2563eb', sun: '#2563eb', cloud: '#2563eb', bright: '#2563eb', grey: '#2563eb',
  sea: '#0891b2', wave: '#0891b2', ocean: '#0891b2', deep: '#0891b2', fish: '#0891b2', water: '#0891b2',
  dog: '#d97706', cat: '#d97706', pet: '#d97706', pets: '#d97706', runs: '#d97706', barks: '#d97706', furry: '#d97706',
  blue: '#7c3aed',
};
const colorOf = (w: string) => THEME[w] || '#64748b';

// a single word rendered in its topic colour
function Word({ w }: { w: string }) {
  return <strong style={{ color: colorOf(w) }}>{w}</strong>;
}

// a word "chip": highlighted if shared, dimmed if it's a glue word
function Chip({ w, kind }: { w: string; kind: 'glue' | 'shared' | 'normal' }) {
  const c = colorOf(w);
  return (
    <span style={{
      display: 'inline-block', margin: '2px 3px', padding: '2px 9px', borderRadius: 999,
      fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
      background: kind === 'shared' ? '#fef9c3' : '#fff',
      color: kind === 'glue' ? '#94a3b8' : c,
      border: `1.5px solid ${kind === 'shared' ? '#eab308' : kind === 'glue' ? '#e2e8f0' : c + '66'}`,
      opacity: kind === 'glue' ? 0.75 : 1,
    }}>{w}</span>
  );
}

function ChipRow({ words, highlight }: { words: string[]; highlight?: Set<string> }) {
  return (
    <div style={{ margin: '4px 0' }}>
      {words.map(w => (
        <Chip key={w} w={w} kind={highlight?.has(w) ? 'shared' : GLUE.has(w) ? 'glue' : 'normal'} />
      ))}
    </div>
  );
}

// a tiny STATIC sketch: sky & ocean near each other, dog far away
function DistanceSketch() {
  const pts = [
    { w: 'sky', x: 70, y: 50 }, { w: 'ocean', x: 96, y: 70 }, { w: 'blue', x: 78, y: 98 },
    { w: 'dog', x: 225, y: 138 },
  ];
  return (
    <svg viewBox="0 0 280 175" style={{ width: '100%', maxWidth: 320, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, margin: '6px 0' }}>
      <ellipse cx={82} cy={72} rx={46} ry={42} fill="#eff6ff" stroke="#bfdbfe" />
      {pts.map(p => (
        <g key={p.w}>
          <circle cx={p.x} cy={p.y} r={4} fill={colorOf(p.w)} />
          <text x={p.x + 7} y={p.y + 4} fontSize={11} fontWeight={700} fill={colorOf(p.w)}>{p.w}</text>
        </g>
      ))}
    </svg>
  );
}

function NeighbourStepThrough() {
  const skyN = neighboursOf('sky');
  const oceanN = neighboursOf('ocean');
  const dogN = neighboursOf('dog');
  const skyOcean = new Set(sharedNeighbours('sky', 'ocean'));
  const skyDog = new Set(sharedNeighbours('sky', 'dog'));

  const steps: ReactNode[] = [
    <>
      <p style={{ margin: '0 0 8px' }}>
        The model can&apos;t see meanings — only text. So take the word <Word w="sky" /> and scan every
        sentence for the words sitting right beside it (within a word or two). Here is its{' '}
        <strong>complete</strong> neighbour list:
      </p>
      <ChipRow words={skyN} />
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        That list is <em>everything</em> the model knows about <Word w="sky" /> — not a definition, just
        the company it keeps.
      </p>
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        Now do the exact same thing for a different word, <Word w="ocean" />:
      </p>
      <ChipRow words={oceanN} />
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        Notice <Word w="sky" /> and <Word w="ocean" /> never appear in the same sentence — so far the model
        has no hint at all that they&apos;re related.
      </p>
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        Now line the two lists up and look for words they <strong>both</strong> keep company with
        (highlighted):
      </p>
      <div style={{ fontSize: 13 }}><span style={{ color: '#64748b' }}>sky&nbsp;&nbsp;</span><ChipRow words={skyN} highlight={skyOcean} /></div>
      <div style={{ fontSize: 13 }}><span style={{ color: '#64748b' }}>ocean&nbsp;</span><ChipRow words={oceanN} highlight={skyOcean} /></div>
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        They overlap on <Word w="blue" /> — plus glue words like <em>the</em> and <em>is</em>. Throw the
        glue out: words like <em>the</em> sit next to almost everything, so they don&apos;t single anyone
        out. The real shared signal is the content word <Word w="blue" />.
      </p>
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        For contrast, take a word from a totally different world, <Word w="dog" />:
      </p>
      <ChipRow words={dogN} highlight={skyDog} />
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        Compared with <Word w="sky" />, the only words in common are <em>the</em> and <em>is</em> — pure
        glue, no content word shared. <Word w="sky" /> and <Word w="dog" /> keep completely different
        company.
      </p>
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        Here is the only rule, in one line: <strong>the more real neighbours two words share, the closer
        together we place their dots.</strong>
      </p>
      <ul style={{ margin: '0 0 8px', paddingLeft: '1.2rem', fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
        <li><Word w="sky" /> and <Word w="ocean" /> share a content word (<Word w="blue" />) → placed <strong>close</strong>.</li>
        <li><Word w="sky" /> and <Word w="dog" /> share only glue → pushed <strong>far apart</strong>.</li>
      </ul>
      <DistanceSketch />
    </>,
    <>
      <p style={{ margin: 0 }}>
        So, the question we started with: <strong>does the model know what &ldquo;sky&rdquo; means?</strong>{' '}
        <strong style={{ color: '#5b21b6' }}>No.</strong> It never learns that the sky is the blue thing
        overhead. It only ever learns <strong>who each word&apos;s neighbours are</strong>, and it calls two
        words &ldquo;similar&rdquo; when they share neighbours. &ldquo;Meaning,&rdquo; here, is nothing more
        than <em>keeps similar company</em> — similarity measured purely by overlapping neighbours. The
        astonishing part of the rest of this course is that this turns out to be enough.
      </p>
    </>,
  ];

  const card: CSSProperties = { padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 8 };

  return (
    <div style={{ margin: '1.25rem 0' }}>
      {steps.map((node, i) => (
        <div key={i} style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', marginBottom: 6, letterSpacing: 0.3 }}>STEP {i + 1}</div>
          <div style={{ fontSize: 14.5, color: '#1e293b', lineHeight: 1.65 }}>{node}</div>
        </div>
      ))}
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
  const col: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' };
  const arrow: CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11, minWidth: 70, gap: 2 };
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
      <ExplanationBox title="Let's Work It Out by Hand">
        <p>
          We keep claiming the embedding numbers are &ldquo;learned from context.&rdquo; That is easy to say
          and easy not to believe. So let&apos;s pin down exactly how it works — slowly, by hand, on real
          sentences you can check yourself.
        </p>
        <p>
          First the model needs some text to learn from. We&apos;ll give it a tiny <strong>training
          set</strong> — just a small pile of example sentences. (The proper word for &ldquo;the text a model
          learns from&rdquo; is a <strong>corpus</strong>. A real one is billions of web pages; ours is the{' '}
          {SENTENCES.length} toy sentences below, about {WORD_COUNT} words total.) They use only{' '}
          {VOCAB.length} different words, which happen to fall into three clear topics —{' '}
          <strong>sky</strong>, <strong>sea</strong>, and <strong>animals</strong> — plus little glue words
          like &ldquo;the&rdquo; and &ldquo;is.&rdquo;
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12.5, color: '#475569', lineHeight: 1.9, columns: 2 }}>
          {CORPUS.map((s, i) => <div key={i}>{s}</div>)}
        </div>
        <p>
          Our goal is to give every one of those {VOCAB.length} words a spot on a map, so that words with
          similar meanings land near each other. The catch — and the whole point — is that the model never
          sees our topic colours and is never told what any word means. The <em>only</em> thing it gets to
          look at is which words sit next to which in those sentences. Let&apos;s see how that alone is
          enough.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Wait — Does It Even Know What Words Mean?">
        <p>
          This is the question worth nailing, because the honest answer is surprising:{' '}
          <strong>no — the model never knows what a word means.</strong> It cannot picture the sky or feel
          that water is wet. The only thing it ever receives is text, so the only thing it can possibly
          learn is <strong>which words appear near which</strong>. Everything we call &ldquo;meaning&rdquo;
          has to be squeezed out of that single fact.
        </p>
        <p>
          So how does &ldquo;sky and ocean are similar&rdquo; ever fall out of plain neighbour-watching?
          Here is the whole thing, one move at a time — every step is something you could do by hand with the{' '}
          {SENTENCES.length} sentences above:
        </p>
        <NeighbourStepThrough />
      </ExplanationBox>

      <ExplanationBox title="The Actual Network Doing It">
        <p>
          We just did that by hand — list a word&apos;s neighbours, compare, place it close or far. A real
          model reaches the <em>same</em> place automatically, with a small neural network — the one
          Word2Vec made famous — built from pieces you already know. Its job is our rule in disguise:{' '}
          <strong>given a word, predict the words likely to appear around it.</strong>
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

    </div>
  );
}
