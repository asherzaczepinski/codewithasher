'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step8() {
  // Bar chart geometry for the 2^n vs 2n comparison
  const ns = [1, 2, 3, 4, 5, 6];
  const chartW = 460;
  const chartH = 220;
  const padBottom = 36;
  const padTop = 10;
  const maxJoint = Math.pow(2, ns[ns.length - 1]); // 2^6 = 64
  const barGroupW = chartW / ns.length;
  const barW = 16;
  const scale = (v: number) => ((chartH - padBottom - padTop) * v) / maxJoint;

  return (
    <div>
      <ExplanationBox title="The Joint Distribution Is Astronomically Big">
        <p>
          To classify text &quot;properly&quot; you would want the full <strong>joint distribution</strong>:
          the probability of every possible combination of words appearing together. The problem is
          that the number of combinations doubles every time you add one more word to the vocabulary.
        </p>
        <p>
          With 2 words there are 4 possible combinations (each word present or absent). With 3 words
          there are 8. With <em>n</em> words there are 2<sup>n</sup>. This is exponential growth, and
          it gets out of hand almost immediately:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            width="100%"
            style={{
              maxWidth: chartW,
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              margin: '0.75rem 0',
            }}
          >
            {/* baseline */}
            <line
              x1={0}
              y1={chartH - padBottom}
              x2={chartW}
              y2={chartH - padBottom}
              stroke="#e2e8f0"
            />
            {ns.map((n, i) => {
              const joint = Math.pow(2, n);
              const naive = 2 * n;
              const groupX = i * barGroupW + barGroupW / 2;
              const jointH = scale(joint);
              const naiveH = scale(naive);
              return (
                <g key={n}>
                  {/* joint = 2^n (red, exploding) */}
                  <rect
                    x={groupX - barW - 2}
                    y={chartH - padBottom - jointH}
                    width={barW}
                    height={jointH}
                    fill="#ef4444"
                    rx={2}
                  />
                  {/* naive = 2n (blue, flat) */}
                  <rect
                    x={groupX + 2}
                    y={chartH - padBottom - naiveH}
                    width={barW}
                    height={naiveH}
                    fill="#2563eb"
                    rx={2}
                  />
                  <text
                    x={groupX}
                    y={chartH - padBottom + 16}
                    textAnchor="middle"
                    fontSize={11}
                    fill="#64748b"
                  >
                    n={n}
                  </text>
                </g>
              );
            })}
            {/* legend */}
            <rect x={10} y={8} width={11} height={11} fill="#ef4444" rx={2} />
            <text x={26} y={18} fontSize={11} fill="#1e293b">
              joint = 2ⁿ
            </text>
            <rect x={110} y={8} width={11} height={11} fill="#2563eb" rx={2} />
            <text x={126} y={18} fontSize={11} fill="#1e293b">
              naive = 2n
            </text>
          </svg>
        </div>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          The red bars (joint) double at every step while the blue bars (naive) crawl up linearly.
          For a real vocabulary of 50,000 words the red bar would need to be billions of times taller
          than this entire page — completely hopeless to store or estimate.
        </p>
      </ExplanationBox>

      <ExplanationBox title="One Number Per Word Per Class">
        <p>
          The <strong>naive independence assumption</strong> rescues us. Instead of asking &quot;how
          do all these words behave together?&quot; we assume each word contributes independently
          given the class. That collapses the impossible joint table down to a single number for each
          word in each class: just <strong>P(word | class)</strong>.
        </p>
        <p>
          For a vocabulary of size |V| and two classes (spam and ham), that is exactly{' '}
          <strong>2 × |V|</strong> numbers to learn — and each one is trivially estimated by counting.
          The blue bars above never explode because adding a word only adds 2 more numbers.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Concrete Count">
        <p>
          Put real numbers on it. With a 50,000-word vocabulary:
        </p>
        <ul style={{ lineHeight: '2' }}>
          <li>
            <strong>Joint approach:</strong> 2<sup>50,000</sup> combinations — more than the number
            of atoms in the universe, many times over. Impossible to even write down, let alone
            estimate from data.
          </li>
          <li>
            <strong>Naive approach:</strong> 50,000 words × 2 classes ={' '}
            <strong>100,000 numbers</strong>. A small table that fits comfortably in memory and is
            estimated in a single pass over the training emails.
          </li>
        </ul>
        <p>
          That is the whole trick: the independence assumption trades a tiny bit of accuracy for a
          model that is actually computable.
        </p>
      </ExplanationBox>

      <WorkedExample title="Joint Table vs Naive Table for a Tiny Vocabulary">
        <p>
          Take a toy vocabulary of just 3 words {'{'} free, winner, meeting {'}'} and 2 classes. Count
          how many numbers each approach needs.
        </p>
        <CalcStep number={1}>
          Joint table: every combination of the 3 words present/absent = 2³ = 8 rows per class.
        </CalcStep>
        <CalcStep number={2}>
          Across 2 classes that is 8 × 2 = 16 joint probabilities to estimate.
        </CalcStep>
        <CalcStep number={3}>
          Naive table: one P(word | class) per word per class = 3 words × 2 classes = 6 numbers.
        </CalcStep>
        <CalcStep number={4}>
          Even at just 3 words, naive needs 6 numbers vs 16 — and the gap is 2ⁿ vs 2n.
        </CalcStep>
        <CalcStep number={5}>
          At n = 20 words: joint needs 2²⁰ × 2 ≈ 2,000,000 numbers; naive needs only 20 × 2 = 40.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The naive table grows in lock-step with the vocabulary, while the joint table explodes
          exponentially. This is exactly why Naive Bayes is tractable where the &quot;correct&quot;
          full model is not.
        </p>
      </WorkedExample>
    </div>
  );
}
