'use client';

import { useState } from 'react';
import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import MathFormula from '@/components/MathFormula';

// Locked numbers from Step 12: raw attention scores for the query "is".
const SCORES: { word: string; score: number; exp: number; weight: number }[] = [
  { word: 'The', score: 0.16, exp: 1.17, weight: 0.153 },
  { word: 'sky', score: 1.67, exp: 5.31, weight: 0.691 },
  { word: 'is',  score: 0.18, exp: 1.20, weight: 0.156 },
];

function SoftmaxBars() {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  // stage 0 = raw scores, 1 = exponentiated, 2 = normalized weights
  const values = SCORES.map(s => (stage === 0 ? s.score : stage === 1 ? s.exp : s.weight));
  const max = Math.max(...values);
  const labels = ['Raw scores', 'After e^x', 'After ÷ sum = weights'];

  return (
    <div style={{ margin: '1.25rem 0', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.2rem', flexWrap: 'wrap' }}>
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => setStage(i as 0 | 1 | 2)}
            style={{
              padding: '6px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              border: '1px solid ' + (stage === i ? '#7c3aed' : '#e2e8f0'),
              background: stage === i ? '#7c3aed' : '#fff',
              color: stage === i ? '#fff' : '#64748b',
            }}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SCORES.map((s, i) => {
          const v = values[i];
          const isTop = v === max;
          return (
            <div key={s.word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 34, fontWeight: 700, fontSize: 14, color: '#334155' }}>{s.word}</span>
              <div style={{ flex: 1, height: 20, background: '#eef2f7', borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(v / max) * 100}%`, transition: 'width 0.4s ease', background: isTop ? 'linear-gradient(90deg,#7c3aed,#5b21b6)' : 'linear-gradient(90deg,#c4b5fd,#a78bfa)' }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color: '#1e293b', width: 64, textAlign: 'right' }}>
                {stage === 2 ? `${Math.round(v * 100)}%` : v.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
      <p style={{ margin: '1.1rem 0 0', fontSize: 12.5, color: '#475569', lineHeight: 1.6 }}>
        {stage === 0 && 'The raw scores from last step. They rank the words, but they do not add up to anything tidy.'}
        {stage === 1 && 'Exponentiating with e^x keeps everything positive and stretches the gap: sky pulls far ahead.'}
        {stage === 2 && 'Divide each by the total (7.68) and the bars become percentages that add up to exactly 100%.'}
      </p>
    </div>
  );
}

export default function Step9() {
  return (
    <div>
      <ExplanationBox title="From a Ranking to a Real Budget of Attention">
        <p>
          Last step left us with three <strong>raw scores</strong> for the query{' '}
          <strong>&ldquo;is&rdquo;</strong>: <code>The = 0.16</code>, <code>sky = 1.67</code>,{' '}
          <code>is = 0.18</code>. They tell us the <em>order</em> — sky matters most — but they are
          not yet usable as weights. They do not sum to anything meaningful, and in general a score
          could even come out negative.
        </p>
        <p>
          What we actually want is a <strong>budget</strong>: &ldquo;is&rdquo; has 100% of its
          attention to spend, and we need to split that 100% across the three words. The function that
          turns any list of numbers into a clean set of percentages that add to one is called{' '}
          <strong>softmax</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Softmax Recipe">
        <p>Softmax is two moves, in order:</p>
        <ul style={{ fontSize: 15, color: '#444', lineHeight: 1.8, paddingLeft: '1.2rem' }}>
          <li><strong>Exponentiate</strong> every score: replace each number <code>x</code> with <code>e<sup>x</sup></code>.</li>
          <li><strong>Normalize</strong>: divide each result by the sum of all of them, so they total 1.</li>
        </ul>
        <MathFormula label="softmax">
          weight(word) = e<sup>score(word)</sup> / Σ e<sup>score(every word)</sup>
        </MathFormula>
        <p>
          That <code>e</code> is <strong>Euler&apos;s number</strong>, about <code>2.718</code> — the
          same constant that shows up everywhere growth compounds. We do not need its backstory here,
          only one fact: <code>e<sup>x</sup></code> is always <strong>positive</strong>, no matter what{' '}
          <code>x</code> is. That alone fixes the &ldquo;a score could be negative&rdquo; problem: after
          exponentiating, every value is a clean positive number we can treat as a share.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Exponentiate Instead of Just Dividing?">
        <p>
          You might ask: why not skip <code>e</code> and divide the raw scores by their sum? Two reasons.
          First, raw scores can be negative, and you cannot have a negative share of attention.{' '}
          <code>e<sup>x</sup></code> guarantees positivity. Second, exponentiating{' '}
          <strong>amplifies gaps</strong>: a slightly bigger score becomes a much bigger{' '}
          <code>e<sup>x</sup></code>. That is exactly what we want — attention should commit to the word
          that wins, not spread itself thin. The name says it: it is a <em>soft</em> version of taking
          the <em>max</em>.
        </p>
      </ExplanationBox>

      <WorkedExample title="Softmax on Our Three Scores">
        <p>Start with the scores <strong>0.16, 1.67, 0.18</strong>. Step one, exponentiate each:</p>
        <CalcStep number={1}>
          <strong>The</strong>: e<sup>0.16</sup> ≈ <strong>1.17</strong>
        </CalcStep>
        <CalcStep number={2}>
          <strong>sky</strong>: e<sup>1.67</sup> ≈ <strong>5.31</strong>
        </CalcStep>
        <CalcStep number={3}>
          <strong>is</strong>: e<sup>0.18</sup> ≈ <strong>1.20</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The gap between 1.67 and 0.16 was about ten-to-one in the raw scores; after exponentiating,
          sky&apos;s value towers even more. Step two, add them up to get the normalizing total:
        </p>
        <CalcStep number={4}>
          sum = 1.17 + 5.31 + 1.20 = <strong>7.68</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>Step three, divide each by 7.68:</p>
        <CalcStep number={5}>
          <strong>The</strong>: 1.17 / 7.68 ≈ 0.153 ≈ <strong>15%</strong>
        </CalcStep>
        <CalcStep number={6}>
          <strong>sky</strong>: 5.31 / 7.68 ≈ 0.691 ≈ <strong>69%</strong>
        </CalcStep>
        <CalcStep number={7}>
          <strong>is</strong>: 1.20 / 7.68 ≈ 0.156 ≈ <strong>16%</strong>
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          Check the books: <strong>15% + 69% + 16% = 100%</strong>. The attention budget is fully spent.
        </p>
      </WorkedExample>

      <ExplanationBox title="Watch the Three Stages">
        <p>
          Click through the stages below. Same three words, transformed from raw scores → exponentials →
          final percentages:
        </p>
        <SoftmaxBars />
      </ExplanationBox>

      <ExplanationBox title="The Result, in Plain Words">
        <p>
          Softmax has turned the ranking into a decision: <strong>sky 69%, is 16%, The 15%</strong>. The
          word <strong>&ldquo;is&rdquo; now spends 69% of its attention looking at &ldquo;sky.&rdquo;</strong>{' '}
          That is precisely the connection we needed — to guess what follows &ldquo;The sky is,&rdquo; the
          model leans hard on the subject of the sentence and mostly ignores the two grammar words.
        </p>
        <p>
          One nice aside: if you ever run softmax over just <strong>two</strong> options, the formula
          collapses into the <strong>sigmoid</strong> curve you met in the neural-network course. Sigmoid
          is just softmax with two choices; softmax is sigmoid&apos;s many-choice sibling. Same idea —
          squash arbitrary numbers into probabilities — scaled up from a yes/no to a full distribution.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Catch We Are About to Hit">
        <p>
          Our toy used 3-dimensional vectors, so the scores stayed small and softmax behaved. But in a
          real model with hundreds of dimensions, the dot-product scores get <em>large</em> — large
          enough that softmax slams one weight to nearly 100% and starves the rest. The next step shows
          that failure and the one-line fix: dividing by the square root of the dimension.
        </p>
      </ExplanationBox>
    </div>
  );
}
