'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// A second illustrative sentence — rich enough to show several relationships at once.
// (Our running "The sky is" has only three words; here we need more to make heads vivid.)
const SENT = ['The', 'robot', 'picked', 'up', 'the', 'red', 'ball', 'because', 'it', 'was', 'light'];

const HEADS: { name: string; question: string; src: number; weights: number[]; note: string }[] = [
  {
    name: 'Head A — pronouns',
    question: 'What does "it" refer to?',
    src: 8,
    weights: [0.02, 0.22, 0.02, 0.01, 0.01, 0.05, 0.55, 0.02, 0, 0.02, 0.08],
    note: '"it" attends mostly to "ball" (and a little to "robot" — the other candidate). This head has specialized in linking pronouns to the nouns they stand for.',
  },
  {
    name: 'Head B — descriptions',
    question: 'Which words describe "ball"?',
    src: 6,
    weights: [0.03, 0.12, 0.15, 0.02, 0.08, 0.50, 0, 0.02, 0.04, 0.02, 0.02],
    note: '"ball" pulls in "red" — its adjective — plus a bit of "picked" (the verb acting on it). This head tracks which words modify which.',
  },
  {
    name: 'Head C — who did it',
    question: 'Who is doing the picking?',
    src: 2,
    weights: [0.04, 0.60, 0, 0.08, 0.02, 0.02, 0.20, 0.01, 0.01, 0.01, 0.01],
    note: '"picked" attends hard to "robot" — its subject — and somewhat to "ball" — its object. This head tracks who-did-what-to-whom.',
  },
];

function MultiHeadDemo() {
  const [h, setH] = useState(0);
  const head = HEADS[h];
  return (
    <div className="mh-box">
      <div className="mh-tabs">
        {HEADS.map((hd, i) => (
          <button key={i} className={i === h ? 'on' : ''} onClick={() => setH(i)}>{hd.name}</button>
        ))}
      </div>
      <p className="mh-q">{head.question}</p>
      <div className="mh-sent">
        {SENT.map((w, i) => {
          const isSrc = i === head.src;
          const a = head.weights[i];
          return (
            <span
              key={i}
              className={`mh-word ${isSrc ? 'src' : ''}`}
              style={!isSrc ? { background: `rgba(124, 58, 237, ${a})`, color: a > 0.4 ? 'white' : '#1e293b' } : undefined}
            >
              {w}
              {!isSrc && a > 0.1 && <span className="mh-w">{Math.round(a * 100)}%</span>}
            </span>
          );
        })}
      </div>
      <p className="mh-note">{head.note}</p>
      <style jsx>{`
        .mh-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .mh-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
        .mh-tabs button { padding: 0.35rem 0.8rem; border: 1px solid #cbd5e1; border-radius: 7px; background: white; cursor: pointer; font-size: 13px; font-weight: 600; color: #334155; }
        .mh-tabs button.on { background: #7c3aed; border-color: #7c3aed; color: white; }
        .mh-q { font-size: 13px; color: #64748b; margin: 0 0 0.8rem; font-style: italic; }
        .mh-sent { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .mh-word { position: relative; padding: 0.45rem 0.6rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 15px; color: #1e293b; }
        .mh-word.src { background: #7c3aed; color: white; border-color: #7c3aed; font-weight: 700; }
        .mh-w { position: absolute; top: -8px; right: -4px; font-size: 9px; background: #5b21b6; color: white; padding: 1px 4px; border-radius: 6px; }
        .mh-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

// Concat → project diagram.
function ConcatDiagram() {
  const heads = [
    { label: 'Head A', color: '#7c3aed' },
    { label: 'Head B', color: '#2563eb' },
    { label: 'Head C', color: '#db2777' },
  ];
  return (
    <div className="cc-box">
      <div className="cc-row">
        {heads.map((hd, i) => (
          <div key={i} className="cc-head" style={{ borderColor: hd.color }}>
            <span className="cc-head-label" style={{ color: hd.color }}>{hd.label}</span>
            <span className="cc-head-out">out vector</span>
          </div>
        ))}
      </div>
      <div className="cc-arrow">concatenate side by side ↓</div>
      <div className="cc-concat">
        <span style={{ color: '#7c3aed' }}>[ A&apos;s numbers</span>
        <span style={{ color: '#2563eb' }}> | B&apos;s numbers</span>
        <span style={{ color: '#db2777' }}> | C&apos;s numbers ]</span>
      </div>
      <div className="cc-arrow">multiply by one learned matrix W&#8338; ↓</div>
      <div className="cc-final">one combined vector — original size</div>
      <style jsx>{`
        .cc-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; text-align: center; }
        .cc-row { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
        .cc-head { flex: 1; min-width: 90px; max-width: 130px; border: 1.5px solid; border-radius: 10px; padding: 0.6rem; display: flex; flex-direction: column; gap: 3px; background: #fff; }
        .cc-head-label { font-weight: 700; font-size: 13px; }
        .cc-head-out { font-size: 11px; color: #94a3b8; }
        .cc-arrow { font-size: 12px; color: #64748b; margin: 0.7rem 0; }
        .cc-concat { display: inline-block; font-family: monospace; font-weight: 700; font-size: 13px; padding: 0.6rem 1rem; background: #fff; border: 1px dashed #cbd5e1; border-radius: 8px; }
        .cc-final { display: inline-block; font-weight: 700; font-size: 14px; color: #5b21b6; padding: 0.6rem 1.1rem; background: #ede9fe; border-radius: 8px; }
      `}</style>
    </div>
  );
}

export default function Step18() {
  return (
    <div>
      <ExplanationBox title="One Head Can Only Track One Thing">
        <p>
          Look back at what you just built. Across Part 3, the word{' '}
          <strong>&ldquo;is&rdquo;</strong> produced a single query, scored it against every word, and
          softmaxed the result into <strong>one</strong> set of weights:{' '}
          <strong>sky 69%, The 15%, is 16%</strong>. That single pattern learned to do one job — look
          back at the subject of the sentence. It found <strong>sky</strong>, exactly the word you need
          to guess what comes after &ldquo;The sky is.&rdquo;
        </p>
        <p>
          One job. But understanding language takes many jobs at once. Even our tiny sentence needs more
          than &ldquo;find the subject&rdquo; — it also helps to know which word is the verb, how the
          grammar agrees, where each token sits. A single set of weights cannot serve all of those
          masters: blend them together and they smear into mush. The fix is wonderfully blunt:{' '}
          <strong>run several attentions in parallel</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Many Questions at Once">
        <p>
          Each parallel attention is called a <strong>head</strong>. A head is just the entire recipe
          from Part 3 — its own learned W<sub>Q</sub>, W<sub>K</sub>, W<sub>V</sub> matrices, its own
          score → scale → softmax → blend — run start to finish. Because each head has its own query
          matrix, each one asks the sentence a <em>different question</em>.
        </p>
        <p>
          The head you built asked &ldquo;where is my subject?&rdquo; A second head might ask &ldquo;which
          word is my verb?&rdquo; A third, &ldquo;what does this pronoun refer to?&rdquo; To see several
          heads side by side we need a sentence with more moving parts than three words, so switch
          examples for a moment. Each tab below is a different head looking at the same sentence:
        </p>
        <MultiHeadDemo />
        <p>
          Same sentence, same recipe, three completely different webs of attention. That is the whole
          idea of multi-head attention: <strong>parallel views of the same words</strong>, each
          specialized for one kind of relationship.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Nobody Assigns the Heads Their Jobs">
        <p>
          Sound familiar? In the neural-network course, we never told Neuron 1 to detect &ldquo;muggy
          conditions&rdquo; — it specialized on its own because random starting weights sent each neuron
          down a different path through training. Heads work exactly the same way. All of them start
          random; backpropagation nudges each one toward whatever relationship-tracking happens to lower
          prediction error; and because they start different, they <em>stay</em> different and divide up
          the labor.
        </p>
        <p>
          When researchers dissect trained models, they really do find heads like the ones in the demo —
          pronoun-resolution heads, previous-word heads, rare-token heads. And plenty of heads doing
          things nobody can name. Same story as the million-neuron networks from last time: past a
          certain scale you can see <em>that</em> it works without being able to say what every part is
          for.
        </p>
      </ExplanationBox>

      <ExplanationBox title="How the Heads Recombine">
        <p>
          So each head produces its own little output vector for every word. How do they become one
          answer again? Tidily. The per-head outputs are <strong>concatenated</strong> — laid end to end
          into one long vector — and then multiplied by a single learned matrix that mixes them and
          squeezes the result back to the original size.
        </p>
        <ConcatDiagram />
        <p>
          The word walks out with one vector, but it is now enriched by every head&apos;s perspective at
          once: &ldquo;is&rdquo; leaves knowing its subject is the sky, <em>and</em> what role it plays
          grammatically, <em>and</em> where it sits — all folded into the same list of numbers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Scale in Real Models">
        <p>
          One head was enough to write on a napkin. Real models run a crowd. <strong>GPT-2</strong> ran{' '}
          <strong>12 heads</strong> per layer across 12 layers — 144 heads in all. Larger models run
          dozens of heads per layer across a hundred layers or more, thousands of heads total. Every
          single one is the same dot-product recipe you computed by hand, just with its own learned
          matrices.
        </p>
        <p>
          And here is the quiet detail that makes it cheap: the heads don&apos;t each work on the full
          vector. The vector is <em>split</em> across them, so twelve heads each handle a twelfth of the
          numbers. You get twelve perspectives for roughly the price of one — twelve narrow questions
          instead of one wide blur.
        </p>
        <p>
          Multi-head attention gives us rich, multi-perspective mixing <em>across</em> words. But that is
          only half of a transformer block. The other half processes each word on its own — an actual
          little neural network, an old friend from the last course. That is next.
        </p>
      </ExplanationBox>
    </div>
  );
}
