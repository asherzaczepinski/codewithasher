'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';
import CodeBlock from '@/components/CodeBlock';

export default function Step6() {
  return (
    <div>
      <ExplanationBox title="When No Line Will Do">
        <p>
          Sometimes the two classes cannot be separated by any straight line, no matter how you tilt
          or shift it. Imagine our flowers arranged in a ring: all Setosa flowers form a circle in
          the centre, all Versicolor flowers surround them. Every straight line through that picture
          will cut through both species.
        </p>
        <p>
          One solution: add a third dimension. If you lift each point by a height equal to
          x₁² + x₂² — its distance from the origin — then the inner ring rises less than the outer
          ring. In this new 3D space, a flat horizontal plane cleanly slices the two species apart.
          A linear boundary in 3D corresponds to a curved boundary in the original 2D space.
        </p>
        <p>
          This is the fundamental idea behind the <strong>kernel trick</strong>.
        </p>
      </ExplanationBox>

      <ExplanationBox title="The Mapping Problem — and the Shortcut">
        <p>
          Explicitly mapping every data point to a higher dimension and then doing SVM there can be
          astronomically expensive. If the original space has n features and you map to all polynomial
          combinations of degree d, the new space has O(nᵈ) dimensions. For large n and d that is
          completely impractical.
        </p>
        <p>
          Here is the shortcut: the SVM training algorithm only ever needs the <em>dot product</em>{' '}
          between pairs of points — never the points themselves in the expanded space. A
          <strong> kernel function</strong> K(x_i, x_j) computes that dot product in the
          high-dimensional space <em>without ever constructing the mapping explicitly</em>.
        </p>
        <p>
          You get all the power of a high-dimensional boundary at the computational cost of a
          dot product in the original space. That is the kernel trick.
        </p>
      </ExplanationBox>

      <MathFormula label="Kernel as an Implicit Dot Product">
        K(x_i, x_j) = φ(x_i) · φ(x_j)
      </MathFormula>

      <ExplanationBox title="Common Kernels">
        <p>
          <strong>Linear kernel</strong> — K(x_i, x_j) = x_i · x_j. No mapping at all; this is
          just the ordinary hard- or soft-margin SVM. Use when you already believe the data is
          roughly linearly separable.
        </p>
        <p>
          <strong>Polynomial kernel</strong> — K(x_i, x_j) = (x_i · x_j + c)ᵈ. Maps to a space
          of all polynomial combinations up to degree d. For d = 2 and two features this includes
          terms like x₁², x₁x₂, x₂² — enough to carve out circular and elliptical boundaries.
          The constant c controls how much the lower-degree terms influence the result.
        </p>
        <p>
          <strong>RBF (Radial Basis Function) kernel</strong> — also called the Gaussian kernel —
          is K(x_i, x_j) = exp(−γ ||x_i − x_j||²). It effectively maps to an
          <em> infinite</em>-dimensional space, giving the SVM extreme flexibility. The parameter γ
          controls how quickly similarity falls off with distance: large γ means only very nearby
          points influence each other (tight, wiggly boundaries); small γ means distant points still
          influence each other (smooth, broad boundaries).
        </p>
      </ExplanationBox>

      <MathFormula label="RBF Kernel">
        K(x_i, x_j) = exp(−γ ||x_i − x_j||²)
      </MathFormula>

      <WorkedExample title="The Circle Becomes Separable">
        <p>
          Return to our ring example. Setosa flowers sit near the origin; Versicolor flowers form an
          outer ring. In 2D no line separates them. Let&apos;s apply the mapping φ(x₁, x₂) = (x₁, x₂, x₁² + x₂²).
        </p>

        <CalcStep number={1}>
          Setosa point near origin: (0.5, 0.5). Mapped: (0.5, 0.5, 0.5² + 0.5²) = (0.5, 0.5, 0.5).
          Third coordinate is small — this point sits low in 3D.
        </CalcStep>
        <CalcStep number={2}>
          Versicolor point in outer ring: (2.0, 1.5). Mapped: (2.0, 1.5, 2.0² + 1.5²) = (2.0, 1.5, 6.25).
          Third coordinate is large — this point sits high in 3D.
        </CalcStep>
        <CalcStep number={3}>
          Another Setosa point: (−0.3, 0.6). Mapped: (−0.3, 0.6, 0.09 + 0.36) = (−0.3, 0.6, 0.45).
          Still sits low in 3D.
        </CalcStep>
        <CalcStep number={4}>
          A horizontal cut at third coordinate ≈ 1.0 perfectly separates all mapped Setosa points
          (third coordinate &lt; 1.0) from all mapped Versicolor points (third coordinate &gt; 1.0).
          In the original 2D space this cut corresponds to the circle x₁² + x₂² = 1 — a nonlinear boundary.
        </CalcStep>

        <p style={{ marginTop: '1rem' }}>
          The kernel trick lets the SVM find this circular boundary without ever explicitly computing
          the 3D coordinates. It only evaluates K(x_i, x_j) = x_i · x_j + (x_i · x_i)(x_j · x_j) —
          a calculation in the original 2D space — and the algebra of the SVM solver does the rest.
          This is why kernelised SVMs can draw curved, complex decision boundaries while remaining
          efficient to train.
        </p>
      </WorkedExample>

      <ExplanationBox title="In Python">
        <p>
          We add two things to <strong>svm.py</strong>: the RBF kernel function itself, and a
          demonstration using scikit-learn&apos;s <code>SVC</code> — the production-ready kernelised SVM
          — on the ring-shaped data from the worked example.
        </p>
      </ExplanationBox>

      <CodeBlock
        filename="svm.py"
        caption="rbf_kernel shows the formula explicitly; sklearn&apos;s SVC(kernel=&quot;rbf&quot;) applies it at scale without manual dot-product bookkeeping."
        code={`import numpy as np
from sklearn.svm import SVC

# --- (all previous functions from Steps 2, 4, and 5 are defined above) ---

def rbf_kernel(a, b, gamma=0.5):
    # The RBF (Gaussian) kernel between two points a and b.
    # It measures similarity: K = 1 when a == b, and K -> 0 as they move apart.
    # gamma controls how quickly similarity decays with distance.
    #   - Large gamma: only very close points are considered similar (wiggly boundary).
    #   - Small gamma: distant points still influence each other (smooth boundary).
    # Crucially, this computation lives in the ORIGINAL feature space.
    # The algebra of the SVM solver treats it as a dot product in an
    # infinite-dimensional space — without ever building that space explicitly.
    diff = a - b
    squared_distance = np.dot(diff, diff)   # ||a - b||^2
    return np.exp(-gamma * squared_distance)

# --- demonstrate the kernel on the ring-shaped data from the worked example ---
# Setosa flowers sit near the origin; Versicolor flowers form an outer ring.
# No straight line separates them, but the RBF kernel can.
np.random.seed(0)

# Inner ring (Setosa, label -1): random points within radius 1.
angles_inner = np.random.uniform(0, 2 * np.pi, 60)
radii_inner = np.random.uniform(0.0, 0.9, 60)
X_inner = np.column_stack([radii_inner * np.cos(angles_inner),
                           radii_inner * np.sin(angles_inner)])

# Outer ring (Versicolor, label +1): random points between radius 1.4 and 2.2.
angles_outer = np.random.uniform(0, 2 * np.pi, 60)
radii_outer = np.random.uniform(1.4, 2.2, 60)
X_outer = np.column_stack([radii_outer * np.cos(angles_outer),
                           radii_outer * np.sin(angles_outer)])

X_ring = np.vstack([X_inner, X_outer])
y_ring = np.concatenate([-np.ones(60), np.ones(60)])   # -1 inner, +1 outer

# SVC with kernel="rbf" applies the kernel trick automatically.
# Under the hood it only ever computes rbf_kernel(x_i, x_j) pairs — never the
# mapping phi(x) explicitly.  C and gamma are tuned the same way as before.
clf = SVC(kernel="rbf", C=1.0, gamma=0.5)
clf.fit(X_ring, y_ring)

# Check accuracy on the training set — a linear SVM would score around 50%.
train_accuracy = clf.score(X_ring, y_ring)

# The support vectors are the subset of points that actually define the boundary.
# Everything else could be removed and the trained model would be identical.
n_support_vectors = clf.support_vectors_.shape[0]

# Predict a new point near the origin — should be Setosa (-1).
new_point = np.array([[0.3, -0.4]])
prediction = clf.predict(new_point)   # expected: [-1]
`}
      />

      <ExplanationBox title="Putting It All Together">
        <p>
          You now have the complete SVM story. Start with the widest-margin line (or hyperplane) for
          linearly separable data. Relax the hard margin to a soft margin with parameter C when data
          overlaps. Swap in a kernel function when no straight boundary will do. At every stage only
          the support vectors — the handful of points touching the margin edges — determine the final
          boundary.
        </p>
        <p>
          SVMs remain one of the most elegant classifiers in machine learning: a single geometric
          idea (maximize the margin) plus one algebraic shortcut (the kernel trick) covers an
          enormous range of real-world classification problems.
        </p>
      </ExplanationBox>
    </div>
  );
}
