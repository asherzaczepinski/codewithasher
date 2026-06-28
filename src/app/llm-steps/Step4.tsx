'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step4() {
  return (
    <div>
      <ExplanationBox title="Who Decided the Chunks?">
        <p>
          Last step the tokenizer split &ldquo;The sky is&rdquo; into exactly three tokens and never
          flinched. But that raises a question we waved past: <strong>where did its dictionary come
          from?</strong> Why is &ldquo;the&rdquo; one whole token while &ldquo;flibbertigibbet&rdquo;
          shatters into fragments? Nobody sat down and typed out fifty thousand chunks by hand. The
          tokenizer <strong>learned</strong> its vocabulary from data — and the method is simple enough to
          do on paper.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Chunks Instead of Whole Words?">
        <p>
          First, why subword pieces at all? Two reasons. A fixed vocabulary cannot possibly list every word
          in every language, plus every name, typo, and made-up term. By keeping a vocabulary of{' '}
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
          So the goal is a vocabulary where <em>frequent</em> things are whole tokens and <em>rare</em>{' '}
          things fall back to pieces. The trick is letting the data decide which is which.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Byte-Pair Encoding: Learn by Merging">
        <p>
          The algorithm is called <strong>byte-pair encoding</strong> (BPE), and the whole idea fits in one
          sentence: <strong>start with single characters, then over and over, glue together the pair of
          neighbors that shows up most often.</strong> Each merge you keep becomes a new token in the
          vocabulary. Do it tens of thousands of times and the common words have fused into single tokens
          on their own.
        </p>
        <p>
          Let&apos;s actually run it. Pretend our entire training corpus is just these five words, with how
          many times each one appears:
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#ede9fe', borderRadius: 8 }}>
          <code style={{ fontSize: 14, color: '#4c1d95' }}>
            hug ×10 &nbsp;&nbsp; pug ×5 &nbsp;&nbsp; pun ×12 &nbsp;&nbsp; bun ×4 &nbsp;&nbsp; hugs ×5
          </code>
        </div>
        <p>
          We begin with every word split into single characters, so the only &ldquo;tokens&rdquo; we have
          are the letters <code>b g h n p s u</code>. Now we count every adjacent pair across the whole
          corpus, weighted by how often its word appears.
        </p>
      </ExplanationBox>

      <WorkedExample title="Merge #1 — Find the Most Common Pair">
        <p>
          Tally each neighboring pair. The pair <strong>u·g</strong> shows up inside three different words,
          so its count adds up:
        </p>
        <CalcStep number={1}><strong>u·g</strong>: 10 (hug) + 5 (pug) + 5 (hugs) = <strong>20</strong></CalcStep>
        <CalcStep number={2}><strong>p·u</strong>: 5 (pug) + 12 (pun) = <strong>17</strong></CalcStep>
        <CalcStep number={3}><strong>u·n</strong>: 12 (pun) + 4 (bun) = <strong>16</strong></CalcStep>
        <CalcStep number={4}><strong>h·u</strong>: 10 (hug) + 5 (hugs) = <strong>15</strong></CalcStep>
        <p style={{ marginTop: '1rem' }}>
          <strong>u·g</strong> wins with 20. So we add a brand-new token <code>ug</code> to the vocabulary
          and rewrite every word with it: <code>h·ug</code>, <code>p·ug</code>, <code>p·u·n</code>,{' '}
          <code>b·u·n</code>, <code>h·ug·s</code>.
        </p>
      </WorkedExample>

      <WorkedExample title="Merges #2 and #3 — Keep Going">
        <p>Recount the pairs on the rewritten corpus and merge the winner again:</p>
        <CalcStep number={1}>
          Now <strong>u·n</strong> = 12 (pun) + 4 (bun) = <strong>16</strong> is the most common, so we
          merge it into <code>un</code>. Words become <code>p·un</code> and <code>b·un</code>.
        </CalcStep>
        <CalcStep number={2}>
          Recount again: <strong>h·ug</strong> = 10 (hug) + 5 (hugs) = <strong>15</strong> now leads, so we
          merge it into <code>hug</code>. The word &ldquo;hug&rdquo; is now a <em>single token</em>.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Three merges in, our vocabulary has grown from 7 lone letters to{' '}
          <code>b g h n p s u ug un hug</code>. The words that appeared most often quietly collapsed into
          whole tokens, while a rare word would still be spelled out in smaller pieces — exactly the
          behavior we wanted, and nobody chose it by hand. The data did.
        </p>
      </WorkedExample>

      <ExplanationBox title="The Same Lesson, Already">
        <p>
          A real tokenizer runs this loop tens of thousands of times over a huge pile of internet text.
          &ldquo;t&rdquo; + &ldquo;h&rdquo; merge almost immediately because &ldquo;th&rdquo; is
          everywhere; after enough rounds, &ldquo;The,&rdquo; &ldquo; sky,&rdquo; and &ldquo; is&rdquo; have
          all earned their own single tokens — which is why our specimen came out as just three IDs.
        </p>
        <p>
          Notice the shape of what just happened: we did not <em>program</em> the vocabulary, we{' '}
          <strong>learned it from data</strong> by repeating a tiny rule. That is the exact theme of this
          whole course — embeddings, attention, every weight in the machine is discovered the same way, by
          letting data vote. The tokenizer is just the first and simplest example.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Takeaway">
        <p>
          The tokenizer&apos;s dictionary is not handwritten — it is the frozen result of BPE merging the
          most common pairs, over and over, until frequent words became whole tokens. With that vocabulary
          fixed, &ldquo;The sky is&rdquo; reliably becomes <code>[464, 6766, 318]</code>. But those are
          still just labels. Next we start Part 2 and give each ID real <em>meaning</em>: an embedding
          vector.
        </p>
      </ExplanationBox>
    </div>
  );
}
