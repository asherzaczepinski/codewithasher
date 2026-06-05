'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step7() {
  return (
    <div>
      <ExplanationBox title="Three Matrices Every Practitioner Needs to Know">
        <p>
          Beyond ordinary multiplication, three special matrix operations come up constantly in ML
          theory and code: the <strong>identity matrix</strong>, the <strong>transpose</strong>, and
          the <strong>inverse</strong>. Each has a clear intuition rooted in arithmetic you already know.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Identity Matrix: The 1 of Matrices">
        <p>
          The number 1 has a special property: multiplying any number by 1 leaves it unchanged.
          The <strong>identity matrix I</strong> is the matrix equivalent of 1. It is a square matrix
          with 1s on the main diagonal (top-left to bottom-right) and 0s everywhere else.
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '16px', borderRadius: '6px', margin: '0.75rem 0', lineHeight: '2.2' }}>
          I₃ = [ 1 &nbsp; 0 &nbsp; 0 ]<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ 0 &nbsp; 1 &nbsp; 0 ]<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ 0 &nbsp; 0 &nbsp; 1 ]
        </p>
        <p>
          For any matrix A with compatible shape: <strong>A · I = I · A = A</strong>. The identity
          matrix &quot;does nothing.&quot; It appears in theory proofs and as a sanity check in code
          (multiplying by I should return the original matrix unchanged).
        </p>
      </ExplanationBox>

      <MathFormula label="Transpose definition">
        (Aᵀ)[i, j] = A[j, i]   — swap every row index with its column index
      </MathFormula>

      <ExplanationBox title="The Transpose: Flipping Rows and Columns">
        <p>
          Transposing a matrix means <strong>reflecting it across its main diagonal</strong>: every
          row becomes a column and every column becomes a row. If A is m × n, then Aᵀ is n × m.
        </p>
        <p>
          You encounter transposing all the time in ML. For instance, to compute the dot product of
          two column vectors a and b in matrix notation you write <strong>aᵀ · b</strong> — transpose
          a into a row vector so the shapes work out: (1×n)·(n×1) = (1×1), a scalar.
          Libraries like NumPy use <code>.T</code>; PyTorch uses <code>.t()</code> or <code>.transpose()</code>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Inverse: Undoing a Matrix Transformation">
        <p>
          Every non-zero number x has a reciprocal 1/x such that x · (1/x) = 1. The matrix analogue
          is the <strong>inverse A⁻¹</strong>: a matrix such that <strong>A · A⁻¹ = I</strong>.
        </p>
        <p>
          The inverse &quot;undoes&quot; what A does. If A transforms a vector v into a new vector u = Av,
          then A⁻¹u = A⁻¹(Av) = Iv = v — we get the original vector back. This is the theoretical
          foundation of solving systems of linear equations: if Ax = b, then x = A⁻¹b.
        </p>
        <p>
          <strong>Crucial caveat:</strong> not every matrix has an inverse. A matrix is
          <em> invertible</em> only if it is square (n × n) and its determinant is non-zero. A matrix
          with linearly dependent rows (one row is a multiple of another) has determinant zero and
          is called <em>singular</em> — it has no inverse. In practice, libraries like NumPy raise an
          error or return a near-infinite result when you try to invert a singular matrix.
        </p>
        <p>
          In most modern ML, we rarely compute full inverses — they are expensive and numerically unstable.
          We use gradient descent instead. But the inverse is essential for understanding closed-form
          solutions like the <strong>normal equation</strong> in linear regression: w = (XᵀX)⁻¹Xᵀy.
        </p>
      </ExplanationBox>

      <WorkedExample title="Transposing Our House Feature Matrix">
        <p>
          Start with our 3×4 house matrix X. Transposing it gives a 4×3 matrix Xᵀ where each
          <em> column</em> is a house and each <em>row</em> is a feature across all houses.
        </p>

        <CalcStep number={1}>X has shape 3×4 (3 houses, 4 features)</CalcStep>
        <CalcStep number={2}>Xᵀ will have shape 4×3 (4 features, 3 houses)</CalcStep>
        <CalcStep number={3}>Row 1 of X = [1400, 3, 2, 0.8] becomes column 1 of Xᵀ</CalcStep>
        <CalcStep number={4}>Row 2 of X = [900, 2, 1, 1.5] becomes column 2 of Xᵀ</CalcStep>
        <CalcStep number={5}>Row 3 of X = [2100, 4, 3, 0.3] becomes column 3 of Xᵀ</CalcStep>
        <CalcStep number={6}>So row 1 of Xᵀ = [1400, 900, 2100] — all square footages across houses</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The transpose reframes the data: instead of reading across a house&apos;s features, we now
          read <em>down</em> one feature across all houses. This is handy when computing XᵀX (a 4×4
          matrix encoding how features relate to each other), which appears in the normal equation
          and in understanding covariance.
        </p>
      </WorkedExample>
    </div>
  );
}
