'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// Our toy trained embedding table — 3 columns instead of GPT-2's 768, so every
// downstream calculation stays checkable by hand. These exact rows are locked
// and used in every later step.
const ROWS = [
  { w: 'The', id: 464, v: [0.1, 0.0, 0.9] },
  { w: 'sky', id: 6766, v: [1.0, 0.7, 0.0] },
  { w: 'is', id: 318, v: [0.1, 0.2, 0.8] },
];

function LookupTable() {
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 0.8rem', fontSize: 12.5, color: '#64748b' }}>
        Token ID in → that row of the table out. No arithmetic, no decision — a lookup:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROWS.map(r => (
          <div key={r.w} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ width: 34, fontWeight: 700, fontSize: 14, color: '#334155' }}>{r.w}</span>
            <span style={{ width: 78, fontSize: 11.5, fontFamily: 'monospace', color: '#94a3b8' }}>id {r.id}</span>
            <span style={{ color: '#94a3b8' }}>→ row #{r.id} →</span>
            <div style={{ display: 'flex', gap: 5 }}>
              {r.v.map((n, i) => (
                <span key={i} style={{ padding: '3px 10px', borderRadius: 6, fontFamily: 'monospace', fontSize: 13, fontWeight: 700, background: n > 0 ? '#ede9fe' : '#f1f5f9', color: n > 0 ? '#5b21b6' : '#94a3b8' }}>
                  {n.toFixed(1)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{ margin: '0.9rem 0 0', fontSize: 12, color: '#94a3b8' }}>
        A real GPT-2 row has 768 numbers, not 3. We shrink the width so you can check every later
        calculation on paper — the machinery is identical.
      </p>
    </div>
  );
}

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="A Token ID Means Nothing as a Number">
        <p>
          Tokenizing left us with bare IDs — <code>464, 6766, 318</code> for &ldquo;The sky is.&rdquo; The
          model has to do <em>arithmetic</em> on words, and an ID is useless for that: token 6766 is not
          &ldquo;bigger&rdquo; or &ldquo;more&rdquo; than token 464 in any meaningful way. Feed IDs straight
          into a machine that multiplies and adds, and it would conclude &ldquo;is&rdquo; (318) is roughly
          half of &ldquo;The&rdquo; (464). Nonsense.
        </p>
      </ExplanationBox>

      <ExplanationBox title="What a Real GPT Actually Does: Look Up a Row">
        <p>
          So the first move of a real GPT is dead simple. It keeps one giant grid of numbers — the{' '}
          <strong>embedding matrix</strong> — with <strong>one row per token</strong> in its vocabulary
          (GPT-2: 50,257 rows, 768 numbers each). When token 6766 arrives, the model{' '}
          <strong>fetches row #6766</strong>. That row of numbers — the token&apos;s{' '}
          <strong>embedding vector</strong> — is what flows into everything else. The ID is thrown away.
        </p>
        <LookupTable />
        <p>
          Where do the numbers in the rows come from? <strong>Training, and nothing else.</strong> They
          start as random noise and get nudged, billions of times, by the model&apos;s one job — predicting
          the next token. No person writes them, no person can even read most of them. That claim deserves
          proof, not trust — and this course will not hand-wave it: before you finish, you will run every
          algorithm of that training yourself, by hand. It has to wait only because the training loop pushes
          its corrections <em>backward through the whole machine</em> — so we build the machine first. The
          three rows above are what a tiny <em>already-trained</em> table looks like.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Reading a Trained Row (Carefully)">
        <p>
          Stare at the toy table and the trained numbers have visible structure: the first slot is large
          only for <strong>sky</strong> — it tracks <em>topic-ness</em>. The second lights up for visual,
          colour-heavy words — call it <em>bright-ness</em>. The third is large for the little function
          words — <em>grammar-ness</em>. We&apos;ll label them <strong>TOPIC / BRIGHT / GRAMMAR</strong> so
          the hand math stays readable.
        </p>
        <p>
          Now the caveat, because this course doesn&apos;t hand-wave: <strong>real rows come with no
          labels.</strong> A real model&apos;s 768 slots are just numbers; nobody assigned &ldquo;slot 214 =
          brightness.&rdquo; Researchers <em>probe</em> trained tables afterward and do find meaningful
          directions inside them (that is the field of interpretability) — but the labels are our reading of
          the numbers, never an input to them. Training carved the structure; we&apos;re just naming what it
          carved so we can follow the arithmetic.
        </p>
        <p>
          So <em>how</em> does that structure get carved? Nobody edits these slots by hand — the model gets
          exactly one kind of nudge: <strong>it guesses the next token, and every miss pushes each row a
          hair in the direction that would have made the right word more likely.</strong> Repeat that across
          billions of snippets and something falls out on its own — &ldquo;sky&rdquo; and &ldquo;ocean&rdquo;
          keep sitting before the same next words (<em>blue, clear, vast</em>), so they get shoved the same
          way over and over and drift into the same region of the table. The TOPIC / BRIGHT / GRAMMAR
          structure is the <em>fossil record</em> of those repeated nudges, never a plan. We build that
          training loop for real, one row at a time, in{' '}
          <strong>&ldquo;How a Real GPT Learns Its Vectors.&rdquo;</strong>
        </p>
      </ExplanationBox>

      <ExplanationBox title="Comparing Two Rows: The Dot Product">
        <p>
          Words are now vectors, and the whole rest of the machine keeps asking one question about them:{' '}
          <strong>how much do two vectors point the same way?</strong> The tool a real GPT uses — inside
          attention, and again at the final prediction — is the <strong>dot product</strong>: multiply the
          matching slots, add up the results. Two words that are large in the <em>same</em> slots produce a
          big total; mismatched words cancel to nearly nothing.
        </p>
        <WorkedExample title="Dot Products of &ldquo;The Sky Is&rdquo;">
          <CalcStep number={1}>The &middot; is = (0.1&times;0.1) + (0.0&times;0.2) + (0.9&times;0.8) = 0.01 + 0 + 0.72 = <strong>0.73</strong></CalcStep>
          <CalcStep number={2}>sky &middot; is = (1.0&times;0.1) + (0.7&times;0.2) + (0.0&times;0.8) = 0.10 + 0.14 + 0 = <strong>0.24</strong></CalcStep>
          <CalcStep number={3}>The &middot; sky = (0.1&times;1.0) + (0.0&times;0.7) + (0.9&times;0.0) = 0.10 + 0 + 0 = <strong>0.10</strong></CalcStep>
          <p style={{ marginTop: '1rem' }}>
            A big number means &ldquo;these two point the same way&rdquo;; near zero means &ldquo;unrelated.&rdquo;
            And look what falls out: <strong>The</strong> and <strong>is</strong> line up the most (0.73) —
            both are high-GRAMMAR glue words — while <strong>sky</strong> barely aligns with either. Hold
            that thought; it is about to become a problem.
          </p>
        </WorkedExample>
      </ExplanationBox>

      <ExplanationBox title="But Every Token Gets Only One Row">
        <p>
          One warning sign is already on the table: the dot products say &ldquo;is&rdquo; lines up with
          &ldquo;The,&rdquo; not with the word that actually matters for what comes next, &ldquo;sky.&rdquo;
          And there&apos;s a structural limit behind it: the lookup hands each token{' '}
          <strong>one fixed row, identical in every sentence it ever appears in</strong>. The next step
          shows exactly where that breaks — and the crack is what the rest of the machine exists to fix.
        </p>
      </ExplanationBox>
    </div>
  );
}
