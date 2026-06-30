'use client';

import { useState } from 'react';
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
// every sentence that contains a word (duplicates kept — they are what drive the counts)
const sentencesWith = (w: string) => SENTENCES.filter(s => s.includes(w));

// a single word, emphasised (no topic colour — colours fight colour-named words)
function Word({ w }: { w: string }) {
  return <strong style={{ color: '#334155' }}>{w}</strong>;
}

// a word "chip", coloured only by ROLE: yellow = shared, dim = glue, plain otherwise
function Chip({ w, kind }: { w: string; kind: 'glue' | 'shared' | 'normal' }) {
  return (
    <span style={{
      display: 'inline-block', margin: '2px 3px', padding: '2px 9px', borderRadius: 999,
      fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
      background: kind === 'shared' ? '#fef9c3' : '#fff',
      color: kind === 'shared' ? '#854d0e' : kind === 'glue' ? '#94a3b8' : '#334155',
      border: `1.5px solid ${kind === 'shared' ? '#eab308' : kind === 'glue' ? '#e2e8f0' : '#cbd5e1'}`,
      opacity: kind === 'glue' ? 0.8 : 1,
    }}>{w}</span>
  );
}

function ChipRow({ words, highlight, anchor }: { words: string[]; highlight?: Set<string>; anchor?: string }) {
  return (
    <div style={{ margin: '4px 0', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
      {anchor && (
        <>
          <span style={{ display: 'inline-block', margin: '2px 4px 2px 0', padding: '3px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', background: '#334155', color: '#fff' }}>{anchor}</span>
          <span style={{ color: '#94a3b8', fontSize: 12, margin: '0 6px 0 2px' }}>sits next to →</span>
        </>
      )}
      {words.map(w => (
        <Chip key={w} w={w} kind={highlight?.has(w) ? 'shared' : GLUE.has(w) ? 'glue' : 'normal'} />
      ))}
    </div>
  );
}

// the corpus sentences containing `focus`, with focus + its window-neighbours highlighted
function SentencesWith({ focus }: { focus: string }) {
  return (
    <div style={{ margin: '8px 0', padding: '10px 12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, lineHeight: 2.1 }}>
      {sentencesWith(focus).map((s, si) => {
        const fi = s.indexOf(focus);
        return (
          <div key={si}>
            {s.map((w, i) => {
              const isFocus = i === fi;
              const isNeighbour = !isFocus && Math.abs(i - fi) <= WINDOW;
              return (
                <span key={i} style={{
                  padding: '1px 5px', margin: '0 1px', borderRadius: 4,
                  fontWeight: isFocus ? 700 : isNeighbour ? 600 : 400,
                  background: isFocus ? '#334155' : isNeighbour ? '#fef9c3' : 'transparent',
                  color: isFocus ? '#fff' : isNeighbour ? '#854d0e' : '#cbd5e1',
                }}>{w}</span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// horizontal bar chart of how often each word sits beside `focus`
function TallyChart({ focus }: { focus: string }) {
  const words = neighboursOf(focus);
  const counts = words.map(w => NEIGH[focus][w]);
  const max = Math.max(...counts);
  return (
    <div style={{ margin: '8px 0', padding: '12px 14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
      {words.map((w, i) => {
        const glue = GLUE.has(w);
        return (
          <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i === words.length - 1 ? 0 : 5 }}>
            <span style={{ width: 44, textAlign: 'right', fontSize: 12.5, fontWeight: 600, color: glue ? '#94a3b8' : '#334155' }}>{w}</span>
            <div style={{ flex: 1, height: 16, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(counts[i] / max) * 100}%`, background: glue ? '#cbd5e1' : '#7c3aed', borderRadius: 4 }} />
            </div>
            <span style={{ width: 28, fontSize: 12.5, fontWeight: 700, color: '#475569' }}>×{counts[i]}</span>
          </div>
        );
      })}
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
      {pts.map(p => {
        const c = p.w === 'dog' ? '#94a3b8' : '#7c3aed';
        return (
          <g key={p.w}>
            <circle cx={p.x} cy={p.y} r={4} fill={c} />
            <text x={p.x + 7} y={p.y + 4} fontSize={11} fontWeight={700} fill={c}>{p.w}</text>
          </g>
        );
      })}
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
        Take <Word w="sky" /> — the same word from our running example &ldquo;The sky is.&rdquo; The model
        can&apos;t see what it means, only text, so it pulls up every sentence that contains{' '}
        <Word w="sky" /> and looks at the words sitting right beside it (within a word or two — those are{' '}
        <strong>highlighted</strong>):
      </p>
      <SentencesWith focus="sky" />
      <p style={{ margin: '8px 0' }}>
        Now just <strong>count</strong> how many times each highlighted word landed beside <Word w="sky" />{' '}
        across those {sentencesWith('sky').length} sentences. That tally is the chart below — and it{' '}
        <em>is</em> <Word w="sky" />&apos;s neighbour list:
      </p>
      <TallyChart focus="sky" />
      <p style={{ margin: '8px 0' }}>
        Written as a row of chips — the format we&apos;ll reuse for the other words:
      </p>
      <ChipRow words={skyN} anchor="sky" />
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        That tally — which words keep <Word w="sky" /> company, and how often — is <em>everything</em> the
        model knows about it. Not a definition. Just the company it keeps.
      </p>
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        Now pick a second word to hold <Word w="sky" /> up against — say <Word w="ocean" /> — and do the
        exact same thing, just list its neighbours:
      </p>
      <ChipRow words={oceanN} anchor="ocean" />
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
      <ChipRow words={skyN} highlight={skyOcean} anchor="sky" />
      <ChipRow words={oceanN} highlight={skyOcean} anchor="ocean" />
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
      <ChipRow words={dogN} highlight={skyDog} anchor="dog" />
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

// ─── A live training loop on ONE 3-number vector: sky ────────────────────────────
const SKY_START: [number, number, number] = [0.50, 0.50, 0.50];
const OCEAN_VEC: [number, number, number] = [0.85, 0.30, 0.70]; // shares "blue" → pull toward
const DOG_VEC: [number, number, number] = [0.15, 0.85, 0.20];   // shares nothing → push away
const PULL = 0.18;   // fraction of the gap to ocean we close each step
const PUSH = 0.020;  // strength of the shove away from dog (fades with distance)

const dist3 = (a: number[], b: number[]) =>
  Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));

function trainStep(cur: [number, number, number]) {
  const pull = cur.map((v, i) => PULL * (OCEAN_VEC[i] - v));
  const d2 = Math.max(1e-4, cur.reduce((s, v, i) => s + (v - DOG_VEC[i]) ** 2, 0));
  const push = cur.map((v, i) => (PUSH * (v - DOG_VEC[i])) / d2);
  const next = cur.map((v, i) => Math.min(1, Math.max(0, v + pull[i] + push[i]))) as [number, number, number];
  return { next, pull, push };
}

function DimTrack({ label, sky, ocean, dog }: { label: string; sky: number; ocean: number; dog: number }) {
  const dot = (x: number, color: string, fill: string, z: number, txt?: string) => (
    <div style={{ position: 'absolute', left: `${x * 100}%`, top: '50%', transform: 'translate(-50%,-50%)', zIndex: z, textAlign: 'center' }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: fill, border: `2px solid ${color}` }} />
      {txt && <div style={{ fontSize: 9, fontWeight: 700, color, marginTop: 1, whiteSpace: 'nowrap' }}>{txt}</div>}
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '10px 0' }}>
      <span style={{ width: 28, fontSize: 12, fontWeight: 700, color: '#475569' }}>{label}</span>
      <div style={{ position: 'relative', flex: 1, height: 26, background: '#f1f5f9', borderRadius: 6 }}>
        {dot(dog, '#94a3b8', '#e2e8f0', 1, 'dog')}
        {dot(ocean, '#7c3aed', '#ede9fe', 2, 'ocean')}
        {dot(sky, '#0f172a', '#0f172a', 3)}
      </div>
      <span style={{ width: 42, fontSize: 12, fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>{sky.toFixed(2)}</span>
    </div>
  );
}

function TrainingLoopSim() {
  const [sky, setSky] = useState<[number, number, number]>(SKY_START);
  const [step, setStep] = useState(0);
  const [last, setLast] = useState<{ pull: number[]; push: number[] } | null>(null);

  const advance = (n: number) => {
    let cur = sky;
    let rec: { pull: number[]; push: number[] } | null = last;
    for (let k = 0; k < n; k++) {
      const r = trainStep(cur);
      cur = r.next;
      rec = { pull: r.pull, push: r.push };
    }
    setSky(cur);
    setLast(rec);
    setStep(step + n);
  };
  const reset = () => { setSky(SKY_START); setStep(0); setLast(null); };

  const dOcean = dist3(sky, OCEAN_VEC);
  const dDog = dist3(sky, DOG_VEC);
  const btn: CSSProperties = { padding: '7px 14px', fontSize: 13, fontWeight: 700, borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', color: '#334155', cursor: 'pointer' };
  const btnPrimary: CSSProperties = { ...btn, background: '#7c3aed', color: '#fff', border: '1px solid #7c3aed' };

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.1rem 1.2rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <strong style={{ fontSize: 14, color: '#1e293b' }}>sky = ({sky.map(v => v.toFixed(2)).join(', ')})</strong>
        <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 700 }}>training step {step}</span>
      </div>
      <DimTrack label="x" sky={sky[0]} ocean={OCEAN_VEC[0]} dog={DOG_VEC[0]} />
      <DimTrack label="y" sky={sky[1]} ocean={OCEAN_VEC[1]} dog={DOG_VEC[1]} />
      <DimTrack label="z" sky={sky[2]} ocean={OCEAN_VEC[2]} dog={DOG_VEC[2]} />

      <div style={{ display: 'flex', gap: 14, margin: '12px 0 4px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 150, padding: '8px 11px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#15803d' }}>distance to ocean (pulling closer)</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#166534', fontVariantNumeric: 'tabular-nums' }}>{dOcean.toFixed(3)}</div>
        </div>
        <div style={{ flex: 1, minWidth: 150, padding: '8px 11px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c' }}>distance to dog (pushing away)</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#991b1b', fontVariantNumeric: 'tabular-nums' }}>{dDog.toFixed(3)}</div>
        </div>
      </div>

      {last && (
        <p style={{ margin: '8px 0 0', fontSize: 12.5, color: '#64748b', lineHeight: 1.6 }}>
          Last step nudged each number by <strong style={{ color: '#15803d' }}>pull</strong> (toward ocean) ={' '}
          [{last.pull.map(v => v.toFixed(3)).join(', ')}] plus{' '}
          <strong style={{ color: '#b91c1c' }}>push</strong> (away from dog) ={' '}
          [{last.push.map(v => v.toFixed(3)).join(', ')}].
        </p>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button style={btnPrimary} onClick={() => advance(1)}>Run one step</button>
        <button style={btn} onClick={() => advance(10)}>Run 10 steps</button>
        <button style={btn} onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default function Step6() {
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

      <ExplanationBox title="What the &ldquo;Dots&rdquo; Actually Are: an x and a y">
        <p>
          We kept saying &ldquo;place the dots close or far.&rdquo; Time to be literal about what a dot{' '}
          <em>is</em>. Each word is stored as a tiny list of numbers — its <strong>coordinates</strong> on
          the map. On our flat graph that is just <strong>two</strong> numbers, an <strong>x</strong> and a{' '}
          <strong>y</strong>. That pair <em>is</em> the word&apos;s embedding; nothing else about the word is
          kept. After running the pull-together / push-apart rule over our sentences, the words settle at
          coordinates something like:
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, fontFamily: 'monospace', fontSize: 13.5, color: '#334155', lineHeight: 1.9 }}>
          <div><strong>sky</strong>&nbsp;&nbsp;= (x 0.90, y 0.20)</div>
          <div><strong>ocean</strong> = (x 0.80, y 0.35)</div>
          <div><strong>dog</strong>&nbsp;&nbsp;= (x 0.10, y 0.90)</div>
        </div>
        <p>
          Now &ldquo;close&rdquo; stops being a feeling and becomes a <strong>number</strong>: the
          straight-line distance between two points, the same Pythagoras you already know —{' '}
          <code>distance = √((x₁−x₂)² + (y₁−y₂)²)</code>. Plug our words in:
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#ede9fe', borderRadius: 8, fontFamily: 'monospace', fontSize: 13, color: '#4c1d95', lineHeight: 1.9 }}>
          <div>sky → ocean: √((0.90−0.80)² + (0.20−0.35)²) = √(0.01 + 0.0225) ≈ <strong>0.18</strong></div>
          <div>sky → dog:&nbsp;&nbsp;&nbsp;√((0.90−0.10)² + (0.20−0.90)²) = √(0.64 + 0.49) ≈ <strong>1.06</strong></div>
        </div>
        <p>
          <strong>sky</strong> sits about <strong>six times closer</strong> to <strong>ocean</strong> than
          to <strong>dog</strong> — the exact similarity we read off the neighbour lists, now boiled down to
          one number. And nobody <em>computed</em> these coordinates from a formula: every word started at a
          <em> random</em> (x, y), and the rule — tug shared-neighbour words together, push the rest apart —
          was applied over and over, nudging each x and y a hair at a time until everything settled. The
          settled coordinates are what we keep and call the embedding.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Watch One Vector Actually Learn">
        <p>
          Coordinates settling &ldquo;a hair at a time&rdquo; is the kind of thing you only believe once you
          watch it. So let&apos;s track a <strong>single</strong> vector — <Word w="sky" /> — through the loop
          and run the rule by hand. We&apos;ll give it <strong>three</strong> numbers this time (an x, a y,
          and a z) instead of two: still tiny enough to read, but a step toward the hundreds a real model
          uses.
        </p>
        <p>
          There are exactly two forces, and every step applies both:
        </p>
        <ul style={{ margin: '0 0 8px', paddingLeft: '1.2rem', fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
          <li>
            <strong style={{ color: '#15803d' }}>Pull</strong> — <Word w="sky" /> shares a neighbour
            (<Word w="blue" />) with <Word w="ocean" />, so we move it a fraction of the way <em>toward</em>{' '}
            ocean: nudge each number a slice of the gap that&apos;s left.
          </li>
          <li>
            <strong style={{ color: '#b91c1c' }}>Push</strong> — <Word w="sky" /> shares nothing with{' '}
            <Word w="dog" />, so we shove it a little <em>away</em> from dog (a shove that fades as the two
            drift apart).
          </li>
        </ul>
        <p>
          Add both nudges to sky&apos;s three numbers, clamp them to the map, and repeat. Hit the button and
          watch the dark <strong>sky</strong> dot slide toward <strong style={{ color: '#7c3aed' }}>ocean</strong>{' '}
          and away from <strong style={{ color: '#94a3b8' }}>dog</strong> on every axis — the green distance
          shrinking, the red one growing:
        </p>
        <TrainingLoopSim />
        <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0' }}>
          Nobody placed sky here. It started at a flat (0.50, 0.50, 0.50) and these exact two forces, repeated,
          carried it to its spot. That is the entire training loop — just run billions of times, over every
          word at once.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Now Scale It Up to a Real LLM">
        <p>
          A real model does <em>exactly</em> this — just enormous in every direction. It doesn&apos;t embed a
          handful of words: it gives <strong>every token in its whole vocabulary</strong> (tens of thousands
          of them) its own coordinates, learned from <strong>essentially all the text on the internet</strong>,
          not 20 toy sentences. And it doesn&apos;t stop at two numbers per word — each vector has{' '}
          <strong>hundreds or thousands of coordinates</strong>: 768 in GPT-2, and 1024, 4096, even 12288 in
          the largest models. We used a plain <strong>x</strong> and <strong>y</strong> so we could draw it on
          a page; a real model lives in a 768-dimension space no human can picture. But the idea is{' '}
          <em>identical</em> to what you just did by hand: every word is a point, its coordinates come from
          the company it keeps, and closeness between points is similarity in meaning.
        </p>
      </ExplanationBox>

    </div>
  );
}
