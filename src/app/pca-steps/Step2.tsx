'use client';

import ExplanationBox from '@/components/ExplanationBox';
import PCAScatter from '@/components/PCAScatter';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="Two Scores That Move Together">
        <p>
          Before we touch any formulas, let&apos;s look at what correlated data actually
          looks like. Take our two features — each student&apos;s <strong>math score</strong> and{' '}
          <strong>physics score</strong> — and plot every student as a single dot, with math
          on the horizontal axis and physics on the vertical axis.
        </p>
        <p>
          Because strong students tend to do well on both exams, the dots don&apos;t scatter
          randomly. They line up into a tilted, elongated cloud that stretches from the
          lower-left (low on both) to the upper-right (high on both). That tilt <em>is</em>{' '}
          the correlation, made visible.
        </p>
      </ExplanationBox>

      <PCAScatter />

      <ExplanationBox title="The Cloud Has a Direction">
        <p>
          Drag the slider above. When ρ is near zero the cloud is a round, directionless
          blob — knowing a student&apos;s math score tells you nothing about their physics
          score. As ρ grows toward +1, the blob collapses onto a single diagonal line: the
          two scores become almost perfectly redundant.
        </p>
        <p>
          Notice the dashed red line that appears as the cloud tilts. That is the{' '}
          <strong>direction of greatest spread</strong> — the one axis along which the data
          varies the most. If you had to summarize each student with a single number, their
          position <em>along that line</em> would lose the least information. Finding that
          line, automatically, for any dataset, is exactly what PCA does.
        </p>
      </ExplanationBox>

      <ExplanationBox title="From Picture to Procedure">
        <p>
          So far this is just intuition you can see with your eyes in 2D. The challenge is
          that real datasets live in dozens or hundreds of dimensions, where you{' '}
          <em>cannot</em> eyeball the dominant direction. PCA turns this visual idea into a
          precise, mechanical procedure that works in any number of dimensions.
        </p>
        <p>
          To get there we need to make two vague phrases exact: &quot;how spread out&quot; the
          data is, and &quot;along which direction.&quot; Those are <em>variance</em> and{' '}
          <em>covariance</em> — the tools we&apos;ll build next. But first, we need to
          understand <em>why</em> high-dimensional data is such a problem in the first place.
        </p>
      </ExplanationBox>
    </div>
  );
}
