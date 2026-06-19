'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// A tiny next-word demo: a hand-made probability table over a few continuations.
const CONTEXT = 'The sky is';
const NEXT: { word: string; p: number }[] = [
  { word: 'blue', p: 0.62 },
  { word: 'clear', p: 0.18 },
  { word: 'falling', p: 0.08 },
  { word: 'grey', p: 0.07 },
  { word: 'pizza', p: 0.01 },
];

function NextWordDemo() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="nw-box">
      <div className="nw-prompt">
        <span className="nw-ctx">{CONTEXT}</span>
        <span className="nw-blank">{picked ?? '____'}</span>
      </div>
      <p className="nw-label">The model&apos;s guess for the next word — bigger bar = more likely:</p>
      <div className="nw-rows">
        {NEXT.map(n => (
          <button key={n.word} className={`nw-row ${picked === n.word ? 'sel' : ''}`} onClick={() => setPicked(n.word)}>
            <span className="nw-word">{n.word}</span>
            <span className="nw-track"><span className="nw-fill" style={{ width: `${n.p * 100}%` }} /></span>
            <span className="nw-pct">{Math.round(n.p * 100)}%</span>
          </button>
        ))}
      </div>
      <p className="nw-note">
        {picked
          ? `You picked “${picked}”. A real LLM does exactly this, then feeds “${CONTEXT} ${picked}” back in and guesses again — and again — until the sentence is done.`
          : 'Click a word to choose the continuation. Notice the model never “knows” the answer — it ranks options by probability.'}
      </p>
      <style jsx>{`
        .nw-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .nw-prompt { font-size: 20px; font-weight: 600; color: #1e293b; margin-bottom: 1rem; }
        .nw-ctx { color: #334155; }
        .nw-blank { margin-left: 0.4rem; color: #7c3aed; border-bottom: 2px dashed #c4b5fd; padding: 0 0.3rem; }
        .nw-label { font-size: 13px; color: #64748b; margin: 0 0 0.6rem; }
        .nw-rows { display: flex; flex-direction: column; gap: 0.45rem; }
        .nw-row { display: flex; align-items: center; gap: 0.7rem; padding: 0.4rem 0.6rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: left; }
        .nw-row:hover { border-color: #c4b5fd; }
        .nw-row.sel { border-color: #7c3aed; background: #faf5ff; }
        .nw-word { width: 70px; font-weight: 600; color: #334155; font-size: 14px; }
        .nw-track { flex: 1; height: 10px; background: #eef2f7; border-radius: 5px; overflow: hidden; }
        .nw-fill { display: block; height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); }
        .nw-pct { width: 38px; text-align: right; font-variant-numeric: tabular-nums; color: #64748b; font-size: 13px; }
        .nw-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="A Language Model Is a Next-Word Guesser">
        <p>
          Strip away the branding and a language model is a function with one job: given some text,
          output a <strong>probability for every possible next word</strong>. That&apos;s it. It doesn&apos;t
          store answers in a database. It doesn&apos;t look things up. It computes, from the patterns it
          learned during training, how likely each word is to come next.
        </p>
        <p>
          Try it. Here&apos;s the context &quot;The sky is&quot; and a set of candidate next words. The model
          assigns each one a probability:
        </p>
        <NextWordDemo />
        <p>
          Hang on to that <strong>62% for &quot;blue&quot;</strong> — it comes back near the end of the
          course, when we see how the model is punished or rewarded for numbers exactly like it during
          training.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Where the Probabilities Come From">
        <p>
          During training, the model reads a colossal amount of text and plays a fill-in-the-blank game
          trillions of times: hide the next word, guess it, check the real answer, and nudge its internal
          weights to be a little less wrong. Sound familiar? It&apos;s the same{' '}
          <strong>predict → measure error → adjust</strong> loop from the neural network course — just at
          enormous scale, and with text as the data.
        </p>
        <p>
          After enough rounds, &quot;blue&quot; gets a high probability after &quot;The sky is&quot; not because
          anyone told it to, but because it saw that pattern over and over. Meaning and grammar emerge as
          side effects of getting good at the guessing game.
        </p>
      </ExplanationBox>

      <ExplanationBox title="From One Guess to a Whole Answer">
        <p>
          A single guess only gives one word. To write a sentence, the model does it{' '}
          <strong>autoregressively</strong>: predict a word, stick it onto the end of the text, then feed
          the whole thing back in and predict the next. Each new word becomes part of the context for the
          word after it. That tight little loop, run hundreds of times, is what produces a paragraph that
          reads like a person wrote it.
        </p>
        <p>
          We&apos;ll run that loop ourselves at the end of the course — you&apos;ll click through it word
          by word and watch a sentence assemble itself, including the moment the model decides it&apos;s
          finished.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Two Questions That Drive This Course">
        <p>
          If an LLM is &quot;just&quot; a next-word guesser, two honest questions remain — and answering
          them properly is the whole course:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>
            <strong>How does text become numbers a network can compute with?</strong> Networks multiply
            and add; they can&apos;t multiply the word &quot;sky.&quot; That&apos;s Part 1: tokens and
            embeddings.
          </li>
          <li>
            <strong>How does the model know which earlier words matter for the current guess?</strong>{' '}
            &quot;Blue&quot; is likely because of &quot;sky,&quot; not because of &quot;The.&quot;
            That&apos;s Part 2: attention — the idea that made modern LLMs possible.
          </li>
        </ul>
        <p>
          We start with the first one: turning text into numbers.
        </p>
      </ExplanationBox>
    </div>
  );
}
