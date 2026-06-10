'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';

export default function Step3() {
  return (
    <div>
      <ExplanationBox title="Most Points Do Nothing">
        <p>
          Here is one of the most surprising facts about SVMs: once training is complete, the vast
          majority of your training points are <em>irrelevant</em>. You could remove them from the
          dataset entirely and retrain — and you would get the exact same boundary.
        </p>
        <p>
          The boundary is determined solely by the points that sit on the margin edges — the dashed
          lines at w · x + b = +1 and w · x + b = −1. These special points are called{' '}
          <strong>support vectors</strong>. They literally &quot;support&quot; the margin walls the
          way columns support a roof.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Which Points Are Support Vectors?">
        <p>
          In our flower example, imagine drawing the widest possible street between the Setosa and
          Versicolor clusters. After you draw it, look at which flowers actually touch the edges of
          the street. Maybe two Setosa flowers press up against the left wall and one Versicolor
          flower touches the right wall. Those three flowers — and only those three — are the support
          vectors for that boundary.
        </p>
        <p>
          Every other flower is safely inside its own territory, well away from the street. If any of
          those non-edge flowers moved slightly, or if you added ten new flowers far from the boundary,
          the street would not shift at all. The support vectors are the only points that matter.
        </p>
      </ExplanationBox>

      <MathFormula label="Support Vector Condition">
        w · x_sv + b = +1  (Versicolor support vectors)
        {'\n'}
        w · x_sv + b = −1  (Setosa support vectors)
      </MathFormula>

      <ExplanationBox title="Why This Makes SVMs Robust">
        <p>
          Because only a small handful of points define the boundary, SVMs are naturally resistant to
          noise in the training data. A dataset with 10,000 flowers might have only 4 or 5 support
          vectors. The other 9,995 flowers could be slightly mismeasured without affecting the
          classifier at all.
        </p>
        <p>
          This is very different from algorithms that try to fit every single training point. Those
          algorithms memorize noise; SVMs tune it out. The support vectors encode the essential
          geometric information — the flowers that are closest to the decision — and everything else
          is safely ignored.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Useful Mental Image">
        <p>
          Think of the margin street as a highway median. Cars on either side can park anywhere in
          their lane without affecting the position of the median. Only the cars parked right at the
          edge of the median determine where it sits. Move those edge cars and the median must move
          with them. Move any other car and the median stays put. That is exactly what support vectors
          do for the SVM boundary.
        </p>
      </ExplanationBox>
    </div>
  );
}
