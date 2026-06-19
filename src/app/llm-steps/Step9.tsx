'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// One sentence, three hand-authored heads, each tracking a different relationship.
const SENT = ['The', 'robot', 'picked', 'up', 'the', 'red', 'ball', 'because', 'it', 'was', 'light'];

const HEADS: { name: string; question: string; src: number; weights: number[]; note: string }[] = [
  {
    name: 'Head 1 — pronouns',
    question: 'What does "it" refer to?',
    src: 8,
    weights: [0.02, 0.22, 0.02, 0.01, 0.01, 0.05, 0.55, 0.02, 0, 0.02, 0.08],
    note: '"it" attends mostly to "ball" (and a little to "robot" — the other candidate). This head has specialized in linking pronouns to the nouns they stand for.',
  },
  {
    name: 'Head 2 — descriptions',
    question: 'Which words describe "ball"?',
    src: 6,
    weights: [0.03, 0.12, 0.15, 0.02, 0.08, 0.50, 0, 0.02, 0.04, 0.02, 0.02],
    note: '"ball" pulls in "red" — its adjective — plus a bit of "picked" (the verb acting on it). This head tracks which words modify which.',
  },
  {
    name: 'Head 3 — who did it',
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

export default function Step9() {
  return (
    <div>
      <ExplanationBox title="One Head Can Only Track One Thing at a Time">
        <p>
          The attention you computed last step produces <strong>one</strong> set of weights per word —
          one pattern of &quot;who listens to whom.&quot; But look at this sentence:{' '}
          <em>&quot;The robot picked up the red ball because it was light.&quot;</em> To really understand
          it, the model needs several different webs of relationships <strong>at the same time</strong>:
          what &quot;it&quot; refers to, which adjective describes which noun, who performed the verb.
        </p>
        <p>
          A single attention pattern can&apos;t serve all those masters at once — blending them into one
          set of weights would muddy them all. The fix is beautifully blunt:{' '}
          <strong>run several attentions in parallel</strong>. Each one is called a{' '}
          <strong>head</strong>, and each head gets its own learned W<sub>Q</sub>, W<sub>K</sub>,{' '}
          W<sub>V</sub> matrices — its own notion of what to look for, what to offer, and what to hand over.
        </p>
        <MultiHeadDemo />
      </ExplanationBox>

      <ExplanationBox title="Nobody Assigns the Heads Their Jobs">
        <p>
          Sound familiar? In the rain network, we never told Neuron 1 to detect &quot;muggy
          conditions&quot; — it specialized on its own because random starting weights gave each neuron a
          different trajectory through training. Heads work exactly the same way. All of them start
          random; backpropagation nudges each one toward whatever relationship-tracking happens to reduce
          prediction error; and because they start different, they <em>stay</em> different and divide up
          the work.
        </p>
        <p>
          When researchers dissect trained models, they really do find heads like the ones in the demo —
          pronoun-resolution heads, previous-word heads, rare-token heads. (And plenty of heads doing
          things nobody can name. Same story as the millions-of-neurons networks from the last course:
          past a certain scale, you can see <em>that</em> it works without being able to say what every
          part does.)
        </p>
      </ExplanationBox>

      <ExplanationBox title="How the Heads Recombine">
        <p>
          Mechanically, it&apos;s tidy. Each head runs the full recipe from last step — score, scale,
          softmax, blend — and produces its own output vector per word. The per-head outputs get{' '}
          <strong>concatenated</strong> side by side and multiplied through one more learned matrix that
          mixes them back into a single vector of the original size. The word ends up with one combined
          representation enriched by every head&apos;s perspective: &quot;it&quot; now knows it means
          the ball, <em>and</em> that the ball is red, <em>and</em> that the robot picked it up.
        </p>
        <p>
          The scale of this in real models: GPT-2 ran <strong>12 heads</strong> in each layer, with 12
          layers — 144 heads in total. Modern frontier models run thousands. Every one of them is the
          same little dot-product recipe you computed by hand.
        </p>
        <p>
          So now we have rich, multi-perspective attention. But attention is only half of a transformer.
          The other half is an old friend from the last course — an actual neural network. Time to
          assemble the full block.
        </p>
      </ExplanationBox>
    </div>
  );
}
