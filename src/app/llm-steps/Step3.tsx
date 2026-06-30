'use client';

import ExplanationBox from '@/components/ExplanationBox';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Byte-Pair Encoding: Learn by Merging">
        <p>
          The algorithm is called <strong>byte-pair encoding</strong> (BPE), and the whole idea fits in one
          sentence: <strong>start with single characters, then over and over, glue together the pair of
          neighbors that shows up most often.</strong> Each merge you keep becomes a new token in the
          vocabulary. Do it tens of thousands of times and the common words have fused into single tokens
          on their own. (Real GPT tokenizers actually start one level below letters, from raw{' '}
          <strong>bytes</strong> — which is why any character at all, even an emoji you&apos;ve never typed,
          can always be built up instead of coming out &ldquo;unknown.&rdquo;)
        </p>
        <p>
          It really is that mechanical, <strong>one token at a time</strong>: scan all the text, find the
          single most common adjacent pair, and add it to the vocabulary as a new token. Then do the whole
          thing again on the updated text, and again, and again — tens of thousands of times. Each round the
          frequent words fuse a little more, until common words are single tokens and only rare ones are
          still spelled out in pieces. (If two pairs ever tie for most common, it doesn&apos;t add both at
          once — it picks one by a fixed rule, and the other almost always wins the very next round. Not always, though: the first merge can eat into the second pair&apos;s count or spawn a brand-new pair that outranks it.) Nobody
          chose any of this by hand; the data did.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Chunks Instead of Whole Words?">
        <p>
          First, why subword pieces at all? Three reasons. A fixed vocabulary cannot possibly list every
          word in every language, plus every name, typo, and made-up term. By keeping a vocabulary of{' '}
          <strong>subword pieces</strong>, the tokenizer can build any word — even one it has never seen —
          by gluing chunks together. That is exactly why &ldquo;flibbertigibbet&rdquo; came out as a string
          of fragments instead of a single &ldquo;unknown.&rdquo;
        </p>
        <p>
          Second, it is efficient. Common words like &ldquo;the&rdquo; get their own single token, so they
          cost one slot. Rare words get split into a few pieces. This keeps the vocabulary at a manageable
          size (typically ~50,000–100,000 tokens) while still covering everything you could ever type.
        </p>
        <p>
          Third, the pieces are not meaningless — a fragment like &ldquo;un-&rdquo; or &ldquo;-ing&rdquo;
          carries real meaning of its own, and later you&apos;ll see the model learn to value a prefix
          differently depending on which pieces sit next to it.
        </p>
      </ExplanationBox>
    </div>
  );
}
