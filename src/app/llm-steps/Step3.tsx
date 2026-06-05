'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import CodeBlock from '@/components/CodeBlock';

// A toy "subword" tokenizer: a fixed vocabulary of common chunks. We greedily match
// the longest chunk in the vocab at each position. IDs are just the index in the vocab.
const VOCAB = [
  ' tokenization', ' understanding', ' learning', ' network', ' models',
  ' token', ' learn', ' play', 'ing', 'ization', 'ization', 'tion', ' the', ' is', ' of',
  ' a', ' to', 'ed', 'er', 'ly', '.', ',', ' ', "'",
];
// stable id = position in this ordered list (dedup-safe by index)
function tokenize(text: string): { piece: string; id: number }[] {
  const out: { piece: string; id: number }[] = [];
  let i = 0;
  const lower = text.toLowerCase();
  while (i < lower.length) {
    let matched = '';
    let matchedId = -1;
    for (let v = 0; v < VOCAB.length; v++) {
      const chunk = VOCAB[v];
      if (chunk && lower.startsWith(chunk, i) && chunk.length > matched.length) {
        matched = chunk;
        matchedId = v;
      }
    }
    if (matched) {
      out.push({ piece: text.slice(i, i + matched.length), id: 1000 + matchedId });
      i += matched.length;
    } else {
      out.push({ piece: text[i], id: lower.charCodeAt(i) });
      i += 1;
    }
  }
  return out;
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
          common word, sometimes a fragment like &quot;ization&quot; or &quot;ing&quot;. Type into the box and
          watch your sentence get split:
        </p>
        <TokenizerDemo />
      </ExplanationBox>

      <ExplanationBox title="Why Chunks Instead of Whole Words?">
        <p>
          Two reasons. First, a fixed vocabulary can&apos;t possibly list every word in every language,
          plus every name, typo, and made-up term. By keeping a vocabulary of <strong>subword pieces</strong>,
          the tokenizer can build any word — even one it&apos;s never seen — by gluing chunks together.
        </p>
        <p>
          Second, it&apos;s efficient. Common words like &quot;the&quot; get their own single token, so they
          cost one slot. Rare words get split into a few pieces. This keeps the vocabulary at a manageable
          size (typically ~50,000–100,000 tokens) while still covering everything.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Takeaway">
        <p>
          After tokenizing, your text is a list of integers, like <code>[464, 6766, 318, ...]</code>.
          That&apos;s the model&apos;s native input. But an ID like <code>6766</code> is just a label — it
          carries no meaning on its own; <code>6767</code> isn&apos;t &quot;one more&quot; than it in any
          useful sense. The next step fixes that: turning each ID into a vector that actually encodes what
          the token <em>means</em>.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="llm.py"
        caption="A minimal byte-pair-style tokenizer: build a vocabulary, then greedily encode text to token IDs."
        code={`import re

# ---------------------------------------------------------------------------
# STEP 1 — TOKENIZATION
# Convert raw text into a list of integer token IDs.
# Real models use Byte-Pair Encoding (BPE) learned from data; this version
# hand-crafts the same idea so every line stays readable.
# ---------------------------------------------------------------------------

# The vocabulary: an ordered list of string "pieces".
# Index 0 -> ID 0, index 1 -> ID 1, etc.
# Common multi-character chunks come first so the greedy scan picks them.
VOCAB = [
    " tokenization", " understanding", " learning",   # long words -> single token
    " the", " is", " of", " a", " to",                # common short words
    "ing", "tion", "er", "ly",                        # common suffixes
    ".", ",", " ", "'",                               # punctuation & space
]

def build_vocab_index(vocab):
    # Map each piece -> its integer ID for fast lookup later.
    # Longer pieces are tried first during encoding (greedy longest match).
    return {piece: idx for idx, piece in enumerate(vocab)}

VOCAB_INDEX = build_vocab_index(VOCAB)

def tokenize(text):
    # Greedy longest-match tokenizer.
    # Walk left-to-right; at each position try the longest vocab piece that fits.
    # If nothing matches, fall back to the raw Unicode code-point (always works).
    tokens = []        # list of (piece_string, token_id) pairs
    i = 0
    lower = text.lower()

    while i < len(lower):
        best_piece = None
        best_id    = None

        # Try every vocab piece; keep the longest one that starts at position i.
        for piece, pid in VOCAB_INDEX.items():
            if lower.startswith(piece, i):
                if best_piece is None or len(piece) > len(best_piece):
                    best_piece = piece
                    best_id    = pid

        if best_piece is not None:
            # Matched a known vocab piece -> use the original-case slice.
            tokens.append((text[i : i + len(best_piece)], best_id))
            i += len(best_piece)
        else:
            # Unknown character -> encode as its Unicode code-point.
            # This guarantees the tokenizer never fails on unseen characters.
            tokens.append((text[i], ord(text[i])))
            i += 1

    return tokens

# --- demo ---
sentence = "Tokenization is the start of understanding."
result   = tokenize(sentence)

# Each element is (piece, id).  The model only sees the IDs.
token_ids = [tid for _, tid in result]
print("pieces :", [p for p, _ in result])
print("ids    :", token_ids)
# ids: [0, 2, 3, ..., 14]  <-- the model's actual input`}
      />
    </div>
  );
}
