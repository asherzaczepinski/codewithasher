'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="The Most Important Operation in ML">
        <p>
          Matrix multiplication is the engine of neural networks. Every forward pass — the process by
          which a network turns an input into a prediction — is a sequence of matrix multiplications.
          Understanding it deeply means understanding <em>why</em> neural networks are structured the way they are.
        </p>
        <p>
          The key idea: matrix multiplication is <strong>generalised dot products, done in bulk</strong>.
          Instead of computing a single dot product between two vectors, we compute many dot products
          simultaneously between all rows of the left matrix and all columns of the right matrix.
        </p>
      </ExplanationBox>

      <MathFormula label="Matrix multiplication rule">
        C = A · B  where  C[i,j] = dot product of row i of A with column j of B
      </MathFormula>

      <MathFormula label="Shape constraint (inner dimensions must match)">
        (m × n) · (n × p) = (m × p)
      </MathFormula>

      <ExplanationBox title="Why Inner Dimensions Must Match">
        <p>
          Each entry C[i, j] is a dot product of a row from A (length n) with a column from B (also
          length n). You can only take a dot product between two lists of the <em>same</em> length —
          hence the requirement that A has n columns and B has n rows. The n&apos;s must match.
        </p>
        <p>
          The output shape is determined by what&apos;s left over: m rows from A and p columns from B.
          So an <strong>(m × n)</strong> matrix times an <strong>(n × p)</strong> matrix gives an
          <strong> (m × p)</strong> matrix. The inner dimension n is &quot;consumed&quot; by the multiplication.
        </p>
        <p>
          In a neural network layer: the input is an (m × n) matrix (m examples, n features). The
          weight matrix is (n × p) (n inputs, p neurons). The output is (m × p) — all m examples
          have been transformed to p-dimensional activations simultaneously. One matrix multiply
          processes the entire batch.
        </p>
      </ExplanationBox>

      <WorkedExample title="Multiplying a 2×3 Matrix by a 3×2 Matrix">
        <p>
          Let&apos;s use a concrete small example. Suppose we have 2 houses, 3 features (sqft in hundreds,
          beds, baths), and a weight matrix with 2 neurons:
        </p>
        <p style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: '16px', borderRadius: '6px', margin: '0.75rem 0', lineHeight: '2.2' }}>
          X = [ 14 &nbsp; 3 &nbsp; 2 ]&nbsp;&nbsp; (House 1, features scaled for readability)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;[ &nbsp;9 &nbsp; 2 &nbsp; 1 ]&nbsp;&nbsp; (House 2)<br />
          <br />
          W = [ 0.5 &nbsp; −1.0 ]&nbsp;&nbsp; (feature 1 weights for neuron A and B)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;[ 2.0 &nbsp; &nbsp;1.5 ]&nbsp;&nbsp; (feature 2 weights)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;[ 1.0 &nbsp; &nbsp;2.0 ]&nbsp;&nbsp; (feature 3 weights)
        </p>
        <p>X is 2×3, W is 3×2 → inner dimension 3 matches → output C is 2×2.</p>

        <CalcStep number={1}>C[1,1] = row 1 of X · column 1 of W = (14×0.5) + (3×2.0) + (2×1.0) = 7 + 6 + 2 = 15</CalcStep>
        <CalcStep number={2}>C[1,2] = row 1 of X · column 2 of W = (14×−1.0) + (3×1.5) + (2×2.0) = −14 + 4.5 + 4 = −5.5</CalcStep>
        <CalcStep number={3}>C[2,1] = row 2 of X · column 1 of W = (9×0.5) + (2×2.0) + (1×1.0) = 4.5 + 4 + 1 = 9.5</CalcStep>
        <CalcStep number={4}>C[2,2] = row 2 of X · column 2 of W = (9×−1.0) + (2×1.5) + (1×2.0) = −9 + 3 + 2 = −4</CalcStep>
        <CalcStep number={5}>
          Assemble the result: C = [ 15, −5.5 ] (House 1&apos;s activations for neuron A and B)
          and [ 9.5, −4 ] (House 2&apos;s activations)
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          In one matrix multiplication, both houses have been pushed through both neurons. Neuron A
          (column 1 of W) rates House 1 highly (15) and House 2 moderately (9.5). Neuron B (column 2 of W)
          gives negative signals to both — it may be detecting something that pushes price <em>down</em>.
          This is exactly a neural network&apos;s first layer in action.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          NumPy represents matrices as 2-D arrays. The <code>@</code> operator performs matrix
          multiplication and enforces the inner-dimension rule automatically.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="linalg.py"
        caption="Building a matrix, inspecting its shape, and running matrix multiplication with @ in NumPy."
        code={`import numpy as np

# A 2-D numpy array IS a matrix.
# Each row is one house; each column is one feature (sqft/100, beds, baths).
X = np.array([
    [14, 3, 2],   # House 1 — 1400 sqft scaled to 14, 3 beds, 2 baths
    [ 9, 2, 1],   # House 2
])
# .shape returns (rows, columns).  Always check shape before multiplying!
print("X shape:", X.shape)   # -> (2, 3)

# Weight matrix: 3 features -> 2 neurons.
# Each column holds the weights for one neuron.
W = np.array([
    [ 0.5, -1.0],  # weights that feature 1 sends to neuron A and neuron B
    [ 2.0,  1.5],  # feature 2
    [ 1.0,  2.0],  # feature 3
])
print("W shape:", W.shape)   # -> (3, 2)

# --- The @ operator performs matrix multiplication ---
# Inner dimensions must match: X is (2 x 3), W is (3 x 2) -> inner dim = 3. Good.
# Output shape = outer dimensions: (2 x 2).
C = X @ W
print("C = X @ W:")
print(C)
# -> [[ 15.  -5.5]   House 1: neuron A signal, neuron B signal
#     [  9.5 -4. ]]  House 2: same

# Verify the inner-dimension rule manually:
# X has 3 columns, W has 3 rows -> they match -> multiplication is valid.
# If we tried W @ X (wrong order), shapes (3,2)@(2,3) still works,
# but gives a DIFFERENT (3x3) result — order matters in matrix math!
print("W @ X shape:", (W @ X).shape)   # -> (3, 3)  -- not what we want for a layer`}
      />
    </div>
  );
}
