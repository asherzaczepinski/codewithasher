'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

// Final hidden vector for "is" (the context vector from Part 3, refined by the block).
const FINAL: [number, number, number] = [0.72, 0.52, 0.26];
// A handful of candidate words, each with its learned "unembedding" vector.
const VOCAB: { word: string; vec: [number, number, number] }[] = [
  { word: 'blue',    vec: [2.0, 2.0, 0.1] },
  { word: 'clear',   vec: [1.0, 0.9, 0.2] },
  { word: 'grey',    vec: [0.4, 0.2, 0.2] },
  { word: 'falling', vec: [0.5, 0.0, 0.3] },
  { word: 'pizza',   vec: [0.0, -0.3, 0.4] },
];
const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i], 0);

function LogitBars() {
  const rows = VOCAB.map(v => ({ word: v.word, logit: dot(FINAL, v.vec) }));
  const min = Math.min(...rows.map(r => r.logit));
  const max = Math.max(...rows.map(r => r.logit));
  const span = max - min;
  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <p style={{ margin: '0 0 1rem', fontSize: 13, color: '#64748b' }}>
        One logit per candidate word — the raw score of how much the final vector &ldquo;points toward&rdquo; that word:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(r => (
          <div key={r.word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 60, fontWeight: 600, fontSize: 13, color: '#334155' }}>{r.word}</span>
            <div style={{ flex: 1, height: 16, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${((r.logit - min) / span) * 100}%`, background: r.logit === max ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)' }} />
            </div>
            <span style={{ width: 46, textAlign: 'right', fontSize: 14, fontWeight: 700, fontFamily: 'monospace', color: '#1e293b' }}>{r.logit.toFixed(2)}</span>
          </div>
        ))}
      </div>
      <p style={{ margin: '1rem 0 0', fontSize: 12, color: '#94a3b8' }}>
        Notice one bar dips below zero — logits are unbounded and can be negative. They are scores, not
        probabilities. Not yet.
      </p>
    </div>
  );
}

export default function Step23() {
  return (
    <div>
      <ExplanationBox title="We Have a Vector. We Need a Word.">
        <p>
          Everything so far has turned text into vectors and pushed those vectors through attention and a
          transformer block. After all of it, the last word in our sentence — &ldquo;is&rdquo; — carries a
          final vector that has soaked up the whole context. For our toy that vector is the contextual one
          we computed in Part 3: <code>[0.72, 0.52, 0.26]</code>, a vector that has gone heavily
          &ldquo;sky-flavored.&rdquo;
        </p>
        <p>
          But a vector is not an answer. The model has to convert that single vector into a score for{' '}
          <strong>every one of the ~50,000 words</strong> in its vocabulary. How? With the operation this
          entire course has been built on: the <strong>dot product</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Unembedding: A Vector for Every Word">
        <p>
          Mirroring the embedding table from the start, the model keeps an <strong>output</strong> table —
          the <em>unembedding</em> — with one vector per vocabulary word. The score for a word, called its{' '}
          <strong>logit</strong>, is just the dot product of our final vector with that word&apos;s output
          vector:
        </p>
        <div style={{ margin: '1rem 0', padding: '0.9rem 1.1rem', background: '#ede9fe', borderRadius: 8 }}>
          <code style={{ fontSize: 14, color: '#4c1d95' }}>logit(word) = final_vector · unembedding(word)</code>
        </div>
        <p>
          A big dot product means the final vector points the same way as that word&apos;s vector —
          &ldquo;this state is asking for that word.&rdquo; To keep it on a napkin, we will score just five
          plausible candidates instead of all 50,000. The real model does the exact same dot product, just
          50,000 times.
        </p>
      </ExplanationBox>

      <WorkedExample title="Five Logits, By Hand">
        <p>Final vector = [0.72, 0.52, 0.26]. Dot it with each candidate&apos;s output vector:</p>
        <CalcStep number={1}>
          <strong>blue</strong> [2.0, 2.0, 0.1]: (0.72×2.0) + (0.52×2.0) + (0.26×0.1) = 1.44 + 1.04 + 0.03 = <strong>2.51</strong>
        </CalcStep>
        <CalcStep number={2}>
          <strong>clear</strong> [1.0, 0.9, 0.2]: (0.72×1.0) + (0.52×0.9) + (0.26×0.2) = 0.72 + 0.47 + 0.05 = <strong>1.24</strong>
        </CalcStep>
        <CalcStep number={3}>
          <strong>grey</strong> [0.4, 0.2, 0.2]: (0.72×0.4) + (0.52×0.2) + (0.26×0.2) = 0.29 + 0.10 + 0.05 = <strong>0.44</strong>
        </CalcStep>
        <CalcStep number={4}>
          <strong>falling</strong> [0.5, 0.0, 0.3]: (0.72×0.5) + (0.52×0.0) + (0.26×0.3) = 0.36 + 0 + 0.08 = <strong>0.44</strong>
        </CalcStep>
        <CalcStep number={5}>
          <strong>pizza</strong> [0.0, −0.3, 0.4]: (0.72×0.0) + (0.52×−0.3) + (0.26×0.4) = 0 − 0.16 + 0.10 = <strong>−0.05</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The numbers reward what the final vector is made of. Our vector is rich in the topic and bright
          dimensions, and <strong>blue</strong>&apos;s output vector points hardest in exactly those
          directions — so blue earns the top logit. &ldquo;pizza,&rdquo; pointing the wrong way on the
          bright axis, even goes negative.
        </p>
      </WorkedExample>

      <ExplanationBox title="Logits Are Not Answers Yet">
        <LogitBars />
        <p>
          We finally have a ranking — but logits are raw, unbounded scores. They do not sum to anything,
          one of them is negative, and &ldquo;2.51&rdquo; is not a probability. To turn this list into a
          real distribution — a set of percentages that sum to 100% and tell us how confident the model
          is — we need one last function. You have already met it twice, inside attention. One more pass
          of <strong>softmax</strong>, and the number this whole course has been building toward finally
          appears.
        </p>
      </ExplanationBox>
    </div>
  );
}
