'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// "The animal didn't cross the street because it was too tired."
// Click a word; show hand-authored attention weights from that word to the others.
const SENT = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'];
// attention weights keyed by source index → array over all words (0..1)
const ATTN: Record<number, number[]> = {
  7: [0.03, 0.55, 0.02, 0.04, 0.02, 0.20, 0.03, 0.0, 0.03, 0.02, 0.06], // "it" → mostly "animal"
  10: [0.02, 0.30, 0.03, 0.03, 0.02, 0.05, 0.03, 0.18, 0.04, 0.05, 0.0], // "tired" → "animal","it"
  3: [0.04, 0.34, 0.05, 0.0, 0.06, 0.40, 0.02, 0.02, 0.02, 0.02, 0.03], // "cross" → "animal","street"
};
const DEFAULT_SRC = 7;

function AttentionDemo() {
  const [src, setSrc] = useState(DEFAULT_SRC);
  const weights = ATTN[src] ?? SENT.map(() => 0);
  return (
    <div className="at-box">
      <p className="at-label">Click a word to see what it &quot;pays attention&quot; to:</p>
      <div className="at-sent">
        {SENT.map((w, i) => {
          const isSrc = i === src;
          const a = weights[i];
          const hasAttn = ATTN[i] !== undefined;
          return (
            <button
              key={i}
              className={`at-word ${isSrc ? 'src' : ''} ${hasAttn ? 'clickable' : ''}`}
              style={!isSrc ? { background: `rgba(124, 58, 237, ${a})`, color: a > 0.4 ? 'white' : '#1e293b' } : undefined}
              onClick={() => hasAttn && setSrc(i)}
            >
              {w}
              {!isSrc && a > 0.12 && <span className="at-w">{Math.round(a * 100)}%</span>}
            </button>
          );
        })}
      </div>
      <p className="at-note">
        The highlighted word is doing the looking; the purple shading shows how much of its attention lands
        on each other word. &quot;<strong>it</strong>&quot; pours most of its attention onto
        &quot;<strong>animal</strong>&quot; — that&apos;s how the model resolves what &quot;it&quot; refers to.
        (Try the other underlined words: <em>cross</em>, <em>tired</em>.)
      </p>
      <style jsx>{`
        .at-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .at-label { font-size: 13px; color: #64748b; margin: 0 0 0.8rem; }
        .at-sent { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .at-word { position: relative; padding: 0.45rem 0.6rem; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 15px; color: #1e293b; cursor: default; }
        .at-word.clickable { cursor: pointer; border-bottom: 2px solid #c4b5fd; }
        .at-word.src { background: #7c3aed; color: white; border-color: #7c3aed; font-weight: 700; }
        .at-w { position: absolute; top: -8px; right: -4px; font-size: 9px; background: #5b21b6; color: white; padding: 1px 4px; border-radius: 6px; }
        .at-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Problem: Words Need Context">
        <p>
          We ended Part 1 with a puzzle: the embedding for &quot;bank&quot; is one fixed vector, but{' '}
          <em>&quot;I sat by the river bank&quot;</em> and <em>&quot;I robbed a bank&quot;</em> mean
          wildly different things. The vector can&apos;t know which one you meant — the answer lives in
          the <strong>surrounding words</strong>.
        </p>
        <p>
          Here&apos;s an even sharper example: <em>&quot;The animal didn&apos;t cross the street because
          it was too tired.&quot;</em> What does &quot;it&quot; refer to — the animal or the street? You
          know instantly: the animal. (Swap &quot;tired&quot; for &quot;wide&quot; and your answer flips
          to the street — with only one word changed!) You figured that out by letting &quot;it&quot;{' '}
          <strong>look back</strong> at the other words and decide which one it depends on.
        </p>
        <p>
          That&apos;s the exact ability an LLM needs, and <strong>attention</strong> is the mechanism
          that provides it:
        </p>
        <AttentionDemo />
      </ExplanationBox>

      <ExplanationBox title="Attention in Plain English">
        <p>
          For each word, attention asks: <strong>&quot;Which other words should I listen to, and how much?&quot;</strong>{' '}
          It produces a set of weights — one per word — that add up to 1. A weight near 1 means &quot;this
          word matters a lot to me right now&quot;; a weight near 0 means &quot;ignore it.&quot;
        </p>
        <p>
          Then the word updates its own representation by taking a <strong>weighted blend</strong> of all the
          other words&apos; information, using those attention weights. After this, the vector for &quot;it&quot;
          literally has &quot;animal&quot; mixed into it — so downstream, the model treats &quot;it&quot; as
          standing for the animal. Same for &quot;bank&quot;: with &quot;river&quot; blended in, its vector
          drifts toward the geography region of meaning space; with &quot;robbed&quot; blended in, toward money.
        </p>
        <p>
          One crucial detail: those attention weights are <strong>not stored anywhere</strong>. They&apos;re
          computed fresh, on the fly, for every sentence the model reads. A new sentence means new weights.
          How can a fixed set of learned parameters produce custom weights for sentences it&apos;s never
          seen? That&apos;s the clever part — and it&apos;s the next step.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why This Is Such a Big Deal">
        <p>
          Older language models (RNNs, from the deep-learning family you may have met elsewhere) read text
          strictly left to right, one word at a time, squeezing everything they&apos;d seen into a single
          running summary. By the end of a long paragraph, the beginning had faded — connecting
          &quot;it&quot; to a noun fifty words back was nearly hopeless.
        </p>
        <p>
          Attention lets <strong>every word see every other word directly</strong>, no matter the
          distance — word 500 can look straight at word 3 with no fading in between. And it{' '}
          <em>learns</em> which connections matter from data. The 2017 paper that introduced the
          transformer was titled <em>&quot;Attention Is All You Need&quot;</em> — and it meant it: throw
          away the old machinery, keep attention, and language modeling suddenly works at scale. Every
          modern LLM descends from that one idea.
        </p>
        <p>
          Next, we open the box: the three famous ingredients — <strong>queries, keys, and values</strong> —
          that turn &quot;look at the other words&quot; into actual arithmetic.
        </p>
      </ExplanationBox>
    </div>
  );
}
