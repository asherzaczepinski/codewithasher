'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="From Distances to a Decision">
        <p>
          Once we have a distance from the new point to every labeled example, KNN does something
          beautifully simple: it picks the <strong>k smallest distances</strong>, looks at the
          labels attached to those neighbors, and returns the <strong>majority label</strong> as
          its prediction.
        </p>
        <p>
          It&apos;s a democratic vote — each neighbor gets exactly one vote, and the candidate
          with the most votes wins. With k&nbsp;=&nbsp;3, three neighbors vote; with k&nbsp;=&nbsp;5,
          five vote.
        </p>
      </ExplanationBox>

      <MathFormula label="KNN Classification Rule">
        ŷ = majority label among the k neighbors with smallest d(new point, neighbor)
      </MathFormula>

      <ExplanationBox title="Tie-Breaking">
        <p>
          When two classes receive the same number of votes, there is a tie. The safest strategy
          is to use an <strong>odd k</strong> so ties can&apos;t happen in a binary (two-class)
          problem. We&apos;ll dig deeper into choosing k in the next part of the course.
        </p>
      </ExplanationBox>

      <WorkedExample title="Full Classification: Mystery Fruit M = (180, 7)">
        <p>
          We have five labeled fruits. Using <strong>Euclidean distance</strong>, let&apos;s
          compute the distance from mystery fruit <strong>M&nbsp;=&nbsp;(180,&nbsp;7)</strong> to
          each one, then classify with <strong>k&nbsp;=&nbsp;3</strong>.
        </p>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Step 1 — Compute all distances</p>

        <CalcStep number={1}>
          Fruit A (170, 7) — Apple: √((180−170)²+(7−7)²) = √(100+0) = 10.00
        </CalcStep>
        <CalcStep number={2}>
          Fruit B (160, 6) — Apple: √((180−160)²+(7−6)²) = √(400+1) = √401 ≈ 20.02
        </CalcStep>
        <CalcStep number={3}>
          Fruit C (270, 4) — Orange: √((180−270)²+(7−4)²) = √(8100+9) = √8109 ≈ 90.05
        </CalcStep>
        <CalcStep number={4}>
          Fruit D (280, 5) — Orange: √((180−280)²+(7−5)²) = √(10000+4) = √10004 ≈ 100.02
        </CalcStep>
        <CalcStep number={5}>
          Fruit E (175, 8) — Apple: √((180−175)²+(7−8)²) = √(25+1) = √26 ≈ 5.10
        </CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Step 2 — Rank by distance</p>

        <CalcStep number={6}>1st nearest: Fruit E — 5.10 — Apple</CalcStep>
        <CalcStep number={7}>2nd nearest: Fruit A — 10.00 — Apple</CalcStep>
        <CalcStep number={8}>3rd nearest: Fruit B — 20.02 — Apple</CalcStep>
        <CalcStep number={9}>4th nearest: Fruit C — 90.05 — Orange</CalcStep>
        <CalcStep number={10}>5th nearest: Fruit D — 100.02 — Orange</CalcStep>

        <p style={{ marginTop: '1rem', fontWeight: 600 }}>Step 3 — Vote with k = 3</p>

        <CalcStep number={11}>Neighbors selected: E (Apple), A (Apple), B (Apple)</CalcStep>
        <CalcStep number={12}>Apple votes: 3 &nbsp;|&nbsp; Orange votes: 0</CalcStep>
        <CalcStep number={13}>Majority label: Apple</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          KNN predicts the mystery fruit is an <strong>Apple</strong> — a unanimous verdict from
          its three nearest neighbors. All three are apples clustered near weight&nbsp;≈&nbsp;170–175&nbsp;g
          and sweetness&nbsp;≈&nbsp;6–8, matching the mystery fruit closely. The two oranges are
          nearly 90 units away and never even entered the vote.
        </p>
      </WorkedExample>
    </div>
  );
}
