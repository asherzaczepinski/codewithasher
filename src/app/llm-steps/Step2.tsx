'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// Abstract autoregressive-loop demo. No real sentence, no numbers, no probabilities —
// just neutral placeholder shapes, so we can show the predict → append → repeat loop
// without spoiling the running example or revealing any output.
function LoopDemo() {
  const [tokens, setTokens] = useState<number[]>([0, 1, 2]);
  const predictNext = () => setTokens(t => (t.length >= 7 ? t : [...t, t.length]));
  const reset = () => setTokens([0, 1, 2]);
  const done = tokens.length >= 7;
  const SHAPES = ['◆', '●', '■', '▲', '◆', '●', '■'];
  return (
    <div className="lp-box">
      <p className="lp-label">
        Think of each shape as one chunk of text. The model looks at everything so far, then emits one
        more chunk — and that new chunk becomes part of what it reads on the next pass.
      </p>
      <div className="lp-stage">
        <div className="lp-strip">
          {tokens.map((t, i) => (
            <span key={i} className={`lp-tok ${i >= 3 ? 'gen' : ''}`}>{SHAPES[t % SHAPES.length]}</span>
          ))}
          {!done && <span className="lp-slot">?</span>}
        </div>
      </div>
      <div className="lp-controls">
        <button className="lp-btn" onClick={predictNext} disabled={done}>
          {done ? 'Stopped' : 'Predict the next chunk →'}
        </button>
        <button className="lp-btn ghost" onClick={reset}>Reset</button>
      </div>
      <p className="lp-note">
        {done
          ? 'The model emitted a special “stop” signal and the loop ended. That single rule — guess one chunk, feed it back, repeat — is how every paragraph you have ever read from an LLM was produced.'
          : 'Each click runs the model once. Notice the output of one step becomes the input of the next. The model never plans the whole sentence; it only ever answers “what comes next?”'}
      </p>
      <style jsx>{`
        .lp-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .lp-label { font-size: 13px; color: #64748b; margin: 0 0 1rem; line-height: 1.6; }
        .lp-stage { background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; margin-bottom: 1rem; }
        .lp-strip { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
        .lp-tok { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 8px; font-size: 18px; background: #eef2f7; color: #475569; }
        .lp-tok.gen { background: #ede9fe; color: #5b21b6; }
        .lp-slot { display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 8px; font-size: 18px; font-weight: 700; color: #7c3aed; border: 2px dashed #c4b5fd; }
        .lp-controls { display: flex; gap: 0.6rem; }
        .lp-btn { padding: 0.55rem 1rem; font-size: 14px; font-weight: 600; color: white; background: #7c3aed; border: none; border-radius: 8px; cursor: pointer; }
        .lp-btn:hover { background: #5b21b6; }
        .lp-btn:disabled { background: #c4b5fd; cursor: default; }
        .lp-btn.ghost { background: white; color: #7c3aed; border: 1px solid #c4b5fd; }
        .lp-btn.ghost:hover { background: #faf5ff; }
        .lp-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
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
          output a number for <strong>every possible next word</strong> saying how likely that word is to
          come next. The whole vocabulary gets a score; the scores add up to 100%. That spread of scores
          across every candidate word is called a <strong>probability distribution</strong>, and producing
          one is the only thing the model ever does.
        </p>
        <p>
          It does not store answers in a database. It does not look anything up. It <em>computes</em>,
          from patterns it absorbed during training, how plausible each word is as the continuation of
          what it just read.
        </p>
      </ExplanationBox>

      <ExplanationBox title="It Ranks, It Doesn't Know">
        <p>
          This is the mental shift that makes everything later click: the model never &ldquo;knows&rdquo;
          the answer. It produces a <strong>ranking</strong>. Usually one word is far more likely than the
          rest, but several are often plausible at once, and the model is perfectly happy to spread its
          confidence across them. Picking which one to actually use is a separate decision we make
          afterward — and a knob we will get to control near the end of the course.
        </p>
        <p>
          So whenever you read an LLM&apos;s output, remember what really happened underneath: at every
          single position, the model laid out the entire vocabulary, scored every option, and committed
          to one. Then it did it again.
        </p>
      </ExplanationBox>

      <ExplanationBox title="From One Guess to a Whole Answer">
        <p>
          A single guess only gives one word. To write a sentence, the model works{' '}
          <strong>autoregressively</strong>: predict a word, stick it onto the end of the text, then feed
          the whole thing back in and predict the next. Each new word becomes part of the context for the
          word after it. That tight little loop, run hundreds of times, is what produces a paragraph that
          reads like a person wrote it.
        </p>
        <LoopDemo />
        <p>
          We will run this exact loop ourselves at the very end of the course — with real numbers — and
          watch a sentence assemble itself one word at a time, including the moment the model decides it
          is finished.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Where the Scores Come From">
        <p>
          During training, the model reads a colossal amount of text and plays a fill-in-the-blank game
          trillions of times: hide the next word, guess it, check the real answer, and nudge its internal
          weights to be a little less wrong. Sound familiar? It is the same{' '}
          <strong>predict → measure error → adjust</strong> loop from the neural network course — just at
          enormous scale, with text as the data. Meaning and grammar are not programmed in; they emerge
          as side effects of getting good at the guessing game.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Two Questions That Drive This Course">
        <p>
          If an LLM is &ldquo;just&rdquo; a next-word guesser, two honest questions remain — and answering
          them properly is the entire course:
        </p>
        <ul style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>
            <strong>How does text become numbers a network can compute with?</strong> Networks multiply
            and add; they cannot multiply a word. That is Part 1: tokens and embeddings.
          </li>
          <li>
            <strong>How does the model know which earlier words matter for the current guess?</strong>{' '}
            Some earlier words are decisive and some are noise, and which is which changes every time.
            That is Part 2: attention — the idea that made modern LLMs possible.
          </li>
        </ul>
        <p>
          We start with the first one. Next we will meet the single phrase we will carry through the whole
          course, and confront the very first obstacle: a computer cannot do arithmetic on letters.
        </p>
      </ExplanationBox>
    </div>
  );
}
