'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step5() {
  return (
    <div>
      <ExplanationBox title="From One House to an Entire Dataset">
        <p>
          We&apos;ve been representing a single house as a vector. But a real estate dataset has
          thousands of houses. We need a way to represent <em>all</em> of them at once — and that
          structure is called a <strong>matrix</strong>.
        </p>
        <p>
          A matrix is a rectangular <strong>grid of numbers</strong>, arranged in rows and columns.
          Every row is one data point; every column is one feature. The shape of a matrix is written
          as <strong>m × n</strong> (read &quot;m by n&quot;), meaning m rows and n columns.
        </p>
      </ExplanationBox>

      <MathFormula label="Matrix shape notation">
        X is an m × n matrix  →  m rows (examples), n columns (features)
      </MathFormula>

      <ExplanationBox title="Our Dataset as a Matrix">
        <p>
          Suppose we have 3 houses and 4 features (sqft, beds, baths, km-to-school). The entire
          dataset fits into one <strong>3 × 4 matrix</strong> X:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '16px', borderRadius: '6px', margin: '0.75rem 0', lineHeight: '2' }}>
          X = &nbsp;[ 1400 &nbsp; 3 &nbsp; 2 &nbsp; 0.8 ]&nbsp; ← House 1<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ &nbsp;900 &nbsp; 2 &nbsp; 1 &nbsp; 1.5 ]&nbsp; ← House 2<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[ 2100 &nbsp; 4 &nbsp; 3 &nbsp; 0.3 ]&nbsp; ← House 3
        </p>
        <p>
          Each <strong>row</strong> is a house — a data point we&apos;ve already seen as a vector.
          Each <strong>column</strong> is a feature — all the square footages, all the bedroom counts, etc.
          The matrix is literally a stack of our house vectors, one on top of the other.
        </p>
      </ExplanationBox>

      <ExplanationBox title="A Vector Is a Special Case of a Matrix">
        <p>
          Vectors and matrices aren&apos;t two separate concepts — a vector is just a matrix with
          one row or one column:
        </p>
        <ul style={{ lineHeight: '1.9' }}>
          <li>A <strong>column vector</strong> of length n is an <em>n × 1</em> matrix — one column, n rows.</li>
          <li>A <strong>row vector</strong> of length n is a <em>1 × n</em> matrix — one row, n columns.</li>
        </ul>
        <p>
          This unification matters: almost every library (NumPy, PyTorch, TensorFlow) stores vectors as
          matrices with a trailing &quot;1&quot; dimension. Knowing the shape convention prevents a whole
          class of bugs where an operation fails because dimensions don&apos;t match.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Indexing Into a Matrix">
        <p>
          We refer to individual elements using row and column indices. The element in row i and
          column j is written <strong>X[i, j]</strong> or <strong>X_ij</strong>.
        </p>
        <p>
          Using 1-based indexing on our house matrix: X[2, 1] = 900 (House 2&apos;s square footage),
          X[3, 4] = 0.3 (House 3&apos;s distance to school). In code (0-based): X[1, 0] = 900.
          Always clarify which indexing convention you&apos;re using — mixing them is a common source of bugs.
        </p>
      </ExplanationBox>

      <WorkedExample title="Reading the Shape of a Matrix">
        <p>
          Given our house dataset matrix X above, answer three questions about its shape:
        </p>

        <CalcStep number={1}>Count the rows: House 1, House 2, House 3 → m = 3 rows</CalcStep>
        <CalcStep number={2}>Count the columns: sqft, beds, baths, dist → n = 4 columns</CalcStep>
        <CalcStep number={3}>Write the shape: X is a 3 × 4 matrix</CalcStep>
        <CalcStep number={4}>Total elements: 3 × 4 = 12 numbers stored in X</CalcStep>
        <CalcStep number={5}>Extract row 1 (House 1) as a vector: h₁ = [1400, 3, 2, 0.8]</CalcStep>
        <CalcStep number={6}>Extract column 2 (all bedroom counts) as a vector: [3, 2, 4]</CalcStep>

        <p style={{ marginTop: '1rem' }}>
          Getting comfortable with shapes is the single most important debugging skill in ML engineering.
          Every matrix operation has a shape requirement — violations cause immediate errors. When
          something breaks, the first question is always: <em>&quot;what shape did I expect vs. what did I get?&quot;</em>
        </p>
      </WorkedExample>
    </div>
  );
}
