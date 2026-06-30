'use client';

import type { CSSProperties, ReactNode } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// ─── A ~100-sentence toy corpus: three topics (sky / sea / animals) + glue words ──
const CORPUS = [
  // sky / weather
  'the sky is blue', 'the sky is grey', 'the sky is dark', 'the sky is wide',
  'the sky is bright', 'the sky is cold', 'the sky is calm', 'the sky is high',
  'the sun is bright', 'the sun is warm', 'the sun is high', 'the warm sun is high',
  'the moon is bright', 'the moon is high', 'the moon is small',
  'the star is bright', 'the star is small', 'the star is high',
  'the cloud is grey', 'the cloud is dark', 'the cloud is high', 'the cloud is wide',
  'the blue sky is wide', 'the bright sun is warm', 'the grey cloud is dark',
  'the dark sky is cold', 'the high sun is bright', 'the blue sky is calm',
  'a cloud is in the sky', 'the sun is in the sky', 'the moon is in the sky',
  'the star is in the sky', 'the wide sky is blue', 'the sun is warm',
  // sea / water
  'the sea is blue', 'the sea is deep', 'the sea is cold', 'the sea is calm',
  'the sea is wide', 'the sea is dark', 'the ocean is blue', 'the ocean is deep',
  'the ocean is cold', 'the ocean is wide', 'the ocean is calm', 'the wave is high',
  'the wave is cold', 'the wave is blue', 'the wave is wide', 'the lake is calm',
  'the lake is deep', 'the lake is cold', 'the lake is blue', 'the water is blue',
  'the water is cold', 'the water is deep', 'the water is calm',
  'a wave is in the sea', 'a wave is in the ocean', 'the blue sea is calm',
  'the deep ocean is dark', 'the cold water is deep', 'the blue ocean is wide',
  'the deep sea is cold', 'the calm lake is blue', 'the cold sea is deep',
  'the wide ocean is blue',
  // animals / pets
  'the dog is furry', 'the dog is fast', 'the dog is small', 'the dog is soft',
  'the dog is warm', 'the dog runs', 'the dog barks', 'the dog sleeps',
  'the cat is furry', 'the cat is soft', 'the cat is small', 'the cat is fast',
  'the cat purrs', 'the cat sleeps', 'the fox is fast', 'the fox is furry',
  'the fox is small', 'the fox runs', 'the pup is small', 'the pup is soft',
  'the pup is furry', 'the pup runs', 'the pup barks', 'a dog is a pet',
  'a cat is a pet', 'the pet is furry', 'the pet is soft', 'the pet is small',
  'the furry dog runs', 'the small cat purrs', 'the fast fox runs',
  'the soft pup sleeps', 'pets are furry',
];

const SENTENCES = CORPUS.map(s => s.split(' '));
const VOCAB: string[] = [];
for (const s of SENTENCES) for (const w of s) if (!VOCAB.includes(w)) VOCAB.push(w);

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
      background: kind === 'shared' ? '#fef9c3' : kind === 'glue' ? '#f1f5f9' : '#fff',
      color: kind === 'shared' ? '#854d0e' : kind === 'glue' ? '#b6bfcb' : '#334155',
      border: `1.5px solid ${kind === 'shared' ? '#eab308' : kind === 'glue' ? '#e2e8f0' : '#cbd5e1'}`,
      opacity: kind === 'glue' ? 0.65 : 1,
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
  const oceanN = neighboursOf('ocean');
  const dogN = neighboursOf('dog');

  const steps: ReactNode[] = [
    <>
      <p style={{ margin: '0 0 8px' }}>
        Pull up every sentence that contains{' '}
        <Word w="sky" /> and look at the words sitting right beside it (within two words — those are{' '}
        <strong>highlighted</strong>):
      </p>
      <SentencesWith focus="sky" />
      <p style={{ margin: '8px 0' }}>
        Now just <strong>count</strong> how many times each highlighted word landed beside <Word w="sky" />{' '}
        across those {sentencesWith('sky').length} sentences. That tally is the chart below — and it{' '}
        <em>is</em> <Word w="sky" />&apos;s neighbour list:
      </p>
      <TallyChart focus="sky" />
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        Now pick a second word to hold <Word w="sky" /> up against — say <Word w="ocean" /> — and do the
        exact same thing, just list its neighbours:
      </p>
      <ChipRow words={oceanN} anchor="ocean" />
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        For contrast, take a word from a totally different world, <Word w="dog" />:
      </p>
      <ChipRow words={dogN} anchor="dog" />
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        Compared with <Word w="sky" />, the only words in common are{' '}
        <em style={{ color: '#b6bfcb' }}>the</em> and <em style={{ color: '#b6bfcb' }}>is</em> — pure
        glue, no content word shared. <Word w="sky" /> and <Word w="dog" /> keep completely different
        company.
      </p>
    </>,
    <>
      <p style={{ margin: '0 0 8px' }}>
        Now stop doing this two words at a time and do it for <strong>every</strong> content word at once.
        Link each word to the neighbours it sits beside; the words that hang off the <em>same</em> neighbour
        drift into a group — and nobody ever names the groups:
      </p>
      <ConnectorMap />
      <p style={{ margin: '8px 0 0', fontSize: 13, color: '#64748b' }}>
        Every line here is <strong>real</strong>: it joins two words that share a neighbour somewhere in the
        sentences above, and the layout simply lets those links pull the sharers together. Three clumps fall
        out on their own — sky-words, sea-words, and animal-words — and the sky and sea clumps stay loosely
        tied because both keep company with <Word w="blue" />, <em>cold</em>, and <em>calm</em>. Nobody
        labelled a single group; the shared neighbours did. Those clumps <em>are</em> the map.
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
  ];

  const card: CSSProperties = { padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 8 };

  return (
    <div style={{ margin: '1.25rem 0' }}>
      <div style={{ ...card, background: '#fffbeb', borderColor: '#fde68a' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b45309', marginBottom: 6, letterSpacing: 0.3 }}>PREREQUISITE</div>
        <div style={{ fontSize: 14.5, color: '#1e293b', lineHeight: 1.65 }}>
          <p style={{ margin: 0 }}>
            One thing up front: we&apos;re going to <strong>ignore the glue words</strong>{' '}
            &ldquo;the,&rdquo; &ldquo;is,&rdquo; and &ldquo;in&rdquo; (greyed out below). They sit next to
            almost every word, so their meaning is far too broad for our tiny set of sentences to pin down —
            the model would need a great deal more text to learn what they actually do. So we set them aside
            and focus on the content words.
          </p>
        </div>
      </div>
      {steps.map((node, i) => (
        <div key={i} style={card}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', marginBottom: 6, letterSpacing: 0.3 }}>STEP {i + 1}</div>
          <div style={{ fontSize: 14.5, color: '#1e293b', lineHeight: 1.65 }}>{node}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Connector map: EVERY content word, laid out from the real shared-neighbour data ───
const CM_W = 460, CM_H = 380;
const CM_WORDS = VOCAB.filter(w => !GLUE.has(w));
const cmNbrs = (w: string) => neighboursOf(w).filter(x => !GLUE.has(x));
const cmShared = (a: string, b: string) => {
  const bs = new Set(cmNbrs(b));
  return cmNbrs(a).filter(x => bs.has(x));
};
// real edges: two words linked when they share a (non-glue) neighbour
const CM_EDGES: { i: number; j: number; via: string[] }[] = [];
for (let i = 0; i < CM_WORDS.length; i++)
  for (let j = i + 1; j < CM_WORDS.length; j++) {
    const via = cmShared(CM_WORDS[i], CM_WORDS[j]);
    if (via.length) CM_EDGES.push({ i, j, via });
  }
const CM_DEG = CM_WORDS.map((_, i) => CM_EDGES.some(e => e.i === i || e.j === i));
// deterministic force-directed layout (seeded Park–Miller; computed once at import)
const CM_POS: [number, number][] = (() => {
  let seed = 1234567;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const p: [number, number][] = CM_WORDS.map(() => [40 + rnd() * (CM_W - 80), 30 + rnd() * (CM_H - 60)]);
  for (let it = 0; it < 600; it++) {
    const d: [number, number][] = p.map(() => [0, 0]);
    for (let i = 0; i < p.length; i++)
      for (let j = i + 1; j < p.length; j++) {
        let dx = p[i][0] - p[j][0], dy = p[i][1] - p[j][1];
        const dd = dx * dx + dy * dy || 0.01, len = Math.sqrt(dd), f = 3400 / dd;
        dx = dx / len * f; dy = dy / len * f;
        d[i][0] += dx; d[i][1] += dy; d[j][0] -= dx; d[j][1] -= dy;
      }
    for (const { i, j, via } of CM_EDGES) {
      let dx = p[i][0] - p[j][0], dy = p[i][1] - p[j][1];
      const len = Math.sqrt(dx * dx + dy * dy) || 0.01, f = (len - 46) * 0.06 * via.length;
      dx = dx / len * f; dy = dy / len * f;
      d[i][0] -= dx; d[i][1] -= dy; d[j][0] += dx; d[j][1] += dy;
    }
    const temp = 9 * (1 - it / 600);
    for (let i = 0; i < p.length; i++) {
      const len = Math.sqrt(d[i][0] ** 2 + d[i][1] ** 2) || 0.01, s = Math.min(len, temp);
      p[i][0] = Math.max(24, Math.min(CM_W - 24, p[i][0] + d[i][0] / len * s));
      p[i][1] = Math.max(16, Math.min(CM_H - 16, p[i][1] + d[i][1] / len * s));
    }
  }
  return p;
})();

function ConnectorMap() {
  return (
    <div style={{ margin: '10px 0', padding: '8px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
      <svg viewBox={`0 0 ${CM_W} ${CM_H}`} style={{ width: '100%' }}>
        {CM_EDGES.map((e, k) => {
          const [x1, y1] = CM_POS[e.i], [x2, y2] = CM_POS[e.j];
          return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ddd6fe"
            strokeWidth={Math.min(2.5, 0.5 + e.via.length * 0.5)} strokeOpacity={0.7} />;
        })}
        {CM_WORDS.map((w, i) => {
          const [x, y] = CM_POS[i], on = CM_DEG[i], wdt = Math.max(26, w.length * 6.5 + 10);
          return (
            <g key={w}>
              <rect x={x - wdt / 2} y={y - 9} width={wdt} height={18} rx={9}
                fill={on ? '#ede9fe' : '#f8fafc'} stroke={on ? '#c4b5fd' : '#e2e8f0'} strokeWidth={1.25} />
              <text x={x} y={y + 3} textAnchor="middle" fontSize={9.5} fontWeight={700}
                fill={on ? '#6d28d9' : '#cbd5e1'}>{w}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Let's Work It Out by Hand">
        <p>
          First the model needs some text to learn from. We&apos;ll give it a tiny training set.
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12, color: '#475569', lineHeight: 1.8, columns: 3, maxHeight: 220, overflowY: 'auto' }}>
          {CORPUS.map((s, i) => <div key={i} style={{ breakInside: 'avoid' }}>{s}</div>)}
        </div>
        <p>
          Our goal is to give every one of those {VOCAB.length} words a spot on a map, so that words with
          similar meanings land near each other. The catch — and the whole point — is that the model is
          never told what any word means. The <em>only</em> thing it gets to
          look at is which words <em>recurringly</em> show up in the same surroundings — for example{' '}
          &ldquo;the sea is blue&rdquo; and &ldquo;the ocean is blue&rdquo; drop <strong>sea</strong> and{' '}
          <strong>ocean</strong> into an identical slot, and that repeated overlap is the model&apos;s only
          clue the two words mean something similar.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Steps">
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
