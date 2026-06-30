'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

const WORDS: { word: string; vec: [number, number, number]; color: string }[] = [
  { word: 'The', vec: [0.1, 0.0, 0.9], color: '#64748b' },
  { word: 'sky', vec: [1.0, 0.7, 0.0], color: '#2563eb' },
  { word: 'is',  vec: [0.1, 0.2, 0.8], color: '#7c3aed' },
];
const DIMS = ['TOPIC', 'BRIGHT', 'GRAMMAR'];

// Let the reader move attention weights and watch the blended vector for "is" form.
function BlendDemo() {
  const [w, setW] = useState<[number, number, number]>([0.33, 0.34, 0.33]);
  const total = w[0] + w[1] + w[2] || 1;
  const norm = w.map(x => x / total) as [number, number, number];

  const blend = [0, 1, 2].map(d =>
    WORDS.reduce((s, word, i) => s + norm[i] * word.vec[d], 0)
  );

  const setOne = (i: number, val: number) => {
    const next = [...w] as [number, number, number];
    next[i] = val;
    setW(next);
  };

  return (
    <div className="bl-box">
      <p className="bl-lead">
        Build the new vector for <strong>&ldquo;is&rdquo;</strong> yourself. Slide each word&apos;s knob to
        decide <em>how much of it</em> to pour into the blend. The knobs are rescaled to add up to 100%,
        so this really is a weighted average of the three embeddings:
      </p>

      <div className="bl-sliders">
        {WORDS.map((word, i) => (
          <div key={word.word} className="bl-srow">
            <span className="bl-name" style={{ color: word.color }}>{word.word}</span>
            <input
              type="range" min={0} max={1} step={0.01}
              value={w[i]}
              onChange={e => setOne(i, parseFloat(e.target.value))}
              style={{ accentColor: word.color }}
            />
            <span className="bl-pct">{(norm[i] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <div className="bl-result">
        <div className="bl-rlabel">new &ldquo;is&rdquo; vector =</div>
        <div className="bl-bars">
          {blend.map((v, d) => (
            <div key={d} className="bl-bar">
              <span className="bl-dim">{DIMS[d]}</span>
              <div className="bl-track">
                <div className="bl-fill" style={{ width: `${(v / 1.0) * 100}%` }} />
              </div>
              <span className="bl-val">{v.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="bl-note">
        {norm[1] > 0.5
          ? 'Pour in mostly "sky" and the new vector lights up on the TOPIC axis — "is" now carries the fact that this sentence is about the sky. That is exactly the move we want.'
          : norm[0] > 0.5
            ? 'Lean on "The" and you just absorb another function word — lots of GRAMMAR, no topic. Useless for guessing what comes next.'
            : 'Right now you are taking a flat average of all three. Attention does better than flat: it learns to lean toward the words that actually matter.'}
      </p>

      <style jsx>{`
        .bl-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .bl-lead { margin: 0 0 1.1rem; font-size: 13px; color: #475569; line-height: 1.6; }
        .bl-sliders { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.25rem; }
        .bl-srow { display: flex; align-items: center; gap: 0.8rem; }
        .bl-name { width: 36px; font-weight: 700; font-size: 14px; }
        .bl-srow input { flex: 1; }
        .bl-pct { width: 42px; text-align: right; font-family: monospace; font-weight: 700; color: #334155; font-size: 13px; }
        .bl-result { padding: 1rem; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; }
        .bl-rlabel { font-size: 13px; font-weight: 700; color: #5b21b6; margin-bottom: 0.6rem; }
        .bl-bars { display: flex; flex-direction: column; gap: 0.45rem; }
        .bl-bar { display: flex; align-items: center; gap: 0.7rem; }
        .bl-dim { width: 62px; font-size: 10px; letter-spacing: 0.04em; color: #94a3b8; font-weight: 600; }
        .bl-track { flex: 1; height: 12px; background: #eef2f7; border-radius: 6px; overflow: hidden; }
        .bl-fill { height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); transition: width 0.12s; }
        .bl-val { width: 38px; text-align: right; font-family: monospace; font-weight: 700; color: #1e293b; font-size: 13px; }
        .bl-note { margin: 1rem 0 0; font-size: 13px; color: #555; line-height: 1.6; }
      `}</style>
    </div>
  );
}

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The One-Sentence Idea">
        <p>
          Here is the whole trick, before any math: <strong>each word builds itself a brand-new vector by
          taking a weighted blend of the earlier words&apos; vectors</strong> — including its own. The word
          doesn&apos;t keep its lonely dictionary entry; it mixes a custom cocktail from the words so far and
          walks away with that instead.
        </p>
        <p>
          The magic word is <strong>weighted</strong>. The blend is not a flat average where every word
          counts the same. Each word gets to <em>decide how much to pull from each neighbor</em> — a lot
          from the ones that matter, almost nothing from the ones that don&apos;t. Those amounts are the{' '}
          <strong>attention weights</strong>.
        </p>
        <p>
          One restriction matters from the start: a generative LLM writes <strong>left to right</strong>, so
          when it processes a word it may only look at that word and the ones <em>before</em> it — never
          ahead. (Peeking at the future would be cheating: at write-time the future isn&apos;t there yet.)
          That look-backward-only rule is called the <strong>causal mask</strong>, and it&apos;s why{' '}
          &ldquo;is&rdquo; in &ldquo;The sky is ___&rdquo; blends <em>The</em>, <em>sky</em>, and itself, but
          nothing past it.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What This Buys Us">
        <p>
          Go back to our problem. The word <strong>&ldquo;is&rdquo;</strong> needs to understand it sits in
          a sentence <em>about the sky</em>. With attention, &ldquo;is&rdquo; can put a big weight on{' '}
          <strong>sky</strong> and a tiny weight on <strong>The</strong> — and the blend it walks away with
          is no longer a generic function word. It is &ldquo;is, in a sentence about the sky.&rdquo; The
          fixed-vector problem from the last step just dissolves: context flowed into the word.
        </p>
        <BlendDemo />
        <p>
          Notice this happens for <em>every</em> word at once, each with its own set of weights — &ldquo;The&rdquo;
          builds its own blend, &ldquo;sky&rdquo; builds its own, &ldquo;is&rdquo; builds its own. We only
          care about the last word&apos;s blend, because that is the vector that will go on to predict what
          comes next.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Only Question Left">
        <p>
          The blend is easy — it is just a weighted average, and you already did the arithmetic by hand in
          the demo. So the entire problem of attention boils down to a single question:{' '}
          <strong>where do the weights come from?</strong> How does the model <em>know</em> that
          &ldquo;is&rdquo; should lean on &ldquo;sky&rdquo; and not on &ldquo;The&rdquo;?
        </p>
        <p>
          It can&apos;t be from raw similarity — we saw that raw similarity points &ldquo;is&rdquo; straight
          at &ldquo;The.&rdquo; The model needs a smarter way to ask &ldquo;who is relevant to me?&rdquo;
          That is the job of three learned roles — <strong>Queries, Keys, and Values</strong> — and it is
          the next step.
        </p>
      </ExplanationBox>
    </div>
  );
}
