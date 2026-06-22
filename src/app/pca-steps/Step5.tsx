'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import PCAVarianceDirection from '@/components/PCAVarianceDirection';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="Projecting Onto a Direction">
        <p>
          We know how to measure variance along the math axis or the physics axis. But a{' '}
          <em>direction</em> doesn&apos;t have to line up with an original axis — it can point
          diagonally. To measure spread along a diagonal direction, we first{' '}
          <strong>project</strong> each point onto it.
        </p>
        <p>
          Projecting means dropping a perpendicular from the point onto the line and reading
          off how far along the line it lands. If <strong>u</strong> is a unit vector pointing
          in our chosen direction, and <strong>p</strong> is a (mean-centered) data point, the
          projected coordinate is just the dot product:
        </p>
      </ExplanationBox>

      <MathFormula label="Projected coordinate of point p onto unit direction u">
        t = p · u = pₓ·uₓ + p_y·u_y
      </MathFormula>

      <ExplanationBox title="Rotate the Line, Watch the Spread">
        <p>
          Below are our five students, mean-centered so the cloud sits around the origin:
          [−15,−17], [−5,−3], [0,−1], [5,4], [15,17]. The blue line is a direction you can
          rotate. The gray dashes drop each student perpendicularly onto it, and the smaller
          dots are their projected positions.
        </p>
        <p>
          Drag the angle slider and watch the <strong>projected variance</strong> readout.
          Some directions squash the projections into a tight clump (low variance); one
          special direction stretches them out as far as possible.
        </p>
      </ExplanationBox>

      <PCAVarianceDirection />

      <ExplanationBox title="The Maximum-Variance Direction Is PC1">
        <p>
          Notice that the variance peaks near <strong>θ ≈ 45°</strong> — the &quot;both scores
          high together&quot; diagonal — at a value of about <strong>224.5</strong>. That is no
          coincidence: it equals λ₁, the largest eigenvalue of the covariance matrix we&apos;ll
          meet shortly.
        </p>
        <p>
          The direction that maximizes projected variance is, by definition, the{' '}
          <strong>first principal component (PC1)</strong>. It is the single best line for
          summarizing the data: projecting every student onto it preserves more of their
          variation than any other one-dimensional summary could.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Why Perpendicular Comes Next">
        <p>
          Once PC1 captures the dominant spread, where does the <em>leftover</em> variation
          live? In the direction perpendicular to PC1. The{' '}
          <strong>second principal component (PC2)</strong> is the maximum-variance direction
          among all directions at right angles to PC1.
        </p>
        <p>
          In 2D that leaves exactly one choice — the perpendicular diagonal. In higher
          dimensions PCA keeps repeating this: each new component is the direction of greatest
          remaining variance, perpendicular to all the ones before it. To find these
          directions efficiently, instead of spinning a line by hand, we&apos;ll package the
          data&apos;s spread into a single object — the covariance matrix.
        </p>
      </ExplanationBox>
    </div>
  );
}
