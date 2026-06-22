'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step9() {
  return (
    <div>
      <ExplanationBox title="Eigenvalue First, Eigenvector Second">
        <p>
          In the last step we found the <em>eigenvalues</em> of our covariance matrix C by
          solving det(C − λI) = 0, getting λ₁ ≈ 224.5 and λ₂ ≈ 4.6. But an eigenvalue on its
          own only tells us <em>how much</em> a direction stretches — not <em>which</em>{' '}
          direction. To get the actual principal-component directions, we now need the{' '}
          <strong>eigenvectors</strong>.
        </p>
        <p>
          The recipe: take each eigenvalue λ you found, plug it back into{' '}
          <strong>(C − λI)v = 0</strong>, and solve for the vector v. That vector is the
          eigenvector — the direction the matrix only stretches.
        </p>
      </ExplanationBox>

      <WorkedExample title="Solving for the First Eigenvector (λ₁ ≈ 224.5)">
        <p>
          We have C = [[100, 109], [109, 129]] and λ₁ ≈ 224.5. Build the matrix C − λ₁I by
          subtracting 224.5 from the diagonal:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          C − λ₁I = | 100−224.5&nbsp;&nbsp;&nbsp;109&nbsp;&nbsp;&nbsp; |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 109&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 129−224.5 |<br />
          = | −124.5&nbsp;&nbsp;&nbsp;109&nbsp;&nbsp; |<br />
          &nbsp;&nbsp;| 109&nbsp;&nbsp;&nbsp;&nbsp;−95.5 |
        </p>

        <CalcStep number={1}>
          We need (C − λ₁I)v = 0 for v = [v₁, v₂]. Write the top row as an equation:<br />
          (100 − 224.5)·v₁ + 109·v₂ = 0
        </CalcStep>
        <CalcStep number={2}>
          Simplify the coefficient:<br />
          −124.5·v₁ + 109·v₂ = 0
        </CalcStep>
        <CalcStep number={3}>
          Solve for v₂ in terms of v₁:<br />
          109·v₂ = 124.5·v₁&nbsp;&nbsp;⟹&nbsp;&nbsp;v₂ = (124.5 / 109)·v₁ ≈ <strong>1.14·v₁</strong>
        </CalcStep>
        <CalcStep number={4}>
          Pick v₁ = 1, so v₂ ≈ 1.14. The direction is approximately{' '}
          <strong>[1, 1.14]</strong> — pointing up and to the right, the &quot;both scores
          high&quot; diagonal.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          That direction [1, 1.14] is very close to the clean diagonal [1, 1]. The reason it
          isn&apos;t exactly [1, 1] is that <strong>224.5 is a rounded eigenvalue</strong> — if
          we used the exact value the ratio would come out to exactly 1. Throughout this
          course we use the tidy approximation <strong>v₁ ≈ [0.707, 0.707]</strong> (the
          normalised diagonal), which is what you&apos;d get from the exact arithmetic.
        </p>
      </WorkedExample>

      <ExplanationBox title="Normalizing to Unit Length">
        <p>
          The equation (C − λI)v = 0 only fixes the <em>direction</em> of v, not its length —
          any scalar multiple of an eigenvector is also an eigenvector. PCA wants{' '}
          <strong>unit vectors</strong> (length 1) so that projecting is a clean dot product
          with no extra scaling. To normalise, divide the vector by its own length:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          |[1, 1]| = √(1² + 1²) = √2 ≈ 1.414<br />
          v̂ = [1, 1] / 1.414 = [0.707, 0.707]
        </p>
        <p>
          So the unit eigenvector is <strong>[0.707, 0.707]</strong>. Now |v̂| = 1, exactly
          what we need for projection in the next step.
        </p>
      </ExplanationBox>

      <WorkedExample title="The Second Eigenvector (λ₂ ≈ 4.6)">
        <p>
          Repeat the process with the smaller eigenvalue. Build C − λ₂I:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          C − λ₂I = | 100−4.6&nbsp;&nbsp;&nbsp;109&nbsp;&nbsp;&nbsp; |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 109&nbsp;&nbsp;&nbsp;&nbsp; 129−4.6 |<br />
          = | 95.4&nbsp;&nbsp;109&nbsp;&nbsp; |<br />
          &nbsp;&nbsp;| 109&nbsp;&nbsp;124.4 |
        </p>

        <CalcStep number={1}>
          Top row equation:<br />
          95.4·v₁ + 109·v₂ = 0
        </CalcStep>
        <CalcStep number={2}>
          Solve for v₂:<br />
          v₂ = −(95.4 / 109)·v₁ ≈ <strong>−0.875·v₁</strong>
        </CalcStep>
        <CalcStep number={3}>
          Pick v₁ = 1, so v₂ ≈ −0.88. Direction ≈ <strong>[1, −0.88]</strong> — close to the
          clean perpendicular diagonal [1, −1].
        </CalcStep>
        <CalcStep number={4}>
          Normalise [1, −1]: divide by √2 ≈ 1.414 to get{' '}
          <strong>v₂ ≈ [0.707, −0.707]</strong>.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Again the slight drift from the exact [1, −1] comes from rounding λ₂ to 4.6. The
          course uses the clean unit vector <strong>[0.707, −0.707]</strong> — the
          &quot;math-minus-physics&quot; direction.
        </p>
      </WorkedExample>

      <ExplanationBox title="Why Both Come Out Perpendicular">
        <p>
          Notice the two eigenvectors — [0.707, 0.707] and [0.707, −0.707] — are exactly{' '}
          <strong>perpendicular</strong> (their dot product is 0.5 − 0.5 = 0). That is not a
          coincidence. The covariance matrix C is <strong>symmetric</strong> (the
          math–physics entry equals the physics–math entry), and a deep result from linear
          algebra — the <em>spectral theorem</em> — guarantees that the eigenvectors of any
          symmetric matrix are mutually orthogonal.
        </p>
        <p>
          This is what makes principal components so clean: each new axis is at a perfect
          right angle to all the previous ones. You get a brand-new, perpendicular coordinate
          system aligned with the directions of the data&apos;s variance, for free.
        </p>
      </ExplanationBox>
    </div>
  );
}
