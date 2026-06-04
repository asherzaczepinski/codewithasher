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

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="The Problem: Words Need Context">
        <p>
          Take the sentence: <em>&quot;The animal didn&apos;t cross the street because it was too tired.&quot;</em>{' '}
          What does &quot;it&quot; refer to — the animal or the street? You know instantly: the animal.
          You figured it out by letting &quot;it&quot; <strong>look back</strong> at the other words and
          decide which one it depends on.
        </p>
        <p>
          That&apos;s the exact ability an LLM needs. A fixed embedding for &quot;it&quot; can&apos;t know
          what it refers to — the answer lives in the surrounding words. <strong>Attention</strong> is the
          mechanism that lets every token gather information from the others.
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
          standing for the animal.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why This Is Such a Big Deal">
        <p>
          Older models read text strictly left to right, one word at a time, and struggled to connect words
          that were far apart. Attention lets <strong>every word see every other word at once</strong>,
          no matter the distance — and it learns <em>which</em> connections matter from data.
        </p>
        <p>
          That single idea is what made modern LLMs possible. Next, we&apos;ll open up the box and compute
          attention by hand with real numbers, using its three famous ingredients: <strong>queries, keys,
          and values</strong>.
        </p>
      </ExplanationBox>
    </div>
  );
}
