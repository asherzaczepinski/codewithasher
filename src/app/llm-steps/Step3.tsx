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

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="One Job, Start to Finish">
        <p>
          Before we build any single piece, let&apos;s look at the whole machine the way you&apos;d look
          at a map before a road trip. Don&apos;t worry about understanding the details yet — the rest of
          the course is nothing but slowly, carefully filling them in. Right now we just want the shape of
          the thing in your head.
        </p>
        <p>
          Here is that shape. A language model has exactly one job: <strong>you give it some text, and it
          guesses what word comes next.</strong> That&apos;s genuinely all it does. The autocomplete on
          your phone does a tiny version of this. A model like ChatGPT does a wildly better version, and
          then does it over and over — guess a word, add it on, guess the next — until it has written a
          whole answer.
        </p>
        <p>
          So the entire machine is a pipeline that takes in <em>&ldquo;The sky is&rdquo;</em> and turns it
          into a ranked list of likely next words. The surprising part is what happens in between. It runs
          through <strong>five stations</strong>, like an assembly line. Let&apos;s walk down the line one
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

        <p style={{ marginTop: '1rem' }}>
          That&apos;s the entire journey: <strong>text → numbers → meaning → context → refinement → a
          guess.</strong> Everything else in this course is just zooming into one of those five stations
          and working out exactly how it does its job.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Question We&apos;re Saving for Later">
        <p>
          You might be wondering where all those numbers — the word coordinates, the attention amounts —
          actually come from. Nobody types them in by hand. The model <em>learns</em> them by practice: it
          guesses the next word on billions of real sentences, checks how wrong it was, and nudges its
          numbers a hair in the better direction, trillions of times over. That process is called{' '}
          <strong>training</strong>, and it gets its own proper treatment in Part 4. For now, just hold the
          thought: every number in this machine was discovered, not designed.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Plan From Here">
        <p>
          We deliberately refuse to tell you which word wins, or what the final percentages are. That is
          the whole point of the course: by the end, you will have computed that prediction{' '}
          <em>yourself</em> — every multiply, every sum — with nothing hidden. So we keep the punchline
          locked until you&apos;ve earned it.
        </p>
        <p>The road there has four parts, matching the stations above:</p>
        <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.9, paddingLeft: '1.2rem' }}>
          <li><strong>Part 1 — From Text to Meaning:</strong> stations 1 and 2. Turn words into vectors, and learn to measure how close two meanings are.</li>
          <li><strong>Part 2 — Attention:</strong> station 3. Let each word gather context from the others. This is the engine of the whole thing.</li>
          <li><strong>Part 3 — The Transformer Block:</strong> station 4. Wrap attention into the repeatable unit that gets stacked dozens of times.</li>
          <li><strong>Part 4 — Prediction &amp; Training:</strong> station 5 and beyond. Turn the final vector into a real probability, generate a sentence, and see how the whole thing is trained.</li>
        </ul>
        <p>
          Next, we start at the very front of the line and answer the most basic question of all: why
          can&apos;t a computer just read the word &ldquo;sky&rdquo; — and what do we do about it?
        </p>
      </ExplanationBox>
    </div>
  );
}
