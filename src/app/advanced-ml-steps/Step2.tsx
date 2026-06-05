'use client';

import ExplanationBox from '@/components/ExplanationBox';
import MathFormula from '@/components/MathFormula';
import WorkedExample from '@/components/WorkedExample';
import CalcStep from '@/components/CalcStep';

export default function Step2() {
  return (
    <div>
      <ExplanationBox title="The Problem Kernel Methods Solve">
        <p>
          Many patterns in data are not linearly separable — no straight line (or flat hyperplane)
          can divide the classes. The naive fix is to add more features: if x and y are your inputs,
          also include x&sup2;, y&sup2;, and xy. With enough engineered features the data often
          becomes linearly separable in that higher-dimensional space.
        </p>
        <p>
          But high-dimensional feature maps are expensive to compute and store. Kernel methods
          provide an elegant shortcut: <strong>the kernel trick</strong>. Instead of explicitly
          computing the high-dimensional feature vector for every data point, you only ever
          compute the <em>dot product</em> between pairs of points in that space — and that dot
          product can be evaluated cheaply using a kernel function k(x, x&apos;).
        </p>
      </ExplanationBox>

      <MathFormula label="The Kernel Trick">
        k(x, x&apos;) = phi(x) &middot; phi(x&apos;)
      </MathFormula>

      <ExplanationBox title="What a Kernel Function Really Does">
        <p>
          phi(x) is the (potentially infinite-dimensional) feature map we never need to compute
          explicitly. The kernel k(x, x&apos;) gives us the dot product in that space directly.
          Two classic examples:
        </p>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>Polynomial kernel:</strong> k(x, x&apos;) = (x &middot; x&apos; + c)^d —
            implicitly maps to all polynomial features up to degree d.
          </li>
          <li>
            <strong>RBF / Gaussian kernel:</strong> k(x, x&apos;) = exp(-||x - x&apos;||&sup2; / (2 sigma&sup2;)) —
            corresponds to an infinite-dimensional feature space; the similarity decays
            smoothly with distance.
          </li>
        </ul>
        <p>
          Any algorithm that only accesses data through dot products — including SVMs, PCA,
          and ridge regression — can be &quot;kernelized&quot; for free. You replace every dot product
          x &middot; x&apos; with k(x, x&apos;) and the rest of the math stays identical.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Kernel Ridge Regression">
        <p>
          Standard ridge regression finds weights w that minimize the squared loss plus a
          regularization penalty: ||y - Xw||&sup2; + lambda ||w||&sup2;. The closed-form solution
          is w = (X&apos;X + lambda I)^(-1) X&apos;y.
        </p>
        <p>
          The kernelized version instead finds dual coefficients alpha and makes predictions as
          a weighted sum of kernel evaluations: f(x) = sum_i alpha_i k(x_i, x). The key matrix
          is the <strong>kernel matrix K</strong>, where K_ij = k(x_i, x_j). Because K is
          n x n (not d x d), kernel ridge regression scales with the number of training points,
          not the dimensionality — a useful trade-off when d is enormous.
        </p>
      </ExplanationBox>

      <ExplanationBox title="Structured Prediction: Outputs With Internal Structure">
        <p>
          Standard classification maps an input to a single label. But many real tasks have
          outputs that are themselves structured: a sentence (sequence of words), a parse tree,
          a protein fold (3-D graph), a road scene (pixel-level labels). <strong>Structured
          prediction</strong> models these outputs explicitly.
        </p>
        <p>
          The central challenge is the output space. A sentence of length 20 over a vocabulary
          of 50,000 words has 50,000^20 possible outputs — you cannot enumerate them.
          Instead, structured prediction methods define a <em>score function</em> s(x, y) over
          input-output pairs and use dynamic programming or beam search to find the
          highest-scoring y efficiently.
        </p>
      </ExplanationBox>

      <MathFormula label="Structured Prediction Objective">
        y* = argmax_y s(x, y; w)
      </MathFormula>

      <ExplanationBox title="The Graphical Model Connection">
        <p>
          Many structured prediction models are probabilistic graphical models in disguise.
          A <strong>Conditional Random Field (CRF)</strong> defines a probability distribution
          over output sequences y given an input x. The score decomposes over the edges of a
          graph — for a sequence, each edge connects adjacent labels — which makes inference
          with the Viterbi algorithm tractable despite the exponential output space.
        </p>
        <p>
          Graphical models make the independence assumptions explicit. If y_3 is conditionally
          independent of y_1 given y_2 (a Markov assumption), the full joint factors into a
          chain of pairwise terms, each cheap to evaluate. This factorization is the
          bridge between the abstract structured prediction objective and practical inference.
        </p>
        <p>
          In modern NLP, sequence-to-sequence transformers have largely replaced CRFs for raw
          accuracy, but CRFs remain valuable when you need guaranteed constraint satisfaction
          (e.g., valid entity spans must not overlap) and when interpretability of the
          dependency structure matters.
        </p>
      </ExplanationBox>

      <WorkedExample title="Kernel Trick: Polynomial Features Without Computing Them">
        <p>
          Suppose x = (2, 3) and x&apos; = (1, 4). We want a degree-2 polynomial kernel with c = 0.
        </p>
        <CalcStep number={1}>Compute the raw dot product: x &middot; x&apos; = 2(1) + 3(4) = 2 + 12 = 14</CalcStep>
        <CalcStep number={2}>Apply the polynomial kernel: k(x, x&apos;) = (14)^2 = 196</CalcStep>
        <CalcStep number={3}>
          The explicit degree-2 feature map would be phi(x) = (x1^2, x2^2, sqrt(2) x1 x2) = (4, 9, 6 sqrt(2)).
          Computing phi(x) &middot; phi(x&apos;) = 1(4) + 16(9) + 2(6)(4) = 4 + 144 + 48 = 196. Same answer.
        </CalcStep>
        <p style={{ marginTop: '1rem' }}>
          The kernel gave us the exact same dot product as the explicit high-dimensional features
          — with a single multiplication instead of constructing and dotting two expanded vectors.
          For d = 1,000 inputs and degree 5, the feature map has millions of entries; the kernel
          computation is a single scalar operation.
        </p>
      </WorkedExample>
    </div>
  );
}
