'use client';

import ExplanationBox from '@/components/ExplanationBox';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

const STAGES = ['center', 'covariance', 'eigen', 'sort', 'project', 'choose k'];

export default function Step13() {
  return (
    <div>
      <ExplanationBox title="The Whole Thing, Start to Finish">
        <p>
          You&apos;ve seen every piece of PCA on its own. Now let&apos;s run the entire algorithm
          on our 5-student dataset in one unbroken pass, so you can watch the data flow from
          raw scores all the way to a single compressed number. Six stages, in order:
        </p>
        <svg
          viewBox="0 0 440 90"
          style={{ width: '100%', maxWidth: 440, height: 'auto', display: 'block', margin: '12px auto' }}
        >
          {STAGES.map((label, i) => {
            const boxW = 60;
            const gap = (440 - STAGES.length * boxW) / (STAGES.length - 1);
            const x = i * (boxW + gap);
            return (
              <g key={label}>
                <rect x={x} y={28} width={boxW} height={34} rx={7} fill="#eff6ff" stroke="#2563eb" strokeWidth={1.5} />
                <text x={x + boxW / 2} y={42} textAnchor="middle" fontSize={9} fill="#1e293b" fontWeight={700}>
                  {i + 1}
                </text>
                <text x={x + boxW / 2} y={55} textAnchor="middle" fontSize={8.5} fill="#1e293b">
                  {label}
                </text>
                {i < STAGES.length - 1 && (
                  <line
                    x1={x + boxW}
                    y1={45}
                    x2={x + boxW + gap}
                    y2={45}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    markerEnd="url(#flowArrow)"
                  />
                )}
              </g>
            );
          })}
          <defs>
            <marker id="flowArrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
            </marker>
          </defs>
        </svg>
      </ExplanationBox>

      <WorkedExample title="PCA on the 5-Student Dataset, End to End">
        <p>
          Raw data — five students, each with (math, physics):
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '10px', borderRadius: '6px', lineHeight: '1.8' }}>
          S1 (60, 58)&nbsp;&nbsp;S2 (70, 72)&nbsp;&nbsp;S3 (75, 74)&nbsp;&nbsp;S4 (80, 79)&nbsp;&nbsp;S5 (90, 92)
        </p>

        <CalcStep number={1}>
          <strong>Center the data.</strong> Both feature means are 75, so subtract [75, 75]:<br />
          S1 [−15, −17]&nbsp;&nbsp;S2 [−5, −3]&nbsp;&nbsp;S3 [0, −1]&nbsp;&nbsp;S4 [5, 4]&nbsp;&nbsp;S5 [15, 17]
        </CalcStep>
        <CalcStep number={2}>
          <strong>Build the covariance matrix</strong> from the centred data:<br />
          C = [[100, 109], [109, 129]] — strong positive covariance (109) means the two
          scores rise and fall together.
        </CalcStep>
        <CalcStep number={3}>
          <strong>Eigen-decomposition</strong> of C (solve det(C − λI) = 0, then (C − λI)v = 0):<br />
          λ₁ ≈ 224.5, v₁ ≈ [0.707, 0.707]&nbsp;&nbsp;(the diagonal &quot;both high&quot; axis)<br />
          λ₂ ≈ 4.6, v₂ ≈ [0.707, −0.707]&nbsp;&nbsp;(the perpendicular &quot;math vs physics&quot; axis)
        </CalcStep>
        <CalcStep number={4}>
          <strong>Sort by eigenvalue.</strong> 224.5 ≫ 4.6, so v₁ becomes PC1 and v₂ becomes
          PC2. The order is already correct here.
        </CalcStep>
        <CalcStep number={5}>
          <strong>Project</strong> each centred point onto PC1 (dot with v₁):<br />
          S1 → −22.6&nbsp;&nbsp;S2 → −5.7&nbsp;&nbsp;S3 → −0.7&nbsp;&nbsp;S4 → +6.4&nbsp;&nbsp;S5 → +22.6
        </CalcStep>
        <CalcStep number={6}>
          <strong>Choose k via EVR.</strong> EVR(1) = 224.5 / 229.1 ≈ 98%. One component
          clears the 95% bar, so keep <strong>k = 1</strong>. Two features become one number.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          That single number per student is the entire compressed dataset. S1 sits at −22.6
          (weakest), S5 at +22.6 (strongest), and we kept 98% of everything that
          distinguished them — having thrown away one full dimension.
        </p>
      </WorkedExample>

      <ExplanationBox title="What Each Stage Buys You">
        <ul style={{ lineHeight: '1.9' }}>
          <li>
            <strong>Center</strong> — puts the origin at the data&apos;s centre of mass so
            variance is measured around the cloud, not the arbitrary zero point.
          </li>
          <li>
            <strong>Covariance</strong> — encodes how every pair of features moves together
            into one symmetric matrix.
          </li>
          <li>
            <strong>Eigen-decompose</strong> — extracts the natural axes of that matrix:
            directions (eigenvectors) and their variances (eigenvalues).
          </li>
          <li>
            <strong>Sort</strong> — ranks those axes from most to least informative.
          </li>
          <li>
            <strong>Project</strong> — re-expresses each point in the new coordinate system,
            keeping only the top k axes.
          </li>
          <li>
            <strong>Choose k</strong> — uses explained variance to decide how aggressively to
            compress.
          </li>
        </ul>
        <p>
          Every real PCA implementation — in scikit-learn, NumPy, R, anywhere — runs exactly
          these six stages. You now know what each line of <code>PCA().fit_transform(X)</code>{' '}
          is actually doing under the hood.
        </p>
      </ExplanationBox>
    </div>
  );
}
