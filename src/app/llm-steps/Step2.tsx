'use client';

import ExplanationBox from '@/components/ExplanationBox';

// Small reusable "station" card for the plain-English walkthrough.
function Station({ n, name, tag, children }: { n: number; name: string; tag: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, marginBottom: 12 }}>
      <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: '50%', background: '#ede9fe', color: '#6d28d9', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>{n}</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>{name}</span>
          <span style={{ fontSize: 12, color: '#7c3aed', background: '#f5f3ff', padding: '1px 8px', borderRadius: 4 }}>{tag}</span>
        </div>
        <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="One Job, Start to Finish">
        <p>
          A language model has exactly one job: <strong>you give it some text, and it guesses what word
          comes next</strong> — then does it over and over until it has written a whole answer. What keeps
          it from being glorified autocomplete is what happens <em>before</em> the guess: the model works
          out what every word is actually doing in <em>this</em> sentence and which other words it leans on,
          tracking how much each word matters to every other one and <strong>prioritizing</strong> the ones
          that count (that shifting web of who-matters-to-whom even has a name, <strong>attention</strong>,
          and earns its own part later). So the whole machine is a pipeline that takes in{' '}
          <em>&ldquo;The sky is&rdquo;</em> and turns it into a ranked list of likely next words, running
          through <strong>five stations</strong> like an assembly line. Let&apos;s walk down the line one
          station at a time, in plain English.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Five Stations on the Assembly Line">
        <Station n={1} name="Tokenize" tag="text → numbers">
          A computer can&apos;t actually read letters — deep down it only ever works with numbers. So the
          very first thing we do is chop the text into bite-sized pieces called <strong>tokens</strong>{' '}
          (usually whole words, sometimes chunks of words) and look up a number for each one. Think of it
          like a barcode: every word in the model&apos;s dictionary has its own ID number. After this
          station, <em>&ldquo;The sky is&rdquo;</em> is no longer words at all — it&apos;s just a short list
          of ID numbers.
        </Station>

        <Station n={2} name="Embed" tag="numbers → meaning">
          A barcode tells you <em>which</em> word, but nothing about what it <em>means</em>. So next we
          swap each ID for a small list of numbers called a <strong>vector</strong>. The easiest way to
          picture a vector is as a location, like GPS coordinates — except instead of a map of the Earth,
          it&apos;s a giant map of <em>meaning</em>, where words that mean similar things sit near each
          other (&ldquo;dog&rdquo; close to &ldquo;puppy,&rdquo; far from &ldquo;tractor&rdquo;).{' '}
          <strong>Where does that map come from?</strong> The model builds it by reading enormous amounts
          of text off the internet and noticing which words keep showing up around the same other words —
          it decides what &ldquo;dog&rdquo; means from the company it keeps, so &ldquo;dog&rdquo; and
          &ldquo;puppy&rdquo; drift together because they appear in such similar surroundings. These
          coordinates are what the model actually thinks with from here on.
        </Station>

        <Station n={3} name="Attention" tag="words share context">
          Embeddings gave each word one fixed meaning, but a word only really means something{' '}
          <em>in context</em> — after &ldquo;The sky,&rdquo; the word &ldquo;is&rdquo; needs to know
          it&apos;s talking about a sky. So <strong>attention</strong> lets every word pull in the other
          words that matter to it, and ignore the ones that don&apos;t. That&apos;s the whole purpose.
          {' '}
          How did it learn which words matter? The same way embeddings learned meaning — from the
          guess-the-next-word game, played on mountains of text. At first it focused on random words and
          guessed terribly. But every time paying attention to &ldquo;sky&rdquo; helped it correctly
          predict what follows &ldquo;The sky is,&rdquo; that habit got reinforced; focusing on
          &ldquo;The&rdquo; never helped, so it faded away. After enough rounds the model had worked out on
          its own that to fill this blank you look at &ldquo;sky&rdquo; — not because the two words are
          similar, but simply because that&apos;s what kept making its guesses come true.
        </Station>

        <Station n={4} name="Transformer block" tag="think it over">
          Attention let the words <em>share</em> information; the rest of the block is where each word{' '}
          <em>thinks for itself</em>. Now that &ldquo;is&rdquo; knows it&apos;s about a sky, this step
          mixes in what the model actually knows about skies — the kinds of words and facts that tend to go
          with them. Looking around, then thinking it over: that pair is one <strong>block</strong>.
          That&apos;s the purpose.
          {' '}
          And how did it learn what to think? Same game again — whatever bits of knowledge made its
          next-word guesses more accurate got kept, trillions of examples over, until they were baked into
          its numbers. One round isn&apos;t enough, so models stack <strong>dozens</strong> of these blocks
          and repeat the rhythm: look around, think it over, look around, think it over. Each pass makes
          every word&apos;s understanding a little deeper — grammar in the early rounds, real meaning later
          on.
        </Station>

        <Station n={5} name="Predict" tag="score every word">
          Finally, the model takes the vector for the last word and asks, for <strong>every single one</strong>{' '}
          of the ~50,000 words it knows: &ldquo;how good a fit are you as the next word?&rdquo; It scores
          them all, then converts the scores into percentages that add up to 100%. The word with the
          highest percentage is its guess. (Which word wins for &ldquo;The sky is&rdquo;? You&apos;ll work
          that out yourself, by hand, at the end — we&apos;re keeping it secret on purpose.)
        </Station>
      </ExplanationBox>
    </div>
  );
}
