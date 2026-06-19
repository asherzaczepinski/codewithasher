'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';

// ─── The full pipeline, end to end ────────────────────────────────────────────
function PipelineTrace() {
  const stages = [
    { label: 'text', sub: '"the cat sat"', fill: '#f1f5f9', stroke: '#64748b' },
    { label: 'tokens', sub: '[291, 2368, 3332]', fill: '#fef9c3', stroke: '#ca8a04' },
    { label: 'embeddings', sub: '+ positions', fill: '#dcfce7', stroke: '#16a34a' },
    { label: 'transformer blocks', sub: 'attention + FFN, × N', fill: '#ede9fe', stroke: '#7c3aed' },
    { label: 'logits', sub: 'one score per word', fill: '#dbeafe', stroke: '#2563eb' },
    { label: 'softmax', sub: 'probabilities', fill: '#fae8ff', stroke: '#a21caf' },
    { label: 'sample', sub: '"on"', fill: '#ffe4e6', stroke: '#e11d48' },
  ];
  return (
    <div className="pt-box">
      <div className="pt-flow">
        {stages.map((s, i) => (
          <span key={s.label} className="pt-item">
            <span className="pt-stage" style={{ background: s.fill, borderColor: s.stroke }}>
              <span className="pt-label" style={{ color: s.stroke }}>{s.label}</span>
              <span className="pt-sub">{s.sub}</span>
            </span>
            {i < stages.length - 1 && <span className="pt-arrow">→</span>}
          </span>
        ))}
      </div>
      <p className="pt-cap">
        …then &quot;on&quot; is appended to the text and the <strong>whole pipeline runs again</strong>.
        Every stage is something you&apos;ve now seen up close.
      </p>
      <style jsx>{`
        .pt-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .pt-flow { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; justify-content: center; }
        .pt-item { display: inline-flex; align-items: center; gap: 0.4rem; }
        .pt-stage { display: inline-flex; flex-direction: column; align-items: center; padding: 0.4rem 0.7rem; border: 1.5px solid; border-radius: 9px; gap: 1px; }
        .pt-label { font-size: 12px; font-weight: 700; }
        .pt-sub { font-size: 10px; color: #64748b; font-family: var(--font-mono), monospace; }
        .pt-arrow { color: #94a3b8; font-size: 14px; }
        .pt-cap { margin: 1rem 0 0; font-size: 13px; color: #555; line-height: 1.6; text-align: center; }
      `}</style>
    </div>
  );
}

// ─── Our toy LLM: hand-made next-word tables for the tiny world ───────────────
const TABLE: Record<string, { word: string; p: number }[]> = {
  the:  [{ word: 'cat', p: 0.45 }, { word: 'dog', p: 0.30 }, { word: 'mat', p: 0.15 }, { word: 'park', p: 0.10 }],
  cat:  [{ word: 'sat', p: 0.60 }, { word: 'ran', p: 0.30 }, { word: '.', p: 0.10 }],
  dog:  [{ word: 'ran', p: 0.55 }, { word: 'sat', p: 0.35 }, { word: '.', p: 0.10 }],
  sat:  [{ word: 'on', p: 0.70 }, { word: 'in', p: 0.20 }, { word: '.', p: 0.10 }],
  ran:  [{ word: 'in', p: 0.45 }, { word: 'on', p: 0.35 }, { word: '.', p: 0.20 }],
  on:   [{ word: 'the', p: 0.90 }, { word: '.', p: 0.10 }],
  in:   [{ word: 'the', p: 0.90 }, { word: '.', p: 0.10 }],
  mat:  [{ word: '.', p: 0.85 }, { word: 'in', p: 0.15 }],
  park: [{ word: '.', p: 0.85 }, { word: 'on', p: 0.15 }],
};
const MAX_LEN = 14;

// Weighted random draw — lives outside the component so render stays pure.
function weightedPick(candidates: { word: string; p: number }[]): string {
  let r = Math.random();
  for (const c of candidates) { r -= c.p; if (r <= 0) return c.word; }
  return candidates[candidates.length - 1].word;
}

function GenerationDemo() {
  const [context, setContext] = useState<string[]>(['the']);
  const [done, setDone] = useState(false);

  const last = context[context.length - 1];
  const tooLong = context.length >= MAX_LEN;
  const candidates = done ? [] : tooLong ? [{ word: '.', p: 1.0 }] : (TABLE[last] ?? [{ word: '.', p: 1.0 }]);

  const pick = (word: string) => {
    if (done) return;
    if (word === '.') { setContext(c => [...c, '.']); setDone(true); }
    else setContext(c => [...c, word]);
  };
  const sample = () => pick(weightedPick(candidates));
  const reset = () => { setContext(['the']); setDone(false); };

  return (
    <div className="gn-box">
      <p className="gn-label">The text so far (the context):</p>
      <div className="gn-ctx">
        {context.map((w, i) => (
          <span key={i} className={`gn-tok ${w === '.' ? 'stop' : ''} ${i === context.length - 1 ? 'new' : ''}`}>{w === '.' ? '. (stop)' : w}</span>
        ))}
        {!done && <span className="gn-cursor">▌</span>}
      </div>

      {done ? (
        <div className="gn-done">
          <p className="gn-done-msg">
            The model emitted its <strong>stop token</strong> — generation over. Final output:{' '}
            <em>&quot;{context.slice(0, -1).join(' ')}.&quot;</em>
          </p>
          <button className="gn-btn" onClick={reset}>Start over ↺</button>
        </div>
      ) : (
        <>
          <p className="gn-label">
            {tooLong
              ? 'Hit the length limit — only the stop token remains:'
              : <>The model&apos;s probabilities for the next word, given everything so far — pick one, or let it sample:</>}
          </p>
          <div className="gn-rows">
            {candidates.map(c => (
              <button key={c.word} className="gn-row" onClick={() => pick(c.word)}>
                <span className="gn-word">{c.word === '.' ? '. (stop)' : c.word}</span>
                <span className="gn-track"><span className="gn-fill" style={{ width: `${c.p * 100}%` }} /></span>
                <span className="gn-pct">{Math.round(c.p * 100)}%</span>
              </button>
            ))}
          </div>
          <div className="gn-actions">
            <button className="gn-btn" onClick={sample}>🎲 Sample for me</button>
            <button className="gn-btn ghost" onClick={reset}>Reset</button>
          </div>
        </>
      )}

      <p className="gn-note">
        This toy model&apos;s &quot;transformer&quot; is just a lookup table over the previous word — but
        the <strong>loop</strong> is the real thing: predict, append, repeat, stop. Run it a few times.
        Sometimes you get &quot;the cat sat on the mat.&quot; — sometimes the dog runs in the park —
        and occasionally something silly. That&apos;s sampling.
      </p>
      <style jsx>{`
        .gn-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .gn-label { font-size: 13px; color: #64748b; margin: 0 0 0.6rem; }
        .gn-ctx { display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center; margin-bottom: 1.25rem; min-height: 36px; }
        .gn-tok { padding: 0.35rem 0.65rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 15px; font-weight: 600; color: #1e293b; }
        .gn-tok.new { border-color: #7c3aed; background: #faf5ff; color: #5b21b6; }
        .gn-tok.stop { border-color: #fda4af; background: #fff1f2; color: #be123c; font-size: 12px; }
        .gn-cursor { color: #7c3aed; animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .gn-rows { display: flex; flex-direction: column; gap: 0.45rem; }
        .gn-row { display: flex; align-items: center; gap: 0.7rem; padding: 0.4rem 0.6rem; background: white; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: left; }
        .gn-row:hover { border-color: #c4b5fd; }
        .gn-word { width: 76px; font-weight: 600; color: #334155; font-size: 14px; }
        .gn-track { flex: 1; height: 10px; background: #eef2f7; border-radius: 5px; overflow: hidden; }
        .gn-fill { display: block; height: 100%; background: linear-gradient(90deg, #a78bfa, #7c3aed); }
        .gn-pct { width: 38px; text-align: right; font-variant-numeric: tabular-nums; color: #64748b; font-size: 13px; }
        .gn-actions { display: flex; gap: 0.6rem; margin-top: 1rem; }
        .gn-btn { padding: 0.45rem 1rem; background: #7c3aed; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
        .gn-btn.ghost { background: white; color: #334155; border: 1px solid #cbd5e1; }
        .gn-done { padding: 0.9rem 1rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; }
        .gn-done-msg { margin: 0 0 0.75rem; font-size: 14px; color: #166534; line-height: 1.6; }
        .gn-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step13() {
  return (
    <div>
      <ExplanationBox title="The Loop That Writes Everything">
        <p>
          You now know every stage of a single prediction. Generation is just that prediction{' '}
          <strong>in a loop</strong>:
        </p>
        <ol style={{ fontSize: '15px', color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li>Run the whole context through the transformer.</li>
          <li>Get next-token probabilities; sample one token.</li>
          <li>Append it to the context.</li>
          <li>Repeat — until a stop token or a length limit.</li>
        </ol>
        <PipelineTrace />
      </ExplanationBox>

      <ExplanationBox title="Now You Run It">
        <p>
          Time for the course&apos;s closing demo: our toy world&apos;s own language model. It starts
          with the context &quot;the&quot; and offers you its genuine next-word distribution at each
          step. Drive it yourself, or hit the dice and let it sample:
        </p>
        <GenerationDemo />
        <p>
          Note the <strong>stop token</strong> — a special vocabulary entry meaning &quot;I&apos;m
          done.&quot; Real models have exactly this: generation ends when the model itself predicts the
          end. When ChatGPT stops typing, that&apos;s not a timer — the model literally chose
          &quot;stop&quot; as its most likely next token.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why the Loop Stays Coherent">
        <p>
          Every word the model writes becomes part of the input for the next word. That&apos;s why an
          LLM can stay on topic across a whole essay: by paragraph three, its own paragraph one is right
          there in the context window, attended to by every new token. It&apos;s also why one early weird
          word can snowball — the model treats its own past output as gospel context. Generation quality
          is self-reinforcing in both directions.
        </p>
      </ExplanationBox>

      <ExplanationBox title="You've Built the Whole Picture">
        <p>
          Put it together and the &quot;magic&quot; is gone — replaced by something you can actually trace:
        </p>
        <p style={{ padding: '0.7rem 0.9rem', background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', fontSize: '14px', color: '#5b21b6', lineHeight: 1.7 }}>
          <strong>text → tokens → embeddings → (+positions) → a tall stack of attention + feed-forward blocks
          → logits → softmax → sample a token → repeat.</strong>
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          Every piece is concrete: dot products, softmax, weighted sums. But two big questions remain.
          Where do all those weights — the embeddings, the W<sub>Q</sub>/W<sub>K</sub>/W<sub>V</sub>{' '}
          matrices, the feed-forward layers — actually come from? And how does a raw next-word guesser
          become a helpful assistant that follows instructions? Those are the last two steps.
        </p>
      </ExplanationBox>
    </div>
  );
}
