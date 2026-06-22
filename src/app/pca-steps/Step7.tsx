'use client';

import ExplanationBox from '@/components/ExplanationBox';
import PCACovMatrix from '@/components/PCACovMatrix';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Packaging All the Variances Together">
        <p>
          We now have three numbers describing how our two features spread: Var(math) = 100,
          Var(physics) = 129, and Cov(math, physics) = 109. The{' '}
          <strong>covariance matrix</strong> simply arranges them into a tidy square grid so we
          can treat the whole picture as one object:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '12px', borderRadius: '6px', lineHeight: '1.8' }}>
          C = | 100  109 |<br />
          &nbsp;&nbsp;&nbsp;&nbsp;| 109  129 |
        </p>
        <p>
          With <em>d</em> features the covariance matrix is <em>d × d</em>: every diagonal cell
          is a variance, every off-diagonal cell a covariance between two features. This single
          matrix is the complete summary of how the data is spread and coupled — and it is the
          one input PCA needs.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Read the Matrix as a Heatmap">
        <p>
          Shading each cell by its magnitude makes the structure pop out at a glance. Hover any
          cell below to see exactly what it measures.
        </p>
      </ExplanationBox>

      <PCACovMatrix />

      <ExplanationBox title="Diagonal = Variances, Off-Diagonal = Coupling">
        <p>
          The two <strong>diagonal</strong> cells (100 and 129) are the variances — how much
          each feature spreads on its own. Physics (129) spreads a little more than math (100).
        </p>
        <p>
          The two <strong>off-diagonal</strong> cells (both 109) measure coupling — how
          strongly the features move together. Here the coupling is almost as large as the
          individual variances, which is the matrix&apos;s way of saying the two scores are
          highly redundant. That redundancy is precisely what PCA will exploit to compress two
          numbers down to one.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Symmetry Guarantees Perpendicular Components">
        <p>
          Look at the off-diagonal cells: they are <em>equal</em>, because Cov(math, physics) =
          Cov(physics, math). Every covariance matrix is <strong>symmetric</strong> for this
          reason, and that is not just a cosmetic fact.
        </p>
        <p>
          A deep result in linear algebra — the spectral theorem — guarantees that a symmetric
          matrix always has eigenvectors that are mutually <strong>perpendicular</strong>. Those
          eigenvectors are exactly the principal components: a clean, right-angled set of axes
          aligned with the directions of maximum variance. In the next module we&apos;ll meet
          eigenvectors directly and see why they fall right onto the diagonal of our student
          cloud.
        </p>
      </ExplanationBox>
    </div>
  );
}
