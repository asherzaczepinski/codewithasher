'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// ─── The generation loop, hand-authored ────────────────────────────────────────
// The first turn uses the LOCKED reveal numbers. The follow-on tables are
// illustrative but plausible — enough to assemble one clean sentence and stop.
type Cand = { tok: string; p: number };
type Turn = {
  // probability distribution over the NEXT token, given everything so far
  dist: Cand[];
  pick: string;     // the chosen (top) token
  glue: string;     // ' ' before a word, '' before punctuation / end
  stop?: boolean;   // true on the end-of-text token
  label: string;    // human-readable name for the picked token
};

const BASE = 'The sky is';

const TURNS: Turn[] = [
  {
    dist: [
      { tok: 'blue', p: 0.62 },
      { tok: 'clear', p: 0.17 },
      { tok: 'grey', p: 0.08 },
      { tok: 'falling', p: 0.08 },
      { tok: 'pizza', p: 0.05 },
    ],
    pick: 'blue', glue: ' ', label: 'blue',
  },
  {
    dist: [
      { tok: 'today', p: 0.44 },
      { tok: 'and', p: 0.21 },
      { tok: '.', p: 0.17 },
      { tok: 'right', p: 0.11 },
      { tok: 'outside', p: 0.07 },
    ],
    pick: 'today', glue: ' ', label: 'today',
  },
  {
    dist: [
      { tok: '.', p: 0.55 },
      { tok: ',', p: 0.22 },
      { tok: 'and', p: 0.14 },
      { tok: 'with', p: 0.09 },
    ],
    pick: '.', glue: '', label: 'a period',
  },
  {
    dist: [
      { tok: '[end]', p: 0.73 },
      { tok: 'The', p: 0.13 },
      { tok: 'It', p: 0.08 },
      { tok: 'I', p: 0.06 },
    ],
    pick: '[end]', glue: '', stop: true, label: 'end-of-text',
  },
];

function buildText(gen: number): string {
  let text = BASE;
  for (let i = 0; i < gen; i++) {
    const t = TURNS[i];
    if (t.stop) break;
    text += t.glue + t.pick;
  }
  return text;
}

function GenerationLoop() {
  const [gen, setGen] = useState(0);
  const finished = gen >= TURNS.length;
  const next = finished ? null : TURNS[gen];
  const text = buildText(gen);

  return (
    <div className="gl-box">
      {/* The growing sentence */}
      <div className="gl-strip">
        <span className="gl-cap">context so far</span>
        <div className="gl-sentence">
          <span className="gl-base">{BASE}</span>
          {TURNS.slice(0, gen).map((t, i) =>
            t.stop ? (
              <span key={i} className="gl-end">{t.glue}[end]</span>
            ) : (
              <span
                key={i}
                className={i === gen - 1 ? 'gl-new' : 'gl-old'}
              >
                {t.glue}{t.pick}
              </span>
            )
          )}
          {!finished && <span className="gl-caret">▮</span>}
        </div>
      </div>

      {/* The distribution for the next token */}
      {next && (
        <div className="gl-dist">
          <p className="gl-distcap">
            Feed that whole string back in. The model outputs a fresh probability
            distribution over the next token:
          </p>
          {next.dist.map((c) => {
            const top = c.tok === next.pick;
            return (
              <div key={c.tok} className="gl-row">
                <span className={`gl-tok ${top ? 'gl-toptok' : ''}`}>
                  {c.tok === '[end]' ? '[end]' : c.tok}
                </span>
                <div className="gl-bar">
                  <div
                    className="gl-fill"
                    style={{
                      width: `${c.p * 100}%`,
                      background: top
                        ? 'linear-gradient(90deg,#7c3aed,#5b21b6)'
                        : 'linear-gradient(90deg,#c4b5fd,#a78bfa)',
                    }}
                  />
                </div>
                <span className={`gl-pct ${top ? 'gl-toppct' : ''}`}>
                  {Math.round(c.p * 100)}%
                </span>
              </div>
            );
          })}
          <p className="gl-pickline">
            Top token: <strong>{next.label}</strong>
            {next.stop
              ? ' — the model is signalling it is done.'
              : ' — append it and loop.'}
          </p>
        </div>
      )}

      {finished && (
        <div className="gl-done">
          <strong>[end] generated — the loop stops.</strong> Final output:{' '}
          <span className="gl-final">&ldquo;{text}&rdquo;</span>
        </div>
      )}

      <div className="gl-controls">
        <button
          className="gl-btn"
          onClick={() => setGen((g) => Math.min(g + 1, TURNS.length))}
          disabled={finished}
        >
          {gen === 0 ? 'Generate next token →' : finished ? 'Done' : 'Generate next token →'}
        </button>
        <button className="gl-reset" onClick={() => setGen(0)}>
          Reset
        </button>
        <span className="gl-counter">
          tokens generated: <strong>{finished ? gen - 1 : gen}</strong>
        </span>
      </div>

      <style jsx>{`
        .gl-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .gl-strip { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem 1.2rem; }
        .gl-cap { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: #94a3b8; margin-bottom: 0.5rem; }
        .gl-sentence { font-size: 22px; font-weight: 600; line-height: 1.5; color: #1e293b; }
        .gl-base { color: #475569; }
        .gl-old { color: #475569; }
        .gl-new { color: #5b21b6; background: #ede9fe; border-radius: 5px; padding: 0 4px; animation: gl-pop 0.25s ease; }
        .gl-end { color: #b45309; background: #fef3c7; border-radius: 5px; padding: 0 4px; font-size: 16px; }
        .gl-caret { color: #c4b5fd; margin-left: 2px; animation: gl-blink 1s step-end infinite; }
        @keyframes gl-blink { 50% { opacity: 0; } }
        @keyframes gl-pop { from { transform: translateY(-3px); opacity: 0.4; } to { transform: none; opacity: 1; } }
        .gl-dist { margin-top: 1.2rem; }
        .gl-distcap { margin: 0 0 0.8rem; font-size: 13px; color: #64748b; }
        .gl-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .gl-tok { width: 72px; flex-shrink: 0; font-family: monospace; font-size: 13px; color: #475569; text-align: right; }
        .gl-toptok { color: #5b21b6; font-weight: 700; }
        .gl-bar { flex: 1; height: 16px; background: #eef2f7; border-radius: 5px; overflow: hidden; }
        .gl-fill { height: 100%; transition: width 0.3s ease; }
        .gl-pct { width: 38px; text-align: right; font-family: monospace; font-size: 13px; color: #64748b; font-variant-numeric: tabular-nums; }
        .gl-toppct { color: #1e293b; font-weight: 700; }
        .gl-pickline { margin: 0.8rem 0 0; font-size: 13px; color: #475569; }
        .gl-pickline strong { color: #5b21b6; }
        .gl-done { margin-top: 1.2rem; padding: 1rem 1.2rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; font-size: 14px; color: #065f46; }
        .gl-final { color: #047857; font-weight: 700; }
        .gl-controls { display: flex; align-items: center; gap: 12px; margin-top: 1.3rem; flex-wrap: wrap; }
        .gl-btn { padding: 0.6rem 1.1rem; background: #7c3aed; color: #fff; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .gl-btn:disabled { background: #cbd5e1; cursor: default; }
        .gl-reset { padding: 0.6rem 0.9rem; background: #fff; color: #475569; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px; cursor: pointer; }
        .gl-counter { font-size: 13px; color: #64748b; }
        .gl-counter strong { color: #1e293b; }
      `}</style>
    </div>
  );
}

export default function Step23() {
  return (
    <div>
      <ExplanationBox title="One Prediction Is Not a Sentence">
        <p>
          At the climax we turned <strong>&ldquo;The sky is&rdquo;</strong> into a probability
          distribution and read off the winner: <strong>blue, 62%</strong>. But a model that emits
          one word and stops is not much use. ChatGPT writes paragraphs. How do you get from a single
          next-word guess to a whole sentence?
        </p>
        <p>
          The answer is the promise we made back in Step 2: <strong>autoregression</strong>. You run
          the exact same machine over and over, and each word the model produces becomes part of the
          input for the next run. The output feeds back into the input. That feedback loop is the
          entire trick to generating text.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Loop, in Four Lines">
        <p>Every word a language model has ever written came out of this loop:</p>
        <ol style={{ fontSize: 15, color: '#444', lineHeight: 1.9, paddingLeft: '1.3rem' }}>
          <li><strong>Run the model</strong> on the whole current text to get a distribution over the next token.</li>
          <li><strong>Pick a token</strong> — the most likely one, or sample from the distribution (that is the temperature dial from the last step).</li>
          <li><strong>Append it</strong> to the text.</li>
          <li><strong>Go back to step 1</strong> — until the model picks the special end-of-text token.</li>
        </ol>
        <p>
          The crucial detail: in step 1 you feed the model <em>everything so far</em>, not just the
          last word. After it writes &ldquo;blue,&rdquo; the next prediction is made from
          &ldquo;The sky is blue&rdquo; — the new word is now part of the context, so attention can
          look back at it. This is why a model stays on topic across a paragraph: every token it has
          written is visible to every token it is about to write.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Watch It Write">
        <p>
          Click the button. Start from <strong>&ldquo;The sky is&rdquo;</strong> and watch the
          sentence assemble itself one token at a time. At each click the model produces a fresh
          distribution, the top token gets appended, and the whole string loops back in. (The very
          first distribution is the real one we computed by hand; the follow-on tables are
          illustrative but plausible.)
        </p>
        <GenerationLoop />
        <p>
          Notice three things. The sentence grows by exactly one token per pass. The candidate words
          change every step, because the context changed. And the loop ends on its own — the model
          chose the <strong>[end]</strong> token because, after &ldquo;The sky is blue today.&rdquo;,
          stopping was the most likely continuation. Nobody told it the sentence was over; it
          predicted that it was.
        </p>
      </ExplanationBox>

      <WorkedExample title="The First Two Passes, Spelled Out">
        <p>
          Each pass is one full trip through everything you have learned — tokens, embeddings,
          attention, the transformer stack, logits, softmax — producing one distribution.
        </p>
        <CalcStep number={1}>
          Pass 1. Input <strong>&ldquo;The sky is&rdquo;</strong> → distribution → top token is{' '}
          <strong>blue</strong> (62%). Append it. Text is now &ldquo;The sky is blue.&rdquo;
        </CalcStep>
        <CalcStep number={2}>
          Pass 2. Input <strong>&ldquo;The sky is blue&rdquo;</strong> (all four tokens, including the
          one we just made) → new distribution → top token is <strong>today</strong> (44%). Append.
          Text is now &ldquo;The sky is blue today.&rdquo;
        </CalcStep>
        <CalcStep number={3}>
          Pass 3 picks the period; Pass 4 picks <strong>[end]</strong> and the loop halts.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Four passes, four tokens, one sentence. A model answering a real question does this
          hundreds or thousands of times — which is why longer replies take longer to appear, and why
          you see them stream out word by word. You are literally watching the loop run.
        </p>
      </WorkedExample>

      <ExplanationBox title="Greedy vs. Sampling — Why the Same Prompt Varies">
        <p>
          In the demo we always took the <em>top</em> token. That is called <strong>greedy</strong>{' '}
          decoding, and it is deterministic: the same prompt always yields the same sentence. But if at
          pass 1 you had instead <em>sampled</em> from the distribution — rolling a weighted die where
          &ldquo;blue&rdquo; fills 62% of the faces, &ldquo;clear&rdquo; 17%, and so on — you might
          have gotten &ldquo;The sky is clear today.&rdquo; instead. Crank the temperature up and rarer
          tokens like &ldquo;grey&rdquo; or even &ldquo;pizza&rdquo; get a real shot.
        </p>
        <p>
          That single design choice — sample instead of always taking the max — is why the same prompt
          can give different answers each time, and why a model can feel creative rather than robotic.
          The loop is identical; only the picking rule changes.
        </p>
      </ExplanationBox>

      <ExplanationBox title="That Is the Whole Forward Story">
        <p>
          You can now narrate text generation end to end: tokenize the prompt, embed each token, run
          the stack of attention-and-feed-forward blocks, score the vocabulary into logits, softmax
          into probabilities, pick a token, append, and repeat until <strong>[end]</strong>. Nothing
          in that loop is learning — the weights are frozen. So where did all those numbers, the ones
          that make &ldquo;blue&rdquo; come out on top, actually come from? That is the next step:{' '}
          <strong>training</strong>.
        </p>
      </ExplanationBox>
    </div>
  );
}
