'use client';

import { useState } from 'react';
import { encode, decode } from 'gpt-tokenizer/encoding/r50k_base';
import ExplanationBox from '@/components/ExplanationBox';

function tokenize(text: string): { piece: string; id: number }[] {
  if (!text) return [];
  const ids = encode(text);
  return ids.map(id => ({ piece: decode([id]), id }));
}

const COLORS = ['#dbeafe', '#dcfce7', '#fef9c3', '#fae8ff', '#ffe4e6', '#e0e7ff', '#ccfbf1'];

function TokenizerDemo() {
  const [text, setText] = useState('The sky is');
  const tokens = tokenize(text);
  return (
    <div className="tk-box">
      <input className="tk-input" value={text} onChange={e => setText(e.target.value)} placeholder="Type some text…" />
      <p className="tk-label">Pieces ({tokens.length} tokens):</p>
      <div className="tk-tokens">
        {tokens.map((t, idx) => (
          <span key={idx} className="tk-token" style={{ background: COLORS[idx % COLORS.length] }}>
            <span className="tk-piece">{t.piece === ' ' ? '␣' : t.piece}</span>
            <span className="tk-id">{t.id}</span>
          </span>
        ))}
      </div>
      <p className="tk-note">
        Each colored chunk is one <strong>token</strong>; the small number under it is its{' '}
        <strong>ID</strong> — the token&apos;s row number in the vocabulary. Notice common words become a
        single token while rarer ones get split into pieces. To the model, your text is now just this
        list of IDs.
        <br /><br />
        <strong>Tip:</strong> the leading space before a word is baked <em>into</em> the token — so{' '}
        <code>&quot;sky&quot;</code> and <code>&quot; sky&quot;</code> are two different tokens and may
        split differently. That is why the same word can tokenize differently at the start of a phrase
        versus in the middle of one.
      </p>
      <style jsx>{`
        .tk-box { margin: 1.5rem 0; padding: 1.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .tk-input { width: 100%; padding: 0.6rem 0.8rem; font-size: 15px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 1rem; }
        .tk-label { font-size: 13px; color: #64748b; margin: 0 0 0.6rem; }
        .tk-tokens { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tk-token { display: inline-flex; flex-direction: column; align-items: center; padding: 0.3rem 0.5rem; border-radius: 6px; line-height: 1.2; }
        .tk-piece { font-family: var(--font-mono), monospace; font-size: 14px; color: #1e293b; white-space: pre; }
        .tk-id { font-size: 9px; color: #64748b; font-variant-numeric: tabular-nums; }
        .tk-note { margin: 1rem 0 0; font-size: 13px; line-height: 1.6; color: #555; }
      `}</style>
    </div>
  );
}

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Splitting Text Into Tokens">
        <p>
          A computer can only work with numbers, not letters. So the very first thing that happens to your
          text is it gets chopped into small pieces called <strong>tokens</strong> — usually a whole word or
          a fragment of one. Each token is then swapped for a number called its <strong>ID</strong>, which is
          just its row number in the model&apos;s fixed dictionary.
        </p>
        <p>
          The trick is that these IDs are <strong>name tags, not amounts</strong> — a bigger number does not
          mean &ldquo;more&rdquo; of anything. Turning these label-numbers into ones that actually carry
          meaning is the job of the next step, embeddings.
        </p>
        <p>
          The box below is not a simulation: it runs the <strong>real GPT tokenizer</strong>. It already has
          our specimen loaded — watch &ldquo;The sky is&rdquo; get split, then type anything you like:
        </p>
        <TokenizerDemo />
      </ExplanationBox>
    </div>
  );
}
