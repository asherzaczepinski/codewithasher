'use client';

import { useState } from 'react';
import { encode, decode } from 'gpt-tokenizer/encoding/r50k_base';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

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

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Tokenization: Splitting Text Into Tokens">
        <p>
          Last step we landed on the obstacle: the model computes with numbers, but we handed it letters.
          The first translator in the pipeline is the <strong>tokenizer</strong>. It chops text into
          standard pieces called <strong>tokens</strong> and replaces each piece with an integer{' '}
          <strong>ID</strong> — a row number in a fixed dictionary the model was built with.
        </p>
        <p>
          A token is not always a whole word. It is usually a <em>chunk</em> — sometimes a full common
          word, sometimes a fragment like &ldquo;ization&rdquo; or &ldquo;ing.&rdquo; The box below is not
          a simulation: it runs the <strong>real GPT tokenizer</strong>. It already has our specimen
          loaded — watch &ldquo;The sky is&rdquo; get split, then type anything you like:
        </p>
        <TokenizerDemo />
      </ExplanationBox>

      <WorkedExample title="Our Specimen Becomes Three IDs">
        <p>
          Run &ldquo;The sky is&rdquo; through the tokenizer and you get three tokens — one per word —
          each with its own ID. These exact IDs are the first concrete numbers in our running example:
        </p>
        <CalcStep number={1}><strong>The</strong> &nbsp;→&nbsp; token ID <strong>464</strong></CalcStep>
        <CalcStep number={2}><strong> sky</strong> (with its leading space) &nbsp;→&nbsp; token ID <strong>6766</strong></CalcStep>
        <CalcStep number={3}><strong> is</strong> (with its leading space) &nbsp;→&nbsp; token ID <strong>318</strong></CalcStep>
        <p style={{ marginTop: '1rem' }}>
          So as far as the model is concerned, &ldquo;The sky is&rdquo; is now just the list{' '}
          <code>[464, 6766, 318]</code>. That is the model&apos;s native input — no letters left, just
          three integers.
        </p>
      </WorkedExample>

      <ExplanationBox title="An ID Is a Name Tag, Not a Quantity">
        <p>
          Here is the trap to avoid: those IDs are <strong>labels</strong>, not measurements. Token 6766
          is not &ldquo;bigger&rdquo; or &ldquo;more&rdquo; than token 318 in any meaningful way, and{' '}
          <code>6766</code> is not &ldquo;about 21 times&rdquo; <code>318</code>. The numbers are just
          positions in a dictionary, assigned by where each chunk happened to land when the vocabulary was
          built. If we fed them straight into the multiply-and-add machine, it would draw nonsense
          conclusions from those accidental sizes.
        </p>
        <p>
          That is why tokenization is only <em>half</em> the translation. The next step — embeddings —
          throws the ID away and swaps in numbers that genuinely encode meaning. Tokenization just gets us
          to a clean, finite set of integers to look those meanings up with.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Chunks Instead of Whole Words?">
        <p>
          Two reasons. First, a fixed vocabulary cannot possibly list every word in every language, plus
          every name, typo, and made-up term. By keeping a vocabulary of <strong>subword pieces</strong>,
          the tokenizer can build any word — even one it has never seen — by gluing chunks together. Try
          typing a made-up word like &ldquo;flibbertigibbet&rdquo; into the box above and watch it get
          assembled from fragments.
        </p>
        <p>
          Second, it is efficient. Common words like &ldquo;the&rdquo; get their own single token, so they
          cost one slot. Rare words get split into a few pieces. This keeps the vocabulary at a manageable
          size (typically ~50,000–100,000 tokens) while still covering everything.
        </p>
        <p>
          Where does the chunk list come from? Nobody writes it by hand. An algorithm called{' '}
          <strong>byte-pair encoding</strong> (BPE) builds it from data: start with single characters,
          then repeatedly merge the pair of pieces that appears together most often in a huge pile of
          text. &ldquo;t&rdquo; + &ldquo;h&rdquo; merge early because &ldquo;th&rdquo; is everywhere;
          after tens of thousands of merges, whole common words have become single tokens. Even the
          vocabulary is learned from data — a theme you will see again and again in this course.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why a Model Couldn't Count the R's in Strawberry">
        <p>
          Tokenization explains one of the most famous LLM fails. For a long time, models confidently
          answered that &ldquo;strawberry&rdquo; has <em>two</em> r&apos;s. Why would something that writes
          poetry flub a kindergarten question?
        </p>
        <p>
          Because the model <strong>never sees letters</strong>. By the time the question reaches it,
          &ldquo;strawberry&rdquo; is just a token ID or two — a row number, exactly like the{' '}
          <code>464</code> we got for &ldquo;The.&rdquo; The individual r&apos;s simply are not in the
          input anymore, any more than you could count the letters in a word by looking at its page number
          in a dictionary. The model can only answer from patterns it memorized <em>about</em> the word
          during training.
        </p>
        <p>
          The same effect explains why models historically struggled with arithmetic on long numbers
          (digits get grouped into multi-digit tokens unpredictably) and with rhyming or wordplay (sounds
          and spellings are invisible at the token level). When an LLM does something weirdly dumb,
          &ldquo;it cannot see inside its tokens&rdquo; is very often the reason.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Takeaway">
        <p>
          After tokenizing, our specimen is the list <code>[464, 6766, 318]</code> — the model&apos;s
          native input. But an ID like <code>6766</code> is just a label; it carries no meaning on its own.
          The next step fixes that: turning each ID into a vector of numbers that actually encodes what the
          token <em>means</em>.
        </p>
      </ExplanationBox>
    </div>
  );
}
