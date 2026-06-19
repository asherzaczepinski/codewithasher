'use client';

import { useState } from 'react';
import { encode, decode } from 'gpt-tokenizer';
import ExplanationBox from '@/components/ExplanationBox';

function tokenize(text: string): { piece: string; id: number }[] {
  if (!text) return [];
  const ids = encode(text);
  return ids.map(id => ({ piece: decode([id]), id }));
}

const COLORS = ['#dbeafe', '#dcfce7', '#fef9c3', '#fae8ff', '#ffe4e6', '#e0e7ff', '#ccfbf1'];

function TokenizerDemo() {
  const [text, setText] = useState('Tokenization is the start of understanding.');
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
        single token while rarer ones get split into pieces. To the model, your sentence is now just this
        list of IDs.
        <br /><br />
        <strong>Tip:</strong> the leading space before a word is baked <em>into</em> the token — so{' '}
        <code>&quot;truck&quot;</code> and <code>&quot; truck&quot;</code> are two different tokens and
        may split differently. That&apos;s why the same word can tokenize differently at the start of a
        sentence versus mid-sentence.
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
      <ExplanationBox title="Computers Don't Read Words — They Read Numbers">
        <p>
          The model from the last step computes with numbers, but you typed letters. Something has to
          translate. That something is the <strong>tokenizer</strong>: it chops text into pieces called{' '}
          <strong>tokens</strong> and replaces each piece with an integer <strong>ID</strong>.
        </p>
        <p>
          A token isn&apos;t always a whole word. It&apos;s usually a <em>chunk</em> — sometimes a full
          common word, sometimes a fragment like &quot;ization&quot; or &quot;ing&quot;. This isn&apos;t a
          simulation: the box below runs the <strong>real GPT tokenizer</strong>, the same one used by
          actual OpenAI models. Type into it and watch your sentence get split:
        </p>
        <TokenizerDemo />
      </ExplanationBox>

      <ExplanationBox title="Why Chunks Instead of Whole Words?">
        <p>
          Two reasons. First, a fixed vocabulary can&apos;t possibly list every word in every language,
          plus every name, typo, and made-up term. By keeping a vocabulary of <strong>subword pieces</strong>,
          the tokenizer can build any word — even one it&apos;s never seen — by gluing chunks together.
          Try typing a made-up word like &quot;flibbertigibbet&quot; into the box above and watch it get
          assembled from fragments.
        </p>
        <p>
          Second, it&apos;s efficient. Common words like &quot;the&quot; get their own single token, so they
          cost one slot. Rare words get split into a few pieces. This keeps the vocabulary at a manageable
          size (typically ~50,000–100,000 tokens) while still covering everything.
        </p>
        <p>
          Where does the chunk list come from? Nobody writes it by hand. An algorithm called{' '}
          <strong>byte-pair encoding</strong> builds it from data: start with single characters, then
          repeatedly merge the pair of pieces that appears together most often in a huge pile of text.
          &quot;t&quot; + &quot;h&quot; merge early because &quot;th&quot; is everywhere; after tens of
          thousands of merges, whole common words have become single tokens. Even the vocabulary is
          learned from data — a theme you&apos;ll see again and again in this course.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why ChatGPT Couldn't Count the R's in Strawberry">
        <p>
          Tokenization explains one of the most famous LLM fails. For a long time, models confidently
          answered that &quot;strawberry&quot; has <em>two</em> r&apos;s. Why would something that writes
          poetry flub a kindergarten question?
        </p>
        <p>
          Because the model <strong>never sees letters</strong>. By the time the question reaches it,
          &quot;strawberry&quot; is just a token ID or two — a row number like 101830. The individual
          r&apos;s simply aren&apos;t in the input anymore, any more than you can count the letters in a
          word by looking at its page number in a dictionary. The model can only answer from patterns it
          memorized <em>about</em> the word during training.
        </p>
        <p>
          The same effect explains why models historically struggled with arithmetic on long numbers
          (digits get grouped into multi-digit tokens unpredictably) and with rhyming or wordplay
          (sounds and spellings are invisible at the token level). When an LLM does something weirdly
          dumb, &quot;it can&apos;t see inside its tokens&quot; is very often the reason.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Takeaway">
        <p>
          After tokenizing, your text is a list of integers, like <code>[464, 5789, 318, ...]</code>.
          That&apos;s the model&apos;s native input. But an ID like <code>5789</code> is just a label — it
          carries no meaning on its own; <code>5790</code> isn&apos;t &quot;one more&quot; than it in any
          useful sense. The next step fixes that: turning each ID into a vector that actually encodes what
          the token <em>means</em>.
        </p>
      </ExplanationBox>
    </div>
  );
}
