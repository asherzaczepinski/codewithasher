'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import PCAReconstruction from '@/components/PCAReconstruction';

export default function Step11() {
  return (
    <div>
      <ExplanationBox title="Going Backward: From Score to Approximate Point">
        <p>
          Projection compressed each student into a single PC1 score. A natural question:
          can we go <em>backward</em> — turn that one number back into a math/physics pair?
          We can, approximately. This is <strong>reconstruction</strong>, and it&apos;s how PCA
          works as a compression scheme: store the small scores, then rebuild the data when
          you need it.
        </p>
        <p>
          To reconstruct a point from its score, multiply the score by the eigenvector
          direction and add the mean back:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          x̂ = score · v₁ + mean
        </p>
        <p>
          The result x̂ (&quot;x-hat&quot;) is our best guess at the original point using only
          PC1. It will land exactly on the PC1 line — because that&apos;s the only direction we
          kept information about. Whatever the point had off the line is lost.
        </p>
      </ExplanationBox>

      <PCAReconstruction />

      <WorkedExample title="Reconstructing Student 5 from One Number">
        <p>
          Student 5&apos;s PC1 score was 22.6. Let&apos;s rebuild an approximate (math, physics) pair
          using v₁ ≈ [0.707, 0.707] and mean [75, 75].
        </p>

        <CalcStep number={1}>
          Scale the eigenvector by the score:<br />
          22.6 · [0.707, 0.707] = [15.98, 15.98]
        </CalcStep>
        <CalcStep number={2}>
          Add the mean back:<br />
          x̂ = [15.98, 15.98] + [75, 75] = <strong>[90.98, 90.98]</strong>
        </CalcStep>
        <CalcStep number={3}>
          Compare with the true point [90, 92]:<br />
          residual = [90 − 90.98, 92 − 90.98] = [−0.98, 1.02]
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          From a single number we recovered <strong>[90.98, 90.98]</strong> versus the actual{' '}
          <strong>[90, 92]</strong> — off by only about one point in each subject. The small
          residual is exactly the bit of Student 5 that lived off the PC1 line (they were a
          touch stronger in physics than math), which we threw away when we dropped PC2.
        </p>
      </WorkedExample>

      <ExplanationBox title="Reconstruction Error Is the Discarded Variance">
        <p>
          Add up the squared residuals across all five students and you get the total{' '}
          <strong>reconstruction error</strong>. It isn&apos;t random — it equals the variance
          carried by the components you dropped. Here we dropped only PC2, so the total error
          is proportional to <strong>λ₂ ≈ 4.6</strong>.
        </p>
        <p>
          That is the precise sense in which PCA compression is <strong>lossy</strong>: the
          information you lose is measured, predictable, and (by design) the <em>least</em>{' '}
          important variance in the dataset. If you instead dropped PC1, the error would
          balloon to λ₁ ≈ 224.5 — about 49× worse. Keeping the big-eigenvalue directions is
          what makes the loss tiny.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The 98% That Survives">
        <p>
          Because λ₁ ≈ 224.5 out of a total of 229.1, the PC1 reconstruction preserves about{' '}
          <strong>98%</strong> of the original variance. Only ~2% is lost. For the price of
          storing one number per student instead of two, we keep almost everything that made
          the students different.
        </p>
        <p>
          Set the demo above to k = 2 and the reconstruction becomes <em>exact</em> — error
          drops to 0 — because keeping every component throws nothing away. Reconstruction is
          the lens that makes the trade-off concrete: <strong>fewer components → smaller
          storage → larger (but controlled) error</strong>. In the next step we&apos;ll turn that
          trade-off into a rule for choosing how many components to keep.
        </p>
      </ExplanationBox>
    </div>
  );
}
